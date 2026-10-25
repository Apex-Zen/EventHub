"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";

type Payment = {
  label: string;
  amount: string;
  status: "Successful" | "Failed" | "Pending";
  time: string;
  receipt?: string;
};

type Milestone = {
  label: string;
  description: string;
  amount: string;
  status: "Released" | "Held";
};

type Vendor = {
  name: string;
  total: string;
  released: number;
  milestones: Milestone[];
};

type EventDetails = {
  payments: Payment[];
  vendors: Vendor[];
};

const events = {
  wedding: {
    label: "Perera–Silva wedding",
    payments: [
      {
        label: "Deposit (20%)",
        amount: "LKR 196,000",
        status: "Successful",
        time: "19 Oct, 10:02 pm",
        receipt: "EH-PS-001",
      },
      {
        label: "Deposit (20%), first try",
        amount: "LKR 196,000",
        status: "Failed",
        time: "19 Oct, 8:58 pm",
      },
      {
        label: "Balance (80%)",
        amount: "LKR 784,000",
        status: "Pending",
        time: "Due 5 Dec",
      },
    ],
    vendors: [
      {
        name: "Lens & Light Studio",
        total: "LKR 180,000",
        released: 20,
        milestones: [
          {
            label: "Stage 1 · 20%",
            description: "Booking confirmed",
            amount: "LKR 36,000",
            status: "Released",
          },
          {
            label: "Stage 2 · 50%",
            description: "Vendor arrival",
            amount: "LKR 90,000",
            status: "Held",
          },
          {
            label: "Stage 3 · 30%",
            description: "Event complete",
            amount: "LKR 54,000",
            status: "Held",
          },
        ],
      },
      {
        name: "Ceylon Spice Catering",
        total: "LKR 800,000",
        released: 20,
        milestones: [
          {
            label: "Stage 1 · 20%",
            description: "Booking confirmed",
            amount: "LKR 160,000",
            status: "Released",
          },
          {
            label: "Stage 2 · 50%",
            description: "Vendor arrival",
            amount: "LKR 400,000",
            status: "Held",
          },
          {
            label: "Stage 3 · 30%",
            description: "Event complete",
            amount: "LKR 240,000",
            status: "Held",
          },
        ],
      },
    ],
  },
  office: {
    label: "Office year-end party",
    payments: [
      {
        label: "Deposit (30%)",
        amount: "LKR 240,000",
        status: "Successful",
        time: "12 Nov, 11:20 am",
        receipt: "EH-OY-001",
      },
      {
        label: "Balance (70%)",
        amount: "LKR 560,000",
        status: "Pending",
        time: "Due 18 Dec",
      },
    ],
    vendors: [
      {
        name: "Colombo Event Co.",
        total: "LKR 500,000",
        released: 30,
        milestones: [
          {
            label: "Stage 1 · 30%",
            description: "Booking confirmed",
            amount: "LKR 150,000",
            status: "Released",
          },
          {
            label: "Stage 2 · 40%",
            description: "Vendor arrival",
            amount: "LKR 200,000",
            status: "Held",
          },
          {
            label: "Stage 3 · 30%",
            description: "Event complete",
            amount: "LKR 150,000",
            status: "Held",
          },
        ],
      },
      {
        name: "Brew & Bloom Catering",
        total: "LKR 300,000",
        released: 30,
        milestones: [
          {
            label: "Stage 1 · 30%",
            description: "Booking confirmed",
            amount: "LKR 90,000",
            status: "Released",
          },
          {
            label: "Stage 2 · 40%",
            description: "Vendor arrival",
            amount: "LKR 120,000",
            status: "Held",
          },
          {
            label: "Stage 3 · 30%",
            description: "Event complete",
            amount: "LKR 90,000",
            status: "Held",
          },
        ],
      },
    ],
  },
} satisfies Record<string, EventDetails & { label: string }>;

type EventKey = keyof typeof events;
const eventKeys = Object.keys(events) as EventKey[];

function receiptHref(eventName: string, payment: Payment) {
  const lines = [
    ["EventHub payment receipt", ""],
    ["Event", eventName],
    ["Payment", payment.label],
    ["Amount", payment.amount],
    ["Status", payment.status],
    ["Reference", payment.receipt ?? ""],
    ["Date", payment.time],
  ];
  const csv = lines.map((line) => line.map((value) => `"${value}"`).join(",")).join("\r\n");
  return `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
}

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<EventKey>("wedding");
  const event = events[selectedEvent];

  function handleTabKeyDown(keyboardEvent: KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = eventKeys.indexOf(selectedEvent);
    let nextIndex = currentIndex;

    if (keyboardEvent.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % eventKeys.length;
    } else if (keyboardEvent.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + eventKeys.length) % eventKeys.length;
    } else if (keyboardEvent.key === "Home") {
      nextIndex = 0;
    } else if (keyboardEvent.key === "End") {
      nextIndex = eventKeys.length - 1;
    } else {
      return;
    }

    keyboardEvent.preventDefault();
    const nextEvent = eventKeys[nextIndex];
    setSelectedEvent(nextEvent);
    document.getElementById(`event-tab-${nextEvent}`)?.focus();
  }

  return (
    <main className="payments-page">
      <header className="payments-header">
        <Link className="payments-brand" href="/" aria-label="EventHub home">
          <span className="payments-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
                fill="currentColor"
              />
              <circle cx="12" cy="9" r="2.5" fill="white" />
            </svg>
          </span>
          EventHub
        </Link>
        <nav className="payments-nav" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#events">My events</a>
          <a className="active" href="#payments" aria-current="page">
            Payments
          </a>
          <a href="#messages">Messages</a>
        </nav>
        <div className="payments-account">
          <button className="notification-button" type="button" aria-label="Notifications">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
            </svg>
            <span className="notification-count">3</span>
          </button>
          <span className="account-avatar" aria-hidden="true">N</span>
          <span className="account-name">Nadeesha P.</span>
        </div>
      </header>

      <div className="payments-content">
        <div className="payments-heading">
          <h1>Payments</h1>
          <p>Track event payments and vendor milestones in one place.</p>
        </div>

        <div className="event-tabs" role="tablist" aria-label="Choose an event">
          {eventKeys.map((eventKey) => (
            <button
              aria-selected={selectedEvent === eventKey}
              className={selectedEvent === eventKey ? "selected" : ""}
              aria-controls="event-payments-panel"
              id={`event-tab-${eventKey}`}
              key={eventKey}
              onClick={() => setSelectedEvent(eventKey)}
              onKeyDown={handleTabKeyDown}
              role="tab"
              type="button"
            >
              {events[eventKey].label}
            </button>
          ))}
        </div>

        <section
          aria-labelledby={`event-tab-${selectedEvent} payments-card-heading`}
          className="payments-card"
          id="event-payments-panel"
          role="tabpanel"
        >
          <h2 id="payments-card-heading">Payments for this event</h2>
          <div className="payment-table-wrap">
            <table className="payment-table">
              <thead>
                <tr>
                  <th scope="col">Payment</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col">Time</th>
                  <th scope="col">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {event.payments.map((payment) => (
                  <tr key={`${payment.label}-${payment.time}`}>
                    <td>{payment.label}</td>
                    <td>{payment.amount}</td>
                    <td>
                      <span className={`payment-status ${payment.status.toLowerCase()}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td>{payment.time}</td>
                    <td>
                      {payment.receipt ? (
                        <a
                          className="receipt-link"
                          download={`${payment.receipt}.csv`}
                          href={receiptHref(events[selectedEvent].label, payment)}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v4h14v-4" />
                          </svg>
                          Download
                        </a>
                      ) : payment.status === "Pending" ? (
                        <a className="balance-pay-button" href="/checkout">
                          Pay now
                        </a>
                      ) : (
                        <span className="receipt-unavailable" aria-label="No receipt">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="milestones-card" aria-labelledby="milestones-heading">
          <h2 id="milestones-heading">Milestone progress by vendor</h2>
          <div className="vendors-list">
            {event.vendors.map((vendor) => (
              <article className="vendor" key={vendor.name}>
                <div className="vendor-heading">
                  <div className="vendor-identity">
                    <span className="vendor-avatar" aria-hidden="true">
                      {vendor.name.slice(0, 1)}
                    </span>
                    <div>
                      <h3>{vendor.name}</h3>
                      <p>{vendor.total}</p>
                    </div>
                  </div>
                  <div className="vendor-progress" aria-label={`${vendor.released}% released`}>
                    <div className="progress-track">
                      <span style={{ width: `${vendor.released}%` }} />
                    </div>
                    <span>{vendor.released}% released</span>
                  </div>
                </div>

                <ol className="milestone-list">
                  {vendor.milestones.map((milestone) => (
                    <li
                      className={`milestone ${milestone.status.toLowerCase()}`}
                      key={milestone.label}
                    >
                      <div className="milestone-topline">
                        <h4>{milestone.label}</h4>
                        <span>{milestone.status}</span>
                      </div>
                      <p>{milestone.description}</p>
                      <strong>{milestone.amount}</strong>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
