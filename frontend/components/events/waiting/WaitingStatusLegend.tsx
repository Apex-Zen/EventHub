import React from 'react';

interface WaitingStatusLegendProps {
  text?: string;
}

export default function WaitingStatusLegend({
  text = 'Waiting means no answer yet. Accepted books the date in the vendor diary. Rejected or expired (no answer in 48 hours) leaves the date free.',
}: WaitingStatusLegendProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-[#DBECEC]/60 rounded-lg text-xs sm:text-sm text-[#1B2430]">
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-[#266665] flex-shrink-0 mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
      </svg>
      <p className="leading-relaxed">
        {text}
      </p>
    </div>
  );
}

