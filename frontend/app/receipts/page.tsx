"use client";

import { useState } from "react";
import Link from "next/link";

const receipts = [
  {
    number: "EH-R-2026-00418",
    event: "Perera–Silva wedding",
    payment: "Deposit (20%)",
    amount: "LKR 196,000",
    paidOn: "Mon 19 Oct, 10.02 pm",
  },
  {
    number: "EH-R-2026-00312",
    event: "Galle Face Jazz Night",
    payment: "Event page fee",
    amount: "LKR 5,000",
    paidOn: "Fri 2 Oct, 4.15 pm",
  },
  {
    number: "EH-R-2026-00187",
    event: "Nugegoda birthday party",
    payment: "Balance (80%)",
    amount: "LKR 152,000",
    paidOn: "Wed 29 Jul, 11.20 am",
  },
  {
    number: "EH-R-2026-00151",
    event: "Nugegoda birthday party",
    payment: "Deposit (20%)",
    amount: "LKR 38,000",
    paidOn: "Mon 6 Jul, 8.43 pm",
  },
  {
    number: "EH-R-2026-00042",
    event: "Kandy homecoming",
    payment: "Balance (80%)",
    amount: "LKR 480,000",
    paidOn: "Sun 22 Feb, 9.30 am",
  },
];

export default function ReceiptsPage() {
  const [eventFilter, setEventFilter] = useState("All events");
  const [year, setYear] = useState("2026");

  const visibleReceipts = receipts.filter((receipt) => {
    const matchesEvent =
      eventFilter === "All events" || receipt.event === eventFilter;
    const matchesYear = receipt.number.includes(`-${year}-`);
    return matchesEvent && matchesYear;
  });

  return (
    <main className="success-page">
      <header className="dashboard-header">
        <Link className="brand" href="/" aria-label="EventHub home">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0Z" />
            <circle cx="12" cy="10" r="2.2" />
          </svg>
          <span>EventHub</span>
        </Link>
        <nav className="dashboard-nav" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/">My events</Link>
          <Link href="/receipts" className="active">Payments</Link>
          <Link href="/">Messages</Link>
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

      <div className="receipts-page">
        <div className="receipts-heading">
          <div>
            <h1>Payment receipts</h1>
            <p>Every card payment you made on EventHub. Each receipt is a PDF.</p>
          </div>
          <button className="download-all-button" type="button" onClick={() => window.print()}>
            Download all (ZIP)
          </button>
        </div>

        <div className="receipts-filters" aria-label="Receipt filters">
          <label>
            <span>Event</span>
            <select value={eventFilter} onChange={(event) => setEventFilter(event.target.value)}>
              <option>All events</option>
              <option>Perera–Silva wedding</option>
              <option>Galle Face Jazz Night</option>
              <option>Nugegoda birthday party</option>
              <option>Kandy homecoming</option>
            </select>
          </label>
          <label>
            <span>Year</span>
            <select value={year} onChange={(event) => setYear(event.target.value)}>
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
          </label>
        </div>

        <div className="receipts-table-wrap">
          <table className="receipts-table">
            <thead>
              <tr>
                <th>Receipt no.</th>
                <th>Event</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Paid on</th>
                <th aria-label="Download receipt" />
              </tr>
            </thead>
            <tbody>
              {visibleReceipts.map((receipt) => (
                <tr key={receipt.number}>
                  <td>{receipt.number}</td>
                  <td>{receipt.event}</td>
                  <td>{receipt.payment}</td>
                  <td>{receipt.amount}</td>
                  <td>{receipt.paidOn}</td>
                  <td>
                    <button type="button" onClick={() => window.print()}>
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="failed-payments-note">
          Failed payments are not listed here. They show in Payments with the reason.
        </p>
      </div>
    </main>
  );
}
