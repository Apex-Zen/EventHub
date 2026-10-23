"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
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
type Step = "form" | "verify" | "reset-request" | "reset-verify" | "reset-password" | "reset-success" | "dashboard";

type Account = {
  role: Role;
  fullName: string;
  email: string;
  passwordSalt: string;
  passwordHash: string;
  isVerified: boolean;
  profileDetail: string;
};

type VerificationCode = {
  value: string;
  expiresAt: number;
  attempts: number;
};

const ACCOUNTS_KEY = "eventhub.demo.accounts";
const CODE_LIFETIME_MS = 5 * 60 * 1000;
const MAX_CODE_ATTEMPTS = 5;

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

function roleProfileLabel(role: Role) {
  return role === "Vendor" ? "Business or service name" : "";
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
  const [mode, setMode] = useState<Mode>("signup");
  const [step, setStep] = useState<Step>("form");
  const [role, setRole] = useState<Role>("Client");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileDetail, setProfileDetail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationInput, setVerificationInput] = useState("");
  const [verificationCode, setVerificationCode] = useState<VerificationCode | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
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
        if (!passwordsMatch(password, confirmPassword)) {
          throw new Error(
            "Use at least 8 characters with an uppercase letter, a lowercase letter, and a number. Both password fields must match.",
          );
        }
        if (accounts.some((account) => getAccountKey(account.email, account.role) === accountKey)) {
          throw new Error("An account with this email already exists for this role. Sign in instead.");
        }
        if (role !== "Client" && !profileDetail.trim()) {
          throw new Error(`${roleProfileLabel(role)} is required.`);
        }

        const { salt, hash } = await hashPassword(password);
        const account: Account = {
          role,
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          passwordSalt: salt,
          passwordHash: hash,
          isVerified: false,
          profileDetail: profileDetail.trim(),
        };
        saveAccounts([...accounts, account]);
        createVerification(account, "Your verification code is ready below.");
        return;
      }

      const account = accounts.find(
        (item) => getAccountKey(item.email, item.role) === accountKey,
      );
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

      setActiveAccount(account);
      setStep("dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function handleResendCode() {
    resetMessages();
    setVerificationCode(makeVerificationCode());
    setVerificationInput("");
    setNotice(step === "reset-verify"
      ? "A new password reset code is ready. Previous codes are no longer valid."
      : "A new verification code is ready below. Previous codes are no longer valid.");
  }

  function checkVerificationCode() {
    resetMessages();
    if (!verificationCode) {
      setError("Request a new verification code to continue.");
      return false;
    }
    if (Date.now() > verificationCode.expiresAt) {
      setVerificationCode(null);
      setError("This code has expired. Request a new one to continue.");
      return false;
    }
    if (verificationCode.attempts >= MAX_CODE_ATTEMPTS) {
      setVerificationCode(null);
      setError("Too many incorrect attempts. Request a new code to continue.");
      return false;
    }
    if (verificationInput.trim() !== verificationCode.value) {
      const attempts = verificationCode.attempts + 1;
      setVerificationCode(attempts >= MAX_CODE_ATTEMPTS ? null : { ...verificationCode, attempts });
      setError(
        attempts >= MAX_CODE_ATTEMPTS
          ? "Too many incorrect attempts. Request a new code to continue."
          : `That code doesn't match. ${MAX_CODE_ATTEMPTS - attempts} attempts remaining.`,
      );
      return false;
    }

    return true;
  }

  function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!checkVerificationCode()) return;

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

  function beginPasswordReset() {
    setStep("reset-request");
    setVerificationCode(null);
    setVerificationInput("");
    resetMessages();
  }

  function handleResetRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    try {
      const account = readAccounts().find(
        (item) => getAccountKey(item.email, item.role) === getAccountKey(email, role),
      );
      if (!account) {
        throw new Error("We couldn't find an account with that email and account type.");
      }

      setEmail(account.email);
      setVerificationCode(makeVerificationCode());
      setVerificationInput("");
      setStep("reset-verify");
      setNotice("Enter the password reset code to continue.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn't start password reset. Please try again.");
    }
  }

  function handleResetVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!checkVerificationCode()) return;

    const account = readAccounts().find(
      (item) => getAccountKey(item.email, item.role) === getAccountKey(email, role),
    );
    if (!account) {
      setVerificationCode(null);
      setError("We couldn't find that account. Start password reset again.");
      setStep("reset-request");
      return;
    }

    setVerificationCode(null);
    setVerificationInput("");
    setStep("reset-password");
    resetMessages();
  }

  async function handlePasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();
    setBusy(true);

    try {
      if (!passwordsMatch(newPassword, confirmNewPassword)) {
        throw new Error("Use at least 8 characters with an uppercase letter, a lowercase letter, and a number. Both password fields must match.");
      }

      const accounts = readAccounts();
      const accountKey = getAccountKey(email, role);
      if (!accounts.some((item) => getAccountKey(item.email, item.role) === accountKey)) {
        throw new Error("We couldn't find that account. Start password reset again.");
      }

      const { salt, hash } = await hashPassword(newPassword);
      saveAccounts(accounts.map((item) => getAccountKey(item.email, item.role) === accountKey
        ? { ...item, passwordSalt: salt, passwordHash: hash }
        : item,
      ));
      setNewPassword("");
      setConfirmNewPassword("");
      setStep("reset-success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn't update your password. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setStep("form");
    setVerificationCode(null);
    setVerificationInput("");
    setNewPassword("");
    setConfirmNewPassword("");
    resetMessages();
  }

  function renderPasswordReset() {
    if (step === "reset-request") {
      return (
        <>
          <button className="back-button" type="button" onClick={() => { setStep("form"); resetMessages(); }}>
            <span aria-hidden="true">←</span> Back to sign in
          </button>
          <p className="eyebrow">ACCOUNT RECOVERY</p>
          <h2>Reset your password</h2>
          <p className="form-subtitle">Enter the email and account type associated with your account.</p>
          <form className="auth-form" onSubmit={handleResetRequest}>
            <div className="field">
              <label className="field-label" htmlFor="reset-email">Email address</label>
              <input className="text-input" id="reset-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="reset-role">Account type</label>
              <select className="text-input" id="reset-role" value={role} onChange={(event) => setRole(event.target.value as Role)}>
                {roles.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
              </select>
            </div>
            {error && <p className="form-alert error-alert" role="alert">{error}</p>}
            <button className="primary-button" type="submit">Continue <span aria-hidden="true">→</span></button>
          </form>
        </>
      );
    }

    if (step === "reset-verify") {
      return (
        <>
          <button className="back-button" type="button" onClick={() => { setStep("reset-request"); resetMessages(); }}>
            <span aria-hidden="true">←</span> Change email
          </button>
          <p className="eyebrow">ACCOUNT RECOVERY</p>
          <h2>Enter your reset code</h2>
          <p className="form-subtitle">Enter the 6-digit password reset code for <strong>{email}</strong>.</p>
          <div className="verification-code-box" role="status">
            <span className="verification-code-label">PASSWORD RESET CODE</span>
            <strong className="verification-code-value">{verificationCode?.value ?? "------"}</strong>
            <span className="verification-code-note">Expires in five minutes.</span>
          </div>
          <form className="auth-form" onSubmit={handleResetVerify}>
            <div className="field">
              <label className="field-label" htmlFor="reset-code">Verification code</label>
              <input className="text-input code-input" id="reset-code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="000000" value={verificationInput} onChange={(event) => setVerificationInput(event.target.value.replace(/\D/g, ""))} required />
            </div>
            <p className="field-hint">Code expires in 5 minutes. {verificationCode ? `${MAX_CODE_ATTEMPTS - verificationCode.attempts} attempts available.` : "Request a new code."}</p>
            {error && <p className="form-alert error-alert" role="alert">{error}</p>}
            {notice && <p className="form-alert success-alert" role="status">{notice}</p>}
            <button className="primary-button" type="submit" disabled={!verificationCode}>Verify code <span aria-hidden="true">→</span></button>
          </form>
          <p className="switch-prompt">Need another code? <button className="inline-button" type="button" onClick={handleResendCode}>Send a new code</button></p>
        </>
      );
    }

    if (step === "reset-password") {
      return (
        <>
          <p className="eyebrow">ACCOUNT RECOVERY</p>
          <h2>Choose a new password</h2>
          <p className="form-subtitle">Create a strong password you haven&apos;t used before.</p>
          <form className="auth-form" onSubmit={handlePasswordReset}>
            <div className="field">
              <label className="field-label" htmlFor="new-password">New password</label>
              <input className="text-input" id="new-password" type="password" autoComplete="new-password" minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="confirm-new-password">Confirm new password</label>
              <input className="text-input" id="confirm-new-password" type="password" autoComplete="new-password" minLength={8} value={confirmNewPassword} onChange={(event) => setConfirmNewPassword(event.target.value)} required />
            </div>
            <p className="field-hint">Use 8+ characters, including uppercase, lowercase, and a number.</p>
            {error && <p className="form-alert error-alert" role="alert">{error}</p>}
            <button className="primary-button" type="submit" disabled={busy}>{busy ? "Updating password..." : "Update password"}</button>
          </form>
        </>
      );
    }

    return (
      <div className="reset-success">
        <div className="success-icon" aria-hidden="true">✓</div>
        <p className="eyebrow">PASSWORD UPDATED</p>
        <h2>You&apos;re all set</h2>
        <p className="form-subtitle">Your password has been changed. Sign in with your new password.</p>
        <button className="primary-button" type="button" onClick={() => switchMode("login")}>Return to sign in</button>
      </div>
    );
  }

  function signOut() {
    setActiveAccount(null);
    setStep("form");
    setMode("login");
    setPassword("");
    setConfirmPassword("");
    resetMessages();
  }

  if (step === "dashboard" && activeAccount) {
    return (
      <main className="auth-page">
        <header className="topbar">
          <Link className="brand" href="/" aria-label="EventHub home">
            <LocationIcon className="brand-location-icon" />
            <span>event<span className="brand-accent">hub</span></span>
          </Link>
          <button className="text-button" type="button" onClick={signOut}>Sign out</button>
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

  return (
    <main className="auth-page">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="EventHub home">
          <LocationIcon className="brand-location-icon" />
          <span>event<span className="brand-accent">hub</span></span>
        </Link>
        <p className="topbar-note">Make every gathering matter.</p>
      </header>

      <section className="auth-shell" aria-label="EventHub account access">
        <aside className={`intro-panel intro-panel-${step === "verify" || step.startsWith("reset-") ? "verify" : mode === "login" ? "login" : role === "Vendor" ? "vendor" : "client"}`}>
          <div className="intro-orb intro-orb-one" />
          <div className="intro-orb intro-orb-two" />
          <div className="intro-content">
            <span className="intro-kicker"><span className="kicker-dot" /> EVENTHUB · MADE FOR GATHERINGS</span>
            <h1>
              {step === "reset-request" ? <>Back to<br /><em>your plans.</em></> : step === "reset-verify" ? <>Check your<br /><em>email.</em></> : step === "reset-password" ? <>A fresh<br /><em>start.</em></> : step === "reset-success" ? <>You&apos;re all<br /><em>set.</em></> : step === "verify" ? <>One last<br /><em>step.</em></> : mode === "login" ? <>Welcome<br /><em>back.</em></> : role === "Vendor" ? <>Get booked for<br /><em>the good days.</em></> : <>Your event,<br /><em>planned with care.</em></>}
            </h1>
            <p className="intro-copy">
              {step.startsWith("reset-") ? "Secure access to your EventHub account." : step === "verify" ? "A quick email check, then you’re ready to bring your next event to life." : getRoleMessage(role)}
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
            {step.startsWith("reset-") ? renderPasswordReset() : step === "verify" ? (
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
                <h2>{mode === "signup" ? "Create your account" : "Sign in to EventHub"}</h2>
                <p className="form-subtitle">
                  {mode === "signup"
                    ? "Choose your role and let’s get your event journey started."
                    : "Enter your details to continue to your account."}
                </p>

                <div className="role-heading">
                  <span className="field-label">I&apos;m joining as</span>
                  <span className="role-count">CHOOSE ONE</span>
                </div>
                <div className="role-grid" role="group" aria-label="Choose your account role">
                  {roles.map((item) => (
                    <button
                      className={`role-option${role === item.id ? " role-option-selected" : ""}`}
                      type="button"
                      key={item.id}
                      aria-pressed={role === item.id}
                      onClick={() => {
                        setRole(item.id);
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
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                  {mode === "signup" && (
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
                      {role !== "Client" && (
                        <div className="field">
                          <label className="field-label" htmlFor="profile-detail">{roleProfileLabel(role)}</label>
                          <input
                            className="text-input"
                            id="profile-detail"
                            type="text"
                            autoComplete="organization"
                            placeholder="Enter a name"
                            value={profileDetail}
                            onChange={(event) => setProfileDetail(event.target.value)}
                            required
                          />
                        </div>
                      )}
                    </div>
                  )}
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
                  <div className="field-row">
                    <div className="field">
                      <div className="password-label-row">
                        <label className="field-label" htmlFor="password">Password</label>
                        {mode === "login" && <button className="forgot-password-link" type="button" onClick={beginPasswordReset}>Forgot password?</button>}
                      </div>
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
                          placeholder="Enter it again"
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          minLength={8}
                          required
                        />
                      </div>
                    )}
                  </div>
                  {mode === "signup" && (
                    <p className="field-hint password-hint">
                      Use 8+ characters, including uppercase, lowercase, and a number.
                    </p>
                  )}
                  {error && <p className="form-alert error-alert" role="alert">{error}</p>}
                  {notice && <p className="form-alert success-alert" role="status">{notice}</p>}
                  <button className="primary-button" type="submit" disabled={busy}>
                    {busy ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
                    {!busy && <span aria-hidden="true">→</span>}
                  </button>
                </form>

                <p className="switch-prompt">
                  {mode === "signup" ? "Already have an account?" : "New to EventHub?"}{" "}
                  <button
                    className="inline-button"
                    type="button"
                    onClick={() => switchMode(mode === "signup" ? "login" : "signup")}
                  >
                    {mode === "signup" ? "Sign in" : "Create an account"}
                  </button>
                </p>
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
