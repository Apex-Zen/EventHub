'use client';

import React, { useState } from 'react';
import { VendorPortfolioImage } from './types';

interface VendorPortfolioGridProps {
  images: VendorPortfolioImage[];
  title?: string;
}

export default function VendorPortfolioGrid({
  images,
  title = 'Featured Work & Portfolio',
}: VendorPortfolioGridProps) {
  const [selectedImage, setSelectedImage] = useState<VendorPortfolioImage | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430]">
          {title}
        </h2>
        <span className="text-xs text-[#4B5563] font-medium">
          {images.length} photos
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {images.map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setSelectedImage(img)}
            className="group relative aspect-4/3 sm:aspect-square w-full overflow-hidden rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#266665] focus:ring-offset-2 text-left"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/25" />
            {img.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-2.5 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-xs text-white truncate font-medium">
                  {img.caption}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              &times;
            </button>
            <div className="max-h-[75vh] w-full bg-black flex items-center justify-center">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
            {selectedImage.caption && (
              <div className="p-4 bg-white border-t border-gray-100">
                <p className="text-sm font-medium text-[#1B2430]">
                  {selectedImage.caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

