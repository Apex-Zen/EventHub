'use client';

import React from 'react';
import { VendorToRate } from './types';

interface VendorsToRateSidebarProps {
  vendors: VendorToRate[];
  activeVendorId: string;
  submittedVendorIds: Set<string>;
  onSelectVendor: (id: string) => void;
}

export default function VendorsToRateSidebar({
  vendors,
  activeVendorId,
  submittedVendorIds,
  onSelectVendor,
}: VendorsToRateSidebarProps) {
  return (
    <aside className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-5">
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430]">
        Vendors to rate
      </h2>

      <div className="divide-y divide-gray-100">
        {vendors.map((vendor) => {
          const isActive = vendor.id === activeVendorId;
          const isSubmitted = submittedVendorIds.has(vendor.id);

          return (
            <div
              key={vendor.id}
              className="flex items-center justify-between gap-3 py-4 first:pt-1"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 border border-gray-100">
                  <img
                    src={vendor.avatarSrc}
                    alt={vendor.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1B2430] truncate">
                    {vendor.name}
                  </p>
                  <p className="text-xs text-[#4B5563]">{vendor.category}</p>
                </div>
              </div>

              {isActive ? (
                <span className="inline-flex flex-shrink-0 items-center rounded-full bg-[#DBECEC] px-3 py-1 text-xs font-semibold text-[#266665]">
                  Rating now
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectVendor(vendor.id)}
                  className="inline-flex flex-shrink-0 items-center justify-center rounded-md border border-[#266665] bg-white px-4 py-1.5 text-xs font-medium text-[#266665] transition-colors hover:bg-[#266665]/5 cursor-pointer"
                >
                  {isSubmitted ? 'Rated ✓' : 'Rate'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="border-t border-gray-100 pt-4 text-xs text-[#4B5563] leading-relaxed">
        Reviews stay closed until the event manager marks the event complete.
      </p>
    </aside>
  );
}
