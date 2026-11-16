import React from 'react';

interface VendorAboutSectionProps {
  aboutText: string;
}

export default function VendorAboutSection({ aboutText }: VendorAboutSectionProps) {
  return (
    <div className="space-y-3">
      <h2 className="font-serif text-xl font-bold text-[#1B2430]">About</h2>
      <p className="text-sm text-[#4B5563] leading-relaxed">
        {aboutText}
      </p>
    </div>
  );
}
