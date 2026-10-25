import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { createFinanceRouter } from "./router.js";
import type { FinanceIntegration, FinanceSession } from "./router.js";
import { view } from "./domain.js";
import type { Booking } from "./domain.js";

test("shared-auth integration protects payment actions without fixture login", async () => {
  // Test fixtures are injected into the server; they are never runtime accounts.
  const booking: Booking = { id: "booking-123", title: "Event", vendor: "Vendor", clientId: "c1", vendorId: "v1", managerId: "m1", date: "2027-01-01", location: "Colombo", baseMinor: 10000, paid: false, arrivalVerified: false, completed: false, milestones: [], payment: null, audit: [] };
  const users: Record<string, FinanceSession> = Object.fromEntries([
    ["client", "c1", "client", true], ["other", "c2", "client", true], ["vendor", "v1", "vendor", true], ["manager", "m1", "manager", true], ["unverified", "c1", "client", false],
  ].map(([name, id, role, verified]) => [name, { user: { id, role, name }, csrf: "test-csrf-012345678901234567890123456789", emailVerified: verified }])) as Record<string, FinanceSession>;
  let target = "https://payments.provider.test/session/123";
  let receivedKey = "";
  const integration: FinanceIntegration = {
    resolveSession: async req => users[String(req.headers["test-session"])] || null,
    listBookings: async () => [booking], getBooking: async id => id === booking.id ? booking : null,
    presentBooking: (item, user) => view(item, user.role),
    createQuote: async (_booking, currency) => ({ currency, subtotal: 10000, tax: 0, serviceFee: 100, total: 10100, taxBps: 0, serviceFeeBps: 100, rateLabel: "Settlement quote" }),
    checkout: { allowedHosts: ["payments.provider.test"], create: async input => { receivedKey = input.idempotencyKey; return { checkoutUrl: target }; } },
  };
  const app = express();
  app.use("/api/finance", createFinanceRouter({ origin: "http://localhost:3000", integration: () => integration }));
  app.use("/unconnected", createFinanceRouter({ origin: "http://localhost:3000" }));
  const server = app.listen(0, "127.0.0.1"); await new Promise<void>(resolve => server.on("listening", resolve));
  const address = server.address(); assert(address && typeof address !== "string");
  const base = `http://127.0.0.1:${address.port}`;
  const call = (path: string, role = "client", method = "GET", body?: unknown, headers: Record<string, string> = {}) => fetch(base + path, {
    method, headers: { Origin: "http://localhost:3000", "test-session": role, "X-CSRF-Token": users.client!.csrf, "Idempotency-Key": "payment-request-123456", ...(body ? { "Content-Type": "application/json" } : {}), ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const prefix = "/api/finance", path = prefix + "/bookings/booking-123", payload = { currency: "LKR", acceptedTerms: true };
  try {
    assert.equal((await call("/unconnected/session")).status, 401);
    assert.equal((await call(prefix + "/session", "unknown", "GET", undefined, { role: "manager", "x-user-id": "m1" })).status, 401);
    assert.equal((await call(prefix + "/session", "unverified")).status, 403);
    assert.equal((await call(prefix + "/session", "client", "POST", { email: "client@demo.eventhub", password: "anything" })).status, 404);
    assert.equal((await call(path + "/quote", "other")).status, 404);
    assert.deepEqual((await (await call(prefix + "/bookings", "other")).json()).bookings, []);
    assert.equal((await call(path + "/quote", "vendor")).status, 403);
    assert.equal((await call(path + "/quote?currency=XYZ")).status, 400);
    assert.equal((await call(path + "/checkout", "client", "POST", payload, { Origin: "https://attacker.test" })).status, 403);
    assert.equal((await call(path + "/checkout", "client", "POST", payload, { "X-CSRF-Token": "wrong" })).status, 403);
    assert.equal((await call(path + "/checkout", "vendor", "POST", payload)).status, 403);
    assert.equal((await call(path + "/checkout", "client", "POST", { ...payload, total: 1 })).status, 400);
    assert.equal((await call(path + "/checkout", "client", "POST", { ...payload, outcome: "success" })).status, 400);
    assert.equal((await call(path + "/pay", "client", "POST", payload)).status, 404);
    const response = await call(path + "/checkout", "client", "POST", payload);
    assert.equal(response.status, 200); assert.equal((await response.json()).checkoutUrl, target);
    assert.equal(receivedKey, "c1:booking-123:payment-request-123456"); assert.equal(booking.paid, false);
    target = "https://attacker.test/fake-checkout";
    assert.equal((await call(path + "/checkout", "client", "POST", payload)).status, 502);
    target = "http://payments.provider.test/session";
    assert.equal((await call(path + "/checkout", "client", "POST", payload)).status, 502);
    const checkout = integration.checkout; delete integration.checkout;
    assert.equal((await call(path + "/checkout", "client", "POST", payload)).status, 503); integration.checkout = checkout!;
    assert.equal((await call(path + "/receipt", "other")).status, 404);
    assert.equal((await call(path + "/receipt", "vendor")).status, 403);
    assert.equal((await call(path + "/receipt")).status, 409);
    assert.equal((await call(path + "/complete", "client", "POST", { confirmed: true })).status, 403);
    assert.equal((await call(path + "/complete", "manager", "POST", { confirmed: true })).status, 409);
    const vendorView = view(booking, "vendor"); assert.equal("payment" in vendorView, false); assert.equal("audit" in vendorView, false); assert.equal("clientId" in vendorView, false);
  } finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
});
