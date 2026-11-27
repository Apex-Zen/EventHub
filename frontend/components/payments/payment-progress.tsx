"use client";

import { DashboardPanel } from "@/components/ui/dashboard-panel";
import {
  paymentEvents,
  type PaymentEntry,
  type PaymentEventId,
  type PaymentType,
} from "@/lib/payment-data";
import { PaymentHistoryTable } from "./payment-history-table";
import { VendorMilestoneList } from "./vendor-milestone-list";

export function PaymentProgress({
  activeEvent,
  onEventChange,
  onPayNow,
  paidEvent = "wedding",
  paidType = "deposit",
  paymentTime,
}: {
  activeEvent: PaymentEventId;
  onEventChange: (event: PaymentEventId) => void;
  onPayNow: (entry: PaymentEntry) => void;
  paidEvent?: PaymentEventId;
  paidType?: PaymentType;
  paymentTime?: string;
}) {
  const event = paymentEvents.find((item) => item.id === activeEvent);
  if (!event) {
    throw new Error(`Unknown payment event: ${activeEvent}`);
  }

  const hasNewPayment = Boolean(paymentTime) && activeEvent === paidEvent;
  const targetPrefix = paidType === "balance" ? "Balance" : "Deposit";

  const entries = event.entries.map((entry) => {
    if (
      hasNewPayment &&
      paymentTime &&
      entry.payment.startsWith(targetPrefix) &&
      (paidType === "deposit" ? entry.status === "success" : entry.status === "pending")
    ) {
      return {
        ...entry,
        status: "success" as const,
        time: paymentTime,
        action: "download" as const,
      };
    }
    return entry;
  });

  const vendors = event.vendors.map((vendor) => ({
    ...vendor,
    stages: vendor.stages.map((stage) =>
      hasNewPayment && paidType === "deposit" && stage.receipt && paymentTime
        ? {
            ...stage,
            receipt: `${stage.receipt.split(" · ")[0]} · ${paymentTime}`,
          }
        : stage,
    ),
  }));

  return (
    <div className="payments-dashboard">
      <h1 className="dashboard-title">Payments</h1>
      <div className="event-tabs" role="tablist" aria-label="Events">
        {paymentEvents.map((item) => (
          <button
            type="button"
            role="tab"
            id={`${item.id}-tab`}
            aria-controls="payments-content"
            aria-selected={activeEvent === item.id}
            className={activeEvent === item.id ? "selected" : ""}
            onClick={() => onEventChange(item.id)}
            key={item.id}
          >
            {item.name}
          </button>
        ))}
      </div>

      <DashboardPanel
        id="payments-content"
        role="tabpanel"
        aria-labelledby={`${event.id}-tab`}
        headingId="event-payments-title"
        title="Payments for this event"
      >
          <PaymentHistoryTable entries={entries} onPayNow={onPayNow} />
      </DashboardPanel>

      <DashboardPanel
        headingId="milestone-title"
        title="Milestone progress by vendor"
        className="milestone-panel"
      >
        <VendorMilestoneList vendors={vendors} />
      </DashboardPanel>
    </div>
  );
}
