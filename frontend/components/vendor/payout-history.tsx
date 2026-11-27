import { payouts } from "@/lib/payouts";
import { TableCard, TableScroll } from "./table-card";

function PayoutStatus({ status }: { status: (typeof payouts)[number]["status"] }) {
  return (
    <span className={`status-pill status-${status.toLowerCase()}`}>{status}</span>
  );
}

export function PayoutHistory() {
  return (
    <TableCard className="payout-table-card" aria-label="Payout history">
      <TableScroll>
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
            {payouts.map((payout) => (
              <tr key={`${payout.event}-${payout.stage}`}>
                <td className="event-cell">{payout.event}</td>
                <td>{payout.stage}</td>
                <td>{payout.gross.toLocaleString("en-LK")}</td>
                <td>
                  {payout.commission.toLocaleString("en-LK")} ({payout.commissionRate}%)
                </td>
                <td className="net-cell">{payout.net.toLocaleString("en-LK")}</td>
                <td>
                  <PayoutStatus status={payout.status} />
                </td>
                <td>{payout.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>
    </TableCard>
  );
}
