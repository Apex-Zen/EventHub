import { RefundHistory } from "./refund-history";
import { RefundSummary } from "./refund-summary";

export function RefundStatusContent() {
  return (
    <div className="refund-page">
      <div className="refund-heading">
        <h1>Refund status</h1>
        <p>Perera–Silva wedding · cancellation requested Tue 20 Oct</p>
      </div>
      <RefundSummary />
      <RefundHistory />
    </div>
  );
}
