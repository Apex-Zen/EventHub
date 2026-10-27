import FormAlert from "../FormAlert";
import { useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from "react";
import type { Role } from "../../lib/auth";

export type VerifyEmailFormProps = {
  values: {
    role: Role;
    email: string;
    error: string;
    busy: boolean;
  };
  actions: {
    returnToLogin: () => void;
    verifyEmail: (code: string) => Promise<void>;
  };
};

export default function VerifyEmailForm({ values, actions }: VerifyEmailFormProps) {
  const { role, email, error, busy } = values;
  const { returnToLogin, verifyEmail } = actions;
  const [digits, setDigits] = useState(Array(6).fill(""));
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits(current => current.map((item, position) => position === index ? digit : item));
    if (digit && index < 5)
      inputs.current[index + 1]?.focus();
  }
  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted)
      return;
    setDigits(current => current.map((_, index) => pasted[index] ?? ""));
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  }
  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!busy) void verifyEmail(digits.join(""));
  }
  return (
    <>
      <button
        className="back-button"
        type="button"
        onClick={returnToLogin}
      >
        <span aria-hidden="true">←</span> Back to sign in
      </button>
      <p className="eyebrow">EMAIL VERIFICATION</p>
      <h2>Check your email</h2>
      <p className="form-subtitle">
        Enter the 6-digit code sent to <strong>{email}</strong> to verify your {role.toLowerCase()} account.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="verification-digits" aria-label="6-digit verification code">
          {digits.map((digit, index) => (
            <input
              aria-label={`Verification digit ${index + 1}`}
              autoComplete={index === 0 ? "one-time-code" : "off"}
              inputMode="numeric"
              disabled={busy}
              key={index}
              maxLength={1}
              onChange={event => updateDigit(index, event.target.value)}
              onKeyDown={event => handleKeyDown(index, event)}
              onPaste={index === 0 ? handlePaste : undefined}
              ref={element => { inputs.current[index] = element; }}
              type="text"
              value={digit}
            />
          ))}
        </div>
        {error && <FormAlert kind="error">{error}</FormAlert>}
        <button className="primary-button" type="submit" disabled={busy || digits.some(digit => !digit)}>Verify email</button>
      </form>
    </>
  );
}
