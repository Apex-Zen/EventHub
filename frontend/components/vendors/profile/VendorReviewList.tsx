import React from 'react';
import { VendorReviewItem } from './types';

interface VendorReviewListProps {
  reviews: VendorReviewItem[];
  averageRating?: number;
  reviewCount?: number;
}

export default function VendorReviewList({
  reviews,
  averageRating,
  reviewCount,
}: VendorReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430]">
            Client Reviews
          </h2>
          {averageRating && (
            <p className="text-xs sm:text-sm text-[#4B5563] mt-0.5">
              <span className="font-semibold text-[#266665]">★ {averageRating.toFixed(1)}</span> out of 5 &middot; {reviewCount ?? reviews.length} total reviews
            </p>
          )}
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="rounded-xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm sm:text-base text-[#1B2430]">
                  {rev.authorName}
                </span>
                {rev.authorLocation && (
                  <span className="text-xs text-[#4B5563]">
                    &middot; {rev.authorLocation}
                  </span>
                )}
                {rev.eventTypeName && (
                  <span className="inline-flex items-center rounded-md bg-[#DBECEC] px-2 py-0.5 text-[11px] font-medium text-[#266665]">
                    {rev.eventTypeName}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">
                {rev.date}
              </span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 text-xs text-[#266665]">
              {'★'.repeat(Math.round(rev.rating))}
              <span className="text-gray-300">{'★'.repeat(Math.max(0, 5 - Math.round(rev.rating)))}</span>
            </div>

            {/* Comment */}
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              &ldquo;{rev.comment}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

