import { formatLkr, type PaymentVendor } from "@/lib/payment-data";

function MilestoneStage({
  stage,
}: {
  stage: PaymentVendor["stages"][number];
}) {
  const isReleased = stage.status === "Released";

  return (
    <div className={`milestone-stage${isReleased ? " released" : ""}`}>
      <div className="stage-heading">
        <strong>
          {stage.name} · {stage.percent}%
        </strong>
        <span>{stage.status}</span>
      </div>
      <p>{stage.detail}</p>
      <strong className="stage-amount">{formatLkr(stage.amount)}</strong>
      {stage.receipt && <small>{stage.receipt}</small>}
    </div>
  );
}

function VendorMilestone({ vendor }: { vendor: PaymentVendor }) {
  const releasedPercent = Math.min(
    100,
    vendor.stages
      .filter((stage) => stage.status === "Released")
      .reduce((total, stage) => total + stage.percent, 0),
  );

  return (
    <article className="vendor-item">
      <div className="vendor-heading">
        <div className="vendor-name-group">
          <span className="vendor-image" aria-hidden="true">
            {vendor.icon}
          </span>
          <strong>
            {vendor.name} <span>·</span> {formatLkr(vendor.amount)}
          </strong>
        </div>
        <div className="vendor-progress">
          <div
            className="progress-track"
            role="progressbar"
            aria-label={`${vendor.name} payment progress`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={releasedPercent}
          >
            <span style={{ width: `${releasedPercent}%` }} />
          </div>
          <small>{releasedPercent}% released</small>
        </div>
      </div>
      <div className="milestone-stages">
        {vendor.stages.map((stage) => (
          <MilestoneStage key={stage.name} stage={stage} />
        ))}
      </div>
    </article>
  );
}

export function VendorMilestoneList({
  vendors,
}: {
  vendors: PaymentVendor[];
}) {
  return (
    <div className="vendor-list">
      {vendors.map((vendor) => (
        <VendorMilestone key={vendor.name} vendor={vendor} />
      ))}
    </div>
  );
}
