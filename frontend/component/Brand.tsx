import Link from "next/link";
import type { MouseEventHandler } from "react";
import LocationIcon from "./icon/LocationIcon";
export default function Brand({ variant = "auth", onClick }: { variant?: "auth" | "landing"; onClick?: MouseEventHandler<HTMLAnchorElement> }) {
 const landing = variant === "landing";
 return <Link className={landing ? "landing-brand" : "brand"} href={landing ? "#home" : "/"} aria-label="EventHub home" onClick={onClick}><LocationIcon className={landing ? "landing-brand-icon" : "brand-location-icon"} />{landing ? <span>EventHub</span> : <span>Event<span className="brand-accent">Hub</span></span>}</Link>;
}
