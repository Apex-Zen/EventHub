"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const paymentRoutes = new Set([
  "/",
  "/card-payment",
  "/payment-progress",
  "/receipts",
  "/refund-status",
]);

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "My events", href: "/" },
  { label: "Payments", href: "/payment-progress" },
  { label: "Messages", href: "/" },
];

export function DashboardHeader() {
  const pathname = usePathname();

  return (
    <header className="dashboard-header">
      <Link className="brand" href="/" aria-label="EventHub home">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0Z" />
          <circle cx="12" cy="10" r="2.2" />
        </svg>
        <span>EventHub</span>
      </Link>
      <nav className="dashboard-nav" aria-label="Main navigation">
        {navigationItems.map((item) => {
          const isPaymentsItem = item.href === "/payment-progress";
          const isActive = isPaymentsItem && paymentRoutes.has(pathname);
          return (
            <Link
              href={item.href}
              className={isActive ? "active" : ""}
              aria-current={pathname === item.href ? "page" : undefined}
              key={item.label}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="dashboard-user">
        <span className="notification-icon" aria-label="3 notifications">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
          </svg>
          <b>3</b>
        </span>
        <span className="user-avatar" aria-hidden="true">
          NP
        </span>
        <span className="user-name">Nadeesha P.</span>
      </div>
    </header>
  );
}
