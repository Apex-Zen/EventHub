export type PaymentEventId = "wedding" | "party";
export type PaymentType = "deposit" | "balance";
export type PaymentStatus = "success" | "failed" | "pending";

export type PaymentEntry = {
  payment: string;
  amount: number;
  status: PaymentStatus;
  time: string;
  action: "download" | "none" | "pay";
};

export type PaymentStage = {
  name: string;
  percent: number;
  detail: string;
  status: "Released" | "Held";
  amount: number;
  receipt?: string;
};

export type PaymentVendor = {
  name: string;
  amount: number;
  icon: string;
  stages: PaymentStage[];
};

export type PaymentEvent = {
  id: PaymentEventId;
  name: string;
  total: number;
  entries: PaymentEntry[];
  vendors: PaymentVendor[];
};

export const paymentEvents: PaymentEvent[] = [
  {
    id: "wedding",
    name: "Perera–Silva wedding",
    total: 980000,
    entries: [
      {
        payment: "Deposit (20%)",
        amount: 196000,
        status: "success",
        time: "19 Oct, 10.02 pm",
        action: "download",
      },
      {
        payment: "Deposit (20%), first try",
        amount: 196000,
        status: "failed",
        time: "19 Oct, 9.58 pm",
        action: "none",
      },
      {
        payment: "Balance (80%)",
        amount: 784000,
        status: "pending",
        time: "Due 5 Dec",
        action: "pay",
      },
    ],
    vendors: [
      {
        name: "Lens & Light Studio",
        amount: 180000,
        icon: "📸",
        stages: [
          {
            name: "Stage 1",
            percent: 20,
            detail: "Booking confirm",
            status: "Released",
            amount: 36000,
            receipt: "Receipt EH-R-2026-00418 · 19 Oct, 10.02 pm",
          },
          {
            name: "Stage 2",
            percent: 50,
            detail: "Vendor arrival",
            status: "Held",
            amount: 90000,
          },
          {
            name: "Stage 3",
            percent: 30,
            detail: "Event complete",
            status: "Held",
            amount: 54000,
          },
        ],
      },
      {
        name: "Ceylon Spice Caterers",
        amount: 800000,
        icon: "🍽️",
        stages: [
          {
            name: "Stage 1",
            percent: 20,
            detail: "Booking confirm",
            status: "Released",
            amount: 160000,
            receipt: "Receipt EH-R-2026-00418 · 19 Oct, 10.02 pm",
          },
          {
            name: "Stage 2",
            percent: 50,
            detail: "Vendor arrival",
            status: "Held",
            amount: 400000,
          },
          {
            name: "Stage 3",
            percent: 30,
            detail: "Event complete",
            status: "Held",
            amount: 240000,
          },
        ],
      },
    ],
  },
  {
    id: "party",
    name: "Office year-end party",
    total: 670000,
    entries: [
      {
        payment: "Deposit (20%)",
        amount: 134000,
        status: "success",
        time: "12 Nov, 3.40 pm",
        action: "download",
      },
      {
        payment: "Deposit (20%), first try",
        amount: 134000,
        status: "failed",
        time: "12 Nov, 3.37 pm",
        action: "none",
      },
      {
        payment: "Balance (80%)",
        amount: 536000,
        status: "pending",
        time: "Due 18 Dec",
        action: "pay",
      },
    ],
    vendors: [
      {
        name: "Northstar Events",
        amount: 250000,
        icon: "🎤",
        stages: [
          {
            name: "Stage 1",
            percent: 20,
            detail: "Booking confirm",
            status: "Released",
            amount: 50000,
          },
          {
            name: "Stage 2",
            percent: 50,
            detail: "Vendor arrival",
            status: "Held",
            amount: 125000,
          },
          {
            name: "Stage 3",
            percent: 30,
            detail: "Event complete",
            status: "Held",
            amount: 75000,
          },
        ],
      },
      {
        name: "Gather & Graze",
        amount: 420000,
        icon: "🍽️",
        stages: [
          {
            name: "Stage 1",
            percent: 20,
            detail: "Booking confirm",
            status: "Released",
            amount: 84000,
          },
          {
            name: "Stage 2",
            percent: 50,
            detail: "Vendor arrival",
            status: "Held",
            amount: 210000,
          },
          {
            name: "Stage 3",
            percent: 30,
            detail: "Event complete",
            status: "Held",
            amount: 126000,
          },
        ],
      },
    ],
  },
];

export const checkoutEvent = paymentEvents[0];
export const checkoutDepositAmount = checkoutEvent.total * 0.2;
export const checkoutBalanceAmount = checkoutEvent.total - checkoutDepositAmount;

export function isPaymentEventId(value: string | null): value is PaymentEventId {
  return value === "wedding" || value === "party";
}

export function isPaymentType(value: string | null): value is PaymentType {
  return value === "deposit" || value === "balance";
}

export function getCheckoutAmount(
  eventId: PaymentEventId,
  paymentType: PaymentType,
) {
  const event =
    paymentEvents.find((item) => item.id === eventId) ?? checkoutEvent;
  return paymentType === "balance"
    ? Math.round(event.total * 0.8)
    : Math.round(event.total * 0.2);
}

export function formatLkr(amount: number) {
  return `LKR ${amount.toLocaleString("en-LK")}`;
}

export function formatPaymentTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
