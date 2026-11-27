import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { checkoutEvent } from "@/lib/payment-data";
import { CheckoutProgress } from "./checkout-progress";
import { DepositEventCard } from "./deposit-event-card";
import { DepositSummaryPanel } from "./deposit-summary-panel";

export function DepositPage() {
  return (
    <DashboardLayout>
      <div className="deposit-page">
        <div className="deposit-heading">
          <Link href="#event-summary" className="deposit-back-link">
            <span aria-hidden="true">←</span> {checkoutEvent.name}
          </Link>
          <h1>Pay deposit</h1>
        </div>

        <CheckoutProgress />

        <div className="deposit-layout">
          <DepositEventCard />
          <DepositSummaryPanel />
        </div>
      </div>
    </DashboardLayout>
  );
}
