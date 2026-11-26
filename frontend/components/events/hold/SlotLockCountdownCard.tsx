'use client';

import React, { useState, useEffect } from 'react';

interface SlotLockCountdownCardProps {
  initialSeconds?: number;
  totalWindowSeconds?: number;
  holdWindowText?: string;
  warningTitle?: string;
  warningMessage?: string;
}

export default function SlotLockCountdownCard({
  initialSeconds = 31 * 3600 + 12 * 60 + 8,
  totalWindowSeconds = 48 * 3600,
  holdWindowText = 'Hold started Mon 19 Oct, 9.40 pm · ends Wed 21 Oct, 9.40 pm',
  warningTitle = 'Expiry warning',
  warningMessage = 'Bloom Decor has less than 6 hours left to answer. If they do not, their hold ends and you can pick another decorator.',
}: SlotLockCountdownCardProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  const elapsedPct = Math.min(
    100,
    Math.max(0, Math.round(((totalWindowSeconds - secondsLeft) / totalWindowSeconds) * 100))
  );

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      <div className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#4B5563]">
          SLOT LOCK ENDS IN
        </p>

        {/* Live Countdown */}
        <p className="font-serif text-4xl sm:text-5xl font-bold text-[#1B2430] tabular-nums tracking-tight">
          {pad(hours)} h &nbsp;{pad(minutes)} m &nbsp;{pad(seconds)} s
        </p>

        {/* Progress Bar */}
        <div className="h-2 w-full rounded-full bg-[#DBECEC] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#266665] transition-all duration-500"
            style={{ width: `${elapsedPct}%` }}
          />
        </div>

        <p className="text-xs sm:text-sm text-[#4B5563]">{holdWindowText}</p>
      </div>

      {/* Expiry Warning Callout */}
      <div className="rounded-lg border border-amber-200/80 bg-[#FFF8E7] p-4 sm:p-5 space-y-1.5">
        <h3 className="text-sm font-semibold text-[#1B2430]">{warningTitle}</h3>
        <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
          {warningMessage}
        </p>
      </div>
    </div>
  );
}
