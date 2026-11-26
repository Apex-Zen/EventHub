'use client';

import React from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { HoldVendorItem } from './types';

interface HoldVendorsSidebarProps {
  vendors: HoldVendorItem[];
  packageStatusHref: string;
}

export default function HoldVendorsSidebar({
  vendors,
  packageStatusHref,
}: HoldVendorsSidebarProps) {
  return (
    <aside className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-5">
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430]">
        Vendors
      </h2>

      <div className="divide-y divide-gray-100">
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            className="flex items-center justify-between gap-3 py-4 first:pt-1"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#1B2430] truncate">
                {vendor.name}
              </p>
              <p className="text-xs text-[#4B5563] mt-0.5">{vendor.subtitle}</p>
            </div>

            <StatusBadge
              text={vendor.statusText}
              variant={vendor.statusVariant}
              className="flex-shrink-0"
            />
          </div>
        ))}
      </div>

      <Link
        href={packageStatusHref}
        className="block w-full rounded-md bg-[#266665] py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#123B3A] no-underline"
      >
        View package status
      </Link>
    </aside>
  );
}
