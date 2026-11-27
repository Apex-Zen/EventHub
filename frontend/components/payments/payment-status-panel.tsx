export function PaymentStatusPanel({
  isProcessing,
}: {
  isProcessing: boolean;
}) {
  return (
    <aside className="processing-card" aria-live="polite">
      <p className="processing-label">
        {isProcessing ? "Secure payment" : "Payment status"}
      </p>
      <div
        className={`spinner${isProcessing ? " spinner-active" : ""}`}
        role="img"
        aria-label={isProcessing ? "Payment processing" : "Payment ready"}
      />
      <span className="pending-badge">
        {isProcessing ? "Checking" : "Ready"}
      </span>
      <h2>{isProcessing ? "Authorizing payment" : "Ready to pay"}</h2>
      <p className="processing-copy">
        {isProcessing
          ? "Please wait while your payment is being authorized."
          : "Enter your card details and select Pay to continue."}
      </p>
    </aside>
  );
}
