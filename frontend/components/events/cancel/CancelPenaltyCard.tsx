import React from 'react';

interface PenaltyLineItem {
  label: string;
  amount: string;
  isBold?: boolean;
}

const PENALTY_LINES: PenaltyLineItem[] = [
  { label: 'Paid so far', amount: 'LKR 196,000' },
  { label: 'Cancellation fee (25%)', amount: '− LKR 49,000' },
  { label: 'Already released to vendors', amount: 'LKR 0' },
  { label: 'Refund to your card', amount: 'LKR 147,000', isBold: true },
];

export default function CancelPenaltyCard() {
  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430]">
        Penalty preview
      </h2>

      {/* Line Items */}
      <div className="space-y-3">
        {PENALTY_LINES.map((line) => (
          <div
            key={line.label}
            className="flex items-baseline justify-between gap-4"
          >
            <span
              className={`text-sm ${
                line.isBold
                  ? 'font-semibold text-[#1B2430]'
                  : 'text-[#4B5563]'
              }`}
            >
              {line.label}
            </span>
            <span
              className={`text-sm tabular-nums text-right whitespace-nowrap ${
                line.isBold
                  ? 'font-semibold text-[#1B2430]'
                  : 'text-[#1B2430]'
              }`}
            >
              {line.amount}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* Policy Note */}
      <p className="text-xs text-[#6B7280] leading-relaxed">
        Policy: 10% more than 60 days before · 25% from 30 to 60 days ·
        50% inside 30 days · no refund inside 7 days.
      </p>
    </div>
  );
}
