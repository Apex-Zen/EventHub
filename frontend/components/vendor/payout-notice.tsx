import type { ReactNode } from "react";

type PayoutNoticeProps = {
  children: ReactNode;
  variant: "info" | "error";
  role?: "status" | "alert";
};

export function PayoutNotice({
  children,
  variant,
  role,
}: PayoutNoticeProps) {
  return (
    <aside className={`notice notice-${variant}`} role={role}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5m0-8h.01" />
      </svg>
      <p>{children}</p>
    </aside>
  );
}
