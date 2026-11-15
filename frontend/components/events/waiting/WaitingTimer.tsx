import React from 'react';

interface WaitingTimerProps {
  label?: string;
  timeRemaining?: string;
}

export default function WaitingTimer({
  label = 'TIME LEFT',
  timeRemaining = '31 h 12 m',
}: WaitingTimerProps) {
  return (
    <div className="bg-[#266665] text-white rounded-lg px-6 py-4 flex items-center gap-3.5 shadow-sm">
      <svg
        className="w-7 h-7 text-white flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
      </svg>
      <div>
        <div className="text-[10px] font-semibold tracking-wider uppercase text-white/80">
          {label}
        </div>
        <div className="font-serif text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
          {timeRemaining}
        </div>
      </div>
    </div>
  );
}

