"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import LandingPage from "../component/LandingPage";
import LocationIcon from "../component/icon/LocationIcon";

const roles = [
  {
    id: "Client",
    title: "Client",
    description: "Plan your next event",
    icon: "✦",
  },
  {
    id: "Vendor",
    title: "Vendor",
    description: "Grow your event business",
    icon: "◇",
  },
] as const;

type Role = (typeof roles)[number]["id"];
type Mode = "signup" | "login";
type Step = "form" | "verify" | "forgot" | "reset" | "google" | "dashboard";
type ResetMethod = "email" | "sms";

type Account = {
  role: Role;
  fullName: string;
  email: string;
  passwordSalt: string;
  passwordHash: string;
  isVerified: boolean;
  vendorProfile?: {
    phoneNumber: string;
    serviceCategory: string;
    businessRegistrationNumber: string;
  };
};

type VerificationCode = {
  value: string;
  expiresAt: number;
  attempts: number;
};

const ACCOUNTS_KEY = "eventhub.demo.accounts";
const CODE_LIFETIME_MS = 5 * 60 * 1000;
const RESET_CODE_LIFETIME_MS = 30 * 60 * 1000;
const MAX_CODE_ATTEMPTS = 5;
const vendorCategories = [
  "Photography",
  "Catering",
  "Decoration",
  "Sound and lighting",
  "Venue",
  "Cake",
  "Transport",
  "Other",
];

function getAccountKey(email: string, role: Role) {
  return `${email.trim().toLowerCase()}::${role}`;
}

function readAccounts(): Account[] {
  const savedAccounts = window.localStorage.getItem(ACCOUNTS_KEY);
  if (!savedAccounts) return [];

  const parsed: unknown = JSON.parse(savedAccounts);
  if (!Array.isArray(parsed)) {
    throw new Error("Saved accounts could not be read. Clear this site's storage and try again.");
  }

  return parsed as Account[];
}

function saveAccounts(accounts: Account[]) {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  return new Uint8Array(hex.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? []);
}

async function hashPassword(password: string, salt?: Uint8Array<ArrayBuffer>) {
  if (!window.crypto?.subtle) {
    throw new Error("Secure browser cryptography is unavailable. Open this app on localhost or HTTPS.");
  }

  const passwordSalt = salt ?? window.crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const hash = await window.crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: passwordSalt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    256,
  );

  return {
    salt: bytesToHex(passwordSalt),
    hash: bytesToHex(new Uint8Array(hash)),
  };
}

function passwordsMatch(first: string, second: string) {
  return first.length >= 8 && /[A-Z]/.test(first) && /[a-z]/.test(first) && /\d/.test(first) && first === second;
}

function makeVerificationCode(): VerificationCode {
  const code = window.crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return {
    value: code.toString().padStart(6, "0"),
    expiresAt: Date.now() + CODE_LIFETIME_MS,
    attempts: 0,
  };
}

function getRoleMessage(role: Role) {
  switch (role) {
    case "Client":
      return "Your space to discover, plan, and enjoy memorable events.";
    case "Vendor":
      return "A home for your services, bookings, and event business.";
  }
}

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);
  const [mode, setMode] = useState<Mode>("signup");
  const [step, setStep] = useState<Step>("form");
  const [role, setRole] = useState<Role>("Client");
  const [fullName, setFullName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("");
  const [nicNumber, setNicNumber] = useState("");
  const [identityDocument, setIdentityDocument] = useState<File | null>(null);
  const [acceptedVendorTerms, setAcceptedVendorTerms] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationInput, setVerificationInput] = useState("");
  const [verificationCode, setVerificationCode] = useState<VerificationCode | null>(null);
  const [resetMethod, setResetMethod] = useState<ResetMethod>("email");
  const [resetIdentifier, setResetIdentifier] = useState("");
  const [resetTarget, setResetTarget] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [resetCodeInput, setResetCodeInput] = useState("");
  const [resetExpiresAt, setResetExpiresAt] = useState(0);
  const [resetPassword, setResetPassword] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(false);
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  function resetMessages() {
    setError("");
    setNotice("");
  }

  function createVerification(account: Account, message: string) {
    setVerificationCode(makeVerificationCode());
    setVerificationInput("");
    setEmail(account.email);
    setRole(account.role);
    setStep("verify");
    setNotice(message);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();
    setBusy(true);

    try {
      const accounts = readAccounts();
      const accountKey = getAccountKey(email, role);

      if (mode === "signup") {
        if (role === "Vendor") {
          if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim()) {
            throw new Error("Complete your name and phone number to continue.");
          }
          if (!serviceCategory) {
            throw new Error("Choose a service category to continue.");
          }
          if (!businessRegistrationNumber.trim()) {
            throw new Error("Enter your Business Registration Number (BRN).");
          }
          if (!nicNumber.trim() && !identityDocument) {
            throw new Error("Enter your NIC number or upload your NIC or passport.");
          }
          if (!acceptedVendorTerms) {
            throw new Error("Accept the Vendor Terms and payout commission to create your account.");
          }
          if (identityDocument) {
            const extension = identityDocument.name.split(".").pop()?.toLowerCase();
            if (!["jpg", "jpeg", "png", "pdf"].includes(extension ?? "")) {
              throw new Error("Upload your ID as a JPG, PNG, or PDF file.");
            }
            if (identityDocument.size > 5 * 1024 * 1024) {
              throw new Error("Your ID document must be 5 MB or smaller.");
            }
          }
        }
        if (!passwordsMatch(password, confirmPassword)) {
          throw new Error(
            "Use at least 8 characters with an uppercase letter, a lowercase letter, and a number. Both password fields must match.",
          );
        }
        if (accounts.some((account) => getAccountKey(account.email, account.role) === accountKey)) {
          throw new Error("An account with this email already exists for this role. Sign in instead.");
        }
        const { salt, hash } = await hashPassword(password);
        const account: Account = {
          role,
          fullName: role === "Vendor" ? `${firstName.trim()} ${lastName.trim()}` : fullName.trim(),
          email: email.trim().toLowerCase(),
          passwordSalt: salt,
          passwordHash: hash,
          isVerified: false,
          ...(role === "Vendor" && {
            vendorProfile: {
              phoneNumber: phoneNumber.trim(),
              serviceCategory,
              businessRegistrationNumber: businessRegistrationNumber.trim(),
            },
          }),
        };
        saveAccounts([...accounts, account]);
        setIdentityDocument(null);
        setNicNumber("");
        createVerification(account, "Your verification code is ready below.");
        return;
      }

      const account = accounts.find(
        (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.role === role,
      ) ?? accounts.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
      if (!account) {
        throw new Error("No account found for this email and role. Check your details or create an account.");
      }

      const passwordHash = await hashPassword(password, hexToBytes(account.passwordSalt));
      if (passwordHash.hash !== account.passwordHash) {
        throw new Error("The email, role, or password is incorrect.");
      }
      if (!account.isVerified) {
        createVerification(account, "Verify your email before signing in. A new code is ready below.");
        return;
      }

      setRole(account.role);
      setActiveAccount(account);
      if (rememberEmail) {
        window.localStorage.setItem("eventhub.demo.remembered-email", account.email);
      } else {
        window.localStorage.removeItem("eventhub.demo.remembered-email");
      }
      setStep("dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function openForgotPassword() {
    setResetIdentifier(email);
    setResetMethod("email");
    setResetCode("");
    setResetCodeInput("");
    setStep("forgot");
    resetMessages();
  }

  function returnToLogin() {
    setStep("form");
    setMode("login");
    setResetCode("");
    setResetCodeInput("");
    resetMessages();
  }

  function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    try {
      const accounts = readAccounts();
      const normalizedIdentifier = resetIdentifier.trim().toLowerCase();
      const matches = accounts.filter((item) => {
        if (resetMethod === "email") return item.email.toLowerCase() === normalizedIdentifier;
        const accountPhone = item.vendorProfile?.phoneNumber.replace(/\D/g, "");
        return accountPhone !== undefined && accountPhone === normalizedIdentifier.replace(/\D/g, "");
      });
      const account = matches.find((item) => item.role === role) ?? matches[0];

      if (!account) {
        throw new Error("No matching account was found for this role and contact. Check the details or sign in instead.");
      }

      const generatedCode = makeVerificationCode();
      generatedCode.expiresAt = Date.now() + RESET_CODE_LIFETIME_MS;
      setResetTarget(account.email);
      setRole(account.role);
      setResetCode(generatedCode.value);
      setResetExpiresAt(generatedCode.expiresAt);
      setResetCodeInput("");
      setResetPassword("");
      setConfirmResetPassword("");
      setStep("reset");
      setNotice(
        resetMethod === "email"
          ? "Demo mode: no email was sent. Use the reset code shown below to continue."
          : "Demo mode: no SMS was sent. Use the reset code shown below to continue.",
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not start password reset. Please try again.");
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    if (!resetCode || resetCodeInput.trim() !== resetCode) {
      setError("Enter the reset code shown above.");
      return;
    }
    if (Date.now() > resetExpiresAt) {
      setResetCode("");
      setError("This reset code has expired. Request a new one to continue.");
      return;
    }
    if (!passwordsMatch(resetPassword, confirmResetPassword)) {
      setError("Use at least 8 characters with an uppercase letter, a lowercase letter, and a number. Both password fields must match.");
      return;
    }

    setBusy(true);
    try {
      const accounts = readAccounts();
      const accountIndex = accounts.findIndex((item) => item.email === resetTarget && item.role === role);
      if (accountIndex < 0) {
        throw new Error("The account for this reset request could not be found. Start again from Forgot password.");
      }

      const { salt, hash } = await hashPassword(resetPassword);
      const updatedAccounts = [...accounts];
      updatedAccounts[accountIndex] = {
        ...updatedAccounts[accountIndex],
        passwordSalt: salt,
        passwordHash: hash,
      };
      saveAccounts(updatedAccounts);
      setEmail(resetTarget);
      setPassword("");
      setConfirmPassword("");
      setResetCode("");
      setResetCodeInput("");
      setStep("form");
      setMode("login");
      setNotice("Password updated on this device. Sign in with your new password.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not reset the password. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function handleResendCode() {
    resetMessages();
    setVerificationCode(makeVerificationCode());
    setVerificationInput("");
    setNotice("A new verification code is ready below. Previous codes are no longer valid.");
  }

  function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();
    if (!verificationCode) {
      setError("Request a new verification code to continue.");
      return;
    }
    if (Date.now() > verificationCode.expiresAt) {
      setVerificationCode(null);
      setError("This code has expired. Request a new one to continue.");
      return;
    }
    if (verificationCode.attempts >= MAX_CODE_ATTEMPTS) {
      setVerificationCode(null);
      setError("Too many incorrect attempts. Request a new code to continue.");
      return;
    }
    if (verificationInput.trim() !== verificationCode.value) {
      const attempts = verificationCode.attempts + 1;
      setVerificationCode(attempts >= MAX_CODE_ATTEMPTS ? null : { ...verificationCode, attempts });
      setError(
        attempts >= MAX_CODE_ATTEMPTS
          ? "Too many incorrect attempts. Request a new code to continue."
          : `That code doesn't match. ${MAX_CODE_ATTEMPTS - attempts} attempts remaining.`,
      );
      return;
    }

    try {
      const accounts = readAccounts();
      const account = accounts.find(
        (item) => getAccountKey(item.email, item.role) === getAccountKey(email, role),
      );
      if (!account) {
        throw new Error("The account for this verification code could not be found. Please sign in again.");
      }

      const verifiedAccount = { ...account, isVerified: true };
      saveAccounts(accounts.map((item) =>
        getAccountKey(item.email, item.role) === getAccountKey(email, role) ? verifiedAccount : item,
      ));
      setActiveAccount(verifiedAccount);
      setVerificationCode(null);
      setStep("dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Verification failed. Please try again.");
    }
  }

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setStep("form");
    setVerificationCode(null);
    setVerificationInput("");
    resetMessages();
  }

  function signOut() {
    setActiveAccount(null);
    setStep("form");
    setMode("login");
    setPassword("");
    setConfirmPassword("");
    resetMessages();
  }

  function goHome() {
    setActiveAccount(null);
    setStep("form");
    setVerificationCode(null);
    setShowLanding(true);
    resetMessages();
  }

  function openAuth(nextMode: Mode) {
    setMode(nextMode);
    setStep("form");
    setShowLanding(false);
    if (nextMode === "login") {
      const savedEmail = window.localStorage.getItem("eventhub.demo.remembered-email") ?? "";
      setEmail(savedEmail);
      setRememberEmail(Boolean(savedEmail));
    }
    resetMessages();
  }

  if (step === "dashboard" && activeAccount) {
    return (
      <main className="auth-page">
        <header className="topbar">
          <Link className="brand" href="/" aria-label="EventHub home" onClick={goHome}>
            <LocationIcon className="brand-location-icon" />
            <span>Event<span className="brand-accent">Hub</span></span>
          </Link>
          <div className="topbar-links">
            <Link className="back-home-link" href="/" onClick={goHome}>← Back to home</Link>
            <button className="text-button" type="button" onClick={signOut}>Sign out</button>
          </div>
        </header>
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
      <header className="topbar">
        <Link className="brand" href="/" aria-label="EventHub home" onClick={goHome}>
          <LocationIcon className="brand-location-icon" />
          <span>Event<span className="brand-accent">Hub</span></span>
        </Link>
        {mode === "login" || step !== "form" ? (
          <div className="auth-topbar-prompt">
            <span>New to EventHub?</span>
            <button type="button" onClick={() => switchMode("signup")}>Create an account</button>
          </div>
        ) : (
          <Link className="back-home-link" href="/" onClick={goHome}>← Back to home</Link>
        )}
      </header>

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
              <section className="provider-status" aria-labelledby="provider-title">
                <span className="google-mark" aria-hidden="true">G</span>
                <h2 id="provider-title">Google sign-in isn&apos;t connected yet</h2>
                <p>EventHub is using demo accounts on this device. A Google OAuth client needs to be configured before Google can sign you in.</p>
                <button className="primary-button" type="button" onClick={returnToLogin}>Back to log in</button>
                <button className="provider-back-link" type="button" onClick={goHome}>Return to EventHub home</button>
              </section>
            ) : step === "forgot" ? (
              <>
                <p className="eyebrow">ACCOUNT RECOVERY</p>
                <h2>Forgot your password?</h2>
                <p className="form-subtitle">Enter the email or phone number on your account. We&apos;ll prepare a secure reset code.</p>
                <div className="recovery-tabs" role="tablist" aria-label="Choose password reset method">
                  <button
                    className={resetMethod === "email" ? "recovery-tab recovery-tab-active" : "recovery-tab"}
                    id="reset-email-tab"
                    type="button"
                    role="tab"
                    aria-selected={resetMethod === "email"}
                    onClick={() => {
                      setResetMethod("email");
                      resetMessages();
                    }}
                  >Email</button>
                  <button
                    className={resetMethod === "sms" ? "recovery-tab recovery-tab-active" : "recovery-tab"}
                    id="reset-sms-tab"
                    type="button"
                    role="tab"
                    aria-selected={resetMethod === "sms"}
                    onClick={() => {
                      setResetMethod("sms");
                      setResetIdentifier("");
                      resetMessages();
                    }}
                  >SMS</button>
                </div>
                <form className="auth-form recovery-form" onSubmit={handleForgotPassword}>
                  <label className="field-label" htmlFor="reset-identifier">{resetMethod === "email" ? "Email" : "Phone number"}</label>
                  <input
                    className="text-input"
                    id="reset-identifier"
                    type={resetMethod === "email" ? "email" : "tel"}
                    autoComplete={resetMethod === "email" ? "email" : "tel"}
                    placeholder={resetMethod === "email" ? "you@example.com" : "+94 71 555 0192"}
                    value={resetIdentifier}
                    onChange={(event) => setResetIdentifier(event.target.value)}
                    required
                  />
                  {error && <p className="form-alert error-alert" role="alert">{error}</p>}
                  <button className="primary-button" type="submit">Send reset {resetMethod === "email" ? "link" : "code"}</button>
                </form>
                <button className="back-button" type="button" onClick={returnToLogin}><span aria-hidden="true">←</span> Back to log in</button>
                <p className="recovery-note">Reset codes expire in 30 minutes. Demo mode does not send email or SMS.</p>
              </>
            ) : step === "reset" ? (
              <>
                <p className="eyebrow">ACCOUNT RECOVERY</p>
                <h2>Set a new password</h2>
                <p className="form-subtitle">For <strong>{resetTarget}</strong>. Reset codes expire in 30 minutes.</p>
                <div className="reset-code-card" role="status">
                  <span>DEMO RESET CODE · NOT SENT</span>
                  <strong>{resetCode || "Expired"}</strong>
                </div>
                {notice && <p className="form-alert success-alert" role="status">{notice}</p>}
                <form className="auth-form recovery-form" onSubmit={handleResetPassword}>
                  <div className="field">
                    <label className="field-label" htmlFor="reset-code">Reset code</label>
                    <input
                      className="text-input code-input"
                      id="reset-code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      placeholder="000000"
                      value={resetCodeInput}
                      onChange={(event) => setResetCodeInput(event.target.value.replace(/\D/g, ""))}
                      required
                    />
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="new-password">New password</label>
                    <input
                      className="text-input"
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      value={resetPassword}
                      onChange={(event) => setResetPassword(event.target.value)}
                      minLength={8}
                      required
                    />
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="confirm-new-password">Confirm new password</label>
                    <input
                      className="text-input"
                      id="confirm-new-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Repeat password"
                      value={confirmResetPassword}
                      onChange={(event) => setConfirmResetPassword(event.target.value)}
                      minLength={8}
                      required
                    />
                  </div>
                  <ul className="password-checklist">
                    <li>At least 8 characters</li>
                    <li>At least one uppercase letter, one lowercase letter, and one number</li>
                    <li>Both passwords match</li>
                  </ul>
                  {error && <p className="form-alert error-alert" role="alert">{error}</p>}
                  <button className="primary-button" type="submit" disabled={busy}>{busy ? "Saving..." : "Save new password"}</button>
                </form>
                <button className="back-button" type="button" onClick={() => {
                  setStep("forgot");
                  setResetCode("");
                  setResetCodeInput("");
                  resetMessages();
                }}><span aria-hidden="true">←</span> Request another code</button>
              </>
            ) : step === "verify" ? (
              <>
                <button
                  className="back-button"
                  type="button"
                  onClick={() => {
                    setStep("form");
                    resetMessages();
                  }}
                >
                  <span aria-hidden="true">←</span> Back to sign in
                </button>
                <p className="eyebrow">ONE LAST STEP</p>
                <h2>Verify your email</h2>
                <p className="form-subtitle">
                  Enter the 6-digit code for <strong>{email}</strong> to verify your {role.toLowerCase()} account.
                </p>
                <div className="verification-code-box" role="status">
                  <span className="verification-code-label">VERIFICATION CODE</span>
                  <strong className="verification-code-value">{verificationCode?.value ?? "------"}</strong>
                  <span className="verification-code-note">Expires in five minutes.</span>
                </div>
                <form className="auth-form" onSubmit={handleVerify}>
                  <label className="field-label" htmlFor="verification-code">Verification code</label>
                  <input
                    className="text-input code-input"
                    id="verification-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    placeholder="000000"
                    value={verificationInput}
                    onChange={(event) => setVerificationInput(event.target.value.replace(/\D/g, ""))}
                    required
                    aria-describedby="verification-help"
                  />
                  <p className="field-hint" id="verification-help">
                    Code expires in 5 minutes. {verificationCode ? `${MAX_CODE_ATTEMPTS - verificationCode.attempts} attempts available.` : "Request a new code."}
                  </p>
                  {error && <p className="form-alert error-alert" role="alert">{error}</p>}
                  {notice && <p className="form-alert success-alert" role="status">{notice}</p>}
                  <button className="primary-button" type="submit" disabled={!verificationCode}>
                    Verify and continue <span aria-hidden="true">→</span>
                  </button>
                </form>
                <p className="switch-prompt">
                  Didn&apos;t get a code?{" "}
                  <button className="inline-button" type="button" onClick={handleResendCode}>Send a new code</button>
                </p>
              </>
            ) : (
              <>
                <p className="eyebrow">{mode === "signup" ? "WELCOME TO EVENTHUB" : "WELCOME BACK"}</p>
                <h2>{mode === "signup" ? role === "Vendor" ? "Create a vendor account" : "Create your account" : "Log in"}</h2>
                <p className="form-subtitle">
                  {mode === "signup"
                    ? role === "Vendor"
                      ? "Clients find you by category, district, budget and free dates."
                      : "Choose your role and let’s get your event journey started."
                    : "Enter your details to continue to your account."}
                </p>

                {mode === "signup" && <div className="role-heading">
                  <span className="field-label">I&apos;m joining as</span>
                  {role !== "Vendor" && <span className="role-count">CHOOSE ONE</span>}
                </div>}
                {mode === "signup" && <div className={`role-grid${role === "Vendor" ? " role-grid-vendor" : ""}`} role="group" aria-label="Choose your account role">
                  {roles.map((item) => (
                    <button
                      className={`role-option${role === item.id ? " role-option-selected" : ""}`}
                      type="button"
                      key={item.id}
                      aria-pressed={role === item.id}
                      onClick={() => {
                        setRole(item.id);
                        setIdentityDocument(null);
                        setAcceptedVendorTerms(false);
                        resetMessages();
                      }}
                    >
                      <span className="role-icon" aria-hidden="true">{item.icon}</span>
                      <span className="role-copy">
                        <span className="role-title">{item.title}</span>
                        <span className="role-description">{item.description}</span>
                      </span>
                      <span className="role-radio" aria-hidden="true" />
                    </button>
                  ))}
                </div>}

                <form className={`auth-form${mode === "signup" && role === "Vendor" ? " auth-form-vendor" : ""}`} onSubmit={handleSubmit}>
                  {mode === "signup" && role === "Vendor" && (
                    <>
                      <p className="vendor-form-section">ABOUT YOU</p>
                      <div className="field-row">
                        <div className="field">
                          <label className="field-label" htmlFor="first-name">First name</label>
                          <input
                            className="text-input"
                            id="first-name"
                            type="text"
                            autoComplete="given-name"
                            placeholder="e.g. Kasun"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            required
                          />
                        </div>
                        <div className="field">
                          <label className="field-label" htmlFor="last-name">Last name</label>
                          <input
                            className="text-input"
                            id="last-name"
                            type="text"
                            autoComplete="family-name"
                            placeholder="e.g. Fernando"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="field-row">
                        <div className="field">
                          <label className="field-label" htmlFor="email">Email</label>
                          <input
                            className="text-input"
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@business.lk"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                          />
                        </div>
                        <div className="field">
                          <label className="field-label" htmlFor="phone-number">Phone number</label>
                          <input
                            className="text-input"
                            id="phone-number"
                            type="tel"
                            autoComplete="tel"
                            placeholder="+94 71 555 0192"
                            value={phoneNumber}
                            onChange={(event) => setPhoneNumber(event.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <p className="vendor-form-section">BUSINESS</p>
                      <div className="field">
                        <label className="field-label" htmlFor="service-category">Service category</label>
                        <select
                          className="text-input vendor-select"
                          id="service-category"
                          value={serviceCategory}
                          onChange={(event) => setServiceCategory(event.target.value)}
                          required
                        >
                          <option value="" disabled>Choose a category</option>
                          {vendorCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                        </select>
                        <p className="field-hint">Photography, catering, decoration, sound and lighting, venue, cake, transport.</p>
                      </div>
                      <div className="field">
                        <label className="field-label" htmlFor="business-registration">Business Registration Number (BRN)</label>
                        <input
                          className="text-input"
                          id="business-registration"
                          type="text"
                          placeholder="e.g. PV 00123456"
                          value={businessRegistrationNumber}
                          onChange={(event) => setBusinessRegistrationNumber(event.target.value)}
                          required
                        />
                      </div>

                      <p className="vendor-form-section">ID VERIFICATION</p>
                      <div className="field">
                        <label className="field-label" htmlFor="nic-number">NIC number</label>
                        <input
                          className="text-input"
                          id="nic-number"
                          type="text"
                          autoComplete="off"
                          placeholder="e.g. 199012345678"
                          value={nicNumber}
                          onChange={(event) => setNicNumber(event.target.value)}
                        />
                      </div>
                      <div className="vendor-upload-divider"><span>or</span></div>
                      <label className="vendor-upload" htmlFor="identity-document">
                        <strong>{identityDocument ? identityDocument.name : "Upload NIC or passport (front and back)"}</strong>
                        <span>JPG, PNG or PDF, up to 5 MB</span>
                        <input
                          id="identity-document"
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                          onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            if (file && file.size > 5 * 1024 * 1024) {
                              setIdentityDocument(null);
                              event.target.value = "";
                              setError("Your ID document must be 5 MB or smaller.");
                              return;
                            }
                            const extension = file?.name.split(".").pop()?.toLowerCase();
                            if (file && !["jpg", "jpeg", "png", "pdf"].includes(extension ?? "")) {
                              setIdentityDocument(null);
                              event.target.value = "";
                              setError("Upload your ID as a JPG, PNG, or PDF file.");
                              return;
                            }
                            setIdentityDocument(file);
                            resetMessages();
                          }}
                        />
                      </label>
                      <p className="vendor-document-note">Demo mode: identity documents are not uploaded or saved. A secure verification service is not connected yet.</p>
                    </>
                  )}
                  {mode === "signup" && role === "Client" && (
                    <div className="field-row">
                      <div className="field">
                        <label className="field-label" htmlFor="full-name">Full name</label>
                        <input
                          className="text-input"
                          id="full-name"
                          type="text"
                          autoComplete="name"
                          placeholder="e.g. Alex Morgan"
                          value={fullName}
                          onChange={(event) => setFullName(event.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}
                  {(mode === "login" || mode === "signup" && role === "Client") && (
                    <div className="field">
                      <label className="field-label" htmlFor="email">Email address</label>
                      <input
                        className="text-input"
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                      />
                    </div>
                  )}
                  {mode === "signup" && role === "Vendor" && <p className="vendor-form-section">PASSWORD</p>}
                  <div className="field-row">
                    <div className="field">
                      <label className="field-label" htmlFor="password">Password</label>
                      <input
                        className="text-input"
                        id="password"
                        type="password"
                        autoComplete={mode === "signup" ? "new-password" : "current-password"}
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        minLength={8}
                        required
                      />
                    </div>
                    {mode === "signup" && (
                      <div className="field">
                        <label className="field-label" htmlFor="confirm-password">Confirm password</label>
                        <input
                          className="text-input"
                          id="confirm-password"
                          type="password"
                          autoComplete="new-password"
                          placeholder={role === "Vendor" ? "Repeat password" : "Enter it again"}
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          minLength={8}
                          required
                        />
                      </div>
                    )}
                  </div>
                  {mode === "login" && (
                    <div className="login-options">
                      <label className="remember-email">
                        <input
                          type="checkbox"
                          checked={rememberEmail}
                          onChange={(event) => setRememberEmail(event.target.checked)}
                        />
                        <span>Remember my email</span>
                      </label>
                      <button className="inline-button forgot-link" type="button" onClick={openForgotPassword}>Forgot password?</button>
                    </div>
                  )}
                  {mode === "signup" && (
                    <>
                      <p className="field-hint password-hint">
                        Use 8+ characters, including uppercase, lowercase, and a number.
                      </p>
                      {role === "Vendor" && (
                        <label className="vendor-terms">
                          <input
                            type="checkbox"
                            checked={acceptedVendorTerms}
                            onChange={(event) => setAcceptedVendorTerms(event.target.checked)}
                            required
                          />
                          <span>I accept the Vendor Terms and 5–10% payout commission.</span>
                        </label>
                      )}
                    </>
                  )}
                  {error && <p className="form-alert error-alert" role="alert">{error}</p>}
                  {notice && <p className="form-alert success-alert" role="status">{notice}</p>}
                  <button className="primary-button" type="submit" disabled={busy}>
                    {busy ? "Please wait..." : mode === "signup" ? role === "Vendor" ? "Create vendor account" : "Create account" : "Log in"}
                    {!busy && <span aria-hidden="true">→</span>}
                  </button>
                  {mode === "login" && (
                    <>
                      <div className="auth-divider"><span>or</span></div>
                      <button className="google-button" type="button" onClick={() => {
                        setStep("google");
                        resetMessages();
                      }}>
                        <svg className="google-button-mark" width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                          <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.5 9.5 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.9 6.1-15Z" />
                          <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z" />
                          <path fill="#FBBC05" d="M12.6 27.7a12 12 0 0 1 0-7.4V15H5.8a20 20 0 0 0 0 18l6.8-5.3Z" />
                          <path fill="#EA4335" d="M24 11.9c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.8 29.5 4 24 4A20 20 0 0 0 5.8 15l6.8 5.3c1.6-4.8 6.1-8.4 11.4-8.4Z" />
                        </svg>
                        Continue with Google
                      </button>
                      <div className="login-signup-actions">
                        <button className="secondary-auth-button" type="button" onClick={() => {
                          setRole("Client");
                          switchMode("signup");
                        }}>Sign up as a client</button>
                        <button className="secondary-auth-button" type="button" onClick={() => {
                          setRole("Vendor");
                          switchMode("signup");
                        }}>Sign up as a vendor</button>
                      </div>
                    </>
                  )}
                </form>

                {mode === "signup" && <p className="switch-prompt">
                  Already have an account?{" "}
                  <button className="inline-button" type="button" onClick={() => switchMode("login")}>Log in</button>
                </p>}
              </>
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
