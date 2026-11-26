'use client';

import React, { useState } from 'react';
import {
  CompletedHeroBanner,
  VendorReviewCard,
  VendorsToRateSidebar,
  VendorToRate,
} from '@/components/events/completed';

const VENDORS_TO_RATE: VendorToRate[] = [
  {
    id: '1',
    name: 'Lens & Light Studio',
    category: 'Photography',
    service: 'Full-day wedding coverage',
    avatarSrc: '/images/profile-pic.jpg',
    initialRating: 4,
    initialComment:
      'Arrived on time and handled the rain well. Album link came the next week.',
  },
  {
    id: '3',
    name: 'Ceylon Spice Caterers',
    category: 'Catering',
    service: 'Grand Wedding Buffet (250 guests)',
    avatarSrc: '/images/ceylone-spice.jpg',
    initialRating: 0,
    initialComment: '',
  },
];

export default function EventCompletedPage() {
  const [activeVendorId, setActiveVendorId] = useState<string>(VENDORS_TO_RATE[0].id);

  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    VENDORS_TO_RATE.forEach((v) => {
      init[v.id] = v.initialRating ?? 0;
    });
    return init;
  });

  const [comments, setComments] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    VENDORS_TO_RATE.forEach((v) => {
      init[v.id] = v.initialComment ?? '';
    });
    return init;
  });

  const [submittedIds, setSubmittedIds] = useState<Set<string>>(() => new Set());

  const activeVendor =
    VENDORS_TO_RATE.find((v) => v.id === activeVendorId) || VENDORS_TO_RATE[0];

  const handleSubmitReview = () => {
    setSubmittedIds((prev) => {
      const next = new Set(prev);
      next.add(activeVendor.id);
      return next;
    });
    setRatings((prev) => ({ ...prev, [activeVendor.id]: 0 }));
    setComments((prev) => ({ ...prev, [activeVendor.id]: '' }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFA]">
      {/* Full-bleed Dark Event Hero Banner */}
      <CompletedHeroBanner
        eventTitle="Perera–Silva wedding"
        subtitle="Marked complete by the event manager on Sat 12 Dec, 11.40 pm. All three payment stages are released."
        coverImageSrc="/images/event-1.jpg"
      />

      {/* Main 2-Column Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Main Review Card */}
          <div className="lg:col-span-8">
            <VendorReviewCard
              vendor={activeVendor}
              rating={ratings[activeVendor.id] ?? 0}
              comment={comments[activeVendor.id] ?? ''}
              isSubmitted={submittedIds.has(activeVendor.id)}
              onRatingChange={(stars) =>
                setRatings((prev) => ({ ...prev, [activeVendor.id]: stars }))
              }
              onCommentChange={(val) =>
                setComments((prev) => ({ ...prev, [activeVendor.id]: val }))
              }
              onSubmit={handleSubmitReview}
            />
          </div>

          {/* Right: Vendors to Rate Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-6">
            <VendorsToRateSidebar
              vendors={VENDORS_TO_RATE}
              activeVendorId={activeVendor.id}
              submittedVendorIds={submittedIds}
              onSelectVendor={setActiveVendorId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
