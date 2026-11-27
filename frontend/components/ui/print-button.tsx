"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrintButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  children: ReactNode;
};

export function PrintButton({
  children,
  type = "button",
  ...buttonProps
}: PrintButtonProps) {
  return (
    <button {...buttonProps} type={type} onClick={() => window.print()}>
      {children}
    </button>
  );
}
