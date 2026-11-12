import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import * as crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
function compiled(file) {
  return ts.transpileModule(fs.readFileSync(root + file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
}
function server(options = {}) {
  let now = Date.now();
  class Clock extends Date { static now() { return now; } }
  const sent = [];
  const settings = [];
  let closeCount = 0;
  const exports = {};
  const env = options.env ?? {
    SMTP_HOST: "smtp.example.test", SMTP_PORT: "587", SMTP_USER: "sender",
    SMTP_PASSWORD: "test-only-password", SMTP_FROM: "sender@example.test",
  };
  vm.runInNewContext(compiled("lib/server/email-verification.ts"), {
    exports, Buffer, Date: Clock, process: { env },
    require(name) {
      if (name === "node:crypto") return crypto;
      if (name === "nodemailer") return { default: { createTransport(config) {
        settings.push(config);
        return {
          async sendMail(mail) {
            if (options.fail) throw new Error("Delivery unavailable");
            sent.push(mail);
            return options.rejected ? { accepted: [], rejected: [mail.to.address] } : { accepted: [mail.to.address], rejected: [] };
          },
          close() { closeCount += 1; },
        };
      }}};
      throw new Error("Unexpected import: " + name);
    },
  });
  const route = {};
  vm.runInNewContext(compiled("app/api/auth/email-verification/route.ts"), {
    exports: route, Request, Response, URL,
    require: () => exports,
  });
  return {
    service: exports, route, sent, settings,
    advance(ms) { now += ms; },
    get closed() { return closeCount; },
    code() { return sent.at(-1).text.match(/\b\d{6}\b/)[0]; },
    request(body, origin = "http://localhost:3000") {
      return route.POST(new Request("http://localhost:3000/api/auth/email-verification", {
        method: "POST", headers: { origin, "Content-Type": "application/json" }, body: JSON.stringify(body),
      }));
    },
  };
}
const email = "person@example.test";
test("SMTP sends the code, returns only an opaque challenge, and requires TLS", async () => {
  const h = server();
  const result = await h.service.sendVerification(email, "Client", "ip");
  assert.match(result.challengeId, /^[a-f0-9]{64}$/);
  assert.equal("code" in result, false);
  assert.equal(h.sent.length, 1);
  assert.equal(h.sent[0].to.address, email);
  assert.equal(h.settings[0].requireTLS, true);
  assert.equal(h.closed, 1);
  assert.equal(h.service.verifyEmailCode(result.challengeId, h.code(), email, "Client", "ip").email, email);
  assert.throws(() => h.service.verifyEmailCode(result.challengeId, h.code(), email, "Client", "ip"), /expired/);
});
test("incorrect codes cannot verify and five attempts invalidate the challenge", async () => {
  const h = server();
  const { challengeId } = await h.service.sendVerification(email, "Client", "ip");
  const wrong = h.code() === "000000" ? "999999" : "000000";
  for (let i = 0; i < 4; i += 1) assert.throws(() => h.service.verifyEmailCode(challengeId, wrong, email, "Client", "ip"), /incorrect/);
  assert.throws(() => h.service.verifyEmailCode(challengeId, wrong, email, "Client", "ip"), /Too many/);
  assert.throws(() => h.service.verifyEmailCode(challengeId, h.code(), email, "Client", "ip"), /expired/);
});
test("expired codes and codes for a different account are rejected", async () => {
  const h = server();
  const { challengeId } = await h.service.sendVerification(email, "Client", "ip");
  assert.throws(() => h.service.verifyEmailCode(challengeId, h.code(), email, "Vendor", "ip"), /expired/);
  assert.throws(() => h.service.verifyEmailCode(challengeId, h.code(), "other@example.test", "Client", "ip"), /expired/);
  h.advance(10 * 60 * 1000 + 1);
  assert.throws(() => h.service.verifyEmailCode(challengeId, h.code(), email, "Client", "ip"), /expired/);
});
test("missing configuration, delivery failures, and recipient rejection never report success", async () => {
  for (const options of [{ env: {} }, { fail: true }, { rejected: true }]) {
    const h = server(options);
    await assert.rejects(h.service.sendVerification(email, "Client", "ip"), /configured|could not be sent/);
  }
});
test("email and client sending limits are enforced", async () => {
  const h = server();
  for (let i = 0; i < 5; i += 1) await h.service.sendVerification(email, "Client", "ip");
  await assert.rejects(h.service.sendVerification(email, "Client", "ip"), /Too many/);
  const client = server();
  for (let i = 0; i < 10; i += 1) await client.service.sendVerification(i + "@example.test", "Client", "ip");
  await assert.rejects(client.service.sendVerification("next@example.test", "Client", "ip"), /Too many/);
});
test("route rejects cross-origin requests and malformed requests", async () => {
  const h = server();
  assert.equal((await h.request({ action: "send", email, role: "Client" }, "http://other.test")).status, 403);
  assert.equal((await h.request({ action: "send", email: "bad", role: "Client" })).status, 400);
  assert.equal((await h.request({ action: "verify", email, role: "Client", challengeId: "bad", code: "123456" })).status, 400);
  assert.equal((await h.request({ action: "send", email, role: "Client", padding: "x".repeat(3000) })).status, 413);
  assert.equal(h.sent.length, 0);
});
test("route delivers and verifies without exposing the code in API responses", async () => {
  const h = server();
  const sent = await h.request({ action: "send", email, role: "Client" });
  assert.equal(sent.status, 200);
  assert.equal(sent.headers.get("Cache-Control"), "no-store");
  const payload = await sent.json();
  assert.equal("code" in payload, false);
  const verified = await h.request({ action: "verify", email, role: "Client", challengeId: payload.challengeId, code: h.code() });
  assert.equal(verified.status, 200);
  assert.deepEqual(await verified.json(), { email, role: "Client" });
});
test("client surfaces configuration and transport failures", async () => {
  const exports = {};
  let response = Response.json({ error: "Email delivery is not configured." }, { status: 503 });
  vm.runInNewContext(compiled("lib/email-verification.ts"), { exports, fetch: async () => response });
  await assert.rejects(exports.requestEmailVerification(email, "Client"), /not configured/);
  response = Response.json({ challengeId: "ab".repeat(32) });
  assert.equal(await exports.requestEmailVerification(email, "Client"), "ab".repeat(32));
  response = Response.json({ email: "other@example.test", role: "Client" });
  await assert.rejects(exports.submitEmailVerification("ab".repeat(32), "123456", email, "Client"), /does not match/);
});
