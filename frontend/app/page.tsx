"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { IScannerControls } from "@zxing/browser";

interface EventStats {
  letIn: number;
  rejected: number;
  ticketsSold: number;
}

interface EventRecord {
  id: string;
  name: string;
  date: string;
  gate: string;
  stats: EventStats;
}

interface TicketRecord {
  code: string;
  eventId: string;
  type: string;
  quantity: number;
  buyer: string;
  status: "paid" | "pending" | "refunded" | "used";
  checkedInAt: string | null;
  checkedInBy: string | null;
  eventName: string;
  eventDate: string;
}

interface EventSnapshot {
  event: EventRecord;
  demoMode: boolean;
}

interface ScanReply {
  outcome: "allowed" | "rejected";
  reason:
    | "valid"
    | "not_recognized"
    | "wrong_event"
    | "already_used"
    | "payment_pending"
    | "refunded";
  event: EventRecord;
  demoMode: boolean;
  ticket: TicketRecord | null;
}

interface ScanError {
  outcome: "error";
  title: string;
  message: string;
}

type ScanResult = ScanReply | ScanError;

const configuredApiUrl = process.env.NEXT_PUBLIC_EVENTHUB_API_URL?.replace(/\/$/, "");
const defaultEventId =
  process.env.NEXT_PUBLIC_EVENTHUB_DEFAULT_EVENT_ID?.trim().toUpperCase() ?? "GFJN";
const browserApiUrl =
  typeof window !== "undefined"
    ? window.location.protocol === "https:"
      ? window.location.origin
      : `${window.location.protocol}//${window.location.hostname}:5000`
    : "http://localhost:5000";
const API_BASE = configuredApiUrl ?? browserApiUrl;

function extractTicketCode(rawValue: string): string {
  const value = rawValue.trim();
  if (!value) return "";

  try {
    const url = new URL(value);
    const code =
      url.searchParams.get("ticket") ??
      url.searchParams.get("ticketCode") ??
      url.searchParams.get("code") ??
      url.searchParams.get("token");
    if (code) return code.trim();
  } catch {
    // QR codes may contain plain text rather than a URL.
  }

  try {
    const payload: unknown = JSON.parse(value);
    if (payload && typeof payload === "object") {
      const record = payload as Record<string, unknown>;
      for (const key of ["ticket", "ticketCode", "code", "token"]) {
        if (typeof record[key] === "string") return record[key].trim();
      }
    }
  } catch {
    // Plain-text ticket codes are valid payloads.
  }

  return value;
}

function formattedTime(value: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function StatusMark({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="m13 33 13 13 26-28" />
    </svg>
  ) : (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="m17 17 30 30m0-30L17 47" />
    </svg>
  );
}

function TicketDetails({ result }: { result: ScanReply }) {
  const ticket = result.ticket;
  if (!ticket) {
    if (result.reason !== "not_recognized") return null;
    return (
      <div className="result-message">
        <p>This QR is not a ticket for {result.event.name}.</p>
      </div>
    );
  }

  if (result.reason === "valid") {
    return (
      <div className="result-details">
        <DetailRow label="Ticket" value={ticket.code} />
        <DetailRow label="Bought by" value={ticket.buyer} />
        <DetailRow label="Marked used at" value={formattedTime(ticket.checkedInAt)} />
      </div>
    );
  }

  if (result.reason === "already_used") {
    return (
      <div className="result-details">
        <DetailRow label="Ticket" value={`${ticket.code}  ·  ${ticket.type}`} />
        <DetailRow
          label="First scanned"
          value={`${formattedTime(ticket.checkedInAt)}, ${ticket.checkedInBy}`}
        />
        <DetailRow label="Scanned by" value={ticket.checkedInBy ?? "Another gate"} />
      </div>
    );
  }

  return (
    <div className="result-message">
      {result.reason === "wrong_event" ? (
        <p>
          Ticket {ticket.code} is for {ticket.eventName}, {ticket.eventDate}.
        </p>
      ) : result.reason === "payment_pending" ? (
        <p>Payment for ticket {ticket.code} has not been completed.</p>
      ) : result.reason === "refunded" ? (
        <p>Ticket {ticket.code} has been refunded and is no longer valid.</p>
      ) : null}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function Home() {
  const [eventId] = useState(() => {
    if (typeof window === "undefined") return defaultEventId;
    const requestedEvent = new URLSearchParams(window.location.search)
      .get("event")
      ?.trim()
      .toUpperCase();
    return requestedEvent || defaultEventId;
  });
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [cameraState, setCameraState] = useState<"starting" | "live" | "error">("starting");
  const [cameraMessage, setCameraMessage] = useState("");
  const [manualEntry, setManualEntry] = useState(false);
  const [ticketCode, setTicketCode] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [clock, setClock] = useState("");
  const [isPageVisible, setIsPageVisible] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const cameraSession = useRef(0);
  const scanInFlight = useRef(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const updateClock = () => {
      setClock(
        new Intl.DateTimeFormat(undefined, {
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date()),
      );
    };
    updateClock();
    const timer = window.setInterval(updateClock, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const loadEvent = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/scanner/events/${encodeURIComponent(eventId)}`,
        { cache: "no-store" },
      );
      const payload = (await response.json()) as EventSnapshot | { error?: string };
      if (!response.ok || !("event" in payload)) {
        throw new Error(
          "error" in payload && payload.error ? payload.error : "Event is unavailable.",
        );
      }
      setEvent(payload.event);
      setStats(payload.event.stats);
      setIsDemoMode(payload.demoMode);
      setApiError("");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Could not reach the scanner server.");
    }
  }, [eventId]);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadEvent();
    }, 0);

    const source = new EventSource(
      `${API_BASE}/api/scanner/events/${encodeURIComponent(eventId)}/stream`,
    );
    source.addEventListener("stats", (eventMessage) => {
      try {
        const payload = JSON.parse((eventMessage as MessageEvent<string>).data) as EventSnapshot;
        if (!payload.event || !payload.event.stats) {
          setApiError("The live stats update was not in the expected format.");
          return;
        }
        setEvent(payload.event);
        setStats(payload.event.stats);
        setIsDemoMode(payload.demoMode);
        setApiError("");
        setIsLive(true);
      } catch {
        setApiError("Could not read the live stats update.");
      }
    });
    source.onopen = () => {
      setIsLive(true);
      void loadEvent();
    };
    source.onerror = () => setIsLive(false);

    return () => {
      window.clearTimeout(initialLoad);
      source.close();
    };
  }, [eventId, loadEvent]);

  const submitCode = useCallback(
    async (rawValue: string) => {
      const code = extractTicketCode(rawValue);
      if (!code || scanInFlight.current) return;

      scanInFlight.current = true;
      controlsRef.current?.stop();
      setBusy(true);
      setResult(null);
      setCameraMessage("");

      try {
        const response = await fetch(`${API_BASE}/api/scanner/scan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId,
            code,
          }),
        });
        const payload = (await response.json()) as ScanReply | { error?: string };
        if (!response.ok || !("outcome" in payload)) {
          throw new Error(
            "error" in payload && payload.error
              ? payload.error
              : "The scanner could not check this ticket.",
          );
        }

        setResult(payload);
        setEvent(payload.event);
        setStats(payload.event.stats);
        setIsDemoMode(payload.demoMode);
      } catch (error) {
        setResult({
          outcome: "error",
          title: "Scan not checked",
          message:
            error instanceof Error
              ? error.message
              : "Could not reach the ticket server. Do not admit the ticket.",
        });
      } finally {
        scanInFlight.current = false;
        setBusy(false);
      }
    },
    [eventId],
  );

  const startCamera = useCallback(async () => {
    const session = ++cameraSession.current;
    setCameraState("starting");
    setCameraMessage("");

    try {
      if (!window.isSecureContext) {
        throw new Error(
          "Camera access requires HTTPS or a localhost address. Open this page on localhost or use HTTPS.",
        );
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "This browser does not provide camera access. Use a current browser or enter the code by hand.",
        );
      }

      const { BrowserQRCodeReader } = await import("@zxing/browser");
      const video = videoRef.current;
      if (!video) return;

      const reader = new BrowserQRCodeReader();
      const controls = await reader.decodeFromConstraints(
        {
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        },
        video,
        (code, _error, scannerControls) => {
          if (!code || scanInFlight.current) return;
          scannerControls.stop();
          void submitCode(code.getText());
        },
      );

      if (session !== cameraSession.current) {
        controls.stop();
        return;
      }
      controlsRef.current = controls;
      setCameraState("live");
    } catch (error) {
      if (session !== cameraSession.current) return;
      setCameraState("error");
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError" || error.name === "SecurityError") {
          setCameraMessage(
            "Camera permission was denied. Allow camera access for this page, then try again.",
          );
        } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
          setCameraMessage("No camera was found on this device.");
        } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
          setCameraMessage("The camera is busy or unavailable in another app.");
        } else {
          setCameraMessage(
            error.message ||
              "Camera access failed. Allow camera access or enter the code by hand.",
          );
        }
      } else {
        setCameraMessage(
          error instanceof Error
            ? error.message
            : "Camera access failed. Allow camera access or enter the code by hand.",
        );
      }
    }
  }, [submitCode]);

  useEffect(() => {
    if (result || manualEntry || busy || !isPageVisible) {
      controlsRef.current?.stop();
      controlsRef.current = null;
      return;
    }

    const timer = window.setTimeout(() => void startCamera(), 0);
    return () => {
      window.clearTimeout(timer);
      cameraSession.current += 1;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [busy, isPageVisible, manualEntry, result, startCamera]);

  function handleManualEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitCode(ticketCode);
  }

  function scanNext() {
    setResult(null);
    setManualEntry(false);
    setTicketCode("");
    scanInFlight.current = false;
  }

  function renderResultContent() {
    if (!result) return null;
    const allowed = result.outcome === "allowed";
    const title =
      result.outcome === "error"
        ? result.title
        : result.reason === "valid"
          ? `${result.ticket?.type ?? "Ticket"}  ·  ${result.ticket?.quantity ?? 1} ${
              result.ticket?.quantity === 1 ? "person" : "people"
            }`
          : result.reason === "not_recognized"
            ? "Code not recognised"
            : result.reason === "wrong_event"
              ? "Wrong event"
              : result.reason === "already_used"
                ? "Ticket already used"
                : result.reason === "payment_pending"
                  ? "Payment incomplete"
                  : "Ticket refunded";

    return (
      <div className={`result-view ${allowed ? "allowed" : "rejected"}`}>
        <div className="result-mark">
          <StatusMark allowed={allowed} />
        </div>
        <p className="result-label">
          {result.outcome === "error" ? "SCAN UNAVAILABLE" : allowed ? "ALLOWED IN" : "REJECTED"}
        </p>
        <h2>{title}</h2>
        {result.outcome === "error" ? (
          <div className="result-message">
            <p>{result.message}</p>
          </div>
        ) : (
          <>
            <TicketDetails result={result} />
            <p className="result-guidance">
              {result.reason === "valid"
                ? "Enjoy the event."
                : result.reason === "already_used"
                  ? "A code works once."
                  : result.reason === "wrong_event"
                    ? "Do not let them in. Point them to the correct venue and date."
                    : result.reason === "not_recognized"
                      ? "Do not let the person in. Ask them to show the ticket email."
                      : "Do not let the person in. Ask them to contact the ticket organizer."}
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <main className="scanner-app">
      <header className="scanner-header">
        <div className="status-bar" aria-label="Device status">
          <span>{clock || "—"}</span>
          <span className="status-icons" aria-hidden="true">
            <i />
            <i />
          </span>
        </div>

        <div className="event-heading">
          <h1>Gate scanner</h1>
          <p>
            {event ? `${event.name}  ·  ${event.gate}` : "Connecting to event…"}
          </p>
          <p className="scan-url">
            Event ID: {eventId} · {isDemoMode ? "Demo environment" : "EventHub"}
          </p>
        </div>

        <div className="stats" aria-label="Live event check-in statistics">
          <div className="stat-card">
            <span>Let in</span>
            <strong>{stats?.letIn ?? "—"}</strong>
          </div>
          <div className="stat-card">
            <span>Rejected</span>
            <strong>{stats?.rejected ?? "—"}</strong>
          </div>
          <div className="stat-card">
            <span>Tickets sold</span>
            <strong>{stats?.ticketsSold ?? "—"}</strong>
          </div>
        </div>
      </header>

      <section
        className={`camera-view ${result ? `camera-result ${result.outcome}` : ""}`}
        aria-label="Ticket QR scanner"
      >
        {result ? (
          renderResultContent()
        ) : (
          <>
            <video
              ref={videoRef}
              className={`scanner-video ${cameraState === "error" ? "is-hidden" : ""}`}
              muted
              playsInline
              aria-label="Live camera preview"
            />
            <div className="camera-shade" />
            <div className="scan-frame" aria-hidden="true">
              <span className="corner top-left" />
              <span className="corner top-right" />
              <span className="corner bottom-left" />
              <span className="corner bottom-right" />
              <span className="scan-line" />
            </div>
            <p className="camera-instruction">
              {cameraState === "live"
                ? "Point the camera at the ticket QR code"
                : cameraState === "starting"
                  ? "Starting camera…"
                  : "Camera is unavailable"}
            </p>
            {cameraState === "error" && (
              <div className="camera-error" role="status">
                <p>{cameraMessage}</p>
                <button type="button" onClick={() => void startCamera()}>
                  Try camera again
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <footer className={`scanner-footer ${result ? "result-footer" : ""}`}>
        {result ? (
          <button type="button" className="scan-next" onClick={scanNext}>
            Scan next
          </button>
        ) : manualEntry ? (
          <form
            className="manual-form"
            onSubmit={handleManualEntry}
            aria-label="Enter ticket code"
          >
            <label className="visually-hidden" htmlFor="ticket-code">
              Ticket code
            </label>
            <input
              id="ticket-code"
              autoFocus
              value={ticketCode}
              onChange={(inputEvent) => setTicketCode(inputEvent.target.value)}
              placeholder="Ticket code, e.g. EH-T-7F3K-21"
              autoComplete="off"
              required
              disabled={busy}
            />
            <button type="submit" className="verify-button" disabled={busy}>
              {busy ? "Checking…" : "Check"}
            </button>
            <button
              type="button"
              className="cancel-entry"
              onClick={() => {
                setManualEntry(false);
                setTicketCode("");
              }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <button
              className="manual-entry"
              disabled={busy}
              onClick={() => {
                controlsRef.current?.stop();
                setManualEntry(true);
              }}
            >
              Enter code by hand
            </button>
            {isDemoMode && (
              <button
                className="demo-link"
                disabled={busy}
                onClick={() => void submitCode("EH-T-9A2C-04")}
              >
                Demo: ticket for another event
              </button>
            )}
            <p className="scan-status" aria-live="polite">
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M3.3 7.3A7 7 0 1 1 3 11" />
                <path d="M3.2 3.8v3.8H7" />
                <path d="M10 6.3v4l2.5 1.5" />
              </svg>
              <span>
                {busy
                  ? "Checking ticket…"
                  : isLive
                    ? `Live updates · ${isDemoMode ? "Demo data" : "EventHub"}`
                    : apiError || "Waiting for scanner server"}
              </span>
            </p>
          </>
        )}
      </footer>
    </main>
  );
}
