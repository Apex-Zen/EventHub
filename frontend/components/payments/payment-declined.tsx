import {
  checkoutDepositAmount,
  formatLkr,
} from "@/lib/payment-data";
import { DetailList } from "@/components/ui/detail-list";

export function PaymentDeclined({
  amount = checkoutDepositAmount,
  cardBrand,
  cardEnding,
  paidAt,
  isCancelled,
  onRetry,
}: {
  amount?: number;
  cardBrand?: string;
  cardEnding: string;
  paidAt: string;
  isCancelled: boolean;
  onRetry: () => void;
}) {
  const cardLabel = cardEnding
    ? `${cardBrand || "Card"} ending ${cardEnding}`
    : "No card charged";

  return (
    <section className="declined-page-card" aria-labelledby="declined-title">
      <div className="declined-page-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="m7 7 10 10M17 7 7 17" />
        </svg>
      </div>
      <span className="declined-page-badge">Failed</span>
      <h1 id="declined-title">Payment did not go through</h1>
      <p className="declined-page-description">
        {isCancelled
          ? "Your payment was cancelled. No money was taken. Your vendors keep the date until the 48-hour hold ends."
          : "Your bank declined the payment. No money was taken. Your vendors keep the date until the 48-hour hold ends."}
      </p>

      <DetailList
        className="declined-receipt"
        items={[
          { label: "Amount", value: formatLkr(amount) },
          { label: "Card", value: cardLabel },
          { label: "Time", value: paidAt },
          {
            label: "Reason",
            value: isCancelled
              ? "Payment cancelled"
              : "Declined by issuing bank",
            valueClassName: "declined-reason",
          },
        ]}
      />

      <div className="declined-actions">
        {[
          { label: "Use another card", className: "use-another-card" },
          { label: "Pay again", className: "pay-again-button" },
        ].map((action) => (
          <button
            className={action.className}
            type="button"
            onClick={onRetry}
            key={action.label}
          >
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
