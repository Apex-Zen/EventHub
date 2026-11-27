type PaymentSecurityHeaderProps = {
  merchantName?: string;
};

export function PaymentSecurityHeader({
  merchantName = "EventHub (Pvt) Ltd",
}: PaymentSecurityHeaderProps) {
  return (
    <header className="payment-security-bar">
      <span className="payment-security-title">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3 5.5 5.5v5.8c0 4.1 2.7 7.8 6.5 9.7 3.8-1.9 6.5-5.6 6.5-9.7V5.5L12 3Z" />
          <path d="m9.2 12 1.8 1.8 3.8-3.8" />
        </svg>
        Secure payment gateway
      </span>
      <span className="payment-merchant-name">
        Paying {merchantName}
      </span>
    </header>
  );
}
