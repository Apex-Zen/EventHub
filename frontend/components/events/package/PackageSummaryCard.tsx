'use client';

import React from 'react';

interface PackageSummaryCardProps {
  vendorCount: number;
  total: number;
  budget?: number;
  onSendPackageRequest?: () => void;
}

export default function PackageSummaryCard({
  vendorCount,
  total,
  budget = 1500000,
  onSendPackageRequest,
}: PackageSummaryCardProps) {
  const bookingConfirmDeposit = Math.round(total * 0.2);
  const onArrivalPayment = Math.round(total * 0.5);
  const onCompletePayment = total - bookingConfirmDeposit - onArrivalPayment;

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-6">
      <h2 className="font-serif text-2xl font-bold text-[#1B2430]">
        Summary
      </h2>

      {/* Total & Budget */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#4B5563] font-medium">{vendorCount} vendors</span>
          <span className="font-serif font-bold text-lg text-[#1B2430]">
            LKR {total.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#4B5563] font-medium">Budget</span>
          <span className="font-medium text-[#1B2430]">
            LKR {budget.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Payment after vendors accept section */}
      <div className="pt-2 border-t border-gray-100 space-y-3">
        <h3 className="text-[11px] font-semibold tracking-wider uppercase text-[#266665]">
          PAYMENT AFTER VENDORS ACCEPT
        </h3>

        <div className="space-y-2.5 text-xs sm:text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#4B5563]">20% on booking confirm</span>
            <span className="font-medium text-[#1B2430]">{bookingConfirmDeposit.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#4B5563]">50% when each vendor arrives</span>
            <span className="font-medium text-[#1B2430]">{onArrivalPayment.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#4B5563]">30% when event is complete</span>
            <span className="font-medium text-[#1B2430]">{onCompletePayment.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Note callout */}
      <div className="flex items-start gap-2.5 p-3.5 bg-[#DBECEC]/60 rounded-md text-xs text-[#1B2430]">
        <svg
          className="w-4 h-4 text-[#266665] flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
        </svg>
        <p className="leading-relaxed">
          Each vendor has up to 48 hours to accept or reject. Your date is held with them until then.
        </p>
      </div>

      {/* CTA Button */}
      <button
        type="button"
        onClick={onSendPackageRequest}
        className="w-full py-3 bg-[#266665] hover:bg-[#123B3A] active:bg-[#123B3A] text-white text-sm font-medium rounded transition-colors"
      >
        Send package request
      </button>
    </div>
  );
}

