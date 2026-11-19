# EventHub frontend

The EventHub frontend is a Next.js application. It uses locally bundled Poppins for body/UI text and Playfair Display for headings, so builds do not need to fetch Google Fonts. Their SIL Open Font License notices are in `public/fonts`.

## Setup and commands

From the repository root:

```bash
npm ci --prefix frontend
npm run dev
```

The development server is available at [http://localhost:3000](http://localhost:3000).

Run frontend checks from the repository root:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Email verification

Email verification runs in the Next.js Node server through `/api/auth/email-verification` and sends mail through Nodemailer.

1. Copy `.env.example` to `.env.local` in this directory.
2. Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` using your provider's SMTP settings and approved sender address.
3. Restart the frontend server after changing these settings.

Port 465 uses implicit TLS; other ports use STARTTLS. SMTP credentials remain on the server. Never use a `NEXT_PUBLIC_` prefix for SMTP credentials, and never commit `.env.local`.

Without valid SMTP settings, signup reports a delivery error and offers a login retry for the saved account. The verification screen opens only after the mail server accepts the message. Enter the emailed six-digit code to verify the account and sign in.

Codes expire after ten minutes, permit five incorrect attempts, and are consumed on successful verification. Sending and checking are rate limited. Tests mock the mail transport and do not send real email.

Accounts are currently stored in the browser, while verification challenges are held in the running Node process. Restarting that process invalidates pending codes; sign in again to request a new one. Multiple server replicas or serverless deployments require shared challenge and rate-limit storage. If a reverse proxy supplies `X-Forwarded-For`, configure it to overwrite that header before enabling it for client rate limits.

SMTP provider configuration reference: https://nodemailer.com/smtp
