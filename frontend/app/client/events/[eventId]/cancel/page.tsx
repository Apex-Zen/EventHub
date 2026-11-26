'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CancelHeroBanner,
  CancelReasonCard,
  CancelPenaltyCard,
} from '@/components/events/cancel';

export default function CancelEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = (params?.eventId as string) || '4';

  const confirmedHref = `/client/events/${encodeURIComponent(eventId)}/confirmed`;

  const handleRequestCancellation = () => {
    // Navigate back to the events list after requesting cancellation
    router.push('/client/events');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFA] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <CancelHeroBanner
          subtitle="Sat 12 Dec 2026 · 48 days away · 3 vendors booked"
        />

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <CancelReasonCard
              keepEventHref={confirmedHref}
              onRequestCancellation={handleRequestCancellation}
            />
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-6">
            <CancelPenaltyCard />
          </div>
        </div>
      </div>
    </div>
  );
}
