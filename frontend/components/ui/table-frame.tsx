import type { ReactNode } from "react";

export function TableFrame({
  wrapperClassName,
  tableClassName,
  children,
}: {
  wrapperClassName: string;
  tableClassName: string;
  children: ReactNode;
}) {
  return (
    <div className={wrapperClassName}>
      <table className={tableClassName}>{children}</table>
    </div>
  );
}
