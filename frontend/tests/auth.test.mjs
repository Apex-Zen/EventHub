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
function harness(initial = [], verificationOptions = {}) {
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
    require: name => name === "react" ? React : name === "../lib/email-verification" ? {
      requestEmailVerification: verificationOptions.send ?? (async () => "ab".repeat(32)),
      submitEmailVerification: verificationOptions.verify ?? (async (_id, code) => { if (code !== "123456") throw new Error("The verification code is incorrect."); }),
    } : {
      ...service,
      hashPassword: () => new Promise(resolve => hashes.push(resolve)),
      makeResetCode: () => ({ value: "123456", expiresAt: Date.now() + 300000, attempts: 0 }),
    },
    window: { localStorage }, Date, Error,
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
  actions.setUsername("newuser");
  actions.setEmail(email);
  actions.setPhoneNumber("+94712345678");
  actions.setPassword("Strong123");
  actions.setConfirmPassword("Strong123");
  return h.render().accountForm.actions.handleSubmit(event);
}
test("rejects malformed JSON, malformed entries, vendor profiles, duplicate accounts, and empty saved data", () => {
  const h = harness();
  for (const raw of ["", "{", "{}", "[null]", "[{}]", JSON.stringify([account("vendor@example.com", { role: "Vendor" })]), JSON.stringify([account(), account()])]) {
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
test("unverified account sign-in shows honest verification status without a local code", async () => {
  const h = harness([account("first@example.com", { isVerified: false })]);
  h.render().openAuth("login");
  const actions = h.render().accountForm.actions;
  actions.setEmail("first@example.com"); actions.setPassword("Strong123");
  const pending = h.render().accountForm.actions.handleSubmit(event);
  h.resolveHash(); await pending;
  assert.equal(h.render().step, "verify");
  assert.equal(h.render().activeAccount, null);
  assert.equal(h.service.readAccounts()[0].isVerified, false);
  assert.equal("verificationCode" in h.render().verifyEmailForm.values, false);
  assert.equal(h.render().accountForm.values.password, "");
  h.render().verifyEmailForm.actions.returnToLogin();
  assert.equal(h.render().mode, "login");
  assert.equal(h.render().step, "form");
});
test("vendor can log in without selecting an account role", async () => {
  const vendorAccount = account("vendor@example.com", {
    role: "Vendor",
    fullName: "Test Vendor",
    vendorProfile: {
      phoneNumber: "+94712345678",
      serviceCategory: "Photography",
      businessRegistrationNumber: "PV 00123456",
    },
  });
  const h = harness([vendorAccount]);
  h.render().openAuth("login");
  let flow = h.render();
  flow.accountForm.actions.setEmail("vendor@example.com");
  flow.accountForm.actions.setPassword("Strong123");
  const pending = h.render().accountForm.actions.handleSubmit(event);
  h.resolveHash();
  await pending;
  assert.equal(h.render().activeAccount.role, "Vendor");
  assert.equal(h.render().step, "dashboard");
});
test("users can log in with their username", async () => {
  const h = harness([account("first@example.com", { username: "test_user" })]);
  h.render().openAuth("login");
  let flow = h.render();
  flow.accountForm.actions.setEmail("TEST_USER");
  flow.accountForm.actions.setPassword("Strong123");
  const pending = h.render().accountForm.actions.handleSubmit(event);
  h.resolveHash();
  await pending;
  assert.equal(h.render().activeAccount.email, "first@example.com");
  assert.equal(h.render().step, "dashboard");
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
  actions.setFullName("   "); actions.setUsername("validuser"); actions.setEmail("name@example.com");
  actions.setPassword("Strong123"); actions.setConfirmPassword("Strong123");
  await h.render().accountForm.actions.handleSubmit(event);
  assert.match(h.render().accountForm.values.error, /full name/);
  assert.equal(h.service.readAccounts().length, 0);
});

test("client signup requires and saves a phone number", async () => {
  const h = harness();
  h.render().openAuth("signup");
  let flow = h.render();
  flow.accountForm.actions.setFullName("New User");
  flow.accountForm.actions.setUsername("newuser");
  flow.accountForm.actions.setEmail("new@example.com");
  flow.accountForm.actions.setPassword("Strong123");
  flow.accountForm.actions.setConfirmPassword("Strong123");
  await h.render().accountForm.actions.handleSubmit(event);
  assert.match(h.render().accountForm.values.error, /phone number/);

  h.render().accountForm.actions.setPhoneNumber("+94712345678");
  const pending = h.render().accountForm.actions.handleSubmit(event);
  h.resolveHash();
  await pending;
  assert.equal(h.service.readAccounts()[0].phoneNumber, "+94712345678");
});

test("vendor signup requires an NIC number or a valid ID document", async () => {
  const h = harness(); h.render().openAuth("signup", "Vendor");
  let flow = h.render();
  flow.vendorFields.actions.setFirstName("Test");
  flow.vendorFields.actions.setLastName("Vendor");
  flow.vendorFields.actions.setEmail("vendor@example.com");
  flow.vendorFields.actions.setPhoneNumber("+94712345678");
  flow.vendorFields.actions.setServiceCategory("Photography");
  flow.vendorFields.actions.setBusinessRegistrationNumber("PV 00123456");
  flow.accountForm.actions.setUsername("testvendor");
  flow.accountForm.actions.setPassword("Strong123");
  flow.accountForm.actions.setConfirmPassword("Strong123");
  flow = h.render();
  await flow.accountForm.actions.handleSubmit(event);
  assert.match(h.render().accountForm.values.error, /NIC number or upload/);
  assert.equal(h.service.readAccounts().length, 0);

  h.render().vendorFields.actions.setNicNumber("199012345678");
  await h.render().accountForm.actions.handleSubmit(event);
  assert.match(h.render().accountForm.values.error, /Vendor Terms and 5–10% payout commission/);
  assert.equal(h.service.readAccounts().length, 0);

  h.render().accountForm.actions.setAcceptedVendorTerms(true);
  const submit = h.render().accountForm.actions.handleSubmit(event);
  h.resolveHash();
  await submit;
  const [createdAccount] = h.service.readAccounts();
  assert.equal(createdAccount.email, "vendor@example.com");
  assert.equal(createdAccount.vendorProfile.businessRegistrationNumber, "PV 00123456");
  assert.equal("nicNumber" in createdAccount.vendorProfile, false);
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
    if (mode === "signup") assert.match(html, /Username/);
    if (mode === "signup" && role === "Client") assert.match(html, /Phone number/);
    if (mode === "signup") {
      assert.match(html, /Sign up with Google/);
      assert.doesNotMatch(html, /Account details are saved only in this browser/);
      assert.doesNotMatch(html, /Create account[\s\S]*→/);
    }
    if (mode === "login") {
      assert.doesNotMatch(html, /Sign in as/);
      assert.doesNotMatch(html, /Choose your account role/);
      assert.match(html, /Email or username/);
    }
    if (role === "Vendor") {
      assert.match(html, /Business Registration/);
      assert.match(html, /Upload NIC or passport/);
      assert.doesNotMatch(html, /Identity verification is not connected/);
      assert.doesNotMatch(html, /Photography, catering, decoration, sound and lighting/);
      assert.match(html, /I accept the Vendor Terms and 5–10% payout commission/);
    }
  }
  for (const [name, group] of [["ForgotPasswordForm", "forgotPasswordForm"], ["ResetPasswordForm", "resetPasswordForm"]]) {
    const html = renderToStaticMarkup(React.createElement(load("component/auth/" + name + ".tsx").default, h.render()[group]));
    assert.match(html, /<form/);
  }
  const verificationHtml = renderToStaticMarkup(React.createElement(
    load("component/auth/VerifyEmailForm.tsx").default,
    h.render().verifyEmailForm
  ));
  assert.match(verificationHtml, /Check your email/);
  assert.match(verificationHtml, /Enter the 6-digit code sent to/);
  assert.equal((verificationHtml.match(/Verification digit \d/g) ?? []).length, 6);
  assert.equal((verificationHtml.match(/<input/g) ?? []).length, 6);
  assert.match(verificationHtml, /Verify email/);
  assert.doesNotMatch(verificationHtml, /No code has been sent|verification isn&#x27;t connected/);
  const html = renderToStaticMarkup(React.createElement(load("component/auth/GoogleStatus.tsx").default, { actions: { goHome() {}, returnToLogin() {} } }));
  assert.match(html, /Google/);
});

test("login rejects a password changed in another tab while hashing", async () => {
  const h = harness([account()]);
  h.render().openAuth("login");
  const actions = h.render().accountForm.actions;
  actions.setEmail("first@example.com"); actions.setPassword("Strong123");
  const pending = h.render().accountForm.actions.handleSubmit(event);
  await h.service.updateAccounts(records => records.map(item => ({ ...item, passwordHash: "aa".repeat(32) })));
  h.resolveHash(); await pending;
  assert.equal(h.render().activeAccount, null);
  assert.notEqual(h.render().step, "dashboard");
  assert.match(h.render().accountForm.values.error, /credentials changed/);
});
test("login rejects an account deleted while hashing", async () => {
  const h = harness([account()]);
  h.render().openAuth("login");
  const actions = h.render().accountForm.actions;
  actions.setEmail("first@example.com"); actions.setPassword("Strong123");
  const pending = h.render().accountForm.actions.handleSubmit(event);
  await h.service.updateAccounts(() => []);
  h.resolveHash(); await pending;
  assert.equal(h.render().activeAccount, null);
  assert.match(h.render().accountForm.values.error, /credentials changed/);
});
test("login uses the latest verification state after hashing", async () => {
  const h = harness([account()]);
  h.render().openAuth("login");
  const actions = h.render().accountForm.actions;
  actions.setEmail("first@example.com"); actions.setPassword("Strong123");
  const pending = h.render().accountForm.actions.handleSubmit(event);
  await h.service.updateAccounts(records => records.map(item => ({ ...item, isVerified: false })));
  h.resolveHash(); await pending;
  assert.equal(h.render().activeAccount, null);
  assert.equal(h.render().step, "verify");
});
test("shared-email recovery gives an actionable username alternative", () => {
  const h = sharedEmailAccounts();
  h.render().openAuth("login");
  h.render().accountForm.actions.setEmail("shared@example.com");
  h.render().accountForm.actions.openForgotPassword();
  h.render().forgotPasswordForm.actions.handleForgotPassword(event);
  assert.match(h.render().forgotPasswordForm.values.error, /unique username/);
  assert.equal(h.render().step, "forgot");
});
function sharedEmailAccounts() {
  return harness([
    account("shared@example.com", { username: "client_user" }),
    account("shared@example.com", {
      role: "Vendor", username: "vendor_user",
      vendorProfile: { phoneNumber: "+94712345678", serviceCategory: "Photography", businessRegistrationNumber: "PV123" },
    }),
  ]);
}
test("unique username recovers only the selected shared-email account", async () => {
  for (const [username, role] of [["client_user", "Client"], ["vendor_user", "Vendor"]]) {
    const h = sharedEmailAccounts();
    h.render().openAuth("login"); h.render().accountForm.actions.openForgotPassword();
    h.render().forgotPasswordForm.actions.setResetIdentifier(username.toUpperCase());
    h.render().forgotPasswordForm.actions.handleForgotPassword(event);
    assert.equal(h.render().step, "reset");
    assert.equal(h.render().role, role);
    assert.equal(h.render().resetPasswordForm.values.resetTarget, "shared@example.com");
    const actions = h.render().resetPasswordForm.actions;
    actions.setResetCodeInput("123456"); actions.setResetPassword("Strong123"); actions.setConfirmResetPassword("Strong123");
    const pending = h.render().resetPasswordForm.actions.handleResetPassword(event);
    await h.service.updateAccounts(records => records.map(item => item.role !== role ? { ...item, passwordHash: "aa".repeat(32) } : item));
    h.resolveHash(); await pending;
    assert.equal(h.service.readAccounts().find(item => item.role !== role).passwordHash, "aa".repeat(32));
    assert.equal(h.render().step, "form");
  }
});


test("valid email verification marks the account verified and completes remembered sign-in", async () => {
  const h = harness();
  const pending = signup(h); h.resolveHash(); await pending;
  h.render().accountForm.actions.setRememberEmail(true);
  await h.render().verifyEmailForm.actions.verifyEmail("123456");
  assert.equal(h.render().step, "dashboard");
  assert.equal(h.service.readAccounts()[0].isVerified, true);
  assert.equal(h.storage.get("eventhub.demo.remembered-email"), "new@example.com");
  assert.equal(h.render().accountForm.values.password, "");
});
test("incorrect verification code keeps the account unverified and reports the error", async () => {
  const h = harness();
  const pending = signup(h); h.resolveHash(); await pending;
  await h.render().verifyEmailForm.actions.verifyEmail("000000");
  assert.equal(h.service.readAccounts()[0].isVerified, false);
  assert.equal(h.render().activeAccount, null);
  assert.equal(h.render().step, "verify");
  assert.match(h.render().verifyEmailForm.values.error, /incorrect/);
});
test("email delivery failure never opens the sent-email screen and permits login retry", async () => {
  const h = harness([], { send: async () => { throw new Error("Email delivery is not configured."); } });
  const pending = signup(h); h.resolveHash(); await pending;
  assert.equal(h.render().step, "form");
  assert.equal(h.render().mode, "login");
  assert.equal(h.service.readAccounts().length, 1);
  assert.equal(h.service.readAccounts()[0].isVerified, false);
  assert.match(h.render().accountForm.values.error, /not configured/);
});
test("navigation during verification prevents stale account updates", async () => {
  let finish;
  const h = harness([], { verify: () => new Promise(resolve => { finish = resolve; }) });
  const pending = signup(h); h.resolveHash(); await pending;
  const verifying = h.render().verifyEmailForm.actions.verifyEmail("123456");
  h.render().goHome(); finish(); await verifying;
  assert.equal(h.render().showLanding, true);
  assert.equal(h.service.readAccounts()[0].isVerified, false);
  assert.equal(h.render().activeAccount, null);
});
test("changed credentials invalidate an in-flight verification", async () => {
  let finish;
  const h = harness([], { verify: () => new Promise(resolve => { finish = resolve; }) });
  const pending = signup(h); h.resolveHash(); await pending;
  const verifying = h.render().verifyEmailForm.actions.verifyEmail("123456");
  await h.service.updateAccounts(records => records.map(item => ({ ...item, passwordHash: "aa".repeat(32) })));
  finish(); await verifying;
  assert.equal(h.service.readAccounts()[0].isVerified, false);
  assert.match(h.render().verifyEmailForm.values.error, /account changed/);
});
test("verification form submits its six digits to the verification action", async () => {
  const runtime = await import("react/jsx-runtime");
  const formModule = {};
  vm.runInNewContext(compile("component/auth/VerifyEmailForm.tsx"), {
    exports: formModule,
    require(name) {
      if (name === "react/jsx-runtime") return runtime;
      if (name === "react") return { useState: () => ["123456".split(""), () => {}], useRef: value => ({ current: value }) };
      if (name === "../FormAlert") return { default: () => null };
      throw new Error("Unexpected import: " + name);
    },
  });
  let received = "";
  const tree = formModule.default({
    values: { email: "new@example.com", role: "Client", error: "", busy: false },
    actions: { returnToLogin() {}, verifyEmail: async code => { received = code; } },
  });
  const form = tree.props.children.find(child => child?.type === "form");
  form.props.onSubmit(event);
  assert.equal(received, "123456");
});


