'use client';

import React from 'react';
import Link from 'next/link';

interface ConfirmedEventHeaderCardProps {
  label: string;
  dateTime: string;
  venueAndGuests: string;
  imageSrc: string;
  cancelHref?: string;
  isCancelled?: boolean;
  onCancelEvent?: () => void;
}

export default function ConfirmedEventHeaderCard({
  label,
  dateTime,
  venueAndGuests,
  imageSrc,
  cancelHref,
  isCancelled = false,
  onCancelEvent,
}: ConfirmedEventHeaderCardProps) {
  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8">
        {/* Left: Event Photo */}
        <div className="w-full md:w-80 h-48 sm:h-52 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
          <img
            src={imageSrc}
            alt={label}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right: Event Summary Details */}
        <div className="flex-1 space-y-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#4B5563]">
            {label}
          </p>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1B2430] leading-tight">
            {dateTime}
          </h1>

          <div>
            {isCancelled ? (
              <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                Event cancelled
              </span>
            ) : cancelHref ? (
              <Link
                href={cancelHref}
                className="text-sm font-medium text-[#266665] hover:text-rose-600 transition-colors"
              >
                Cancel event
              </Link>
            ) : (
              <button
                type="button"
                onClick={onCancelEvent}
                className="text-sm font-medium text-[#266665] hover:text-rose-600 transition-colors cursor-pointer"
              >
                Cancel event
              </button>
            )}
          </div>

          <p className="text-sm text-[#4B5563] pt-1">{venueAndGuests}</p>
        </div>
      </div>
    </div>
  );
}
