const checkoutSteps = [
  { label: "Event details", complete: true },
  { label: "Choose vendors", complete: true },
  { label: "Build package", complete: true },
  { label: "Pay deposit", complete: false },
];

export function CheckoutProgress() {
  return (
    <ol className="checkout-progress" aria-label="Booking steps">
      {checkoutSteps.map((step, index) => {
        const isCurrent = index === checkoutSteps.length - 1;
        return (
          <li
            className={step.complete ? "complete" : ""}
            aria-current={isCurrent ? "step" : undefined}
            key={step.label}
          >
            <span className="checkout-step-marker">
              {step.complete ? (
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="m3.5 8 3 3 6-6" />
                </svg>
              ) : (
                index + 1
              )}
            </span>
            <span className="checkout-step-label">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
