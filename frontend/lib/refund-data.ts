export const refundDetails = [
  { label: "Refund no.", value: "EH-RF-2026-0031" },
  { label: "Amount", value: "LKR 147,000" },
  { label: "To", value: "Visa ending 4242" },
];

export const refundSteps = [
  { number: "1", label: "Requested", complete: true },
  { number: "2", label: "Approved by EventHub", complete: true },
  { number: "3", label: "Sent to your bank", complete: true },
  { number: "4", label: "In your account", complete: false },
];

export const refundHistory = [
  {
    date: "Tue 20 Oct, 9.10 am",
    step: "Requested",
    note: "Reason: we changed the date",
  },
  {
    date: "Tue 20 Oct, 2.40 pm",
    step: "Approved",
    note: "Approved by Shehan G., Event Manager. Fee LKR 49,000 kept.",
  },
  {
    date: "Wed 21 Oct, 10.00 am",
    step: "Sent to bank",
    note: "Bank reference 88231904",
  },
];
