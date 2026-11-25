'use client';

import React from 'react';
import { TicketTier } from './types';

interface BeforeYouPublishCardProps {
  tiers: TicketTier[];
  publicSlug: string;
  onPublish: () => void;
  onSaveDraft: () => void;
}

export default function BeforeYouPublishCard({
  tiers,
  publicSlug,
  onPublish,
  onSaveDraft,
}: BeforeYouPublishCardProps) {
  const totalTickets = tiers.reduce((sum, t) => sum + t.ticketsAvailable, 0);
  const potentialRevenue = tiers.reduce(
    (sum, t) => sum + t.price * t.ticketsAvailable,
    0
  );

  return (
    <aside className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-6">
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430]">
        Before you publish
      </h2>

      {/* Summary Metrics */}
      <div className="space-y-3.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[#4B5563]">Ticket tiers</span>
          <span className="font-semibold tabular-nums text-[#1B2430]">
            {tiers.length}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#4B5563]">Tickets in total</span>
          <span className="font-semibold tabular-nums text-[#1B2430]">
            {totalTickets.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[#4B5563]">If all sell</span>
          <span className="font-serif text-lg font-bold tabular-nums text-[#1B2430]">
            LKR {potentialRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Public Page Slug */}
      <div className="border-t border-gray-100 pt-5 space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#4B5563]">
          PUBLIC PAGE
        </p>
        <p className="text-sm font-medium text-[#266665] break-all">
          {publicSlug}
        </p>
      </div>

      {/* QR Pass Notice */}
      <div className="rounded-lg bg-[#DBECEC]/60 p-4 flex items-start gap-3">
        <svg
          className="h-5 w-5 flex-shrink-0 text-[#266665] mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 3h2m4 0h-2m-2-3v2m0 4v-2m2 2h2v-2"
          />
        </svg>
        <p className="text-xs text-[#1B2430] leading-relaxed">
          Every purchase creates a unique QR pass. Gate staff scan it once; a second scan is rejected.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-1">
        <button
          type="button"
          onClick={onPublish}
          className="w-full rounded-md bg-[#266665] py-3 text-sm font-medium text-white transition-colors hover:bg-[#123B3A] cursor-pointer"
        >
          Publish event page
        </button>

        <button
          type="button"
          onClick={onSaveDraft}
          className="w-full rounded-md border border-[#266665] bg-white py-3 text-sm font-medium text-[#266665] transition-colors hover:bg-[#266665]/5 cursor-pointer"
        >
          Save draft
        </button>
      </div>
    </aside>
  );
}
