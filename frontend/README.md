# EventHub Gate Scanner

The scanner is a responsive web app that runs in a phone or laptop browser. Use a URL such as `/scan?event=GFJN` to open a specific event. Camera scanning requires a secure context (HTTPS, or localhost); manual code entry remains available without a camera.

The interface uses the EventHub palette and typography: Primary `#266585`, Pressed `#123B3A`, Tint `#DBECEC`, Ink `#1B2430`, Arrived `#2E9D5B`, Pending `#E0A100`, and Failed `#D64545`, with Poppins for UI text and Playfair Display for headings.

## Run locally

Start the demo backend from `backend`:

```bash
npm run dev
```

In another terminal, start the scanner from `frontend`:

```bash
npm run dev
```

Open `http://localhost:3000/scan?event=GFJN`. Set `NEXT_PUBLIC_EVENTHUB_DEFAULT_EVENT_ID` to change the default event when a URL does not include `?event=`. To test from a phone on the same network, open the frontend using the computer's LAN address and ensure the backend is reachable on port `5000`. Phone camera permissions generally require HTTPS; localhost is the exception.

## Connect to EventHub

The frontend uses the scanner API contract below. Set `NEXT_PUBLIC_EVENTHUB_API_URL` to the API origin when it is hosted separately; for example, `https://api.example.com`. If the site is served over HTTPS and this variable is omitted, requests use the site's origin, which must proxy `/api/scanner` to the EventHub backend. This avoids mixed-content requests on HTTPS sites.

- `GET /api/scanner/events/{eventId}` returns `{ event, demoMode }`.
- `GET /api/scanner/events/{eventId}/stream` sends `stats` server-sent events containing `{ event, demoMode }`.
- `POST /api/scanner/scan` accepts `{ eventId, code }` and returns the scan result shape used in `app/page.tsx`.

The backend currently included in this repository is a **demo ticket store** persisted to a local JSON file; it is not connected to EventHub's production events or ticket database. The production EventHub backend must implement this contract (or an adapter for its existing ticket API) and validate staff authorization server-side before check-in. Do not put credentials in `NEXT_PUBLIC_*` variables.
