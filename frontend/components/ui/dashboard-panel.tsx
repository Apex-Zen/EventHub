import type { ComponentProps, ReactNode } from "react";

type DashboardPanelProps = Omit<
  ComponentProps<"section">,
  "aria-labelledby" | "children" | "className"
> & {
  title: string;
  headingId: string;
  children: ReactNode;
  className?: string;
};

export function DashboardPanel({
  title,
  headingId,
  children,
  className,
  ...sectionProps
}: DashboardPanelProps) {
  return (
    <section
      {...sectionProps}
      className={`dashboard-panel${className ? ` ${className}` : ""}`}
      aria-labelledby={headingId}
    >
      <h2 id={headingId}>{title}</h2>
      {children}
    </section>
  );
}
