'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import {
  SlotLockCountdownCard,
  HoldVendorsSidebar,
  HoldVendorItem,
} from '@/components/events/hold';

const HOLD_VENDORS: HoldVendorItem[] = [
  {
    id: '1',
    name: 'Lens & Light Studio',
    subtitle: 'Photography',
    statusText: 'Accepted',
    statusVariant: 'green',
  },
  {
    id: '3',
    name: 'Ceylon Spice Caterers',
    subtitle: 'Catering',
    statusText: 'Accepted',
    statusVariant: 'green',
  },
  {
    id: '4',
    name: 'Bloom Decor',
    subtitle: 'Decoration · 5 h 40 m left',
    statusText: 'Waiting',
    statusVariant: 'amber',
  },
];

export default function EventDatesOnHoldPage() {
  const params = useParams();
  const eventId = (params?.eventId as string) || '1';

  return (
    <div className="min-h-screen bg-[#F8FAFA] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B2430] leading-tight">
            Your dates are on hold
          </h1>

          <p className="text-sm sm:text-base text-[#4B5563]">
            Vendors have 48 hours to accept. Their dates stay held for you until then.
          </p>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <SlotLockCountdownCard />
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-6">
            <HoldVendorsSidebar
              vendors={HOLD_VENDORS}
              packageStatusHref={`/client/events/${encodeURIComponent(eventId)}/waiting`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
