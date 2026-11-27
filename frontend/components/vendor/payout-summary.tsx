import { formatAmount, payoutSummary } from "@/lib/payouts";

function SummaryCard({
  label,
  amount,
  detail,
}: {
  label: string;
  amount: number;
  detail: string;
}) {
  return (
    <article className="summary-card">
      <p>{label}</p>
      <strong>{formatAmount(amount)}</strong>
      <span>{detail}</span>
    </article>
  );
}

export function PayoutSummary() {
  return (
    <section className="summary-grid" aria-label="Payout summary">
      {payoutSummary.map((item) => (
        <SummaryCard key={item.label} {...item} />
      ))}
    </section>
  );
}
