import { refundDetails, refundSteps } from "@/lib/refund-data";
import { DetailList } from "@/components/ui/detail-list";

export function RefundSummary() {
  const firstIncompleteIndex = refundSteps.findIndex((step) => !step.complete);
  const currentStepIndex =
    firstIncompleteIndex === -1
      ? refundSteps.length - 1
      : firstIncompleteIndex;

  return (
    <section className="refund-summary" aria-label="Refund details and progress">
      <DetailList className="refund-details" items={refundDetails} />

      <ol className="refund-steps" aria-label="Refund progress">
        {refundSteps.map((step, index) => (
          <li
            className={step.complete ? "complete" : ""}
            key={step.number}
            aria-current={index === currentStepIndex ? "step" : undefined}
          >
            <span className="refund-step-number">{step.number}</span>
            <span className="refund-step-label">{step.label}</span>
          </li>
        ))}
      </ol>

      <p className="refund-estimate">
        Card refunds take 5 to 10 working days after they are sent. Expected by
        Fri 6 Nov.
      </p>
    </section>
  );
}
