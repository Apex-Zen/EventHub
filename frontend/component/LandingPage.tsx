"use client";
import Brand from "./Brand";

import Link from "next/link";
import type { ReactNode } from "react";
import LocationIcon from "./icon/LocationIcon";

type AuthMode = "signup" | "login";
type AccountRole = "Client" | "Vendor";

type LandingPageProps = {
  onAuth: (mode: AuthMode, role?: AccountRole) => void;
};

const vendorCategories = [
  { icon: "camera", title: "Photography", price: "From LKR 45,000 a session" },
  { icon: "fork", title: "Catering", price: "From LKR 2,400 per guest" },
  { icon: "flower", title: "Decoration", price: "From LKR 60,000 a hall" },
  { icon: "music", title: "Sound and lighting", price: "From LKR 35,000 a night" },
  { icon: "cake", title: "Cakes", price: "From LKR 18,000 a tier set" },
  { icon: "car", title: "Wedding cars", price: "From LKR 25,000 a day" },
] as const;

type VendorIconName = (typeof vendorCategories)[number]["icon"];

const events = [
  {
    date: ["14", "NOV"],
    title: "Galle Face Jazz Night",
    location: "Galle Face Green, Colombo 03",
    time: "7.00 pm",
    price: "LKR 1,500",
    image: "landing-event-jazz",
  },
  {
    date: ["22", "NOV"],
    title: "Kandy Food Street Fair",
    location: "Dalada Veediya, Kandy",
    time: "10.00 am",
    price: "LKR 800",
    image: "landing-event-food",
  },
  {
    date: ["05", "DEC"],
    title: "Negombo Beach Run 5K",
    location: "Negombo beach",
    time: "6.00 am",
    price: "LKR 1,500",
    image: "landing-event-run",
  },
];

const paymentStages = [
  {
    percentage: "20%",
    title: "Booking confirmed",
    detail: "Released when the vendor accepts your package and your card payment goes through.",
    icon: "✓",
  },
  {
    percentage: "50%",
    title: "Vendor arrives",
    detail: "Released when the vendor checks in at the venue, within 100–200 m by GPS or with a code.",
    icon: "⌖",
  },
  {
    percentage: "30%",
    title: "Event completed",
    detail: "Released when the event manager marks the event complete. Then you can rate each vendor.",
    icon: "⚑",
  },
];

function VendorIcon({ name }: { name: VendorIconName }) {
  const paths: Record<VendorIconName, ReactNode> = {
    camera: <><path d="M4 8.5h3l1.5-2h7l1.5 2h3A1.5 1.5 0 0 1 21.5 10v8a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 18v-8A1.5 1.5 0 0 1 4 8.5Z" /><circle cx="12" cy="13.5" r="3.5" /></>,
    fork: <><path d="M6 3v6M10 3v6M6 6h4M8 9v12M16 3v18M16 3c3 2 3 6 0 8" /></>,
    flower: <><circle cx="12" cy="12" r="2" /><circle cx="12" cy="5.5" r="3" /><circle cx="18" cy="9" r="3" /><circle cx="18" cy="16" r="3" /><circle cx="12" cy="19" r="3" /><circle cx="6" cy="16" r="3" /><circle cx="6" cy="9" r="3" /></>,
    music: <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>,
    cake: <><path d="M3 11h18v9H3zM3 15h18M7 11V8M12 11V8M17 11V8M5 6h14" /><path d="M12 3c-2 2 2 2 0 5" /></>,
    car: <><path d="m4 11 2-5h12l2 5 2 2v5h-2M4 18H2v-5l2-2Z" /><path d="M4 11h16M6 18h12" /><circle cx="6" cy="17" r="2" /><circle cx="18" cy="17" r="2" /></>,
  };

  return (
    <svg aria-hidden="true" className="vendor-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

export default function LandingPage({ onAuth }: LandingPageProps) {
  return (
    <main className="landing-page">
      <section className="landing-hero" id="home">
        <header className="landing-header">
          <Brand variant="landing" />
          <nav className="landing-nav" aria-label="Main navigation">
            <Link href="#home">Home</Link>
            <Link href="#public-events">Public events</Link>
            <Link href="#payments">How payments work</Link>
            <Link href="#vendors">For vendors</Link>
          </nav>
          <div className="landing-actions">
            <button className="landing-login" onClick={() => onAuth("login")} type="button">Log in</button>
            <button className="landing-signup" onClick={() => onAuth("signup")} type="button">Sign up</button>
          </div>
        </header>

        <div className="landing-hero-copy">
          <p className="landing-kicker">WEDDINGS · BIRTHDAYS · COMPANY NIGHTS · PUBLIC EVENTS</p>
          <h1>Book vendors for your event.<br />Pay them in stages.</h1>
          <p className="landing-hero-description">
            Photographers, caterers and decorators across Sri Lanka. Your money is held until the vendor turns up and the event is done.
          </p>
          <div className="landing-hero-actions">
            <button className="landing-signup" onClick={() => onAuth("signup", "Client")} type="button">Plan an event</button>
            <button className="landing-outline" onClick={() => onAuth("signup", "Vendor")} type="button">Offer your services</button>
          </div>
        </div>
        <a className="landing-scroll-cue" href="#welcome">Scroll to explore <span aria-hidden="true">↓</span></a>
      </section>

      <section className="landing-welcome landing-section" id="welcome">
        <div className="landing-welcome-copy">
          <p className="landing-eyebrow">ONE PLACE FOR EVERY CELEBRATION</p>
          <h2>Welcome to EventHub</h2>
          <p className="landing-section-intro">
            One place for the people who plan events and the people who make them happen. Pick how you want to start.
          </p>
          <div className="landing-role">
            <span className="landing-role-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="8" r="3" /><path d="M3.5 19v-1.5A4.5 4.5 0 0 1 8 13h2a4.5 4.5 0 0 1 4.5 4.5V19M16 5.5a3 3 0 0 1 0 5.8M17 13h.5a4 4 0 0 1 4 4v2" />
              </svg>
            </span>
            <div>
              <span className="landing-role-label">FOR CLIENTS</span>
              <h3>I am planning an event</h3>
              <p>Private events: choose vendors free on your date and send one package. Public events: sell tickets with QR passes.</p>
              <button className="landing-text-link" type="button" onClick={() => onAuth("signup", "Client")}>
                Sign up as a client
              </button>
            </div>
          </div>
          <div className="landing-role">
            <span className="landing-role-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8.5 5.5 6h13L21 8.5V19H3zM3 10h18" /><circle cx="12" cy="14.5" r="2.5" />
              </svg>
            </span>
            <div>
              <span className="landing-role-label">FOR VENDORS</span>
              <h3>I provide event services</h3>
              <p>List your services and past work, answer package requests, and get paid 20%, 50% and 30% as the job moves.</p>
              <button className="landing-text-link" type="button" onClick={() => onAuth("signup", "Vendor")}>
                Sign up as a vendor
              </button>
            </div>
          </div>
        </div>
        <div className="landing-welcome-image" role="img" aria-label="Newlyweds celebrating beneath a floral wedding arch" />
      </section>

      <section className="landing-vendors" id="vendors">
        <div className="landing-vendors-inner">
          <div className="landing-centered-heading">
            <p className="landing-eyebrow">YOUR DAY, YOUR WAY</p>
            <h2>Vendors you can book</h2>
            <p>Every vendor shows prices, past work and a public score from real clients.</p>
          </div>
          <div className="landing-vendor-grid">
            {vendorCategories.map((vendor) => (
              <article className="landing-vendor-card" key={vendor.title}>
                <VendorIcon name={vendor.icon} />
                <h3>{vendor.title}</h3>
                <p>{vendor.price}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-events landing-section" id="public-events">
        <div className="landing-section-heading">
          <div>
            <p className="landing-eyebrow">FIND YOUR NEXT EXPERIENCE</p>
            <h2>Public events on sale</h2>
            <p>Buy without an account. Every ticket comes with its own QR code.</p>
          </div>
          <a className="landing-secondary-button" href="#public-events">See all events <span aria-hidden="true">→</span></a>
        </div>
        <div className="landing-event-grid">
          {events.map((event) => (
            <article className="landing-event-card" key={event.title}>
              <div className={`landing-event-image ${event.image}`} role="img" aria-label={event.title}>
                <span className="landing-event-date"><strong>{event.date[0]}</strong><span>{event.date[1]}</span></span>
              </div>
              <div className="landing-event-details">
                <h3>{event.title}</h3>
                <p className="landing-event-location"><LocationIcon className="landing-small-pin" />{event.location}<span>·</span>{event.time}</p>
                <div className="landing-event-bottom">
                  <span>From {event.price}</span>
                  <span className="landing-ticket-label">Get tickets</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-payments" id="payments">
        <div className="landing-centered-heading">
          <p className="landing-eyebrow landing-eyebrow-light">CLEAR, SECURE, STAGE BY STAGE</p>
          <h2>How payment works</h2>
          <p>You pay by card. EventHub holds the money and releases it to each vendor in three stages.</p>
        </div>
        <div className="landing-payment-grid">
          {paymentStages.map((stage) => (
            <article className="landing-payment-card" key={stage.percentage}>
              <div className="landing-payment-top">
                <strong>{stage.percentage}</strong>
                <span aria-hidden="true">{stage.icon}</span>
              </div>
              <h3>{stage.title}</h3>
              <p>{stage.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-main">
          <div className="landing-footer-brand">
            <Brand variant="landing" />
            <p>Event planning with staged payments, for clients and vendors across Sri Lanka.</p>
          </div>
          <div className="landing-footer-column">
            <h3>PLAN</h3>
            <a href="#welcome">Private events</a>
            <a href="#public-events">Public events</a>
            <a href="#payments">How payments work</a>
          </div>
          <div className="landing-footer-column">
            <h3>VENDORS</h3>
            <a href="#vendors">Join as a vendor</a>
            <a href="#payments">Payouts and commission</a>
            <a href="#vendors">Vendor help</a>
          </div>
          <div className="landing-footer-column">
            <h3>COMPANY</h3>
            <a href="#home">About</a>
            <a href="#home">Terms</a>
            <a href="#home">Privacy</a>
            <a href="#home">Contact</a>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <span>EventHub (Pvt) Ltd, Colombo 03</span>
          <span>hello@eventhub.lk · +94 11 234 5678</span>
        </div>
      </footer>
    </main>
  );
}
