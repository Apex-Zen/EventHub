import React, { useEffect, useCallback } from 'react';
import { VendorItem } from './types';

interface VendorProfileModalProps {
  vendor: VendorItem;
  onClose: () => void;
  onToggleAdd: (id: string) => void;
}

function getPackageInclusions(category: string): string[] {
  switch (category.toLowerCase()) {
    case 'photography':
      return [
        'Full day coverage',
        'Edited gallery of 400+ photos',
        'Online delivery within 30 days',
      ];
    case 'catering':
      return [
        'Per guest pricing',
        'Includes setup and service staff',
        'Custom menu options available',
      ];
    case 'decoration':
      return [
        'Full venue decoration',
        'Includes props and signage',
        'Teardown after event',
      ];
    default:
      return [
        'Professional service',
        'Fully confirmed booking',
        'Direct communication with vendor',
      ];
  }
}

export default function VendorProfileModal({
  vendor,
  onClose,
  onToggleAdd,
}: VendorProfileModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const inclusions = getPackageInclusions(vendor.category);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${vendor.name} profile`}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image header */}
        <div className="relative h-56 bg-gray-100 flex-shrink-0">
          <img
            src={vendor.imageSrc}
            alt={vendor.imageAlt}
            className="w-full h-full object-cover rounded-t-xl"
          />
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Vendor name & category */}
          <div className="mb-4">
            <h2 className="font-serif text-2xl font-bold text-[#1B2430] leading-snug">
              {vendor.name}
            </h2>
            <p className="text-sm text-[#4B5563] mt-0.5">
              {vendor.category} · {vendor.location}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#266665] font-semibold text-sm">
              ★ {vendor.rating.toFixed(1)}
            </span>
            <span className="text-sm text-[#4B5563]">({vendor.reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="mb-5">
            <span className="font-serif font-bold text-xl text-[#1B2430]">{vendor.price}</span>
            {vendor.pricePerGuest && (
              <span className="text-sm font-normal text-[#4B5563]"> / guest</span>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mb-5" />

          {/* Package Inclusions */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-[#4B5563] mb-3">
              Package Inclusions
            </h3>
            <ul className="space-y-2">
              {inclusions.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#1B2430]">
                  <span className="mt-0.5 text-[#266665] flex-shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Add / Added button */}
          <button
            type="button"
            onClick={() => onToggleAdd(vendor.id)}
            className={`w-full py-3 text-sm font-medium rounded transition-colors ${
              vendor.isAdded
                ? 'bg-[#266665] hover:bg-[#123B3A] text-white'
                : 'bg-white border border-[#266665] text-[#266665] hover:bg-[#266665]/5'
            }`}
          >
            {vendor.isAdded ? 'Added ✓' : 'Add to package'}
          </button>
        </div>
      </div>
    </div>
  );
}
