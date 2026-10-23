"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent, type KeyboardEvent, type ClipboardEvent } from "react";
import {
  activateLocalAccount,
  authenticateLocalAccount,
  changeLocalPassword,
  createDemoCode,
  endLocalSession,
  findLocalAccount,
  prepareLocalAccount,
  readLocalSession,
  startLocalSession,
  type LocalAccount,
  type LocalProfile,
} from "./local-auth";

type AccountType = "Client" | "Vendor";
type FormMode = "signup" | "login" | "forgot" | "resetPassword";
type VerificationPurpose = "signup" | "passwordReset";

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function PinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

function VisibilityIcon({ visible }: { visible: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      {visible ? (
        <>
          <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
          <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.5 0 9 7 9 7a16 16 0 0 1-2.2 3.1M6.2 6.2C3.9 7.8 3 12 3 12s3.5 7 9 7a10 10 0 0 0 3.5-.6" />
        </>
      ) : (
        <>
          <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" />
          <circle cx="12" cy="12" r="2.5" />
        </>
      )}
    </svg>
  );
}

export default function Home() {
  const [accountType, setAccountType] = useState<AccountType>("Client");
  const [formMode, setFormMode] = useState<FormMode>("signup");
  const [notice, setNotice] = useState("");
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [authUser, setAuthUser] = useState<LocalAccount | null>(null);
  const [email, setEmail] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [identityFiles, setIdentityFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [verificationError, setVerificationError] = useState("");
  const [verificationNotice, setVerificationNotice] = useState("");
  const [verificationDemoCode, setVerificationDemoCode] = useState("");
  const [verificationPurpose, setVerificationPurpose] = useState<VerificationPurpose>("signup");
  const [pendingAccount, setPendingAccount] = useState<LocalAccount | null>(null);
  const [resetAccount, setResetAccount] = useState<LocalAccount | null>(null);
  const [codeTimeLeft, setCodeTimeLeft] = useState(600);
  const [resendTimeLeft, setResendTimeLeft] = useState(45);
  const identityInputRef = useRef<HTMLInputElement>(null);
  const verificationInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const passwordCriteria = [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const passwordStrength = passwordCriteria.filter(Boolean).length;
  const passwordStrengthLabel = ["Add a password", "Weak", "Fair", "Good", "Strong"][passwordStrength];

  useEffect(() => {
    try {
      setAuthUser(readLocalSession());
    } catch (error) {
      if (error instanceof Error) setAuthError(error.message);
      else throw error;
    } finally {
      setAuthReady(true);
    }
  }, []);

  useEffect(() => {
    document.title = authUser
      ? `EventHub | ${authUser.profile.accountType} dashboard`
      : showVerification
        ? "EventHub | Verify your email"
        : formMode === "forgot" || formMode === "resetPassword"
          ? "EventHub | Reset your password"
          : formMode === "login"
            ? "EventHub | Log in"
            : "EventHub | Create your account";
  }, [authUser, formMode, showVerification]);

  useEffect(() => {
    if (!showVerification) return;

    verificationInputRefs.current[0]?.focus();
    const interval = window.setInterval(() => {
      setCodeTimeLeft((remaining) => Math.max(remaining - 1, 0));
      setResendTimeLeft((remaining) => Math.max(remaining - 1, 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [showVerification]);

  function processIdentityFiles(files: File[]) {
    const unsupportedFile = files.find((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      return !["jpg", "jpeg", "png", "pdf"].includes(extension ?? "");
    });
    const oversizedFile = files.find((file) => file.size > 5 * 1024 * 1024);

    if (files.length > 2) {
      if (identityInputRef.current) identityInputRef.current.value = "";
      setIdentityFiles([]);
      setUploadError("Choose up to two images, or combine both sides of your ID in one PDF.");
      return;
    }

    if (unsupportedFile) {
      if (identityInputRef.current) identityInputRef.current.value = "";
      setIdentityFiles([]);
      setUploadError(`${unsupportedFile.name} isn’t a supported file. Choose a JPG, PNG or PDF.`);
      return;
    }

    if (oversizedFile) {
      if (identityInputRef.current) identityInputRef.current.value = "";
      setIdentityFiles([]);
      setUploadError(`${oversizedFile.name} is larger than 5 MB. Please choose a smaller file.`);
      return;
    }

    setUploadError("");
    setIdentityFiles(files);
  }

  function handleIdentityFiles(event: ChangeEvent<HTMLInputElement>) {
    processIdentityFiles(Array.from(event.currentTarget.files ?? []));
  }

  function handleIdentityDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDraggingFiles(false);
    const files = Array.from(event.dataTransfer.files);
    if (identityInputRef.current && files.length > 0) {
      identityInputRef.current.files = event.dataTransfer.files;
    }
    processIdentityFiles(files);
  }

  function resetPasswordFeedback() {
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError("");
    setAuthError("");
    setNotice("");
    setAuthBusy(true);

    try {
      const formData = new FormData(event.currentTarget);
      const submittedEmail = String(formData.get("email") ?? email).trim().toLowerCase();

      if (formMode === "signup") {
        if (accountType === "Vendor" && identityFiles.length === 0) {
          setUploadError("Upload a photo or PDF of your national ID to continue.");
          return;
        }

        const submittedPassword = String(formData.get("password") ?? "");
        const confirmSubmittedPassword = String(formData.get("confirmPassword") ?? "");
        if (submittedPassword !== confirmSubmittedPassword) {
          setPasswordError("Your passwords don’t match. Please check and try again.");
          return;
        }

        const profile: LocalProfile = {
          firstName: String(formData.get("firstName") ?? "").trim(),
          lastName: String(formData.get("lastName") ?? "").trim(),
          email: submittedEmail,
          phone: String(formData.get("phone") ?? "").trim(),
          accountType,
          serviceCategory: accountType === "Vendor"
            ? String(formData.get("serviceCategory") ?? "")
            : "",
        };
        const prepared = await prepareLocalAccount(profile, submittedPassword);

        setPendingAccount(prepared.account);
        setPassword("");
        setConfirmPassword("");
        setResetAccount(null);
        setVerificationPurpose("signup");
        setVerificationEmail(submittedEmail);
        setVerificationDemoCode(prepared.code);
        setVerificationCode(["", "", "", "", "", ""]);
        setVerificationError("");
        setVerificationNotice("");
        setCodeTimeLeft(600);
        setResendTimeLeft(45);
        setShowVerification(true);
        return;
      }

      if (formMode === "login") {
        const account = await authenticateLocalAccount(
          submittedEmail,
          String(formData.get("password") ?? ""),
        );
        startLocalSession(account);
        setAuthUser(account);
        setShowVerification(false);
        setEmail(account.profile.email);
        return;
      }

      if (formMode === "forgot") {
        const account = findLocalAccount(submittedEmail);
        if (!account) {
          throw new Error("No saved demo account uses this email in this browser.");
        }
        setResetAccount(account);
        setPendingAccount(null);
        setVerificationPurpose("passwordReset");
        setVerificationEmail(account.profile.email);
        setVerificationDemoCode(createDemoCode());
        setVerificationCode(["", "", "", "", "", ""]);
        setVerificationError("");
        setVerificationNotice("");
        setCodeTimeLeft(600);
        setResendTimeLeft(45);
        setShowVerification(true);
        return;
      }

      const submittedPassword = String(formData.get("password") ?? "");
      const confirmSubmittedPassword = String(formData.get("confirmPassword") ?? "");
      if (submittedPassword !== confirmSubmittedPassword) {
        setPasswordError("Your passwords don’t match. Please check and try again.");
        return;
      }
      if (!resetAccount) {
        throw new Error("Password recovery expired. Start the recovery flow again.");
      }

      const updatedAccount = await changeLocalPassword(resetAccount.id, submittedPassword);
      startLocalSession(updatedAccount);
      setAuthUser(updatedAccount);
      setShowVerification(false);
      setEmail(updatedAccount.profile.email);
      setResetAccount(null);
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        throw error;
      }
    } finally {
      setAuthBusy(false);
    }
  }

  function switchMode(mode: FormMode) {
    setFormMode(mode);
    setNotice("");
    setAuthError("");
    setPasswordError("");
    setUploadError("");
    resetPasswordFeedback();
  }

  function handleVerificationDigit(index: number, value: string) {
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setVerificationCode((current) => current.map((digit, currentIndex) => currentIndex === index ? "" : digit));
      setVerificationError("");
      return;
    }

    const nextCode = [...verificationCode];
    const acceptedDigits = digits.slice(0, 6 - index);
    acceptedDigits.split("").forEach((digit, offset) => {
      nextCode[index + offset] = digit;
    });
    setVerificationCode(nextCode);
    setVerificationError("");
    setVerificationNotice("");
    verificationInputRefs.current[Math.min(index + acceptedDigits.length, 5)]?.focus();
  }

  function handleVerificationKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !verificationCode[index] && index > 0) {
      verificationInputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowLeft" && index > 0) {
      verificationInputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < 5) {
      verificationInputRefs.current[index + 1]?.focus();
    }
  }

  function handleVerificationPaste(event: ClipboardEvent<HTMLInputElement>, index: number) {
    const pastedDigits = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pastedDigits) return;

    event.preventDefault();
    handleVerificationDigit(index, pastedDigits);
  }

  function handleVerificationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setVerificationNotice("");

    if (codeTimeLeft === 0) {
      setVerificationError("This code has expired. Request a new code to continue.");
      return;
    }

    if (verificationCode.some((digit) => !digit)) {
      setVerificationError("Enter all six digits to continue.");
      return;
    }

    if (verificationCode.join("") !== verificationDemoCode) {
      setVerificationError("That code doesn’t match. Check the preview code and try again.");
      return;
    }

    setVerificationError("");
    if (verificationPurpose === "passwordReset") {
      setShowVerification(false);
      setFormMode("resetPassword");
      setPassword("");
      setConfirmPassword("");
      setNotice("Code accepted. Choose a new password.");
      return;
    }

    if (!pendingAccount) {
      setVerificationError("Your sign-up session expired. Start again to create your account.");
      return;
    }

    try {
      const account = activateLocalAccount(pendingAccount);
      startLocalSession(account);
      setAuthUser(account);
      setPendingAccount(null);
      setShowVerification(false);
      setIdentityFiles([]);
    } catch (error) {
      if (error instanceof Error) setVerificationError(error.message);
      else throw error;
    }
  }

  function handleResendCode() {
    if (resendTimeLeft > 0) return;
    setVerificationDemoCode(createDemoCode());
    setVerificationCode(["", "", "", "", "", ""]);
    setVerificationError("");
    setVerificationNotice("A new code is ready.");
    setCodeTimeLeft(600);
    setResendTimeLeft(45);
    verificationInputRefs.current[0]?.focus();
  }

  function returnToSignup() {
    setShowVerification(false);
    setVerificationCode(["", "", "", "", "", ""]);
    setVerificationError("");
    setVerificationNotice("");
    setVerificationDemoCode("");
    setPendingAccount(null);
    setResetAccount(null);
    setFormMode(verificationPurpose === "passwordReset" ? "forgot" : "signup");
    setNotice("");
  }

  function handleLogout() {
    try {
      endLocalSession();
      setAuthUser(null);
      setFormMode("login");
      setShowVerification(false);
      setVerificationDemoCode("");
      setVerificationCode(["", "", "", "", "", ""]);
      setPendingAccount(null);
      setResetAccount(null);
      setIdentityFiles([]);
      if (identityInputRef.current) identityInputRef.current.value = "";
      setNotice("You’ve been signed out.");
      setAuthError("");
      resetPasswordFeedback();
    } catch (error) {
      if (error instanceof Error) setAuthError(error.message);
      else throw error;
    }
  }

  return (
    <main className="signup-page">
      <div className="signup-container">
        <header className="signup-header">
          <a className="signup-brand" href="/" aria-label="EventHub home">
            <span className="signup-brand-mark"><PinIcon /></span>
            <span>event<span>hub</span></span>
          </a>
          {!authReady ? (
            <span className="verification-step-label">LOADING</span>
          ) : authUser ? (
            <div className="signup-header-action">
              <span>{authUser.profile.email}</span>
              <button className="inline-link" onClick={handleLogout} type="button">Log out</button>
            </div>
          ) : showVerification ? (
            <span className="verification-step-label">EMAIL VERIFICATION · STEP 2 OF 2</span>
          ) : formMode === "forgot" || formMode === "resetPassword" ? (
            <div className="signup-header-action">
              <span>Remembered your password?</span>
              <button className="inline-link" onClick={() => switchMode("login")} type="button">Log in</button>
            </div>
          ) : (
            <div className="signup-header-action">
              <span>{formMode === "signup" ? "Already have an account?" : "New to EventHub?"}</span>
              <button className="inline-link" type="button" onClick={() => switchMode(formMode === "signup" ? "login" : "signup")}>
                {formMode === "signup" ? "Log in" : "Create account"}
              </button>
            </div>
          )}
        </header>

        {!authReady ? (
          <div className="signup-layout auth-loading" role="status">Loading your account…</div>
        ) : authUser ? (
          <div className="signup-layout dashboard-layout">
            <section className={`signup-story${authUser.profile.accountType === "Vendor" ? " signup-story-vendor" : ""}`} aria-label="EventHub dashboard">
              <div className="story-image" />
              <div className="story-shade" />
              <div className="story-copy">
                <span className="story-eyebrow">WELCOME TO EVENTHUB</span>
                <h2>{authUser.profile.accountType === "Vendor" ? "Your next great booking starts here." : "Your next great gathering starts here."}</h2>
                <p>{authUser.profile.accountType === "Vendor"
                  ? "Your vendor profile is ready to explore."
                  : "Your account is ready to explore."}</p>
              </div>
            </section>
            <section className="dashboard-content-panel" aria-labelledby="dashboard-title">
              <span className="account-state-badge">ACCOUNT ACTIVE</span>
              <h1 id="dashboard-title">Welcome, {authUser.profile.firstName}</h1>
              <p className="dashboard-intro">
                You’re signed in as a <strong>{authUser.profile.accountType.toLowerCase()}</strong>.
              </p>
              <div className="dashboard-profile">
                <div className="dashboard-avatar" aria-hidden="true">
                  {authUser.profile.firstName.charAt(0)}{authUser.profile.lastName.charAt(0)}
                </div>
                <div>
                  <strong>{authUser.profile.firstName} {authUser.profile.lastName}</strong>
                  <span>{authUser.profile.email}</span>
                </div>
              </div>
              <div className="dashboard-details">
                <div><span>Account type</span><strong>{authUser.profile.accountType}</strong></div>
                <div><span>Phone</span><strong>{authUser.profile.phone}</strong></div>
                {authUser.profile.accountType === "Vendor" && (
                  <div><span>Service category</span><strong>{authUser.profile.serviceCategory || "Not provided"}</strong></div>
                )}
              </div>
              <button className="submit-button dashboard-logout" onClick={handleLogout} type="button">Log out</button>
            </section>
          </div>
        ) : (
          <>
        <div className={`signup-layout otp-layout${showVerification ? "" : " signup-screen-hidden"}`}>
            <section className="signup-story otp-story" aria-label="EventHub verification">
              <div className="story-image" />
              <div className="story-shade" />
              <div className="story-copy">
                <span className="story-eyebrow">ONE LAST STEP</span>
                <h2>Almost there. Your next great event is waiting.</h2>
                <p>A quick email check helps keep your EventHub account safe.</p>
              </div>
              <span className="story-image-credit">PLAN TOGETHER. CELEBRATE TOGETHER.</span>
            </section>

            <section className="otp-panel" aria-labelledby="otp-title">
              <span className="otp-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="2.5" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </span>
              <span className="form-section-label">{verificationPurpose === "signup" ? "EMAIL VERIFICATION" : "PASSWORD RECOVERY"}</span>
              <h1 id="otp-title">{verificationPurpose === "signup" ? "Check your email" : "Verify your recovery code"}</h1>
              <p className="otp-description">
                Enter the 6-digit {verificationPurpose === "signup" ? "verification" : "recovery"} code for <strong>{verificationEmail}</strong>. It expires in 10 minutes.
              </p>

              <div className="verification-code-preview" aria-label="Verification code">
                {verificationDemoCode.split("").map((digit, index) => <span key={index}>{digit}</span>)}
              </div>

              <form className="otp-form" onSubmit={handleVerificationSubmit}>
                <div className="otp-digit-group" role="group" aria-label="Six-digit verification code">
                  {verificationCode.map((digit, index) => (
                    <input
                      aria-label={`Verification code digit ${index + 1}`}
                      aria-invalid={Boolean(verificationError)}
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      className={verificationError ? "otp-digit otp-digit-error" : "otp-digit"}
                      inputMode="numeric"
                      key={index}
                      maxLength={1}
                      onChange={(event) => handleVerificationDigit(index, event.currentTarget.value)}
                      onKeyDown={(event) => handleVerificationKeyDown(index, event)}
                      onPaste={(event) => handleVerificationPaste(event, index)}
                      ref={(element) => { verificationInputRefs.current[index] = element; }}
                      value={digit}
                    />
                  ))}
                </div>

                {verificationError && <p className="otp-error" role="alert">{verificationError}</p>}
                {verificationNotice && <p className="otp-feedback" role="status">{verificationNotice}</p>}

                <p className={`otp-expiry${codeTimeLeft === 0 ? " otp-expiry-ended" : ""}`} aria-live="polite">
                  {codeTimeLeft === 0
                    ? "This code has expired."
                    : <>Code expires in <strong>{formatCountdown(codeTimeLeft)}</strong></>}
                </p>

                <button className="submit-button otp-submit" type="submit">
                  {verificationPurpose === "signup" ? "Verify email" : "Verify recovery code"}
                </button>
              </form>

              <div className="otp-resend">
                <span>Didn’t get your code?</span>
                {resendTimeLeft > 0 ? (
                  <span className="otp-resend-countdown">Resend code in {formatCountdown(resendTimeLeft)}</span>
                ) : (
                  <button className="otp-text-button" onClick={handleResendCode} type="button">Resend code</button>
                )}
              </div>

              <p className="otp-start-again">
                {verificationPurpose === "signup" ? "Signed up with the wrong email?" : "Want to use a different email?"}{" "}
                <button className="otp-text-button" onClick={returnToSignup} type="button">Start again</button>
              </p>
            </section>
        </div>
        <div className={`signup-layout${showVerification ? " signup-screen-hidden" : ""}`}>
          <section className={`signup-story${accountType === "Vendor" ? " signup-story-vendor" : ""}`} aria-label="EventHub story">
            <div
              className="story-image"
              style={accountType === "Vendor" ? {
                backgroundImage: "url(https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=85)",
              } : undefined}
            />
            <div className="story-shade" />
            <div className="story-copy">
              <span className="story-eyebrow">{accountType === "Vendor" ? "YOUR NEXT BOOKING STARTS HERE" : "THE GOOD PART STARTS HERE"}</span>
              <h2>
                {accountType === "Client"
                  ? "Bring your people together. We’ll help with the details."
                  : "Get booked for the dates you’re free."}
              </h2>
              <p>
                {accountType === "Client"
                  ? "Discover trusted vendors, keep your plans in one place, and enjoy the moments you worked so hard to make."
                  : "Showcase your services, connect with the right clients, and grow your event business on your own terms."}
              </p>
            </div>
            <span className="story-image-credit">
              {accountType === "Vendor" ? "GOOD WORK. GREAT CLIENTS." : "PLAN TOGETHER. CELEBRATE TOGETHER."}
            </span>
          </section>

          <section className="signup-form-panel" aria-labelledby="signup-title">
            <div className="signup-heading">
              {formMode === "signup" && <span className="form-section-label">{accountType === "Vendor" ? "VENDOR ACCOUNT" : "CLIENT ACCOUNT"}</span>}
              {formMode === "forgot" && <span className="form-section-label">PASSWORD RECOVERY</span>}
              {formMode === "resetPassword" && <span className="form-section-label">CHOOSE A NEW PASSWORD</span>}
              <h1 id="signup-title">
                {formMode === "login"
                  ? "Welcome back"
                  : formMode === "forgot"
                    ? "Reset your password"
                    : formMode === "resetPassword"
                      ? "Create a new password"
                      : accountType === "Vendor"
                        ? "Create a vendor account"
                        : "Create your account"}
              </h1>
              <p>
                {formMode === "login"
                  ? "Log in to pick up where your next great event begins."
                  : formMode === "forgot"
                    ? "Enter the email address associated with your account."
                    : formMode === "resetPassword"
                      ? `Choose a new password for ${verificationEmail}.`
                  : accountType === "Vendor"
                    ? "Clients find you by category, district, budget and free dates."
                    : "Plan private events or sell tickets for public ones."}
              </p>
            </div>

            {formMode === "signup" && (
              <div className="account-tabs" role="group" aria-label="Choose account type">
                {(["Client", "Vendor"] as const).map((type) => (
                  <button
                    aria-pressed={accountType === type}
                    className={`account-tab${accountType === type ? " account-tab-active" : ""}`}
                    key={type}
                    onClick={() => {
                      setAccountType(type);
                      setNotice("");
                      setPasswordError("");
                      setUploadError("");
                      setIdentityFiles([]);
                      resetPasswordFeedback();
                    }}
                    type="button"
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}

            <form className="signup-form" onSubmit={handleSubmit}>
              {formMode === "signup" && (
                <>
                  {accountType === "Vendor" && <span className="form-section-label form-section-divider">ABOUT YOU</span>}
                  <div className="form-field-row">
                    <label className="form-field">
                      <span>First name</span>
                      <input autoComplete="given-name" name="firstName" placeholder="e.g. Kasun" required />
                    </label>
                    <label className="form-field">
                      <span>Last name</span>
                      <input autoComplete="family-name" name="lastName" placeholder="e.g. Fernando" required />
                    </label>
                  </div>
                </>
              )}

              {formMode === "signup" && (
                <div className="form-field-row">
                  <label className="form-field">
                    <span>Email</span>
                    <input autoComplete="email" name="email" onChange={(event) => setEmail(event.currentTarget.value)} placeholder={accountType === "Vendor" ? "you@business.lk" : "you@example.com"} type="email" value={email} required />
                  </label>
                  <label className="form-field">
                    <span>Phone number</span>
                    <input autoComplete="tel" name="phone" placeholder="+94 77 123 4567" type="tel" required />
                  </label>
                </div>
              )}

              {(formMode === "login" || formMode === "forgot") && (
                <label className="form-field">
                  <span>Email</span>
                  <input autoComplete="email" name="email" onChange={(event) => setEmail(event.currentTarget.value)} placeholder="you@example.com" type="email" value={email} required />
                </label>
              )}
              {formMode === "resetPassword" && (
                <p className="recovery-email-note">Choose a new password for <strong>{verificationEmail}</strong>.</p>
              )}

              {formMode === "signup" && accountType === "Vendor" && (
                <>
                  <span className="form-section-label form-section-divider">YOUR BUSINESS</span>
                  <label className="form-field">
                    <span>Service category</span>
                    <select autoComplete="off" defaultValue="" name="serviceCategory" required>
                      <option disabled value="">Choose a category</option>
                      <option>Photography & videography</option>
                      <option>Event planning & coordination</option>
                      <option>Catering & food</option>
                      <option>Venue & accommodation</option>
                      <option>Flowers & decoration</option>
                      <option>Music & entertainment</option>
                      <option>Beauty & styling</option>
                      <option>Transport</option>
                      <option>Other event services</option>
                    </select>
                    <span className="field-hint">Choose the service clients should find you for.</span>
                  </label>
                  <label className="form-field">
                    <span>Business Registration Number (BRN)</span>
                    <input autoComplete="off" name="businessRegistrationNumber" placeholder="e.g. PV 0023456" required />
                  </label>

                  <span className="form-section-label form-section-divider">IDENTITY VERIFICATION</span>
                  <label className="form-field">
                    <span>NIC number</span>
                    <input autoComplete="off" name="nicNumber" placeholder="e.g. 199012345678" required />
                  </label>
                  <label
                    className={`identity-upload${uploadError ? " identity-upload-error" : ""}${isDraggingFiles ? " identity-upload-dragging" : ""}`}
                    onDragEnter={(event) => {
                      event.preventDefault();
                      setIsDraggingFiles(true);
                    }}
                    onDragLeave={(event) => {
                      event.preventDefault();
                      if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
                        setIsDraggingFiles(false);
                      }
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={handleIdentityDrop}
                  >
                    <input
                      accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                      aria-label="Upload national ID"
                      multiple
                      name="identityDocuments"
                      onChange={handleIdentityFiles}
                      ref={identityInputRef}
                      required
                      type="file"
                    />
                    <span className="upload-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M12 15V3m0 0L8 7m4-4 4 4" />
                        <path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
                      </svg>
                    </span>
                    <strong>{identityFiles.length ? `${identityFiles.length} ${identityFiles.length === 1 ? "document" : "documents"} selected` : "Drop your ID here or browse files"}</strong>
                    <span className="upload-description">Front and back · JPG, PNG or PDF · up to 5 MB each</span>
                    {identityFiles.length > 0 && <span className="upload-file-list">{identityFiles.map((file) => file.name).join(" · ")}</span>}
                  </label>
                  {uploadError && <p className="form-error" role="alert">{uploadError}</p>}
                </>
              )}

              {formMode === "signup" && accountType === "Vendor" && (
                <span className="form-section-label form-section-divider">SECURE YOUR ACCOUNT</span>
              )}
              {formMode !== "forgot" && (
              <div className={`form-field-row${formMode === "login" || formMode === "resetPassword" ? " form-field-row-single" : ""}`}>
                <div className="form-field">
                  <label htmlFor="account-password">{formMode === "resetPassword" ? "New password" : "Password"}</label>
                  <div className="password-input-wrap">
                    <input
                      autoComplete={formMode === "login" ? "current-password" : "new-password"}
                      id="account-password"
                      minLength={formMode === "login" ? undefined : 8}
                      name="password"
                      onChange={(event) => setPassword(event.currentTarget.value)}
                      placeholder={formMode === "login" ? "Your password" : "At least 8 characters"}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      required
                    />
                    <button
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="password-visibility"
                      onClick={() => setShowPassword((visible) => !visible)}
                      type="button"
                    >
                      <VisibilityIcon visible={showPassword} />
                    </button>
                  </div>
                  {(formMode === "signup" || formMode === "resetPassword") && (
                    <span className="password-strength" aria-live="polite">
                      <span className="password-strength-bars" aria-hidden="true">
                        {passwordCriteria.map((_, index) => (
                          <span className={index < passwordStrength ? `strength-level-${passwordStrength}` : ""} key={index} />
                        ))}
                      </span>
                      <span>{passwordStrengthLabel}</span>
                    </span>
                  )}
                </div>
                {(formMode === "signup" || formMode === "resetPassword") && (
                  <div className="form-field">
                    <label htmlFor="confirm-password">Confirm password</label>
                    <div className="password-input-wrap">
                      <input
                        autoComplete="new-password"
                        id="confirm-password"
                        minLength={8}
                        name="confirmPassword"
                        onChange={(event) => setConfirmPassword(event.currentTarget.value)}
                        placeholder="Repeat password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        required
                      />
                      <button
                        aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                        className="password-visibility"
                        onClick={() => setShowConfirmPassword((visible) => !visible)}
                        type="button"
                      >
                        <VisibilityIcon visible={showConfirmPassword} />
                      </button>
                    </div>
                    {confirmPassword.length > 0 && (
                      <span className={`password-match${password === confirmPassword ? " password-match-success" : " password-match-error"}`} aria-live="polite">
                        {password === confirmPassword ? "Passwords match" : "Passwords don’t match yet"}
                      </span>
                    )}
                  </div>
                )}
              </div>
              )}
              {formMode === "login" && (
                <button
                  className="forgot-password-link"
                  onClick={() => switchMode("forgot")}
                  type="button"
                >
                  Forgot password?
                </button>
              )}

              {passwordError && <p className="form-error" role="alert">{passwordError}</p>}
              {authError && <p className="form-error" role="alert">{authError}</p>}

              {formMode === "signup" && accountType === "Client" && (
                <label className="terms-check">
                  <input name="terms" type="checkbox" required />
                  <span>I agree to the <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a></span>
                </label>
              )}
              {formMode === "signup" && accountType === "Vendor" && (
                <label className="terms-check">
                  <input name="terms" type="checkbox" required />
                  <span>I accept the <a href="#vendor-terms">Vendor Terms</a> and the <strong>5–10% payout commission</strong>.</span>
                </label>
              )}

              <button className="submit-button" disabled={authBusy} type="submit">
                {authBusy
                  ? "Please wait…"
                  : formMode === "login"
                    ? "Log in"
                    : formMode === "forgot"
                      ? "Continue"
                      : formMode === "resetPassword"
                        ? "Save new password"
                        : accountType === "Vendor"
                          ? "Create vendor account"
                          : "Create account"}
              </button>
            </form>

            {notice && <p className="auth-notice" role="status">{notice}</p>}
            {formMode === "login" && (
              <p className="signup-footnote">Sign in to your EventHub account.</p>
            )}
          </section>
        </div>
          </>
        )}
      </div>
    </main>
  );
}
