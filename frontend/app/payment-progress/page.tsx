import { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PaymentProgressPage } from "@/components/payments/payment-progress-page";

function PaymentProgressFallback() {
  return (
    <DashboardLayout>
      <div className="payments-dashboard" aria-live="polite">
        <h1 className="dashboard-title">Payments</h1>
        <p>Loading payment progress…</p>
      </div>
    </DashboardLayout>
  );
}

export default function PaymentProgressRoute() {
  return (
    <Suspense fallback={<PaymentProgressFallback />}>
      <PaymentProgressPage />
    </Suspense>
  );
}
