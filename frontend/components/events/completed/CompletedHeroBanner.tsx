'use client';

import React from 'react';
import Link from 'next/link';

interface CompletedHeroBannerProps {
  eventTitle: string;
  backHref?: string;
  subtitle: string;
  coverImageSrc: string;
}

export default function CompletedHeroBanner({
  eventTitle,
  backHref = '/client/events',
  subtitle,
  coverImageSrc,
}: CompletedHeroBannerProps) {
  return (
    <div className="relative w-full h-[210px] sm:h-[230px] overflow-hidden bg-[#1B2430]">
      <img
        src={coverImageSrc}
        alt={eventTitle}
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1B2430]/85 via-[#1B2430]/55 to-[#1B2430]/75" />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 sm:px-6 lg:px-8 pb-7 sm:pb-8">
        <div className="space-y-2">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/90 hover:text-white transition-colors no-underline"
          >
            <span aria-hidden="true">&larr;</span> {eventTitle}
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              Event completed
            </h1>
            <span className="inline-flex items-center rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-semibold text-[#166534]">
              Completed
            </span>
          </div>

          <p className="text-xs sm:text-sm text-white/85">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
