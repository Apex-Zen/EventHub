"use client";

import { useState, type FormEvent } from "react";

type PaymentField = "cardNumber" | "expiry" | "cvv" | "cardholder";
type PaymentFieldErrors = Partial<Record<PaymentField, string>>;

function isValidCardNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let doubleDigit = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }
  return sum % 10 === 0;
}

function isValidExpiry(value: string) {
  const match = value.trim().match(/^(0[1-9]|1[0-2])\s*\/\s*(\d{2}|\d{4})$/);
  if (!match) return false;

  const month = Number(match[1]);
  const yearValue = Number(match[2]);
  const year = match[2].length === 2 ? 2000 + yearValue : yearValue;
  const now = new Date();
  return year > now.getFullYear() ||
    (year === now.getFullYear() && month >= now.getMonth() + 1);
}

function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <a className="brand" href="/" aria-label="EventHub home">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0Z" />
          <circle cx="12" cy="10" r="2.2" />
        </svg>
        <span>EventHub</span>
      </a>
      <nav className="dashboard-nav" aria-label="Main navigation">
        <a href="/">Home</a>
        <a href="/">My events</a>
        <a href="/" className="active">Payments</a>
        <a href="/">Messages</a>
      </nav>
      <div className="dashboard-user">
        <span className="notification-icon" aria-label="3 notifications">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
          </svg>
          <b>3</b>
        </span>
        <span className="user-avatar" aria-hidden="true">NP</span>
        <span className="user-name">Nadeesha P.</span>
      </div>
    </header>
  );
}

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [activeEvent, setActiveEvent] = useState("wedding");
  const [cardEnding, setCardEnding] = useState("4242");
  const [paidAt, setPaidAt] = useState("");
  const [fieldErrors, setFieldErrors] = useState<PaymentFieldErrors>({});
  const [isCancelled, setIsCancelled] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function formatPaymentTime() {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date());
  }

  function handlePaymentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const digits = String(formData.get("cardNumber") ?? "").replace(/\D/g, "");
    const expiry = String(formData.get("expiry") ?? "");
    const cvv = String(formData.get("cvv") ?? "");
    const cardholder = String(formData.get("cardholder") ?? "").trim();
    const errors: PaymentFieldErrors = {};

    if (!isValidCardNumber(digits)) {
      errors.cardNumber = "Enter a valid card number.";
    }
    if (!isValidExpiry(expiry)) {
      errors.expiry = "Enter a valid, unexpired date (MM / YY).";
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      errors.cvv = "Enter the 3 or 4 digit security code.";
    }
    if (cardholder.length < 2) {
      errors.cardholder = "Enter the name shown on your card.";
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstInvalid = (["cardNumber", "expiry", "cvv", "cardholder"] as const)
        .find((field) => errors[field]);
      if (firstInvalid) {
        const element = event.currentTarget.elements.namedItem(firstInvalid);
        if (element instanceof HTMLInputElement) element.focus();
      }
      return;
    }

    setIsDeclined(false);
    setIsCancelled(false);
    setIsProcessing(true);
    setCardEnding(digits.slice(-4));
    const shouldDecline = digits === "4000000000000002";

    window.setTimeout(() => {
      setIsProcessing(false);
      if (shouldDecline) {
        setPaidAt(formatPaymentTime());
        setIsDeclined(true);
        return;
      }

      setPaidAt(formatPaymentTime());
      setIsSuccessful(true);
    }, 1100);
  }

  function returnToCheckout() {
    setIsDeclined(false);
    setIsCancelled(false);
    setIsSuccessful(false);
    setShowProgress(false);
    setIsProcessing(false);
    setFieldErrors({});
    setFormKey((key) => key + 1);
  }

  function cancelPayment() {
    setIsCancelled(true);
    setIsDeclined(true);
    setIsProcessing(false);
    setPaidAt(formatPaymentTime());
  }

  function clearFieldError(field: PaymentField) {
    setFieldErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  }

  if (showProgress) {
    const isWedding = activeEvent === "wedding";
    const vendors = isWedding
      ? [
          { name: "Lens & Light Studio", amount: "LKR 180,000", icon: "📸", stages: ["LKR 36,000", "LKR 90,000", "LKR 54,000"] },
          { name: "Ceylon Spice Caterers", amount: "LKR 800,000", icon: "🍽️", stages: ["LKR 160,000", "LKR 400,000", "LKR 240,000"] },
        ]
      : [
          { name: "Northstar Events", amount: "LKR 250,000", icon: "🎤", stages: ["LKR 50,000", "LKR 125,000", "LKR 75,000"] },
          { name: "Gather & Graze", amount: "LKR 420,000", icon: "🍽️", stages: ["LKR 84,000", "LKR 210,000", "LKR 126,000"] },
        ];

    return (
      <main className="success-page">
        <DashboardHeader />
        <div className="payments-dashboard">
          <h1 className="dashboard-title">Payments</h1>
          <div className="event-tabs" role="tablist" aria-label="Events">
            <button
              type="button"
              role="tab"
              id="wedding-tab"
              aria-controls="payments-content"
              aria-selected={isWedding}
              className={isWedding ? "selected" : ""}
              onClick={() => setActiveEvent("wedding")}
            >
              Perera–Silva wedding
            </button>
            <button
              type="button"
              role="tab"
              id="party-tab"
              aria-controls="payments-content"
              aria-selected={!isWedding}
              className={!isWedding ? "selected" : ""}
              onClick={() => setActiveEvent("party")}
            >
              Office year-end party
            </button>
          </div>

          <section
            className="dashboard-panel"
            id="payments-content"
            role="tabpanel"
            aria-labelledby={isWedding ? "wedding-tab" : "party-tab"}
          >
            <h2 id="event-payments-title">Payments for this event</h2>
            <div className="payments-table-wrap">
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>Payment</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Deposit (20%)</td>
                    <td>LKR 196,000</td>
                    <td><span className="status-pill status-success">Successful</span></td>
                    <td>19 Oct, 10.02 pm</td>
                    <td><button className="table-link" onClick={() => window.print()} type="button">⇩ Download</button></td>
                  </tr>
                  <tr>
                    <td>Deposit (20%), first try</td>
                    <td>LKR 196,000</td>
                    <td><span className="status-pill status-failed">Failed</span></td>
                    <td>19 Oct, 9.58 pm</td>
                    <td className="table-dash">—</td>
                  </tr>
                  <tr>
                    <td>Balance (80%)</td>
                    <td>LKR 784,000</td>
                    <td><span className="status-pill status-pending">Pending</span></td>
                    <td>Due 5 Dec</td>
                    <td>
                      <button
                        className="table-pay-button"
                        type="button"
                        onClick={() => {
                          setShowProgress(false);
                          setIsSuccessful(false);
                          setIsProcessing(false);
                        }}
                      >
                        Pay now
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="dashboard-panel milestone-panel" aria-labelledby="milestone-title">
            <h2 id="milestone-title">Milestone progress by vendor</h2>
            <div className="vendor-list">
              {vendors.map((vendor) => (
                <article className="vendor-item" key={vendor.name}>
                  <div className="vendor-heading">
                    <div className="vendor-name-group">
                      <span className="vendor-image" aria-hidden="true">{vendor.icon}</span>
                      <strong>{vendor.name} <span>·</span> {vendor.amount}</strong>
                    </div>
                    <div className="vendor-progress">
                      <div className="progress-track"><span /></div>
                      <small>20% released</small>
                    </div>
                  </div>
                  <div className="milestone-stages">
                    {[
                      { name: "Stage 1", percent: "20%", detail: "Booking confirm", status: "Released" },
                      { name: "Stage 2", percent: "50%", detail: "Vendor arrival", status: "Held" },
                      { name: "Stage 3", percent: "30%", detail: "Event complete", status: "Held" },
                    ].map((stage, index) => (
                      <div className={`milestone-stage${index === 0 ? " released" : ""}`} key={stage.name}>
                        <div className="stage-heading">
                          <strong>{stage.name} · {stage.percent}</strong>
                          <span>{stage.status}</span>
                        </div>
                        <p>{stage.detail}</p>
                        <strong className="stage-amount">{vendor.stages[index]}</strong>
                        {index === 0 && <small>Receipt EH-R-2026-00418 · 19 Oct, 10.02 pm</small>}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (isDeclined) {
    return (
      <main className="success-page">
        <DashboardHeader />
        <section className="declined-page-card" aria-labelledby="declined-title">
          <div className="declined-page-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="m7 7 10 10M17 7 7 17" />
            </svg>
          </div>
          <span className="declined-page-badge">Failed</span>
          <h1 id="declined-title">Payment did not go through</h1>
          <p className="declined-page-description">
            {isCancelled
              ? "Your payment was cancelled. No money was taken. Your vendors keep the date until the 48-hour hold ends."
              : "Your bank declined the payment. No money was taken. Your vendors keep the date until the 48-hour hold ends."}
          </p>

          <dl className="declined-receipt">
            <div><dt>Amount</dt><dd>LKR 196,000</dd></div>
            <div><dt>Card</dt><dd>Visa ending {cardEnding}</dd></div>
            <div><dt>Time</dt><dd>{paidAt}</dd></div>
            <div>
              <dt>Reason</dt>
              <dd className="declined-reason">
                {isCancelled ? "Payment cancelled" : "Declined by issuing bank"}
              </dd>
            </div>
          </dl>

          <div className="declined-actions">
            <button className="use-another-card" type="button" onClick={returnToCheckout}>
              Use another card
            </button>
            <button className="pay-again-button" type="button" onClick={returnToCheckout}>
              Pay again
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (isSuccessful) {
    return (
      <main className="success-page">
        <DashboardHeader />

        <section className="success-card" aria-labelledby="success-title">
          <div className="success-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          </div>
          <span className="success-badge">Successful</span>
          <h1 id="success-title">Deposit paid</h1>
          <p className="success-description">
            Stage 1 (20%) is now released to your vendors. Stages 2 and 3
            <br className="desktop-break" /> stay held.
          </p>

          <div className="receipt-details" id="receipt">
            <p className="receipt-label">Receipt</p>
            <dl>
              <div><dt>Receipt no.</dt><dd>EH-R-2026-00418</dd></div>
              <div><dt>Paid</dt><dd>LKR 196,000</dd></div>
              <div><dt>Card</dt><dd>Visa ending {cardEnding}</dd></div>
              <div><dt>Time</dt><dd>{paidAt}</dd></div>
              <div><dt>Event</dt><dd>Perera–Silva wedding</dd></div>
            </dl>
          </div>

          <div className="success-actions">
            <button
              className="receipt-button"
              type="button"
              onClick={() => window.print()}
            >
              Download receipt (PDF)
            </button>
            <button
              className="progress-button"
              type="button"
              onClick={() => setShowProgress(true)}
            >
              View payment progress
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="payment-page">
      <div className="payment-layout">
        <section className="payment-card" aria-labelledby="payment-title">
          <div className="payment-heading">
            <h1 id="payment-title">Card payment</h1>
            <svg
              className="lock-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect x="4.5" y="10" width="15" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          </div>

          <p className="payment-intro">
            Secured by the payment gateway&nbsp; · &nbsp;EventHub never stores
            card numbers or CVV
          </p>

          <div className="merchant-summary">
            <div>
              <span>Merchant</span>
              <strong>EventHub (Pvt) Ltd</strong>
            </div>
            <div>
              <span>Amount</span>
              <strong className="amount">LKR 196,000</strong>
            </div>
          </div>

          <form
            className="payment-form"
            key={formKey}
            onSubmit={handlePaymentSubmit}
            noValidate
          >
            <label className="field">
              <span>Card number</span>
              <input
                type="text"
                name="cardNumber"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                maxLength={23}
                aria-label="Card number"
                aria-invalid={Boolean(fieldErrors.cardNumber)}
                aria-describedby={fieldErrors.cardNumber ? "card-number-error" : "card-number-hint"}
                onChange={() => clearFieldError("cardNumber")}
              />
              {fieldErrors.cardNumber ? (
                <small className="field-error" id="card-number-error">{fieldErrors.cardNumber}</small>
              ) : (
                <small className="field-hint" id="card-number-hint">Use a 13–19 digit card number.</small>
              )}
            </label>

            <div className="field-row">
              <label className="field">
                <span>Expiry</span>
                <input
                  type="text"
                  name="expiry"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM / YY"
                  maxLength={7}
                  aria-label="Card expiry date"
                  aria-invalid={Boolean(fieldErrors.expiry)}
                  aria-describedby={fieldErrors.expiry ? "expiry-error" : undefined}
                  onChange={() => clearFieldError("expiry")}
                />
                {fieldErrors.expiry && <small className="field-error" id="expiry-error">{fieldErrors.expiry}</small>}
              </label>
              <label className="field">
                <span>CVV</span>
                <input
                  type="password"
                  name="cvv"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="3 digits"
                  maxLength={4}
                  aria-label="Card security code"
                  aria-invalid={Boolean(fieldErrors.cvv)}
                  aria-describedby={fieldErrors.cvv ? "cvv-error" : undefined}
                  onChange={() => clearFieldError("cvv")}
                />
                {fieldErrors.cvv && <small className="field-error" id="cvv-error">{fieldErrors.cvv}</small>}
              </label>
            </div>

            <label className="field">
              <span>Name on card</span>
              <input
                type="text"
                name="cardholder"
                autoComplete="cc-name"
                placeholder="As printed on the card"
                aria-label="Name on card"
                aria-invalid={Boolean(fieldErrors.cardholder)}
                aria-describedby={fieldErrors.cardholder ? "cardholder-error" : undefined}
                onChange={() => clearFieldError("cardholder")}
              />
              {fieldErrors.cardholder && <small className="field-error" id="cardholder-error">{fieldErrors.cardholder}</small>}
            </label>

            <button className="pay-button" type="submit" disabled={isProcessing}>
              {isProcessing ? "Authorizing..." : "Pay LKR 196,000"}
            </button>
          </form>

          <button className="cancel-link" type="button" onClick={cancelPayment}>
            Cancel and go back to EventHub
          </button>
        </section>

        <aside className="processing-card" aria-live="polite">
          <p className="processing-label">
            {isProcessing ? "Secure payment" : "Payment status"}
          </p>
          <div
            className={`spinner${isProcessing ? " spinner-active" : ""}`}
            role="img"
            aria-label={isProcessing ? "Payment processing" : "Payment ready"}
          />
          <span className="pending-badge">
            {isProcessing ? "Checking" : "Ready"}
          </span>
          <h2>{isProcessing ? "Authorizing payment" : "Ready to pay"}</h2>
          <p className="processing-copy">
            {isProcessing
              ? "Please wait while your payment is being authorized."
              : "Enter your card details and select Pay to continue."}
          </p>
        </aside>
      </div>
    </main>
  );
}
