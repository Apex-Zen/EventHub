import type { ComponentProps } from "react";
import TextField from "./TextField";
type Props = Omit<ComponentProps<typeof TextField>, "type" | "inputMode" | "autoComplete" | "pattern" | "maxLength">;
export default function CodeInput({ onValueChange, ...props }: Props) {
 return <TextField {...props} type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="000000" className="code-input" onValueChange={value => onValueChange(value.replace(/\D/g, ""))} />;
}
