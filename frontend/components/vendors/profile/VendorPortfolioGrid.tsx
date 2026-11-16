'use client';

import React, { useState } from 'react';
import { VendorPortfolioImage } from './types';

interface VendorPortfolioGridProps {
  images: VendorPortfolioImage[];
  title?: string;
}

export default function VendorPortfolioGrid({
  images,
  title = 'Portfolio',
}: VendorPortfolioGridProps) {
  const [lightbox, setLightbox] = useState<VendorPortfolioImage | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-xl font-bold text-[#1B2430]">{title}</h2>

      {/* Strict 3-column grid matching the Figma */}
      <div className="grid grid-cols-3 gap-4">
        {images.map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setLightbox(img)}
            className="group flex flex-col gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#266665] focus-visible:ring-offset-2"
          >
            {/* Square-ish image tile */}
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            {/* Caption always visible below */}
            {img.caption && (
              <p className="text-xs text-[#4B5563] leading-snug">
                {img.caption}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl w-full overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
            >
              &times;
            </button>
            <div className="max-h-[78vh] w-full bg-black flex items-center justify-center">
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="max-h-[78vh] w-auto object-contain"
              />
            </div>
            {lightbox.caption && (
              <div className="p-4 border-t border-gray-100">
                <p className="text-sm font-medium text-[#1B2430]">{lightbox.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
