import { PaymentForm, type PaymentSubmission } from "./payment-form";
import { PaymentStatusPanel } from "./payment-status-panel";

type PaymentCheckoutProps = {
  amount: number;
  isProcessing: boolean;
  onCancel: () => void;
  onSubmit: (payment: PaymentSubmission) => void;
};

export function PaymentCheckout({
  amount,
  isProcessing,
  onCancel,
  onSubmit,
}: PaymentCheckoutProps) {
  return (
    <main className="payment-page">
      <div className="payment-layout">
        <PaymentForm
          amount={amount}
          isProcessing={isProcessing}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
        <PaymentStatusPanel isProcessing={isProcessing} />
      </div>
    </main>
  );
}
