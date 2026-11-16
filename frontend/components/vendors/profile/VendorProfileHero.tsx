'use client';

import React from 'react';

interface VendorProfileHeroProps {
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  heroImage: string;
  isAdded?: boolean;
  onToggleAdd?: () => void;
  availabilityNote?: string;
}

export default function VendorProfileHero({
  name,
  category,
  location,
  rating,
  reviewCount,
  heroImage,
  isAdded = false,
  onToggleAdd,
  availabilityNote,
}: VendorProfileHeroProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs">
      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full bg-gray-100">
        <img
          src={heroImage}
          alt={name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B2430]/75 via-[#1B2430]/20 to-transparent" />

        {/* Floating Category Badge */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <span className="inline-flex items-center rounded-full bg-[#DBECEC] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#266665]">
            {category}
          </span>
        </div>
      </div>

      {/* Info Header Banner */}
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1B2430]">
              {name}
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              {category} &middot; {location}
            </p>

            {/* Rating & Availability */}
            <div className="flex items-center gap-3 pt-1 text-xs sm:text-sm">
              <span className="font-semibold text-[#266665]">
                ★ {rating.toFixed(1)}
              </span>
              <span className="text-[#4B5563]">
                ({reviewCount} reviews)
              </span>
              {availabilityNote && (
                <>
                  <span className="text-gray-300">&middot;</span>
                  <span className="text-emerald-700 font-medium">
                    {availabilityNote}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action CTA */}
          {onToggleAdd && (
            <div className="flex-shrink-0 pt-2 sm:pt-0">
              {isAdded ? (
                <button
                  type="button"
                  onClick={onToggleAdd}
                  className="inline-flex h-11 min-w-40 items-center justify-center rounded-lg bg-[#266665] px-5 text-sm font-medium text-white transition-colors hover:bg-[#123B3A]"
                >
                  Added to package ✓
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onToggleAdd}
                  className="inline-flex h-11 min-w-40 items-center justify-center rounded-lg border-2 border-[#266665] bg-white px-5 text-sm font-semibold text-[#266665] transition-colors hover:bg-[#266665]/5"
                >
                  Add to package
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

