type FormAlertProps = {
  kind: "error" | "success";
  children: string;
};

export default function FormAlert({ kind, children }: FormAlertProps) {
  return (
    <p className={`form-alert ${kind}-alert`} role={kind === "error" ? "alert" : "status"}>
      {children}
    </p>
  );
}
