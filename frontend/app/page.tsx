
import { useState, type FormEvent } from "react";

type Payout = {
  event: string;
  stage: string;
  gross: number;
  commission: number;
  net: number;
  status: "Pending" | "Paid" | "Failed";
  date: string;
};

const payouts: Payout[] = [
  { event: "Perera–Silva wedding", stage: "1 · 20%", gross: 36000, commission: 3600, net: 32400, status: "Pending", date: "19 Oct" },
  { event: "Wickrama birthday", stage: "3 · 30%", gross: 30000, commission: 3000, net: 27000, status: "Pending", date: "8 Nov" },
  { event: "Wickrama birthday", stage: "2 · 50%", gross: 50000, commission: 5000, net: 45000, status: "Paid", date: "7 Nov" },
  { event: "Wickrama birthday", stage: "1 · 20%", gross: 20000, commission: 2000, net: 18000, status: "Paid", date: "21 Oct" },
  { event: "Fonseka anniversary", stage: "1 · 20%", gross: 15000, commission: 1500, net: 13500, status: "Failed", date: "14 Oct" },
];

const receipts = [
  { number: "EH-P-2026-01188", event: "Wickrama birthday", stage: "3 · 30%", net: 27000, date: "9 Nov" },
  { number: "EH-P-2026-01102", event: "Wickrama birthday", stage: "2 · 50%", net: 45000, date: "8 Nov" },
  { number: "EH-P-2026-00951", event: "Perera–Silva wedding", stage: "1 · 20%", net: 32400, date: "21 Oct" },
];

const navigation = [
  "Dashboard",
  "Profile",
  "Services",
  "Halls",
  "Pricing",
  "Portfolio",
  "Diary",
  "Chat",
  "Reviews",
  "Notifications",
  "Check-in",
  "Payouts",
];

function formatAmount(amount: number) {
  return `LKR ${amount.toLocaleString("en-LK")}`;
}

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function downloadReceipts() {
  const rows = [
    ["Receipt no.", "Event", "Stage", "Net", "Paid on"],
    ...receipts.map((receipt) => [
      receipt.number,
      receipt.event,
      receipt.stage,
      formatAmount(receipt.net),
      receipt.date,
    ]),
  ];
  const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "eventhub-payout-receipts.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function downloadReceipt(receiptNumber: string) {
  const receipt = receipts.find((item) => item.number === receiptNumber);
  if (!receipt) return;

  const lines = [
    "EventHub payout receipt",
    `Receipt no.: ${receipt.number}`,
    `Event: ${receipt.event}`,
    `Stage: ${receipt.stage}`,
    `Net payout: ${formatAmount(receipt.net)}`,
    `Paid on: ${receipt.date}`,
  ];
  const content = [
    "BT",
    "/F1 18 Tf",
    "54 770 Td",
    `(${escapePdfText(lines[0])}) Tj`,
    "/F1 12 Tf",
    ...lines.slice(1).flatMap((line) => ["0 -32 Td", `(${escapePdfText(line)}) Tj`]),
    "ET",
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const [index, object] of objects.entries()) {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  }
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${receipt.number}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

function escapePdfText(value: string) {
  return value
    .replaceAll("–", "-")
    .replace(/[^\x20-\x7e]/g, "")
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

export default function Home() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountSaved, setAccountSaved] = useState(false);

  function saveAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAccountOpen(false);
    setAccountSaved(true);
    window.setTimeout(() => setAccountSaved(false), 3500);
  }

  return (
    <div className="vendor-app">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="EventHub home">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0Z" />
            <circle cx="12" cy="10" r="2.2" />
          </svg>
          <span>EventHub</span>
        </a>

        <p className="sidebar-label">Vendor</p>
        <nav className="sidebar-nav" aria-label="Vendor navigation">
          {navigation.map((item) => (
            <a
              href={item === "Payouts" ? "#payouts" : "#"}
              className={item === "Payouts" ? "selected" : ""}
              aria-current={item === "Payouts" ? "page" : undefined}
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="sidebar-account">
          <div className="profile-avatar" aria-hidden="true">KF</div>
          <div className="profile-copy">
            <strong>Kasun Fernando</strong>
            <span>Lens &amp; Light Studio</span>
          </div>
          <button className="sign-out" type="button" aria-label="Sign out">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M10 17l5-5-5-5M15 12H3m9-8h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7" />
            </svg>
          </button>
        </div>
      </aside>

      <main className="payouts-main" id="payouts">
        <header className="page-heading">
          <div>
            <h1>Payouts</h1>
            <p>One row per released stage. Commission is 5–10% depending on your plan.</p>
          </div>
          <button className="outline-button" type="button" onClick={() => setAccountOpen(true)}>
            Payout account
          </button>
        </header>

        <section className="summary-grid" aria-label="Payout summary">
          <article className="summary-card">
            <p>Paid this month</p>
            <strong>{formatAmount(63000)}</strong>
            <span>2 payouts</span>
          </article>
          <article className="summary-card">
            <p>Pending</p>
            <strong>{formatAmount(59400)}</strong>
            <span>Sent to your bank within 3 working days</span>
          </article>
          <article className="summary-card">
            <p>Still held in escrow</p>
            <strong>{formatAmount(129600)}</strong>
            <span>Released at arrival and event completion</span>
          </article>
        </section>

        <section className="table-card payout-table-card" aria-label="Payout history">
          <div className="table-scroll">
            <table className="payout-table">
              <thead>
                <tr>
                  <th scope="col">Event</th>
                  <th scope="col">Stage</th>
                  <th scope="col">Gross</th>
                  <th scope="col">Commission</th>
                  <th scope="col">Net</th>
                  <th scope="col">Status</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout, index) => (
                  <tr key={`${payout.event}-${payout.stage}-${index}`}>
                    <td className="event-cell">{payout.event}</td>
                    <td>{payout.stage}</td>
                    <td>{payout.gross.toLocaleString("en-LK")}</td>
                    <td>{payout.commission.toLocaleString("en-LK")} (10%)</td>
                    <td className="net-cell">{payout.net.toLocaleString("en-LK")}</td>
                    <td><span className={`status-pill status-${payout.status.toLowerCase()}`}>{payout.status}</span></td>
                    <td>{payout.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="notice notice-info">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5m0-8h.01" />
          </svg>
          <p>Wickrama birthday, agreed LKR 100,000 at 10%: you receive 18,000 + 45,000 + 27,000 = LKR 90,000. EventHub keeps LKR 10,000.</p>
        </aside>

        <aside className="notice notice-error" role="status">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5m0-8h.01" />
          </svg>
          <p>Failed: the bank rejected the transfer for Fonseka anniversary. Update the payout account and it is retried automatically.</p>
        </aside>

        <section className="table-card receipts-card" id="receipts" aria-labelledby="receipts-title">
          <div className="section-heading">
            <h2 id="receipts-title">Payout receipts</h2>
            <button className="text-button" type="button" onClick={downloadReceipts}>Download all (CSV)</button>
          </div>
          <div className="table-scroll">
            <table className="receipt-table">
              <thead>
                <tr>
                  <th scope="col">Receipt no.</th>
                  <th scope="col">Event</th>
                  <th scope="col">Stage</th>
                  <th scope="col">Net</th>
                  <th scope="col">Paid on</th>
                  <th scope="col"><span className="visually-hidden">Download</span></th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt) => (
                  <tr key={receipt.number}>
                    <td>{receipt.number}</td>
                    <td>{receipt.event}</td>
                    <td>{receipt.stage}</td>
                    <td>{formatAmount(receipt.net)}</td>
                    <td>{receipt.date}</td>
                    <td>
                      <button className="text-button download-link" type="button" onClick={() => downloadReceipt(receipt.number)}>
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {accountOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setAccountOpen(false);
        }}>
          <section className="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-title">
            <button className="dialog-close" type="button" onClick={() => setAccountOpen(false)} aria-label="Close dialog">×</button>
            <h2 id="account-title">Payout account</h2>
            <p>Manage the bank account used for your vendor payouts.</p>
            <form onSubmit={saveAccount}>
              <label>
                Account holder
                <input name="accountHolder" defaultValue="Kasun Fernando" required />
              </label>
              <label>
                Bank account
                <input name="accountNumber" defaultValue="•••• •••• 2481" required />
              </label>
              <label>
                Bank
                <select name="bank" defaultValue="Commercial Bank">
                  <option>Commercial Bank</option>
                  <option>Bank of Ceylon</option>
                  <option>People&apos;s Bank</option>
                  <option>Other</option>
                </select>
              </label>
              <button className="primary-button" type="submit">Save payout account</button>
            </form>
          </section>
        </div>
      )}

      {accountSaved && <div className="toast" role="status">Payout account updated.</div>}
    </div>
  );
}
