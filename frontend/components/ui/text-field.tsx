import type { InputHTMLAttributes } from "react";

type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name" | "aria-describedby" | "aria-invalid"
> & {
  label: string;
  name: string;
  error?: string;
  hint?: string;
};

export function TextField({
  label,
  name,
  error,
  hint,
  ...inputProps
}: TextFieldProps) {
  const helpId = error ? `${name}-error` : hint ? `${name}-hint` : undefined;

  return (
    <label className="field">
      <span>{label}</span>
      <input
        {...inputProps}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={helpId}
      />
      {error && (
        <small className="field-error" id={helpId}>
          {error}
        </small>
      )}
      {!error && hint && (
        <small className="field-hint" id={helpId}>
          {hint}
        </small>
      )}
    </label>
  );
}
