import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ReceiptsContent } from "@/components/receipts/receipts-content";

export default function ReceiptsPage() {
  return (
    <DashboardLayout>
      <ReceiptsContent />
    </DashboardLayout>
  );
}
