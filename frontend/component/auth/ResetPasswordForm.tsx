import PasswordFields from "../PasswordFields";
import CodeInput from "../CodeInput";
import FormAlert from "../FormAlert";

import type { FormEvent } from "react";

export type ResetPasswordFormProps = {
  values: {
    resetTarget: string;
    resetCode: string;
    resetCodeInput: string;
    resetPassword: string;
    confirmResetPassword: string;
    error: string;
    notice: string;
    busy: boolean;
  };
  actions: {
    setResetCodeInput: (value: string) => void;
    setResetPassword: (value: string) => void;
    setConfirmResetPassword: (value: string) => void;
    requestAnotherCode: () => void;
    handleResetPassword: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  };
};

export default function ResetPasswordForm({ values, actions }: ResetPasswordFormProps) {
  const { resetTarget, resetCode, resetCodeInput, resetPassword, confirmResetPassword, error, notice, busy } = values;
  const { setResetCodeInput, setResetPassword, setConfirmResetPassword, requestAnotherCode, handleResetPassword } = actions;
  return (

    <>
      <p className="eyebrow">ACCOUNT RECOVERY</p>
      <h2>Set a new password</h2>
      <p className="form-subtitle">For <strong>{resetTarget}</strong>. Reset codes expire in 30 minutes.</p>
      <div className="reset-code-card" role="status">
        <span>DEMO RESET CODE · NOT SENT</span>
        <strong>{resetCode || "Expired"}</strong>
      </div>
      {notice && <FormAlert kind="success">{notice}</FormAlert>}
      <form className="auth-form recovery-form" onSubmit={handleResetPassword}>
        <div className="field">
          <CodeInput
            id="reset-code"
            label="Reset code"
            value={resetCodeInput}
            onValueChange={setResetCodeInput}
            required
          />
        </div>
        <PasswordFields id="new-password" label="New password" confirmationLabel="Confirm new password" value={resetPassword} onValueChange={setResetPassword} confirmation={confirmResetPassword} onConfirmationChange={setConfirmResetPassword} />
        <ul className="password-checklist">
          <li>At least 8 characters</li>
          <li>At least one uppercase letter, one lowercase letter, and one number</li>
          <li>Both passwords match</li>
        </ul>
        {error && <FormAlert kind="error">{error}</FormAlert>}
        <button className="primary-button" type="submit" disabled={busy}>{busy ? "Saving..." : "Save new password"}</button>
      </form>
      <button className="back-button" type="button" onClick={requestAnotherCode}><span aria-hidden="true">←</span> Request another code</button>
    </>
  );
}
