import { formatLkr, type PaymentEntry } from "@/lib/payment-data";
import { PrintButton } from "@/components/ui/print-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableFrame } from "@/components/ui/table-frame";

export function PaymentHistoryTable({
  entries,
  onPayNow,
}: {
  entries: PaymentEntry[];
  onPayNow: (entry: PaymentEntry) => void;
}) {
  return (
    <TableFrame
      wrapperClassName="payments-table-wrap"
      tableClassName="payments-table"
    >
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
          {entries.map((entry) => (
            <tr key={`${entry.payment}-${entry.time}`}>
              <td>{entry.payment}</td>
              <td>{formatLkr(entry.amount)}</td>
              <td>
                <StatusBadge status={entry.status}>
                  {entry.status === "success"
                    ? "Successful"
                    : entry.status === "failed"
                      ? "Failed"
                      : "Pending"}
                </StatusBadge>
              </td>
              <td>{entry.time}</td>
              <td>
                {entry.action === "download" ? (
                  <PrintButton
                    className="table-link"
                    aria-label={`Download receipt for ${entry.payment}`}
                  >
                    ⇩ Download
                  </PrintButton>
                ) : entry.action === "pay" ? (
                  <button
                    className="table-pay-button"
                    type="button"
                    onClick={() => onPayNow(entry)}
                  >
                    Pay now
                  </button>
                ) : (
                  <span className="table-dash">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
    </TableFrame>
  );
}
