import Link from "next/link";

const refundHistory = [
  {
    date: "Tue 20 Oct, 9.10 am",
    step: "Requested",
    note: "Reason: we changed the date",
  },
  {
    date: "Tue 20 Oct, 2.40 pm",
    step: "Approved",
    note: "Approved by Shehan G., Event Manager. Fee LKR 49,000 kept.",
  },
  {
    date: "Wed 21 Oct, 10.00 am",
    step: "Sent to bank",
    note: "Bank reference 88231904",
  },
];

const refundSteps = [
  { number: "1", label: "Requested", complete: true },
  { number: "2", label: "Approved by EventHub", complete: true },
  { number: "3", label: "Sent to your bank", complete: true },
  { number: "4", label: "In your account", complete: false },
];

export default function RefundStatusPage() {
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

      <div className="refund-page">
        <div className="refund-heading">
          <h1>Refund status</h1>
          <p>Perera–Silva wedding · cancellation requested Tue 20 Oct</p>
        </div>

        <section className="refund-summary" aria-label="Refund details and progress">
          <dl className="refund-details">
            <div>
              <dt>Refund no.</dt>
              <dd>EH-RF-2026-0031</dd>
            </div>
            <div>
              <dt>Amount</dt>
              <dd>LKR 147,000</dd>
            </div>
            <div>
              <dt>To</dt>
              <dd>Visa ending 4242</dd>
            </div>
          </dl>

          <ol className="refund-steps" aria-label="Refund progress">
            {refundSteps.map((step) => (
              <li
                className={step.complete ? "complete" : ""}
                key={step.number}
                aria-current={step.number === "3" ? "step" : undefined}
              >
                <span className="refund-step-number">{step.number}</span>
                <span className="refund-step-label">{step.label}</span>
              </li>
            ))}
          </ol>

          <p className="refund-estimate">
            Card refunds take 5 to 10 working days after they are sent. Expected by Fri 6 Nov.
          </p>
        </section>

        <section className="refund-history" aria-labelledby="refund-history-title">
          <h2 id="refund-history-title">History</h2>
          <div className="refund-history-table-wrap">
            <table className="refund-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Step</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {refundHistory.map((item) => (
                  <tr key={item.date}>
                    <td>{item.date}</td>
                    <td>{item.step}</td>
                    <td>{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
