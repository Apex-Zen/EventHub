export type Role = "client" | "vendor" | "manager";
export type Principal = { id: string; role: Role; name: string };
export type Currency = "LKR" | "USD" | "EUR";
export type Milestone = {
  stage: number; percent: number; gross: number; commission: number; net: number;
  status: "Held" | "Released"; payoutStatus: "Not due" | "Pending" | "Paid" | "Failed";
};
/** Values come from the booking/payment repositories; there are no seeded accounts or balances. */
export type Booking = {
  id: string; title: string; vendor: string; clientId: string; vendorId: string;
  managerId: string; date: string; location: string; baseMinor: number;
  paid: boolean; arrivalVerified: boolean; completed: boolean;
  milestones: Milestone[];
  payment: null | { id: string; currency: Currency; totalMinor: number; createdAt: string };
  audit: { action: string; actorId: string; at: string }[];
};
export class FinanceError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function canRead(user: Principal, booking: Booking) {
  return (user.role === "client" && booking.clientId === user.id)
    || (user.role === "vendor" && booking.vendorId === user.id)
    || (user.role === "manager" && booking.managerId === user.id);
}
export function authorize(user: Principal, booking: Booking, role?: Role) {
  if (!canRead(user, booking)) throw new FinanceError(404, "Booking not found.");
  if (role && user.role !== role) throw new FinanceError(403, "Your role cannot perform this action.");
}
export function view(booking: Booking, role: Role) {
  return {
    id: booking.id, title: booking.title, vendor: booking.vendor, date: booking.date, location: booking.location,
    paid: booking.paid, arrivalVerified: booking.arrivalVerified, completed: booking.completed,
    baseMinor: booking.baseMinor, milestones: booking.milestones.map(m => ({
      stage: m.stage, percent: m.percent, gross: m.gross, commission: m.commission,
      net: m.net, status: m.status, payoutStatus: m.payoutStatus,
    })),
    ...(role !== "vendor" ? { payment: booking.payment } : {}),
    ...(role === "manager" ? { audit: booking.audit } : {}),
  };
}
