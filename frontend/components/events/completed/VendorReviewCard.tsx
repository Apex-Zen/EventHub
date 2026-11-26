'use client';

import React from 'react';
import { VendorToRate } from './types';

interface VendorReviewCardProps {
  vendor: VendorToRate;
  rating: number;
  comment: string;
  isSubmitted: boolean;
  onRatingChange: (stars: number) => void;
  onCommentChange: (value: string) => void;
  onSubmit: () => void;
}

export default function VendorReviewCard({
  vendor,
  rating,
  comment,
  isSubmitted,
  onRatingChange,
  onCommentChange,
  onSubmit,
}: VendorReviewCardProps) {
  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      {/* Vendor Header */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 border border-gray-100">
          <img
            src={vendor.avatarSrc}
            alt={vendor.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430]">
            How was {vendor.name}?
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563]">
            {vendor.category} &middot; {vendor.service}
          </p>
        </div>
      </div>

      {/* Interactive 5-Star Rating */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= rating;
            return (
              <button
                key={star}
                type="button"
                onClick={() => onRatingChange(star)}
                aria-label={`${star} star${star > 1 ? 's' : ''}`}
                className={`text-3xl sm:text-4xl leading-none transition-transform hover:scale-110 cursor-pointer focus:outline-none ${
                  isFilled ? 'text-[#266665]' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            );
          })}
        </div>
        <span className="text-sm font-medium text-[#1B2430]">
          {rating} of 5
        </span>
      </div>

      {/* Comment Textarea */}
      <div className="space-y-2">
        <label
          htmlFor="vendor-review-comment"
          className="block text-xs sm:text-sm font-medium text-[#1B2430]"
        >
          Comment
        </label>
        <textarea
          id="vendor-review-comment"
          rows={3}
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Share how this vendor performed..."
          className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-[#1B2430] placeholder-gray-400 focus:border-[#266665] focus:outline-none focus:ring-1 focus:ring-[#266665]"
        />
      </div>

      {/* Helper Note */}
      <p className="text-xs text-[#4B5563]">
        Your review is public on the vendor profile. The public score is the average of all stars.
      </p>

      {/* Submit Action */}
      <div className="flex items-center justify-end gap-3">
        {isSubmitted && (
          <span className="text-xs font-medium text-[#266665]">
            Review submitted ✓
          </span>
        )}
        <button
          type="button"
          onClick={onSubmit}
          className="inline-flex items-center justify-center rounded-md bg-[#266665] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#123B3A] cursor-pointer"
        >
          {isSubmitted ? 'Update review' : 'Submit review'}
        </button>
      </div>
    </div>
  );
}
