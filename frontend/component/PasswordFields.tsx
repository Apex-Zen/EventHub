import TextField from "./TextField";
type Props = { id: string; value: string; onValueChange: (value: string) => void; confirmation: string; onConfirmationChange: (value: string) => void; label?: string; confirmationLabel?: string; };
export default function PasswordFields({ id, value, onValueChange, confirmation, onConfirmationChange, label = "Password", confirmationLabel = "Confirm password" }: Props) {
 return <><div className="field"><TextField id={id} label={label} type="password" autoComplete="new-password" placeholder="At least 8 characters" value={value} onValueChange={onValueChange} minLength={8} required /></div><div className="field"><TextField id={id + "-confirmation"} label={confirmationLabel} type="password" autoComplete="new-password" placeholder="Repeat password" value={confirmation} onValueChange={onConfirmationChange} minLength={8} required /></div></>;
}
