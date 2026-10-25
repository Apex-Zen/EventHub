"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import LocationIcon from "../../component/icon/LocationIcon";
import "./finance.css";

type Role = "client" | "vendor" | "manager";
type Currency = "LKR" | "USD" | "EUR";
type Session = { user: { name: string; role: Role }; csrf: string };
type Milestone = { stage: number; percent: number; gross: number; commission: number; net: number; status: string; payoutStatus: string };
type Booking = {
  id: string; title: string; vendor: string; date: string; location: string;
  baseMinor: number; paid: boolean; arrivalVerified: boolean; completed: boolean;
  milestones: Milestone[];
  payment?: { id: string; currency: Currency; totalMinor: number; createdAt: string } | null;
  audit?: { action: string; actorId: string; at: string }[];
};
type Quote = { currency: Currency; subtotal: number; tax: number; serviceFee: number; total: number; taxBps: number; serviceFeeBps: number; rateLabel: string };
const API = process.env.NEXT_PUBLIC_FINANCE_API_URL || "http://localhost:5000/api/finance";
const signInUrl = process.env.NEXT_PUBLIC_AUTH_SIGN_IN_URL;
const fetchSession = (signal?: AbortSignal) => fetch(`${API}/session`, { credentials: "include", cache: "no-store", ...(signal ? { signal } : {}) });
const money = (amount: number, currency: Currency = "LKR") => new Intl.NumberFormat("en-LK", { style: "currency", currency }).format(amount / 100);
const stages = [
  { percent: 20, title: "Booking confirmed", description: "The first milestone follows confirmed booking and successful payment.", symbol: "check" },
  { percent: 50, title: "Vendor arrival", description: "The next milestone follows verified arrival at your event venue.", symbol: "pin" },
  { percent: 30, title: "Event completed", description: "The final milestone follows completion confirmed by your event manager.", symbol: "flag" },
];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, string> = {
    wallet: "M3 6h16v14H3V6Zm0 0V3h13v3M15 11h6v5h-6v-5Z",
    arrow: "M5 12h14m-5-5 5 5-5 5", check: "m5 12 4 4L19 6",
    lock: "M6 10h12v11H6V10Zm3 0V6a3 3 0 0 1 6 0v4m-3 4v3",
    pin: "M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 1 1 14 0Zm-7-2v4m-2-2h4",
    flag: "M5 21V3h14l-3 5 3 5H5", receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6m-6 4h6",
    calendar: "M4 5h16v16H4V5Zm3-3v6m10-6v6M4 10h16",
    grid: "M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z",
    trend: "m3 17 6-6 4 4 8-10m-6 0h6v6", clock: "M12 8v5l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.wallet}/></svg>;
}

export default function FinanceWorkspace({ screen = "overview", bookingId, audience = "client" }: { screen?: "overview" | "checkout"; bookingId?: string; audience?: Role }) {
  const [session, setSession] = useState<Session | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selection, setSelection] = useState(bookingId || "");
  const [loading, setLoading] = useState(true), [busy, setBusy] = useState(false);
  const [error, setError] = useState(""), [notice, setNotice] = useState("");
  const [tab, setTab] = useState<"payments" | "milestones">("payments");
  const [currency, setCurrency] = useState<Currency>("LKR");
  const [quoteData, setQuoteData] = useState<(Quote & { bookingId: string }) | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [attempt, setAttempt] = useState<{ fingerprint: string; key: string } | null>(null);
  const role = session?.user.role || audience;
  const selected = selection || bookings[0]?.id || "";
  const booking = bookings.find(b => b.id === selected);
  const quote = quoteData?.bookingId === booking?.id && quoteData?.currency === currency ? quoteData : null;

  const load = useCallback(async (response: Response, signal?: AbortSignal) => {
    try {
      if (response.status === 401) { setSession(null); setBookings([]); return; }
      const identity = await response.json();
      if (!response.ok) throw new Error(identity.error || "Unable to load your account.");
      setSession(identity);
      const result = await fetch(`${API}/bookings`, { credentials: "include", cache: "no-store", ...(signal ? { signal } : {}) });
      const data = await result.json();
      if (!result.ok) throw new Error(data.error || "Unable to load payments.");
      setBookings(data.bookings);
    } catch (e) {
      if (e instanceof Error && e.name !== "AbortError") setError(e.message === "Failed to fetch" ? "We couldn't load your payments. Please try again shortly." : e.message);
    } finally { if (!signal?.aborted) setLoading(false); }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchSession(controller.signal).then(response => load(response, controller.signal)).catch(e => {
      if (e.name !== "AbortError") { setError("Unable to load your account. Please try again shortly."); setLoading(false); }
    });
    return () => controller.abort();
  }, [load]);
  useEffect(() => {
    if (!session || session.user.role !== "client" || !booking || booking.paid) return;
    const controller = new AbortController();
    fetch(`${API}/bookings/${encodeURIComponent(booking.id)}/quote?currency=${currency}`, { credentials: "include", cache: "no-store", signal: controller.signal })
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setQuoteData({ ...data, bookingId: booking.id }); })
      .catch(e => { if (e.name !== "AbortError") setError(e.message); });
    return () => controller.abort();
  }, [session, booking, currency]);

  async function refresh() {
    setError(""); setLoading(true);
    try { await load(await fetchSession()); }
    catch { setError("Unable to load your account. Please try again shortly."); setLoading(false); }
  }
  async function action(name: "checkout" | "complete") {
    if (!booking || !session) return;
    setBusy(true); setError(""); setNotice("");
    const payload = name === "checkout" ? { currency, acceptedTerms: accepted } : { confirmed: true };
    const fingerprint = JSON.stringify({ bookingId: booking.id, ...payload });
    const key = attempt?.fingerprint === fingerprint ? attempt.key : crypto.randomUUID();
    if (name === "checkout") setAttempt({ fingerprint, key });
    try {
      const response = await fetch(`${API}/bookings/${encodeURIComponent(booking.id)}/${name}`, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json", "X-CSRF-Token": session.csrf, "Idempotency-Key": key }, body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.status === 401) { setSession(null); setBookings([]); }
      if (!response.ok) throw new Error(data.error || "Unable to continue.");
      if (name === "checkout") { window.location.assign(data.checkoutUrl); return; }
      await load(await fetchSession()); setNotice("Event completion has been recorded.");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to continue."); }
    finally { setBusy(false); }
  }
  async function receipt() {
    if (!booking) return;
    setBusy(true); setError("");
    try {
      const response = await fetch(`${API}/bookings/${encodeURIComponent(booking.id)}/receipt`, { credentials: "include", cache: "no-store" });
      if (!response.ok) throw new Error((await response.json()).error || "Receipt unavailable.");
      const url = URL.createObjectURL(await response.blob()), anchor = document.createElement("a");
      anchor.href = url; anchor.download = "eventhub-receipt.txt"; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) { setError(e instanceof Error ? e.message : "Receipt unavailable."); } finally { setBusy(false); }
  }

  const released = booking?.milestones.filter(m => m.status === "Released") || [];
  const gross = booking?.baseMinor;
  const amountReleased = booking ? released.reduce((sum, m) => sum + (role === "vendor" ? m.net : m.gross), 0) : undefined;
  const amountHeld = booking ? booking.milestones.filter(m => m.status !== "Released").reduce((sum, m) => sum + (role === "vendor" ? m.net : m.gross), 0) : undefined;
  const title = screen === "checkout" ? "Checkout" : role === "vendor" ? "Earnings & payouts" : role === "manager" ? "Payment oversight" : "Payments";

  return <div className="finance">
    <header className="finance-header"><Link href="/" className="finance-brand"><LocationIcon/><span>EventHub</span></Link>
      <nav aria-label="Main navigation"><Link href="/">Overview</Link><Link href="/client/payments" aria-current={role === "client" ? "page" : undefined}>Payments</Link><Link href="/vendor/earnings" aria-current={role === "vendor" ? "page" : undefined}>Vendor earnings</Link></nav>
      <div className="finance-account">{session ? <><span className="finance-avatar">{session.user.name.slice(0, 1)}</span><span>{session.user.name}<small>{session.user.role}</small></span></> : <><Icon name="lock" size={16}/>{signInUrl ? <a href={signInUrl}>Sign in</a> : <span>Your EventHub account</span>}</>}</div>
    </header>
    <main className="finance-main">
      <div className="finance-breadcrumb">EventHub <span>/</span> {role === "vendor" ? "Vendor" : role === "manager" ? "Management" : "My account"} <span>/</span> <strong>{title}</strong></div>
      <div className="finance-heading"><div><p className="finance-eyebrow">{role === "vendor" ? "YOUR BUSINESS, IN BALANCE" : "EVERY DETAIL, TAKEN CARE OF"}</p><h1>{title}</h1><p>{role === "vendor" ? "A clear view of your earnings, commissions and upcoming payouts." : "Keep track of your event payments, receipts and every milestone."}</p></div><button className="finance-button finance-outline" onClick={refresh} disabled={loading || busy}><Icon name="clock" size={16}/>{loading ? "Updating…" : "Refresh"}</button></div>
      {error && <div className="finance-alert finance-error" role="alert">{error}</div>}{notice && <div className="finance-alert" role="status">{notice}</div>}
      {screen !== "checkout" && <section className="finance-hero"><div><span className="finance-hero-label"><Icon name="wallet" size={16}/> EVENTHUB PAYMENTS</span><h2>{role === "vendor" ? "Your work deserves clarity." : "Big moments. Clear payments."}</h2><p>{role === "vendor" ? "Know what you’ve earned, what’s been released and what comes next." : "From the first booking to the final celebration, follow your payments in one place."}</p></div><div className="finance-hero-art" aria-hidden="true"><div className="finance-art-orbit"/><div className="finance-art-card"><LocationIcon/><span>EventHub</span><strong>Every milestone matters.</strong><div className="finance-art-line"/><small>20% <span>→</span> 50% <span>→</span> 30%</small></div></div></section>}
      <section className="finance-stats" aria-label="Payment summary">{[
        { label: role === "vendor" ? "Gross booking value" : "Booking value", value: gross, icon: "wallet", help: "Vendor package total" },
        { label: role === "vendor" ? "Net earnings released" : "Milestones released", value: amountReleased, icon: "trend", help: "Confirmed milestone allocations" },
        { label: "Awaiting milestones", value: amountHeld, icon: "clock", help: "Subject to release conditions" },
      ].map(stat => <article key={stat.label}><div className="finance-stat-title"><span>{stat.label}</span><span className="finance-stat-icon"><Icon name={stat.icon}/></span></div><strong>{stat.value === undefined ? "—" : money(stat.value)}</strong><small>{stat.help}</small></article>)}</section>
      <div className="finance-columns"><div className="finance-primary-column">
        <section className="finance-panel"><div className="finance-panel-heading"><h2>{screen === "checkout" ? "Review your booking" : "Your event"}</h2><span className="finance-label"><Icon name="lock" size={13}/> Private to your account</span></div>
          {loading ? <div className="finance-empty" role="status"><span className="finance-empty-icon"><Icon name="clock" size={28}/></span><h3>Loading your payments</h3><p>Getting the latest information for your account.</p></div> : !booking ? <div className="finance-empty"><span className="finance-empty-icon"><Icon name={screen === "checkout" ? "lock" : "calendar"} size={30}/></span><h3>{bookingId && session ? "Booking unavailable" : screen === "checkout" ? "Your checkout starts with a booking" : "Your next event starts here"}</h3><p>{session ? "Once a confirmed booking is available, its payment details and milestones will appear here." : "Sign in to EventHub to see your bookings, manage payments and keep your receipts together."}</p>{!session && signInUrl && <a className="finance-button" href={signInUrl}>Sign in to EventHub <Icon name="arrow" size={16}/></a>}</div> : <>
            <label className="finance-field-label" htmlFor="booking-selection">Selected booking</label><select id="booking-selection" value={selected} onChange={e => { setSelection(e.target.value); setError(""); setNotice(""); }}>{!bookings.some(b => b.id === selected) && <option value={selected}>Select a booking</option>}{bookings.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}</select><div className="finance-booking"><span className="finance-event-icon"><Icon name="calendar" size={26}/></span><div><h3>{booking.title}</h3><p>{booking.date} · {booking.location}</p><small>{booking.vendor}</small></div><span className={`finance-status ${booking.paid ? "is-paid" : ""}`}>{booking.paid ? "Paid" : "Awaiting payment"}</span></div>
            {screen === "checkout" && role === "client" && !booking.paid && <form onSubmit={e => { e.preventDefault(); void action("checkout"); }}><label className="finance-field-label" htmlFor="payment-currency">Payment currency</label><select id="payment-currency" value={currency} disabled={busy} onChange={e => setCurrency(e.target.value as Currency)}><option>LKR</option><option>USD</option><option>EUR</option></select><div className="finance-payment-info"><Icon name="lock"/><div><strong>Your card details stay private</strong><p>Continue to the payment provider to complete your checkout.</p></div></div><label className="finance-checkbox"><input type="checkbox" required checked={accepted} disabled={busy} onChange={e => setAccepted(e.target.checked)}/>I agree to the payment terms and cancellation policy provided with my booking.</label><button className="finance-button finance-full" disabled={busy || !accepted || !quote}>{busy ? "Opening checkout…" : "Continue to secure payment"}<Icon name="arrow" size={16}/></button></form>}
          </>}
        </section>
        {screen !== "checkout" && <section className="finance-panel"><div className="finance-tabs" role="tablist" aria-label="Payment details"><button id="payments-tab" role="tab" aria-controls="payment-details" aria-selected={tab === "payments"} onClick={() => setTab("payments")}><Icon name="receipt" size={17}/> {role === "vendor" ? "Payout history" : "Payment history"}</button><button id="milestones-tab" role="tab" aria-controls="payment-details" aria-selected={tab === "milestones"} onClick={() => setTab("milestones")}><Icon name="grid" size={17}/> Milestones</button></div><div role="tabpanel" id="payment-details" aria-labelledby={tab === "payments" ? "payments-tab" : "milestones-tab"}>
          {tab === "payments" ? <div className="finance-table-wrap"><table><thead><tr><th>{role === "vendor" ? "Milestone" : "Transaction"}</th><th>Amount</th><th>Status</th><th>{role === "vendor" ? "Commission" : "Receipt"}</th></tr></thead><tbody>{role === "vendor" && booking ? booking.milestones.map(m => <tr key={m.stage}><td>Stage {m.stage} · {m.percent}%</td><td>{money(m.net)}</td><td><span className="finance-status">{m.payoutStatus}</span></td><td>{money(m.commission)}</td></tr>) : booking?.payment ? <tr><td><strong>{booking.title}</strong><small>{new Date(booking.payment.createdAt).toLocaleDateString()}</small></td><td>{money(booking.payment.totalMinor, booking.payment.currency)}</td><td><span className="finance-status is-paid">Successful</span></td><td>{role === "client" && <button className="finance-text-button" onClick={receipt} disabled={busy}>Download</button>}</td></tr> : <tr><td colSpan={4}><div className="finance-empty finance-empty-small"><Icon name="receipt" size={27}/><h3>No {role === "vendor" ? "payouts" : "transactions"} yet</h3><p>Your {role === "vendor" ? "payout" : "payment"} history will appear here.</p></div></td></tr>}</tbody></table></div> : <Milestones booking={booking} role={role}/>}
        </div></section>}
        {role === "manager" && booking && <section className="finance-panel"><h2>Event completion</h2><p className="finance-muted">Arrival status is supplied by the event verification service.</p><button className="finance-button" disabled={busy || !booking.arrivalVerified || booking.completed} onClick={() => { if (window.confirm("Confirm this event has been completed?")) void action("complete"); }}>Mark event complete</button></section>}
      </div><aside>
        {screen === "checkout" ? <section className="finance-panel finance-order"><h2>Order summary</h2><p className="finance-muted">{booking?.title || "Your selected event package"}</p>{quote ? <>{[["Package subtotal", quote.subtotal], [`Tax · ${quote.taxBps / 100}%`, quote.tax], [`Service fee · ${quote.serviceFeeBps / 100}%`, quote.serviceFee]].map(([label, value]) => <div className="finance-price" key={label}><span>{label}</span><strong>{money(Number(value), quote.currency)}</strong></div>)}<div className="finance-price finance-total"><span>Total</span><strong>{money(quote.total, quote.currency)}</strong></div><p className="finance-muted">{quote.rateLabel}</p></> : <div className="finance-summary-placeholder"><Icon name="receipt" size={30}/><p>Your price breakdown will appear once your booking is available.</p></div>}</section> : <section className="finance-panel finance-help"><span className="finance-help-icon"><Icon name="lock" size={24}/></span><h2>Confidence at every step.</h2><p>Your payment records are linked to your EventHub account. Only the people assigned to your booking can access its financial details.</p><div><Icon name="check" size={16}/><span>Private payment records</span></div><div><Icon name="check" size={16}/><span>Clear milestone tracking</span></div><div><Icon name="check" size={16}/><span>Receipts in one place</span></div></section>}
        <section className="finance-panel finance-timeline" id="payment-stages"><p className="finance-eyebrow">HOW PAYMENTS WORK</p><h2>Three stages.<br/>One shared plan.</h2><ol>{stages.map((stage, index) => <li key={stage.percent}><span className="finance-stage-number">0{index + 1}</span><div><div className="finance-stage-heading"><h3>{stage.title}</h3><strong>{stage.percent}%</strong></div><p>{stage.description}</p></div></li>)}</ol></section>
      </aside></div>
    </main><footer className="finance-footer"><Link href="/" className="finance-brand"><LocationIcon/><span>EventHub</span></Link><span>Every event. Every detail.</span><small>© EventHub</small></footer>
  </div>;
}

function Milestones({ booking, role }: { booking?: Booking; role: Role }) {
  return <div className="finance-milestones">{stages.map((stage, i) => { const milestone = booking?.milestones[i]; return <article key={stage.percent}><div className="finance-milestone-top"><span>{stage.percent}%</span><Icon name={stage.symbol}/></div><h3>{stage.title}</h3><p>{stage.description}</p><strong>{milestone ? money(role === "vendor" ? milestone.net : milestone.gross) : "—"}</strong>{milestone && <span className={`finance-status ${milestone.status === "Released" ? "is-paid" : ""}`}>{milestone.status}</span>}</article>; })}</div>;
}
