'use client';

import React from 'react';
import { WaitingVendorItem, VendorStatus } from './types';

interface VendorStatusCardProps {
  vendor: WaitingVendorItem;
  onMessage?: (vendorId: string) => void;
  onFindReplacement?: (vendorId: string, category: string) => void;
}

function StatusBadge({ status }: { status: VendorStatus }) {
  switch (status) {
    case 'Accepted':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#DBECEC] text-[#266665]">
          Accepted
        </span>
      );
    case 'Rejected':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEE2E2] text-[#EF4444]">
          Rejected
        </span>
      );
    case 'Expired':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-[#4B5563]">
          Expired
        </span>
      );
    case 'Waiting':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
          Waiting
        </span>
      );
  }
}

export default function VendorStatusCard({
  vendor,
  onMessage,
  onFindReplacement,
}: VendorStatusCardProps) {
  const isRejectedOrExpired = vendor.status === 'Rejected' || vendor.status === 'Expired';

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 shadow-xs p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Vendor Image and Details */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={vendor.image}
            alt={vendor.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 space-y-1">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1B2430] truncate">
            {vendor.name}
          </h3>
          <p className="text-xs sm:text-sm text-[#4B5563]">
            {vendor.category} &middot; {vendor.priceFormatted}
          </p>
          <div className="pt-0.5">
            <StatusBadge status={vendor.status} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full sm:w-auto flex-shrink-0 flex justify-end">
        {isRejectedOrExpired ? (
          <button
            type="button"
            onClick={() => onFindReplacement?.(vendor.id, vendor.category)}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#266665] hover:bg-[#123B3A] active:bg-[#123B3A] text-white text-xs sm:text-sm font-medium rounded transition-colors"
          >
            Find another {vendor.category.toLowerCase()}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onMessage?.(vendor.id)}
            className="w-full sm:w-auto px-6 py-2 bg-white border border-[#266665] text-[#266665] hover:bg-[#266665]/5 text-xs sm:text-sm font-medium rounded transition-colors"
          >
            Message
          </button>
        )}
      </div>
    </div>
  );
}

