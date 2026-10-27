import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import ts from "typescript";
import { webcrypto } from "node:crypto";

const root = fileURLToPath(new URL("../", import.meta.url));
const event = { preventDefault() {} };
const digest = { salt: "ab".repeat(16), hash: "cd".repeat(32) };
const account = (email = "first@example.com", extra = {}) => ({
  email, role: "Client", fullName: "Test User",
  passwordSalt: digest.salt, passwordHash: digest.hash, isVerified: true, ...extra,
});
function compile(file) {
  return ts.transpileModule(fs.readFileSync(root + file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
}
function harness(initial = []) {
  const storage = new Map([["eventhub.demo.accounts", JSON.stringify(initial)]]);
  const localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  };
  let lockTail = Promise.resolve();
  const locks = { request(_key, callback) {
    const work = lockTail.then(callback);
    lockTail = work.catch(() => {});
    return work;
  }};
  const service = {};
  vm.runInNewContext(compile("lib/auth.ts"), {
    exports: service, window: { localStorage, crypto: webcrypto }, navigator: { locks },
    TextEncoder, Uint8Array, Uint32Array, Date, Set,
  });
  const slots = [];
  let cursor = 0;
  let cleanup;
  const React = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = initial;
      return [slots[index], value => { slots[index] = typeof value === "function" ? value(slots[index]) : value; }];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
    useEffect(effect) { if (!cleanup) cleanup = effect(); },
  };
  const hashes = [];
  const hook = {};
  vm.runInNewContext(compile("hooks/useAuthFlow.ts"), {
    exports: hook,
    require: name => name === "react" ? React : {
      ...service,
      hashPassword: () => new Promise(resolve => hashes.push(resolve)),
      makeVerificationCode: () => ({ value: "123456", expiresAt: Date.now() + 300000, attempts: 0 }),
    },
    window: { localStorage }, Date,
  });
  const render = () => { cursor = 0; return hook.useAuthFlow(); };
  return {
    render, service, storage,
    resolveHash: () => { assert.ok(hashes.length); hashes.shift()(digest); },
    unmount: () => cleanup(),
  };
}
function signup(h, email = "new@example.com") {
  h.render().openAuth("signup", "Client");
  const actions = h.render().accountForm.actions;
  actions.setFullName("New User");
  actions.setEmail(email);
  actions.setPassword("Strong123");
  actions.setConfirmPassword("Strong123");
  return h.render().accountForm.actions.handleSubmit(event);
}
test("rejects malformed JSON, malformed entries, vendor profiles, and duplicate accounts", () => {
  const h = harness();
  for (const raw of ["{", "{}", "[null]", "[{}]", JSON.stringify([account("vendor@example.com", { role: "Vendor" })]), JSON.stringify([account(), account()])]) {
    h.storage.set("eventhub.demo.accounts", raw);
    assert.throws(() => h.service.readAccounts(), /Saved accounts could not be read/);
  }
});
test("concurrent account updates retain both records", async () => {
  const h = harness();
  await Promise.all([
    h.service.updateAccounts(records => [...records, account("one@example.com")]),
    h.service.updateAccounts(records => [...records, account("two@example.com")]),
  ]);
  assert.equal(h.service.readAccounts().length, 2);
});
test("signup preserves an account added during hashing", async () => {
  const h = harness();
  const pending = signup(h);
  await h.service.updateAccounts(records => [...records, account()]);
  h.resolveHash(); await pending;
  assert.equal(h.service.readAccounts().length, 2);
  assert.equal(h.render().step, "verify");
});
test("signup rechecks duplicates after hashing", async () => {
  const h = harness();
  const pending = signup(h);
  await h.service.updateAccounts(records => [...records, account("new@example.com")]);
  h.resolveHash(); await pending;
  assert.equal(h.service.readAccounts().length, 1);
  assert.match(h.render().accountForm.values.error, /already exists/);
});
test("navigation cancels pending signup and clears passwords", async () => {
  for (const navigate of [flow => flow.goHome(), flow => flow.switchMode("login"), flow => flow.accountForm.actions.changeRole("Vendor")]) {
    const h = harness();
    const pending = signup(h);
    navigate(h.render());
    h.resolveHash(); await pending;
    assert.equal(h.service.readAccounts().length, 0);
    assert.equal(h.render().step, "form");
    assert.equal(h.render().accountForm.values.password, "");
    assert.equal(h.render().accountForm.values.confirmPassword, "");
    assert.equal(h.render().accountForm.values.busy, false);
  }
});
test("unmount cancels a pending submission", async () => {
  const h = harness();
  const pending = signup(h);
  h.unmount(); h.resolveHash(); await pending;
  assert.equal(h.service.readAccounts().length, 0);
});
test("a stale operation cannot clear a newer operation's busy state", async () => {
  const h = harness();
  const first = signup(h, "old@example.com");
  h.render().switchMode("signup");
  const second = signup(h, "new@example.com");
  h.resolveHash(); await first;
  assert.equal(h.render().accountForm.values.busy, true);
  h.resolveHash(); await second;
  assert.equal(h.service.readAccounts()[0].email, "new@example.com");
});
test("verification completes remembered login and clears secrets", async () => {
  const h = harness([account("first@example.com", { isVerified: false })]);
  h.render().openAuth("login");
  const actions = h.render().accountForm.actions;
  actions.setEmail("first@example.com"); actions.setPassword("Strong123"); actions.setRememberEmail(true);
  const pending = h.render().accountForm.actions.handleSubmit(event);
  h.resolveHash(); await pending;
  h.render().verifyEmailForm.actions.setVerificationInput("123456");
  await h.render().verifyEmailForm.actions.handleVerify(event);
  assert.equal(h.render().step, "dashboard");
  assert.equal(h.storage.get("eventhub.demo.remembered-email"), "first@example.com");
  assert.equal(h.render().accountForm.values.password, "");
  assert.equal(h.render().verifyEmailForm.values.verificationCode, null);
});
function prepareReset(h) {
  h.render().openAuth("login");
  h.render().accountForm.actions.setEmail("first@example.com");
  h.render().accountForm.actions.openForgotPassword();
  h.render().forgotPasswordForm.actions.handleForgotPassword(event);
  const actions = h.render().resetPasswordForm.actions;
  actions.setResetCodeInput("123456");
  actions.setResetPassword("Strong123");
  actions.setConfirmResetPassword("Strong123");
}
test("password reset preserves unrelated updates and clears reset passwords", async () => {
  const h = harness([account()]);
  prepareReset(h);
  const pending = h.render().resetPasswordForm.actions.handleResetPassword(event);
  await h.service.updateAccounts(records => [...records, account("other@example.com")]);
  h.resolveHash(); await pending;
  assert.equal(h.service.readAccounts().length, 2);
  assert.equal(h.render().step, "form");
  assert.equal(h.render().resetPasswordForm.values.resetPassword, "");
  assert.equal(h.render().resetPasswordForm.values.confirmResetPassword, "");
});
test("leaving reset prevents the pending password write", async () => {
  const original = account("first@example.com", { passwordHash: "aa".repeat(32) });
  const h = harness([original]); prepareReset(h);
  const pending = h.render().resetPasswordForm.actions.handleResetPassword(event);
  h.render().returnToLogin(); h.resolveHash(); await pending;
  assert.equal(h.service.readAccounts()[0].passwordHash, original.passwordHash);
  assert.equal(h.render().resetPasswordForm.values.resetPassword, "");
});
test("changing recovery method clears the identifier both ways", () => {
  const h = harness();
  h.render().forgotPasswordForm.actions.setResetIdentifier("email@example.com");
  h.render().forgotPasswordForm.actions.changeResetMethod("sms");
  assert.equal(h.render().forgotPasswordForm.values.resetIdentifier, "");
  h.render().forgotPasswordForm.actions.setResetIdentifier("+94712345678");
  h.render().forgotPasswordForm.actions.changeResetMethod("email");
  assert.equal(h.render().forgotPasswordForm.values.resetIdentifier, "");
});
test("client signup rejects whitespace-only names", async () => {
  const h = harness(); h.render().openAuth("signup");
  const actions = h.render().accountForm.actions;
  actions.setFullName("   "); actions.setEmail("name@example.com");
  actions.setPassword("Strong123"); actions.setConfirmPassword("Strong123");
  await h.render().accountForm.actions.handleSubmit(event);
  assert.match(h.render().accountForm.values.error, /full name/);
  assert.equal(h.service.readAccounts().length, 0);
});


test("recovery tabs support keyboard navigation, roving focus, and linked panels", async () => {
  const runtime = await import("react/jsx-runtime");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const cache = new Map();
  function load(file) {
    if (cache.has(file)) return cache.get(file);
    const exports = {};
    cache.set(file, exports);
    vm.runInNewContext(compile(file), {
      exports,
      require(name) {
        if (name === "react/jsx-runtime") return runtime;
        if (name === "react") return { useRef: value => ({ current: value }) };
        const target = new URL(name + ".tsx", new URL(file, new URL("../", import.meta.url)));
        return load(fileURLToPath(target).slice(root.length));
      },
    });
    return exports;
  }
  const Form = load("component/auth/ForgotPasswordForm.tsx").default;
  const selected = [];
  const focused = [];
  const tree = Form({
    values: { resetMethod: "email", resetIdentifier: "", error: "" },
    actions: { changeResetMethod: value => selected.push(value), setResetIdentifier() {}, returnToLogin() {}, handleForgotPassword() {} },
  });
  const nodes = [];
  function walk(node) {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node?.props) return;
    nodes.push(node); walk(node.props.children);
  }
  walk(tree);
  const tabs = nodes.filter(node => node.props.role === "tab");
  const panels = nodes.filter(node => node.props.role === "tabpanel");
  assert.equal(tabs.length, 2);
  assert.equal(panels.length, 2);
  tabs.forEach(tab => tab.props.ref({ focus: () => focused.push(tab.props.id) }));
  assert.equal(tabs[0].props.tabIndex, 0);
  assert.equal(tabs[1].props.tabIndex, -1);
  assert.equal(tabs[0].props["aria-controls"], panels[0].props.id);
  assert.equal(panels[1].props.hidden, true);
  let prevented = 0;
  for (const key of ["ArrowRight", "End", "Home", "ArrowLeft"]) {
    tabs[0].props.onKeyDown({ key, preventDefault() { prevented += 1; } });
  }
  assert.equal(prevented, 4);
  assert.deepEqual(selected, ["sms", "sms", "email", "sms"]);
  assert.deepEqual(focused, ["reset-sms-tab", "reset-sms-tab", "reset-email-tab", "reset-sms-tab"]);
  assert.match(renderToStaticMarkup(tree), /role="tabpanel"/);
});

test("authentication components render login, both signups, recovery, reset, verification, and provider status", async () => {
  const React = await import("react");
  const runtime = await import("react/jsx-runtime");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const cache = new Map();
  function load(file) {
    if (cache.has(file)) return cache.get(file);
    const exports = {}; cache.set(file, exports);
    vm.runInNewContext(compile(file), {
      exports,
      require(name) {
        if (name === "react/jsx-runtime") return runtime;
        if (name === "react") return React;
        if (name.endsWith("/lib/auth")) return harness().service;
        const target = new URL(name + ".tsx", new URL(file, new URL("../", import.meta.url)));
        return load(fileURLToPath(target).slice(root.length));
      },
    });
    return exports;
  }
  const h = harness();
  for (const [mode, role] of [["login", "Client"], ["signup", "Client"], ["signup", "Vendor"]]) {
    h.render().openAuth(mode, role);
    const flow = h.render();
    const vendorFields = React.createElement(load("component/auth/VendorFields.tsx").default, flow.vendorFields);
    const html = renderToStaticMarkup(React.createElement(load("component/auth/AccountForm.tsx").default, { ...flow.accountForm, vendorFields }));
    assert.match(html, /<form/);
    if (role === "Vendor") assert.match(html, /Business Registration/);
  }
  for (const [name, group] of [["ForgotPasswordForm", "forgotPasswordForm"], ["ResetPasswordForm", "resetPasswordForm"], ["VerifyEmailForm", "verifyEmailForm"]]) {
    const html = renderToStaticMarkup(React.createElement(load("component/auth/" + name + ".tsx").default, h.render()[group]));
    assert.match(html, /<form/);
  }
  const html = renderToStaticMarkup(React.createElement(load("component/auth/GoogleStatus.tsx").default, { actions: { goHome() {}, returnToLogin() {} } }));
  assert.match(html, /Google/);
});

