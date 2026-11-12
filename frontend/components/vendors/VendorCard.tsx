import React from 'react';
import Link from 'next/link';
import { VendorItem } from './types';

interface VendorCardProps {
  vendor: VendorItem;
  onToggleAdd?: (id: string) => void;
  onViewProfile?: (id: string) => void;
}

export default function VendorCard({
  vendor,
  onToggleAdd,
  onViewProfile,
}: VendorCardProps) {
  return (
    <article className="bg-white rounded-lg border border-gray-200/80 shadow-xs hover:shadow-sm transition-all overflow-hidden p-5 flex flex-col sm:flex-row gap-5 items-start">
      {/* Vendor Image Thumbnail */}
      <div className="w-full sm:w-48 md:w-52 h-40 sm:h-36 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={vendor.imageSrc}
          alt={vendor.imageAlt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Vendor Information */}
      <div className="flex-1 flex flex-col justify-between h-full w-full min-w-0">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-1">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430] leading-snug">
              {vendor.name}
            </h3>
          </div>

          {/* Pricing */}
          <div className="mb-2">
            <span className="font-serif font-bold text-lg sm:text-xl text-[#1B2430]">
              {vendor.price}
            </span>
            {vendor.pricePerGuest && (
              <span className="text-sm font-normal text-[#4B5563]"> / guest</span>
            )}
          </div>

          {/* Category & Location */}
          <p className="text-xs sm:text-sm text-[#4B5563] mb-2">
            {vendor.category} · {vendor.location}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm mb-2">
            <span className="text-[#266665] font-semibold">★ {vendor.rating.toFixed(1)}</span>
            <span className="text-[#4B5563]">({vendor.reviewCount} reviews)</span>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-1.5 text-xs text-[#4B5563]">
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
        <div className="flex items-center justify-between sm:justify-end gap-4 mt-4 pt-3 border-t border-gray-100 sm:border-t-0 sm:pt-0">
          <button
            type="button"
            onClick={() => onViewProfile && onViewProfile(vendor.id)}
            className="text-xs sm:text-sm font-medium text-[#266665] hover:text-[#123B3A] no-underline transition-colors"
          >
            View profile
          </button>

          {vendor.isAdded ? (
            <button
              type="button"
              onClick={() => onToggleAdd && onToggleAdd(vendor.id)}
              className="inline-flex items-center justify-center px-4 py-2 bg-[#266665] hover:bg-[#123B3A] text-white text-xs sm:text-sm font-medium rounded transition-colors"
            >
              Added ✓
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onToggleAdd && onToggleAdd(vendor.id)}
              className="inline-flex items-center justify-center px-4 py-2 bg-white border border-[#266665] text-[#266665] hover:bg-[#266665]/5 text-xs sm:text-sm font-medium rounded transition-colors"
            >
              Add to package
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

