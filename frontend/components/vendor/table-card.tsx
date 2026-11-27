import type { ComponentProps, ReactNode } from "react";

type TableCardProps = ComponentProps<"section">;

export function TableCard({
  children,
  className,
  ...sectionProps
}: TableCardProps) {
  return (
    <section
      {...sectionProps}
      className={`table-card${className ? ` ${className}` : ""}`}
    >
      {children}
    </section>
  );
}

export function TableScroll({ children }: { children: ReactNode }) {
  return <div className="table-scroll">{children}</div>;
}
