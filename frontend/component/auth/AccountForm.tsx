import PasswordFields from "../PasswordFields";
import { roles } from "../../lib/auth";
import TextField from "../TextField";
import FormAlert from "../FormAlert";


import type { Role, Mode } from "../../lib/auth";
import type { FormEvent, ReactNode } from "react";

export type AccountFormProps = {
  values: {
    mode: Mode;
    role: Role;
    fullName: string;
    username: string;
    email: string;
    phoneNumber: string;
    acceptedVendorTerms: boolean;
    password: string;
    confirmPassword: string;
    rememberEmail: boolean;
    error: string;
    notice: string;
    busy: boolean;
  };
  actions: {
    openForgotPassword: () => void;
    setFullName: (value: string) => void;
    setUsername: (value: string) => void;
    setEmail: (value: string) => void;
    setPhoneNumber: (value: string) => void;
    setAcceptedVendorTerms: (value: boolean) => void;
    setPassword: (value: string) => void;
    setConfirmPassword: (value: string) => void;
    setRememberEmail: (value: boolean) => void;
    changeRole: (role: Role) => void;
    openGoogle: () => void;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    switchMode: (mode: Mode) => void;
  };
  vendorFields: ReactNode;
};

export default function AccountForm({ values, actions, vendorFields }: AccountFormProps) {
  const { mode, role, fullName, username, email, phoneNumber, acceptedVendorTerms, password, confirmPassword, rememberEmail, error, notice, busy } = values;
  const { openForgotPassword, setFullName, setUsername, setEmail, setPhoneNumber, setAcceptedVendorTerms, setPassword, setConfirmPassword, setRememberEmail, changeRole, openGoogle, handleSubmit, switchMode } = actions;
  return (

                  <>
                    <p className="eyebrow">{mode === "signup" ? "WELCOME TO EVENTHUB" : "WELCOME BACK"}</p>
                    <h2>{mode === "signup" ? role === "Vendor" ? "Create a vendor account" : "Create your account" : "Log in"}</h2>
                    <p className="form-subtitle">
                      {mode === "signup"
                        ? role === "Vendor"
                          ? "Add your contact details and the service category you work in."
                          : "Create an account to get started with EventHub."
                        : "Enter your details to continue to your account."}
                    </p>
    
                    {mode === "signup" && (
                      <>
                        <div className="role-heading">
                          <span className="field-label">I’m joining as</span>
                          {role !== "Vendor" && <span className="role-count">CHOOSE ONE</span>}
                        </div>
                        <div className={`role-grid${role === "Vendor" ? " role-grid-vendor" : ""}`} role="group" aria-label="Choose your account role">
                          {roles.map((item) => (
                            <button
                              className={`role-option${role === item.id ? " role-option-selected" : ""}`}
                              type="button"
                              key={item.id}
                              aria-pressed={role === item.id}
                              onClick={() => changeRole(item.id)}
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
                      </>
                    )}
    
                    <form className={`auth-form${mode === "signup" && role === "Vendor" ? " auth-form-vendor" : ""}`} onSubmit={handleSubmit}>
                      {mode === "signup" && (
                        <div className="field username-field">
                          <TextField
                            id="username"
                            label="Username"
                            type="text"
                            autoComplete="username"
                            placeholder="Choose a username"
                            value={username}
                            onValueChange={setUsername}
                            minLength={3}
                            maxLength={24}
                            pattern="[A-Za-z0-9._\-]{3,24}"
                            required
                          />
                          <p className="field-hint username-hint">3–24 letters, numbers, periods, underscores, or hyphens.</p>
                        </div>
                      )}
                      {mode === "signup" && role === "Vendor" && (vendorFields)}
                      {mode === "signup" && role === "Client" && (
                        <div className="field-row">
                          <div className="field">
                            <TextField
                              id="full-name"
                              label="Full name"
                              type="text"
                              autoComplete="name"
                              placeholder="e.g. Alex Morgan"
                              value={fullName}
                              onValueChange={setFullName}
                              required
                            />
                          </div>
                          <div className="field">
                            <TextField
                              id="client-phone-number"
                              label="Phone number"
                              type="tel"
                              autoComplete="tel"
                              placeholder="+94 71 555 0192"
                              value={phoneNumber}
                              onValueChange={setPhoneNumber}
                              required
                            />
                          </div>
                        </div>
                      )}
                      {(mode === "login" || mode === "signup" && role === "Client") && (
                        <div className="field">
                          <TextField
                            id="email"
                            label={mode === "login" ? "Email or username" : "Email address"}
                            type={mode === "login" ? "text" : "email"}
                            autoComplete={mode === "login" ? "username" : "email"}
                            placeholder={mode === "login" ? "Enter your email or username" : "you@example.com"}
                            value={email}
                            onValueChange={setEmail}
                            required
                          />
                        </div>
                      )}
                      {mode === "signup" && role === "Vendor" && <p className="vendor-form-section">PASSWORD</p>}
    <div className="field-row">{mode === "signup" ? <PasswordFields id="password" value={password} onValueChange={setPassword} confirmation={confirmPassword} onConfirmationChange={setConfirmPassword} /> : <div className="field"><TextField id="password" label="Password" type="password" autoComplete="current-password" value={password} onValueChange={setPassword} required /></div>}</div>
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
                              <span>I accept the Vendor Terms and 5–10% payout commission</span>
                            </label>
                          )}
                        </>
                      )}
                      {error && <FormAlert kind="error">{error}</FormAlert>}
                      {notice && <FormAlert kind="success">{notice}</FormAlert>}
                      <button className="primary-button" type="submit" disabled={busy}>
                        {busy ? "Please wait..." : mode === "signup" ? role === "Vendor" ? "Create vendor account" : "Create account" : "Log in"}
                      </button>
                      <div className="auth-divider"><span>or</span></div>
                      <button className="google-button" type="button" onClick={openGoogle}>
                        <svg className="google-button-mark" width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                          <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.5 9.5 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.9 6.1-15Z" />
                          <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z" />
                          <path fill="#FBBC05" d="M12.6 27.7a12 12 0 0 1 0-7.4V15H5.8a20 20 0 0 0 0 18l6.8-5.3Z" />
                          <path fill="#EA4335" d="M24 11.9c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.8 29.5 4 24 4A20 20 0 0 0 5.8 15l6.8 5.3c1.6-4.8 6.1-8.4 11.4-8.4Z" />
                        </svg>
                        {mode === "signup" ? "Sign up with Google" : "Google sign-in"}
                      </button>
                      {mode === "login" && (
                        <>
                          <div className="login-signup-actions">
                            <button className="secondary-auth-button" type="button" onClick={() => {
                              changeRole("Client"); switchMode("signup");
                            }}>Sign up as a client</button>
                            <button className="secondary-auth-button" type="button" onClick={() => {
                              changeRole("Vendor"); switchMode("signup");
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
  );
}
