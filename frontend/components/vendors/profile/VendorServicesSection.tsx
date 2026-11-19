import React from 'react';
import { VendorServiceItem } from './types';

interface VendorServicesSectionProps {
  services: VendorServiceItem[];
}

export default function VendorServicesSection({ services }: VendorServicesSectionProps) {
  if (!services || services.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="font-serif text-xl font-bold text-[#1B2430]">Services</h2>

      {/* Divider rows — name | duration (centered) | price (right-aligned) */}
      <div>
        {services.map((svc, idx) => (
          <div
            key={svc.id}
            className={`flex items-center gap-6 py-4 ${
              idx < services.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <span className="flex-1 text-sm font-medium text-[#1B2430]">
              {svc.name}
            </span>
            <span className="w-20 flex-shrink-0 text-center text-sm text-[#4B5563]">
              {svc.duration}
            </span>
            <span className="w-28 flex-shrink-0 text-right text-sm font-semibold text-[#1B2430]">
              {svc.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
