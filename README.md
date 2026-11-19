# EventHub

EventHub is an event-planning dashboard with a Next.js frontend and a small Express backend.

## Requirements

- Node.js 20.9 or later
- npm

## Setup

Install the frontend dependencies:

```bash
npm ci --prefix frontend
```

Install the backend dependencies only if you plan to run it:

```bash
npm ci --prefix backend
```

## Development

Run the frontend from the repository root:

```bash
npm run dev
```

Run the backend separately:

```bash
npm run dev:backend
```

The backend currently exposes a health endpoint at `http://localhost:5000/api/health`. Event and guest data in the dashboard is currently held in client-side application state; it is not persisted or synchronized through the backend.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run build:backend
```

Frontend setup, local SMTP configuration, and verification behavior are documented in [frontend/README.md](./frontend/README.md).
