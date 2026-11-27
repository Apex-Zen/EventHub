import Link from "next/link";
import {
  checkoutBalanceAmount,
  checkoutDepositAmount,
  formatLkr,
} from "@/lib/payment-data";
import { DetailList } from "@/components/ui/detail-list";

const pretaxAmount = Math.round(checkoutDepositAmount / 1.18);
const vatAmount = checkoutDepositAmount - pretaxAmount;
const serviceFee = 0;

export function DepositSummaryPanel() {
  return (
    <aside className="deposit-sidebar" aria-label="Payment summary">
      <section className="deposit-pay-card" aria-labelledby="pay-now-title">
        <h2 id="pay-now-title">Pay now</h2>
        <span className="deposit-label">Deposit</span>
        <strong className="deposit-amount">
          {formatLkr(checkoutDepositAmount)}
        </strong>
        <div className="deposit-balance">
          <span>Balance, due by Sat 5 Dec</span>
          <strong>{formatLkr(checkoutBalanceAmount)}</strong>
        </div>
        <p className="gateway-note">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="5" y="10" width="14" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
          You will enter your card on the payment gateway page.
        </p>
        <Link className="deposit-pay-button" href="/card-payment">
          Pay {formatLkr(checkoutDepositAmount)} by card
        </Link>
      </section>

      <section className="deposit-tax-card" aria-labelledby="tax-title">
        <h2 id="tax-title">Taxes and currency</h2>
        <DetailList
          items={[
            {
              label: "Deposit (20%) before tax",
              value: formatLkr(pretaxAmount),
            },
            { label: "VAT (18%)", value: formatLkr(vatAmount) },
            { label: "Service fee", value: formatLkr(serviceFee) },
            {
              label: "Total due now",
              value: formatLkr(pretaxAmount + vatAmount + serviceFee),
              className: "deposit-tax-total",
            },
          ]}
        />
        <p>
          All prices in Sri Lankan rupees (LKR). Foreign cards are charged in LKR.
          Your bank may add its own conversion fee.
        </p>
      </section>
    </aside>
  );
}
