import type { ReactNode } from "react";

export type StatusVariant = "success" | "failed" | "pending";

export function StatusBadge({
  status,
  children,
}: {
  status: StatusVariant;
  children: ReactNode;
}) {
  return <span className={`status-pill status-${status}`}>{children}</span>;
}
