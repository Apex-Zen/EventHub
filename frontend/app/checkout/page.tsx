"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

const ticketPrice = 2500;
const ticketCount = 2;
const orderTotal = ticketPrice * ticketCount;

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

function formatLkr(amount: number) {
  return `LKR ${amount.toLocaleString("en-LK")}`;
}

export default function Checkout() {
  const [paymentStatus, setPaymentStatus] = useState<
    "checkout" | "processing" | "failed"
  >("checkout");
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (paymentStatus !== "processing") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPaymentStatus("failed");
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [paymentStatus]);

  function handleFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (event.target.validity.valid) {
      event.target.setCustomValidity("");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const trimmed = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    };

    if (Object.values(trimmed).some((value) => value.length === 0)) {
      form.reportValidity();
      return;
    }

    const emailInput = form.elements.namedItem("email") as HTMLInputElement | null;
    const phoneInput = form.elements.namedItem("phone") as HTMLInputElement | null;
    const emailPattern = /\S+@\S+\.\S+/;
    const phonePattern = /^[+]?[(]?[0-9\s\-()]{7,}$/;

    if (!emailPattern.test(trimmed.email)) {
      emailInput?.setCustomValidity("Please enter a valid email address.");
      emailInput?.reportValidity();
      return;
    }
    emailInput?.setCustomValidity("");

    if (!phonePattern.test(trimmed.phone)) {
      phoneInput?.setCustomValidity("Please enter a valid mobile number.");
      phoneInput?.reportValidity();
      return;
    }
    phoneInput?.setCustomValidity("");

    setPaymentStatus("processing");
  }

  return (
    <main className="checkout-page">
      <header className="site-header">
        <a className="brand" href="#" aria-label="EventHub home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
                fill="currentColor"
              />
              <circle cx="12" cy="9" r="2.5" fill="white" />
            </svg>
          </span>
          <span>EventHub</span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#event">Public events</a>
          <a href="#payment-info">How payments work</a>
          <a href="#order-heading">Tickets</a>
        </nav>

        <div className="account-nav">
          <span>Simple, secure checkout</span>
        </div>
      </header>

      <div className="checkout-content">
        <a className="back-link" href="#event">
          <span aria-hidden="true">←</span> Galle Face Jazz Night
        </a>

        <div className="content-head">
          <div>
            <p className="eyebrow eyebrow-muted">Secure checkout</p>
            <h1>Checkout</h1>
          </div>
          <div className="status-pill">
            <span className="status-dot" aria-hidden="true" />
            Protected by EventHub
          </div>
        </div>

        {paymentStatus === "processing" ? (
          <section
            className="payment-status-card"
            aria-labelledby="payment-status-heading"
            aria-live="polite"
            role="status"
          >
            <div className="processing-icon" aria-hidden="true">
              <span />
            </div>
            <p className="eyebrow">Payment processing</p>
            <h2 id="payment-status-heading">Securing your tickets</h2>
            <p className="status-description">
              Please wait while we confirm your order. This usually takes a
              few seconds.
            </p>
            <div className="processing-progress" aria-hidden="true">
              <span />
            </div>
            <p className="processing-caption">
              Keep this page open while your order is being confirmed.
            </p>
            <div className="status-order">
              <span>Galle Face Jazz Night · {ticketCount} tickets</span>
              <strong>{formatLkr(orderTotal)}</strong>
            </div>
          </section>
        ) : paymentStatus === "failed" ? (
          <section
            className="payment-status-card payment-failed-card"
            aria-labelledby="payment-status-heading"
            aria-live="polite"
            role="alert"
          >
            <div className="failure-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="m7 7 10 10M17 7 7 17" />
              </svg>
            </div>
            <p className="eyebrow failure-eyebrow">Payment not completed</p>
            <h2 id="payment-status-heading">We couldn&apos;t process it</h2>
            <p className="status-description">
              We couldn&apos;t connect to the payment service, so your order
              wasn&apos;t completed. You haven&apos;t been charged. Please try
              again.
            </p>
            <div className="status-order">
              <span>Galle Face Jazz Night · {ticketCount} tickets</span>
              <strong>{formatLkr(orderTotal)}</strong>
            </div>
            <div className="status-actions">
              <button
                className="pay-button"
                onClick={() => setPaymentStatus("processing")}
                type="button"
              >
                Try again
              </button>
              <button
                className="secondary-button"
                onClick={() => setPaymentStatus("checkout")}
                type="button"
              >
                Back to checkout
              </button>
            </div>
            <p className="support-hint">
              Still having trouble? Please contact EventHub support.
            </p>
          </section>
        ) : (
          <div className="checkout-grid">
            <section className="details-card" aria-labelledby="details-heading">
              <h2 id="details-heading">Your details</h2>

              <form onSubmit={handleSubmit} noValidate>
                <div className="field-row">
                  <div className="form-field">
                    <label htmlFor="first-name">First name</label>
                    <input
                      autoComplete="given-name"
                      id="first-name"
                      name="firstName"
                      onChange={handleFieldChange}
                      placeholder="e.g. Sachini"
                      required
                      value={formData.firstName}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="last-name">Last name</label>
                    <input
                      autoComplete="family-name"
                      id="last-name"
                      name="lastName"
                      onChange={handleFieldChange}
                      placeholder="e.g. Mendes"
                      required
                      value={formData.lastName}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <input
                    autoComplete="email"
                    id="email"
                    name="email"
                    onChange={handleFieldChange}
                    placeholder="you@example.com"
                    required
                    type="email"
                    value={formData.email}
                  />
                  <span className="field-hint">
                    Tickets and your order receipt will be sent here.
                  </span>
                </div>

                <div className="form-field">
                  <label htmlFor="phone">Mobile number</label>
                  <input
                    autoComplete="tel"
                    id="phone"
                    name="phone"
                    onChange={handleFieldChange}
                    placeholder="+94 77 123 4567"
                    required
                    type="tel"
                    value={formData.phone}
                  />
                </div>

                <div className="security-note" id="payment-info">
                  <span className="note-icon" aria-hidden="true">i</span>
                  <p>
                    Your order is confirmed only after payment is complete.
                    Tickets and a receipt will be sent to your email.
                  </p>
                </div>
                <button className="pay-button" type="submit">
                  Proceed to payment · {formatLkr(orderTotal)}
                </button>
              </form>
            </section>

            <aside className="order-card" aria-labelledby="order-heading">
              <div className="order-topbar">
                <h2 id="order-heading">Order</h2>
                <span className="order-badge">2 tickets</span>
              </div>

              <div className="event-summary" id="event">
                <div className="event-art" aria-hidden="true">
                  <span className="event-art-glow" />
                  <span className="event-art-stage" />
                </div>
                <div className="event-copy">
                  <h3>Galle Face Jazz Night</h3>
                  <p>Sat, 14 Nov · 7:00 pm</p>
                </div>
              </div>

              <div className="order-details">
                <div className="order-line">
                  <span>General × {ticketCount}</span>
                  <span>{formatLkr(orderTotal)}</span>
                </div>
                <div className="tiny-row">
                  <span>Service fee</span>
                  <span>Included</span>
                </div>
                <div className="tiny-row">
                  <span>Taxes</span>
                  <span>Calculated at payment</span>
                </div>
              </div>

              <div className="order-total">
                <span>Total</span>
                <strong>{formatLkr(orderTotal)}</strong>
              </div>

              <div className="hold-notice">
                <span aria-hidden="true">◷</span>
                <p>Tickets are held for 10 minutes while you complete checkout.</p>
              </div>
            </aside>
          </div>
        )}
      </div>

      <footer className="site-footer">
        <span>© 2026 EventHub</span>
        <a href="#payment-info">Secure checkout information</a>
      </footer>
    </main>
  );
}
