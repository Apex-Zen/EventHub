import type { ReactNode } from "react";
import { DashboardHeader } from "./dashboard-header";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="success-page">
      <DashboardHeader />
      {children}
    </main>
  );
}
