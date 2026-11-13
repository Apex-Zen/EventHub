import React from 'react';
import { VendorItem } from './types';

interface VendorCardProps {
  vendor: VendorItem;
  onToggleAdd?: (id: string) => void;
}

export default function VendorCard({
  vendor,
  onToggleAdd,
}: VendorCardProps) {
  return (
    <article className="flex flex-col items-stretch gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:gap-5 sm:p-5">
      {/* Vendor Image Thumbnail */}
      <div className="h-40 w-full flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-36 sm:w-40">
        <img
          src={vendor.imageSrc}
          alt={vendor.imageAlt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Vendor Information */}
      <div className="flex h-full min-w-0 w-full flex-1 flex-col justify-between">
        <div>
          <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
            <h3 className="font-serif text-lg font-semibold leading-snug text-[#1B2430]">
              {vendor.name}
            </h3>
          </div>

          {/* Pricing */}
          <div className="mb-2">
            <span className="font-serif text-lg font-bold tabular-nums text-[#1B2430]">
              {vendor.price}
            </span>
            {vendor.pricePerGuest && (
              <span className="text-sm text-gray-500"> / guest</span>
            )}
          </div>

          {/* Category & Location */}
          <p className="mb-2 text-xs text-gray-500">
            {vendor.category} · {vendor.location}
          </p>

          {/* Rating */}
          <div className="mb-2 flex items-center gap-1.5 text-xs">
            <span className="text-[#266665] font-semibold">★ {vendor.rating.toFixed(1)}</span>
            <span className="text-gray-500">({vendor.reviewCount} reviews)</span>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg
              className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
            </svg>
            <span>{vendor.availability}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-100 pt-3 sm:mt-auto sm:border-t-0 sm:pt-4">
          <span className="inline-flex h-10 items-center justify-center rounded-md px-3 text-sm font-medium text-[#266665]">
            View profile
          </span>

          {vendor.isAdded ? (
            <button
              type="button"
              onClick={() => onToggleAdd && onToggleAdd(vendor.id)}
              className="inline-flex h-10 min-w-36 items-center justify-center rounded-md bg-[#266665] px-4 text-sm font-medium text-white transition-colors hover:bg-[#123B3A]"
            >
              Added ✓
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onToggleAdd && onToggleAdd(vendor.id)}
              className="inline-flex h-10 min-w-36 items-center justify-center rounded-md border border-[#266665] bg-white px-4 text-sm font-medium text-[#266665] transition-colors hover:bg-[#266665]/5"
            >
              Add to package
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

