import {
  checkoutEvent,
  formatLkr,
  type PaymentStage,
} from "@/lib/payment-data";

const releaseStages: PaymentStage[] = [
  {
    name: "Stage 1",
    percent: 20,
    detail: "On booking confirm",
    status: "Held",
    amount: checkoutEvent.total * 0.2,
  },
  {
    name: "Stage 2",
    percent: 50,
    detail: "When each vendor arrives",
    status: "Held",
    amount: checkoutEvent.total * 0.5,
  },
  {
    name: "Stage 3",
    percent: 30,
    detail: "When the event is complete",
    status: "Held",
    amount: checkoutEvent.total * 0.3,
  },
];

function ReleaseStage({ stage, index }: { stage: PaymentStage; index: number }) {
  return (
    <li className="release-stage">
      <span className="release-stage-number">{index + 1}</span>
      <div className="release-stage-copy">
        <strong>
          {stage.name} <span>·</span> {stage.percent}%
        </strong>
        <p>{stage.detail}</p>
      </div>
      <span className="release-stage-status">{stage.status}</span>
      <strong className="release-stage-amount">{formatLkr(stage.amount)}</strong>
    </li>
  );
}

export function DepositEventCard() {
  return (
    <section className="deposit-event-card" id="event-summary">
      <div className="deposit-event-overview">
        <div
          className="deposit-event-image"
          role="img"
          aria-label="Wedding reception"
        >
          <span aria-hidden="true">💍</span>
        </div>
        <div className="deposit-event-copy">
          <h2>{checkoutEvent.name}</h2>
          <p>Sat 12 Dec 2026 <span>·</span> Night <span>·</span> Waters Edge, Battaramulla</p>
          <small>Lens &amp; Light Studio, Ceylon Spice Caterers</small>
        </div>
        <div className="deposit-package-total">
          <span>Package total</span>
          <strong>{formatLkr(checkoutEvent.total)}</strong>
        </div>
      </div>

      <section className="release-schedule" aria-labelledby="release-title">
        <h3 id="release-title">How the money is released</h3>
        <ol>
          {releaseStages.map((stage, index) => (
            <ReleaseStage key={stage.name} stage={stage} index={index} />
          ))}
        </ol>
      </section>

      <aside className="escrow-notice">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3 5 6v5c0 4.7 2.9 8.3 7 10 4.1-1.7 7-5.3 7-10V6l-7-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <p>
          Money stays held by EventHub. There is no release button for clients:
          vendor check-in releases stage 2 and the event manager releases stage 3.
        </p>
      </aside>
    </section>
  );
}
