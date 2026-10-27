"use client";
import VendorFields from "../component/auth/VendorFields";
import Link from "next/link";
import LandingPage from "../component/LandingPage";
import AuthHeader from "../component/AuthHeader";
import { useAuthFlow } from "../hooks/useAuthFlow";
import { getRoleMessage } from "../lib/auth";
import GoogleStatus from "../component/auth/GoogleStatus";
import ForgotPasswordForm from "../component/auth/ForgotPasswordForm";
import ResetPasswordForm from "../component/auth/ResetPasswordForm";
import VerifyEmailForm from "../component/auth/VerifyEmailForm";
import AccountForm from "../component/auth/AccountForm";
export default function Home() {
 const flow = useAuthFlow();
 const { showLanding, mode, step, role, activeAccount, switchMode, signOut, goHome, openAuth } = flow;
  if (step === "dashboard" && activeAccount) {
    return (
      <main className="auth-page">
        <AuthHeader onHome={goHome}>
          <div className="topbar-links">
            <Link className="back-home-link" href="/" onClick={goHome}>← Back to home</Link>
            <button className="text-button" type="button" onClick={signOut}>Sign out</button>
          </div>
        </AuthHeader>
        <section className="welcome-card" aria-labelledby="welcome-title">
          <div className="success-icon" aria-hidden="true">✓</div>
          <p className="eyebrow">SIGNED IN · {activeAccount.role.toUpperCase()}</p>
          <h1 id="welcome-title">Welcome, {activeAccount.fullName || activeAccount.email}.</h1>
          <p className="welcome-copy">{getRoleMessage(activeAccount.role)}</p>
          <div className="verified-label"><span aria-hidden="true">✓</span> Email verified</div>
        </section>
      </main>
    );
  }

  if (showLanding) {
    return <LandingPage onAuth={openAuth} />;
  }

  return (
    <main className={`auth-page${step === "forgot" || step === "reset" || step === "google" ? " auth-page-recovery" : ""}`}>
      <AuthHeader onHome={goHome}>
        {mode === "login" || step !== "form" ? (
          <div className="auth-topbar-prompt">
            <span>New to EventHub?</span>
            <button type="button" onClick={() => switchMode("signup")}>Create an account</button>
          </div>
        ) : (
          <Link className="back-home-link" href="/" onClick={goHome}>← Back to home</Link>
        )}
      </AuthHeader>

      <section className={`auth-shell${step === "forgot" || step === "reset" || step === "google" ? " auth-shell-recovery" : ""}`} aria-label="EventHub account access">
        <aside className={`intro-panel intro-panel-${step === "verify" ? "verify" : mode === "login" || step !== "form" ? "login" : role === "Vendor" ? "vendor" : "client"}`}>
          <div className="intro-orb intro-orb-one" />
          <div className="intro-orb intro-orb-two" />
          <div className="intro-content">
            <span className="intro-kicker"><span className="kicker-dot" /> EVENTHUB · MADE FOR GATHERINGS</span>
            <h1>
              {step === "verify" ? <>One last<br /><em>step.</em></> : step === "forgot" ? <>A fresh start<br /><em>is one step away.</em></> : step === "reset" ? <>Choose a new<br /><em>password.</em></> : step === "google" ? <>Gather well.<br /><em>We’ll get you there.</em></> : mode === "login" ? <>Welcome<br /><em>back.</em></> : role === "Vendor" ? <>Get booked for<br /><em>the dates you are free.</em></> : <>Your event,<br /><em>planned with care.</em></>}
            </h1>
            <p className="intro-copy">
              {step === "verify" ? "A quick email check, then you’re ready to bring your next event to life." : step === "forgot" || step === "reset" ? "We’ll help you get safely back into your EventHub account." : step === "google" ? "Google sign-in will be available when account connection is configured." : mode === "login" ? "One login for clients, vendors, the Event Manager and staff. Gate staff and guests never log in." : getRoleMessage(role)}
            </p>
            <div className="intro-rule" />
            <p className="intro-caption">A place for every part of the celebration.</p>
          </div>
          <div className="intro-footer">
            <span className="footer-spark" aria-hidden="true">✳</span>
            <span>From first idea to final guest.</span>
          </div>
        </aside>

        <section className="form-panel">
          <div className="form-content">
            {step === "google" ? (
              <GoogleStatus actions={{ goHome: flow.goHome, returnToLogin: flow.returnToLogin }} />
            ) : step === "forgot" ? (
              <ForgotPasswordForm {...flow.forgotPasswordForm} />
            ) : step === "reset" ? (
              <ResetPasswordForm {...flow.resetPasswordForm} />
            ) : step === "verify" ? (
              <VerifyEmailForm {...flow.verifyEmailForm} />
            ) : (
              <AccountForm {...flow.accountForm} vendorFields={<VendorFields {...flow.vendorFields} />} />
            )}
          </div>
        </section>
      </section>
      <footer className="page-footer">
        <span>© 2026 EventHub</span>
        <span>Made for moments that matter</span>
      </footer>
    </main>
  );
}
