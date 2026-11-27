import type { ReactNode } from "react";

export type DetailListItem = {
  label: string;
  value: ReactNode;
  className?: string;
  valueClassName?: string;
};

export function DetailList({
  items,
  className,
}: {
  items: DetailListItem[];
  className?: string;
}) {
  return (
    <dl className={className}>
      {items.map((item) => (
        <div className={item.className} key={item.label}>
          <dt>{item.label}</dt>
          <dd className={item.valueClassName}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
