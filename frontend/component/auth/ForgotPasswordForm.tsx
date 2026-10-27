import { useRef } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import type { ResetMethod } from "../../lib/auth";
import TextField from "../TextField";
import FormAlert from "../FormAlert";
export type ForgotPasswordFormProps = {
  values: { resetMethod: ResetMethod; resetIdentifier: string; error: string };
  actions: { setResetIdentifier: (value: string) => void; changeResetMethod: (method: ResetMethod) => void; returnToLogin: () => void; handleForgotPassword: (event: FormEvent<HTMLFormElement>) => void };
};
const methods: ResetMethod[] = ["email", "sms"];
export default function ForgotPasswordForm({ values, actions }: ForgotPasswordFormProps) {
  const { resetMethod, resetIdentifier, error } = values;
  const { setResetIdentifier, changeResetMethod, returnToLogin, handleForgotPassword } = actions;
  const tabs = useRef<Partial<Record<ResetMethod, HTMLButtonElement | null>>>({});
  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, method: ResetMethod) {
    let next: ResetMethod;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") next = method === "email" ? "sms" : "email";
    else if (event.key === "Home") next = "email";
    else if (event.key === "End") next = "sms";
    else return;
    event.preventDefault(); changeResetMethod(next); tabs.current[next]?.focus();
  }
  return <>
    <p className="eyebrow">ACCOUNT RECOVERY</p>
    <h2>Forgot your password?</h2>
    <p className="form-subtitle">Enter the email or phone number on your account. We&apos;ll prepare a reset code.</p>
    <div className="recovery-tabs" role="tablist" aria-label="Choose password reset method">
      {methods.map(method => <button key={method} ref={element => { tabs.current[method] = element; }}
        id={"reset-" + method + "-tab"} type="button" role="tab"
        className={resetMethod === method ? "recovery-tab recovery-tab-active" : "recovery-tab"}
        aria-selected={resetMethod === method} aria-controls={"reset-" + method + "-panel"}
        tabIndex={resetMethod === method ? 0 : -1} onKeyDown={event => handleTabKey(event, method)}
        onClick={() => changeResetMethod(method)}>{method === "email" ? "Email" : "SMS"}</button>)}
    </div>
    {methods.map(method => <div key={method} role="tabpanel" id={"reset-" + method + "-panel"}
      aria-labelledby={"reset-" + method + "-tab"} hidden={resetMethod !== method}>
      {resetMethod === method && <form className="auth-form recovery-form" onSubmit={handleForgotPassword}>
        <TextField id={"reset-identifier-" + method} label={method === "email" ? "Email" : "Phone number"}
          type={method === "email" ? "email" : "tel"} autoComplete={method === "email" ? "email" : "tel"}
          placeholder={method === "email" ? "you@example.com" : "+94 71 555 0192"}
          value={resetIdentifier} onValueChange={setResetIdentifier} required />
        {error && <FormAlert kind="error">{error}</FormAlert>}
        <button className="primary-button" type="submit">Prepare reset code</button>
      </form>}
    </div>)}
    <button className="back-button" type="button" onClick={returnToLogin}><span aria-hidden="true">←</span> Back to log in</button>
    <p className="recovery-note">Reset codes expire in 30 minutes. Demo mode does not send email or SMS.</p>
  </>;
}
