import CodeInput from "../CodeInput";
import { MAX_CODE_ATTEMPTS } from "../../lib/auth";
import FormAlert from "../FormAlert";

import type { Role, VerificationCode } from "../../lib/auth";
import type { FormEvent } from "react";

export type VerifyEmailFormProps = {
  values: {
    role: Role;
    email: string;
    verificationInput: string;
    verificationCode: VerificationCode | null;
    error: string;
    notice: string;
    busy: boolean;
  };
  actions: {
    setVerificationInput: (value: string) => void;
    returnToLogin: () => void;
    handleVerify: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    handleResendCode: () => void;
  };
};

export default function VerifyEmailForm({ values, actions }: VerifyEmailFormProps) {
  const { role, email, verificationInput, verificationCode, error, notice, busy } = values;
  const { setVerificationInput, returnToLogin, handleVerify, handleResendCode } = actions;
  return (

    <>
      <button
        className="back-button"
        type="button"
        onClick={returnToLogin}
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
        <CodeInput
          id="verification-code"
          label="Verification code"
          value={verificationInput}
          onValueChange={setVerificationInput}
          required
          aria-describedby="verification-help"
        />
        <p className="field-hint" id="verification-help">
          Code expires in 5 minutes. {verificationCode ? `${MAX_CODE_ATTEMPTS - verificationCode.attempts} attempts available.` : "Request a new code."}
        </p>
        {error && <FormAlert kind="error">{error}</FormAlert>}
        {notice && <FormAlert kind="success">{notice}</FormAlert>}
        <button className="primary-button" type="submit" disabled={busy || !verificationCode}>
          Verify and continue <span aria-hidden="true">→</span>
        </button>
      </form>
      <p className="switch-prompt">
        Didn&apos;t get a code?{" "}
        <button className="inline-button" type="button" onClick={handleResendCode}>Send a new code</button>
      </p>
    </>
  );
}
