import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { RefundStatusContent } from "@/components/refunds/refund-status-content";

export default function RefundStatusPage() {
  return (
    <DashboardLayout>
      <RefundStatusContent />
    </DashboardLayout>
  );
}
