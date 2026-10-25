# EventHub payment module integration

The payment area uses the existing LocationIcon component, Georgia brand/headings, Arial UI text and the shared EventHub teal #266665. No separate login, fixture accounts, passwords, seeded balances or simulated payment outcomes are included. Your teammate's shared login owns registration, email verification, session cookies, expiry and logout.

## Pages

* `/finance` or `/client/payments`: client payment history and milestones.
* `/client/checkout/{bookingId}`: checkout for a real booking ID.
* `/vendor/earnings`: vendor earnings and payout history.
* `/manager/payments`: assigned manager payment oversight.

These pages render branded empty states before shared authentication is connected. The URL only chooses presentation; it never grants a role. Once authenticated, the actual server role controls data and actions. No fabricated payments are shown as real. Existing `/` and `/checkout` pages are earlier work and are preserved.

Run `npm run dev` in backend and frontend. Default frontend origin is http://localhost:3000 and API is http://localhost:5000/api/finance. Set FINANCE_WEB_ORIGIN and NEXT_PUBLIC_FINANCE_API_URL if different. Optionally set NEXT_PUBLIC_AUTH_SIGN_IN_URL to your teammate's actual sign-in page before starting frontend; no broken sign-in URL is assumed.

## Shared authentication connection

`backend/src/server.ts` reads `app.locals.financeIntegration` on each request. A trusted server bootstrap should set it using the exported FinanceIntegration type from `src/finance/router.ts`. It is not a JSON endpoint and cannot be set by browser headers.

```ts
import type { FinanceIntegration } from './finance/router.js';
import { view } from './finance/domain.js';

const integration: FinanceIntegration = {
  resolveSession: async (req) => {
    // Verify the team's existing opaque session cookie or signed provider token.
    // Obtain immutable ID, server-assigned role and verified-email status
    // from the authentication service. Return null for expired/invalid sessions.
    const session = await authService.readVerifiedSession(req);
    if (!session) return null;
    return {
      user: { id: session.user.id, name: session.user.name, role: session.user.role },
      csrf: session.csrfToken,
      emailVerified: session.user.emailVerified,
    };
  },
  listBookings: (user) => bookingRepository.listForPrincipal(user),
  getBooking: (id) => bookingRepository.findById(id),
  presentBooking: (booking, user) => view(booking, user.role),
  // Supply the additional service adapters listed below when available.
};
app.locals.financeIntegration = integration;
```

The service names above illustrate the handoff; implement them against your teammates' actual services. With no integration, protected APIs return 401. Verified accounts without a connected booking/payment service receive 503, never fake success. Email verification is required. CSRF token must be at least 32 characters, random and tied to the verified shared session. Use HttpOnly, SameSite cookies, Secure over HTTPS, proper session rotation/invalidation and your shared auth provider's recommendations. Roles/IDs/email verification must not come from browser request bodies or unverified headers.

## Payment and booking adapters

See the FinanceIntegration type for exact TypeScript signatures:

* `createQuote(booking, currency)`: actual tax/fee policy and exchange-rate provider, returning integer minor-unit amounts, rates and a rate description. No default tax or exchange rate is invented.
* `checkout.allowedHosts`: exact HTTPS payment provider hostnames.
* `checkout.create({booking, user, quote, idempotencyKey})`: provider-hosted checkout creation. Provider/service must enforce durable idempotency, bind booking/user/quote/version, freeze applicable prices and prevent simultaneous duplicate sessions/charges. The module scopes the key to user and booking and rejects unexpected amount/outcome fields.
* `receipt(booking, user)`: actual payment-service receipt text. Available only to the booking's client after payment is confirmed.
* `completeEvent(booking, user)`: transactionally recheck assignment, payment, verified arrival, completion state and the event date/timezone, then record completion and financial events. Must be idempotent under concurrent calls.

The Booking contract includes repository-owned milestone amounts, commission, net amounts, release state and actual payout state. No inferred bank transfers or invented commission percentages are shown. Use the `view` projection to avoid exposing internal ownership IDs, client receipts to vendors or audit history to unrelated roles.

Only a verified gateway webhook/payment reconciliation service may mark a booking paid. The frontend never sends `outcome=success` or changes payment/arrival statuses. No arrival approval API is exposed: the event verification module must supply trusted arrival evidence. No gateway adapter means checkout is unavailable. Redirects must use HTTPS and an allowed provider host; arbitrary redirect URLs are rejected.

## API

Prefix `/api/finance`. All require shared verified authentication. Mutations require exact FINANCE_WEB_ORIGIN and X-CSRF-Token. Responses are no-store. JSON errors use `{error: string}`.

| Method | Path | Permission |
|---|---|---|
| GET | /session | verified shared session, returns principal + CSRF |
| GET | /bookings | owned/assigned bookings only |
| GET | /bookings/:id/quote?currency=LKR | owning client |
| POST | /bookings/:id/checkout | owning client; currency, acceptedTerms=true; Idempotency-Key |
| GET | /bookings/:id/receipt | owning client, confirmed payment |
| POST | /bookings/:id/complete | assigned manager; confirmed=true |

No payment-specific login or account creation endpoint exists. No fixture password environment variable is used. Real service integration remains required before actual money can move.

## Verification

Backend: `node --import tsx --test src/finance/router.test.ts` and `npx tsc --noEmit`.
Frontend: `npx eslint features/finance app/finance app/client app/vendor app/manager`, `npx tsc --noEmit`, `npm run build`.

Tests inject identities and booking records only inside the test process. They cover missing/shared auth, unverified email, role/header spoofing, ownership, CSRF/origin, amount/outcome injection, missing provider, safe redirects, unpaid receipts, role-private output and manager permissions. These are integration boundaries, not a claim that the unconnected external authentication, booking or payment providers are production ready.
