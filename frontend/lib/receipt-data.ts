export type Receipt = {
  number: string;
  event: string;
  payment: string;
  amount: string;
  paidOn: string;
};

export const receipts: Receipt[] = [
  {
    number: "EH-R-2026-00418",
    event: "Perera–Silva wedding",
    payment: "Deposit (20%)",
    amount: "LKR 196,000",
    paidOn: "Mon 19 Oct, 10.02 pm",
  },
  {
    number: "EH-R-2026-00312",
    event: "Galle Face Jazz Night",
    payment: "Event page fee",
    amount: "LKR 5,000",
    paidOn: "Fri 2 Oct, 4.15 pm",
  },
  {
    number: "EH-R-2026-00187",
    event: "Nugegoda birthday party",
    payment: "Balance (80%)",
    amount: "LKR 152,000",
    paidOn: "Wed 29 Jul, 11.20 am",
  },
  {
    number: "EH-R-2026-00151",
    event: "Nugegoda birthday party",
    payment: "Deposit (20%)",
    amount: "LKR 38,000",
    paidOn: "Mon 6 Jul, 8.43 pm",
  },
  {
    number: "EH-R-2026-00042",
    event: "Kandy homecoming",
    payment: "Balance (80%)",
    amount: "LKR 480,000",
    paidOn: "Sun 22 Feb, 9.30 am",
  },
];

export const receiptYears = ["2026", "2025", "2024"];
