'use client';

import React from 'react';

interface CancelHeroBannerProps {
  subtitle: string;
}

export default function CancelHeroBanner({
  subtitle,
}: CancelHeroBannerProps) {
  return (
    <div className="space-y-2">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B2430] leading-tight">
        Cancel this event
      </h1>

      <p className="text-sm text-[#4B5563]">{subtitle}</p>
    </div>
  );
}
