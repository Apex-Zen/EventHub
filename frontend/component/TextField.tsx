import type { InputHTMLAttributes } from "react";

type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "id" | "onChange" | "type" | "value"
> & {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  className?: string;
};

export default function TextField({
  id,
  label,
  value,
  onValueChange,
  type = "text",
  className = "",
  ...inputProps
}: TextFieldProps) {
  return (
    <>
      <label className="field-label" htmlFor={id}>{label}</label>
      <input
        {...inputProps}
        className={`text-input${className ? ` ${className}` : ""}`}
        id={id}
        type={type}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
    </>
  );
}
