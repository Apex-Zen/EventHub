import React from 'react';

interface VendorAboutSectionProps {
  aboutText: string;
  category: string;
  location: string;
}

export default function VendorAboutSection({
  aboutText,
  category,
  location,
}: VendorAboutSectionProps) {
  return (
    <div className="space-y-3">
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430]">
        About This Vendor
      </h2>
      <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed whitespace-pre-line">
        {aboutText}
      </p>
      <div className="flex items-center gap-4 pt-2 text-xs text-[#4B5563]">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-[#1B2430]">Category:</span> {category}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-[#1B2430]">Base Location:</span> {location}
        </div>
      </div>
    </div>
  );
}

