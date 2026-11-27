import type { Receipt } from "@/lib/receipt-data";
import { PrintButton } from "@/components/ui/print-button";
import { TableFrame } from "@/components/ui/table-frame";

export function ReceiptTable({ receipts }: { receipts: Receipt[] }) {
  return (
    <TableFrame
      wrapperClassName="receipts-table-wrap"
      tableClassName="receipts-table"
    >
        <thead>
          <tr>
            <th scope="col">Receipt no.</th>
            <th scope="col">Event</th>
            <th scope="col">Payment</th>
            <th scope="col">Amount</th>
            <th scope="col">Paid on</th>
            <th scope="col">
              <span className="visually-hidden">Download receipt</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {receipts.length === 0 ? (
            <tr>
              <td colSpan={6}>No receipts found for the selected filters.</td>
            </tr>
          ) : (
            receipts.map((receipt) => (
              <tr key={receipt.number}>
                <td>{receipt.number}</td>
                <td>{receipt.event}</td>
                <td>{receipt.payment}</td>
                <td>{receipt.amount}</td>
                <td>{receipt.paidOn}</td>
                <td>
                  <PrintButton
                    aria-label={`Download PDF for receipt ${receipt.number}`}
                  >
                    Download PDF
                  </PrintButton>
                </td>
              </tr>
            ))
          )}
        </tbody>
    </TableFrame>
  );
}
