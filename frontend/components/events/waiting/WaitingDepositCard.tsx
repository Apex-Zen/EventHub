'use client';

import React from 'react';

interface WaitingDepositCardProps {
  acceptedTotal: number;
  depositPercentage?: number;
  note?: string;
  onPayDeposit?: () => void;
  ctaText?: string;
  isActionDisabled?: boolean;
}

export default function WaitingDepositCard({
  acceptedTotal,
  depositPercentage = 20,
  note = 'You only pay for vendors who accepted. You can add a new decorator later.',
  onPayDeposit,
  ctaText = 'Pay deposit for accepted vendors',
  isActionDisabled = false,
}: WaitingDepositCardProps) {
  const depositDue = Math.round(acceptedTotal * (depositPercentage / 100));

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-6">
      <h2 className="font-serif text-2xl font-bold text-[#1B2430]">
        Deposit
      </h2>

      {/* Figures */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-[#4B5563]">Accepted so far</span>
          <span className="font-medium text-[#1B2430]">
            LKR {acceptedTotal.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-gray-100">
          <span className="text-[#4B5563]">
            Deposit due now ({depositPercentage}%)
          </span>
          <span className="font-serif font-bold text-lg text-[#266665]">
            LKR {depositDue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Explanatory note */}
      {note && (
        <p className="text-xs text-[#4B5563] leading-relaxed">
          {note}
        </p>
      )}

      {/* CTA Button */}
      <button
        type="button"
        disabled={isActionDisabled || acceptedTotal === 0}
        onClick={onPayDeposit}
        className="w-full py-3 bg-[#266665] hover:bg-[#123B3A] active:bg-[#123B3A] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-medium rounded transition-colors"
      >
        {ctaText}
      </button>
    </div>
  );
}

