import { refundHistory } from "@/lib/refund-data";
import { TableFrame } from "@/components/ui/table-frame";

export function RefundHistory() {
  return (
    <section
      className="refund-history"
      aria-labelledby="refund-history-title"
    >
      <h2 id="refund-history-title">History</h2>
      <TableFrame
        wrapperClassName="refund-history-table-wrap"
        tableClassName="refund-history-table"
      >
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Step</th>
              <th scope="col">Note</th>
            </tr>
          </thead>
          <tbody>
            {refundHistory.map((item) => (
              <tr key={`${item.date}-${item.step}`}>
                <td>{item.date}</td>
                <td>{item.step}</td>
                <td>{item.note}</td>
              </tr>
            ))}
          </tbody>
      </TableFrame>
    </section>
  );
}
