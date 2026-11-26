'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const CANCELLATION_REASONS = [
  'We changed the date',
  'We changed the venue',
  'Budget reasons',
  'Found different vendors',
  'Event is no longer happening',
  'Personal reasons',
  'Other',
];

interface CancelReasonCardProps {
  keepEventHref: string;
  onRequestCancellation?: () => void;
}

export default function CancelReasonCard({
  keepEventHref,
  onRequestCancellation,
}: CancelReasonCardProps) {
  const [reason, setReason] = useState(CANCELLATION_REASONS[0]);
  const [details, setDetails] = useState('We moved the wedding to March 2027.');

  const handleSubmit = () => {
    if (onRequestCancellation) {
      onRequestCancellation();
    }
  };

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430]">
        Why are you cancelling?
      </h2>

      {/* Reason Dropdown */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-[#1B2430]">Reason</label>
        <div className="relative">
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-[#1B2430] focus:border-[#266665] focus:ring-1 focus:ring-[#266665] outline-none transition-colors"
          >
            {CANCELLATION_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Details Textarea */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-[#1B2430]">
          Details (optional)
        </label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-[#1B2430] placeholder-gray-400 focus:border-[#266665] focus:ring-1 focus:ring-[#266665] outline-none resize-none transition-colors"
          placeholder="Tell us more about why you're cancelling…"
        />
      </div>

      {/* Warning Notice */}
      <div className="rounded-lg bg-[#FEE2E2]/50 px-4 py-3">
        <p className="text-sm text-[#1B2430]">
          Cancelling releases every vendor&apos;s date. This cannot be undone.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-lg bg-[#B91C1C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#991B1B] transition-colors shadow-sm cursor-pointer"
        >
          Request cancellation
        </button>
        <Link
          href={keepEventHref}
          className="rounded-lg border border-[#266665] px-5 py-2.5 text-sm font-semibold text-[#266665] hover:bg-[#DBECEC]/40 transition-colors"
        >
          Keep my event
        </Link>
      </div>
    </div>
  );
}
