import Link from "next/link";
import { vendorNavigation } from "@/lib/payouts";

export function VendorSidebar() {
  return (
    <aside className="sidebar">
      <Link className="brand" href="/" aria-label="EventHub home">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0Z" />
          <circle cx="12" cy="10" r="2.2" />
        </svg>
        <span>EventHub</span>
      </Link>

      <p className="sidebar-label">Vendor</p>
      <nav className="sidebar-nav" aria-label="Vendor navigation">
        {vendorNavigation.map((item) => (
          <Link
            href={item === "Payouts" ? "#payouts" : "#"}
            className={item === "Payouts" ? "selected" : ""}
            aria-current={item === "Payouts" ? "page" : undefined}
            key={item}
          >
            {item}
          </Link>
        ))}
      </nav>

      <div className="sidebar-account">
        <div className="profile-avatar" aria-hidden="true">
          KF
        </div>
        <div className="profile-copy">
          <strong>Kasun Fernando</strong>
          <span>Lens &amp; Light Studio</span>
        </div>
        <button className="sign-out" type="button" aria-label="Sign out">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M10 17l5-5-5-5M15 12H3m9-8h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
