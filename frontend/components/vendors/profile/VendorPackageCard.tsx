'use client';

import React from 'react';
import { VendorPackageOption } from './types';

interface VendorPackageCardProps {
  pkg: VendorPackageOption;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export default function VendorPackageCard({
  pkg,
  isSelected = false,
  onSelect,
}: VendorPackageCardProps) {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-xl border p-5 sm:p-6 transition-all ${
        isSelected
          ? 'border-[#266665] bg-[#DBECEC]/15 ring-2 ring-[#266665]'
          : 'border-gray-200 bg-white hover:border-gray-300 shadow-xs'
      }`}
    >
      {/* Popular badge */}
      {pkg.isPopular && (
        <span className="absolute -top-3 right-5 inline-flex items-center rounded-full bg-[#266665] px-3 py-0.5 text-[11px] font-semibold tracking-wide uppercase text-white shadow-xs">
          Popular choice
        </span>
      )}

      <div>
        {/* Title and Price */}
        <div className="mb-3">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1B2430]">
            {pkg.name}
          </h3>
          <p className="mt-1">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430]">
              {pkg.price}
            </span>
            {pkg.pricePerGuest && (
              <span className="text-xs text-[#4B5563]"> / guest</span>
            )}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed mb-4">
          {pkg.description}
        </p>

        {/* Features Checklist */}
        <div className="border-t border-gray-100 pt-4 mb-6">
          <h4 className="text-[11px] font-semibold tracking-wider uppercase text-[#4B5563] mb-2.5">
            What&apos;s included
          </h4>
          <ul className="space-y-2">
            {pkg.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#1B2430]">
                <span className="text-[#266665] font-bold flex-shrink-0 mt-0.5">✓</span>
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Select button */}
      {onSelect && (
        <button
          type="button"
          onClick={() => onSelect(pkg.id)}
          className={`w-full py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            isSelected
              ? 'bg-[#266665] text-white hover:bg-[#123B3A]'
              : 'border border-[#266665] text-[#266665] hover:bg-[#266665]/5 bg-white'
          }`}
        >
          {isSelected ? 'Selected Package ✓' : 'Select this package'}
        </button>
      )}
    </div>
  );
}

