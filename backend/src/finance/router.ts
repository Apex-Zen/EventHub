import { Router, json } from "express";
import type { Request, Response, NextFunction } from "express";
import { FinanceError, authorize, canRead } from "./domain.js";
import type { Booking, Principal, Currency } from "./domain.js";

export type FinanceSession = { user: Principal; csrf: string; emailVerified: boolean };
export type CheckoutQuote = { currency: Currency; subtotal: number; tax: number; serviceFee: number; total: number; taxBps: number; serviceFeeBps: number; rateLabel: string };
/** All adapters are supplied by trusted server code, never browser headers/body. */
export type FinanceIntegration = {
  resolveSession: (req: Request) => Promise<FinanceSession | null>;
  listBookings?: (user: Principal) => Promise<unknown[]>;
  getBooking?: (id: string) => Promise<Booking | null>;
  presentBooking?: (booking: Booking, user: Principal) => unknown;
  createQuote?: (booking: Booking, currency: Currency) => Promise<CheckoutQuote>;
  checkout?: {
    allowedHosts: string[];
    create: (input: { booking: Booking; user: Principal; quote: CheckoutQuote; idempotencyKey: string }) => Promise<{ checkoutUrl: string }>;
  };
  receipt?: (booking: Booking, user: Principal) => Promise<string>;
  completeEvent?: (booking: Booking, user: Principal) => Promise<unknown>;
};
export type FinanceOptions = { origin: string; integration?: () => FinanceIntegration | undefined };

function input(req: Request, allowed: string[]) {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body) || Object.keys(req.body).some(key => !allowed.includes(key)))
    throw new FinanceError(400, "Unexpected or missing request fields.");
  return req.body as Record<string, unknown>;
}
function currency(value: unknown): Currency {
  if (value !== "LKR" && value !== "USD" && value !== "EUR") throw new FinanceError(400, "Unsupported currency.");
  return value;
}
function validateQuote(q: CheckoutQuote, requestedCurrency: Currency) {
  if (q.currency !== requestedCurrency || ![q.subtotal, q.tax, q.serviceFee, q.total, q.taxBps, q.serviceFeeBps].every(n => Number.isSafeInteger(n) && n >= 0)
    || q.total !== q.subtotal + q.tax + q.serviceFee || q.total <= 0) throw new FinanceError(503, "Payment pricing is temporarily unavailable.");
  return q;
}
export function createFinanceRouter(options: FinanceOptions) {
  const router = Router();
  const buckets = new Map<string, { count: number; until: number }>();
  router.use((_req, res, next) => {
    res.set({ "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" }); next();
  });
  router.use(async (req, res, next) => {
    const now = Date.now();
    for (const [key, bucket] of buckets) if (bucket.until < now) buckets.delete(key);
    const key = req.ip || "unknown", bucket = buckets.get(key) || { count: 0, until: now + 60000 };
    if (buckets.size > 2000) throw new FinanceError(503, "Please try again shortly.");
    buckets.set(key, bucket); bucket.count++;
    if (bucket.count > 180) throw new FinanceError(429, "Too many requests. Try again in one minute.");
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method) && req.headers.origin !== options.origin) throw new FinanceError(403, "Request origin is not allowed.");
    const integration = options.integration?.();
    const session = integration ? await integration.resolveSession(req) : null;
    if (!session || !session.user?.id || !["client", "vendor", "manager"].includes(session.user.role)) throw new FinanceError(401, "Sign in to EventHub to continue.");
    if (!session.emailVerified) throw new FinanceError(403, "Verify your email address before accessing payments.");
    if (typeof session.csrf !== "string" || session.csrf.length < 32) throw new FinanceError(503, "Account verification is temporarily unavailable.");
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method) && req.headers["x-csrf-token"] !== session.csrf) throw new FinanceError(403, "Session verification failed. Please sign in again.");
    res.locals.integration = integration; res.locals.session = session; next();
  });
  router.use(json({ limit: "8kb", strict: true }));
  router.get("/session", (_req, res) => {
    const session = res.locals.session as FinanceSession;
    res.json({ user: session.user, csrf: session.csrf });
  });
  router.get("/bookings", async (_req, res) => {
    const integration = res.locals.integration as FinanceIntegration;
    if (!integration.listBookings || !integration.presentBooking) throw new FinanceError(503, "Your bookings are temporarily unavailable.");
    const user = (res.locals.session as FinanceSession).user;
    const bookings = await integration.listBookings(user) as Booking[];
    // Recheck object ownership even if the upstream repository filters by account.
    res.json({ bookings: bookings.filter(b => canRead(user, b)).map(b => integration.presentBooking!(b, user)) });
  });
  router.use("/bookings/:bookingId", async (req, res, next) => {
    const integration = res.locals.integration as FinanceIntegration;
    if (!integration.getBooking) throw new FinanceError(503, "Your booking is temporarily unavailable.");
    const booking = await integration.getBooking(String(req.params.bookingId));
    if (!booking) throw new FinanceError(404, "Booking not found.");
    authorize((res.locals.session as FinanceSession).user, booking); res.locals.booking = booking; next();
  });
  router.get("/bookings/:bookingId/quote", async (req, res) => {
    authorize((res.locals.session as FinanceSession).user, res.locals.booking, "client");
    const requestedCurrency = currency(req.query.currency || "LKR"), integration = res.locals.integration as FinanceIntegration;
    if (!integration.createQuote) throw new FinanceError(503, "Checkout is not available yet. Please try again later.");
    res.json(validateQuote(await integration.createQuote(res.locals.booking, requestedCurrency), requestedCurrency));
  });
  router.post("/bookings/:bookingId/checkout", async (req, res) => {
    const user = (res.locals.session as FinanceSession).user, booking = res.locals.booking as Booking;
    authorize(user, booking, "client");
    const data = input(req, ["currency", "acceptedTerms"]), requestedCurrency = currency(data.currency);
    if (data.acceptedTerms !== true) throw new FinanceError(400, "Accept the booking payment terms to continue.");
    const key = req.headers["idempotency-key"];
    if (typeof key !== "string" || !/^[a-zA-Z0-9-]{16,80}$/.test(key)) throw new FinanceError(400, "A valid idempotency key is required.");
    if (booking.paid) throw new FinanceError(409, "This booking has already been paid.");
    const integration = res.locals.integration as FinanceIntegration;
    if (!integration.checkout || !integration.createQuote) throw new FinanceError(503, "Online checkout is not available yet.");
    const quote = validateQuote(await integration.createQuote(booking, requestedCurrency), requestedCurrency);
    const result = await integration.checkout.create({ booking, user, quote, idempotencyKey: `${user.id}:${booking.id}:${key}` });
    let target: URL;
    try { target = new URL(result.checkoutUrl); } catch { throw new FinanceError(502, "Unable to open the payment provider."); }
    if (target.protocol !== "https:" || target.username || target.password || target.port || !integration.checkout.allowedHosts.includes(target.hostname)) throw new FinanceError(502, "Unable to open the payment provider.");
    // Only verified provider webhook handling in the payment service may mark a booking paid.
    res.json({ checkoutUrl: target.toString() });
  });
  router.get("/bookings/:bookingId/receipt", async (_req, res) => {
    const user = (res.locals.session as FinanceSession).user, booking = res.locals.booking as Booking;
    authorize(user, booking, "client");
    if (!booking.paid || !booking.payment) throw new FinanceError(409, "Your receipt will be available after payment is confirmed.");
    const integration = res.locals.integration as FinanceIntegration;
    if (!integration.receipt) throw new FinanceError(503, "Receipt download is temporarily unavailable.");
    res.set({ "Content-Type": "text/plain; charset=utf-8", "Content-Disposition": 'attachment; filename="eventhub-receipt.txt"' });
    res.send(await integration.receipt(booking, user));
  });
  router.post("/bookings/:bookingId/complete", async (req, res) => {
    const user = (res.locals.session as FinanceSession).user, booking = res.locals.booking as Booking;
    authorize(user, booking, "manager");
    if (input(req, ["confirmed"]).confirmed !== true) throw new FinanceError(400, "Explicit confirmation is required.");
    if (!booking.paid || !booking.arrivalVerified || booking.completed) throw new FinanceError(409, "This event is not ready for completion.");
    const integration = res.locals.integration as FinanceIntegration;
    if (!integration.completeEvent) throw new FinanceError(503, "Event completion is temporarily unavailable.");
    // Adapter must transactionally recheck state and event timezone before writing.
    res.json({ booking: await integration.completeEvent(booking, user) });
  });
  router.use((_req, _res, next) => next(new FinanceError(404, "Payment endpoint not found.")));
  router.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const status = error instanceof FinanceError ? error.status : (error as { status?: number })?.status;
    res.status(error instanceof FinanceError ? error.status : status === 400 || status === 413 ? status : 500)
      .json({ error: error instanceof FinanceError ? error.message : status === 400 ? "Invalid request." : status === 413 ? "Request is too large." : "We couldn't complete your request. Please try again." });
  });
  return router;
}
