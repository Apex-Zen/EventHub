This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Email verification

Email verification runs in the Next.js Node server through /api/auth/email-verification. It uses SMTP through Nodemailer.

1. Copy .env.example to .env.local in the frontend folder.
2. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM using your email provider’s SMTP settings and approved sender address.
3. Restart the frontend server after changing these settings.

Port 465 uses implicit TLS; other ports require STARTTLS. SMTP credentials remain on the server. Never use a NEXT_PUBLIC_ prefix for them, and never commit .env.local.

Without valid SMTP settings, signup reports a delivery error and offers login retry for the saved account. The verification screen opens only after the mail server accepts the message. Enter the emailed six-digit code to verify the account and sign in.

Codes expire after ten minutes, permit five incorrect attempts, and are consumed on successful verification. Sending and checking are rate limited. Tests mock the mail transport; they do not send real emails.

The current application stores accounts in the browser and verification challenges in the running Node process. Restarting that process invalidates pending codes; sign in again to request a new one. Multiple server replicas or serverless deployments require a shared challenge and rate-limit store. Configure a reverse proxy to overwrite X-Forwarded-For if it is used for client rate limits.

Run npm test, npx tsc --noEmit, and npm run lint from the frontend folder.

SMTP provider configuration reference: https://nodemailer.com/smtp
