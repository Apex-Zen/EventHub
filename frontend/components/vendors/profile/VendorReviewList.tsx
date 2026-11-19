import React from 'react';
import { VendorReviewItem } from './types';

interface VendorReviewListProps {
  reviews: VendorReviewItem[];
  averageRating?: number;
  reviewCount?: number;
}

/** Filled / empty stars for a rating (0-5, half-star rounds to nearest). */
function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-px" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`text-sm leading-none ${i < filled ? 'text-[#266665]' : 'text-gray-300'}`}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function VendorReviewList({ reviews }: VendorReviewListProps) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-xl font-bold text-[#1B2430]">Reviews</h2>

      <div className="space-y-5">
        {reviews.map((rev, idx) => (
          <div key={rev.id}>
            {/* Author row: avatar | name + stars */}
            <div className="flex items-center gap-3 mb-1.5">
              {/* Circular photo avatar — uses profile-pic.jpg as a generic reviewer avatar */}
              <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 border border-gray-100">
                <img
                  src="/images/profile-pic.jpg"
                  alt={rev.authorName}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Name */}
              <span className="text-sm font-semibold text-[#1B2430] leading-tight">
                {rev.authorName}
              </span>

              {/* Stars inline */}
              <Stars rating={rev.rating} />
            </div>

            {/* Comment indented to align with text after avatar */}
            <p className="pl-12 text-xs text-[#4B5563] leading-relaxed">
              {rev.comment}
            </p>

            {/* Divider between reviews */}
            {idx < reviews.length - 1 && (
              <div className="mt-5 border-t border-gray-100" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
