'use client';

import React from 'react';
import Link from 'next/link';

interface SalesHeroBannerProps {
  title: string;
  subtitle: string;
  coverImageSrc: string;
  editTiersHref?: string;
}

export default function SalesHeroBanner({
  title,
  subtitle,
  coverImageSrc,
  editTiersHref = '/client/events/public',
}: SalesHeroBannerProps) {
  return (
    <div className="relative w-full h-[210px] sm:h-[230px] overflow-hidden bg-[#1B2430]">
      <img
        src={coverImageSrc}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1B2430]/85 via-[#1B2430]/55 to-[#1B2430]/75" />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 sm:px-6 lg:px-8 pb-7 sm:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          {/* Left: Live indicator + Title + Subtitle */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-white/90">
              <span className="h-2 w-2 rounded-full bg-[#2E9D5B]" />
              <span>Live &middot; updated 10 s ago</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              {title}
            </h1>

            <p className="text-xs sm:text-sm text-white/85">
              {subtitle}
            </p>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-md border border-white/80 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur-xs transition-colors hover:bg-white/20 cursor-pointer"
            >
              View public page
            </button>
            <Link
              href={editTiersHref}
              className="inline-flex h-10 items-center justify-center rounded-md bg-[#266665] px-5 text-sm font-medium text-white transition-colors hover:bg-[#123B3A] no-underline"
            >
              Edit tiers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
