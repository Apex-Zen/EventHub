"use client";

import { payoutReceipts, formatAmount } from "@/lib/payouts";
import { downloadReceipt, downloadReceipts } from "@/lib/payout-downloads";
import { TableCard, TableScroll } from "./table-card";

export function PayoutReceipts() {
  return (
    <TableCard
      className="receipts-card"
      id="receipts"
      aria-labelledby="receipts-title"
    >
      <div className="section-heading">
        <h2 id="receipts-title">Payout receipts</h2>
        <button
          className="text-button"
          type="button"
          onClick={() => downloadReceipts(payoutReceipts)}
        >
          Download all (CSV)
        </button>
      </div>
      <TableScroll>
        <table className="receipt-table">
          <thead>
            <tr>
              <th scope="col">Receipt no.</th>
              <th scope="col">Event</th>
              <th scope="col">Stage</th>
              <th scope="col">Net</th>
              <th scope="col">Paid on</th>
              <th scope="col">
                <span className="visually-hidden">Download</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {payoutReceipts.map((receipt) => (
              <tr key={receipt.number}>
                <td>{receipt.number}</td>
                <td>{receipt.event}</td>
                <td>{receipt.stage}</td>
                <td>{formatAmount(receipt.net)}</td>
                <td>{receipt.date}</td>
                <td>
                  <button
                    className="text-button download-link"
                    type="button"
                    onClick={() => downloadReceipt(receipt)}
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>
    </TableCard>
  );
}
