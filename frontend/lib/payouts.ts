export type PayoutStatus = "Pending" | "Paid" | "Failed";

export type Payout = {
  event: string;
  stage: string;
  gross: number;
  commission: number;
  commissionRate: number;
  net: number;
  status: PayoutStatus;
  date: string;
};

export type PayoutReceipt = {
  number: string;
  event: string;
  stage: string;
  net: number;
  date: string;
};

export type SummaryItem = {
  label: string;
  amount: number;
  detail: string;
};

export const payoutSummary: SummaryItem[] = [
  { label: "Paid this month", amount: 63000, detail: "2 payouts" },
  {
    label: "Pending",
    amount: 59400,
    detail: "Sent to your bank within 3 working days",
  },
  {
    label: "Still held in escrow",
    amount: 129600,
    detail: "Released at arrival and event completion",
  },
];

export const payouts: Payout[] = [
  {
    event: "Perera–Silva wedding",
    stage: "1 · 20%",
    gross: 36000,
    commission: 3600,
    commissionRate: 10,
    net: 32400,
    status: "Pending",
    date: "19 Oct",
  },
  {
    event: "Wickrama birthday",
    stage: "3 · 30%",
    gross: 30000,
    commission: 3000,
    commissionRate: 10,
    net: 27000,
    status: "Pending",
    date: "8 Nov",
  },
  {
    event: "Wickrama birthday",
    stage: "2 · 50%",
    gross: 50000,
    commission: 5000,
    commissionRate: 10,
    net: 45000,
    status: "Paid",
    date: "7 Nov",
  },
  {
    event: "Wickrama birthday",
    stage: "1 · 20%",
    gross: 20000,
    commission: 2000,
    commissionRate: 10,
    net: 18000,
    status: "Paid",
    date: "21 Oct",
  },
  {
    event: "Fonseka anniversary",
    stage: "1 · 20%",
    gross: 15000,
    commission: 1500,
    commissionRate: 10,
    net: 13500,
    status: "Failed",
    date: "14 Oct",
  },
];

export const payoutReceipts: PayoutReceipt[] = [
  {
    number: "EH-P-2026-01188",
    event: "Wickrama birthday",
    stage: "3 · 30%",
    net: 27000,
    date: "9 Nov",
  },
  {
    number: "EH-P-2026-01102",
    event: "Wickrama birthday",
    stage: "2 · 50%",
    net: 45000,
    date: "8 Nov",
  },
  {
    number: "EH-P-2026-00951",
    event: "Perera–Silva wedding",
    stage: "1 · 20%",
    net: 32400,
    date: "21 Oct",
  },
];

export const vendorNavigation = [
  "Dashboard",
  "Profile",
  "Services",
  "Halls",
  "Pricing",
  "Portfolio",
  "Diary",
  "Chat",
  "Reviews",
  "Notifications",
  "Check-in",
  "Payouts",
];

export function formatAmount(amount: number) {
  return `LKR ${amount.toLocaleString("en-LK")}`;
}
