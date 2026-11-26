'use client';

import React, { useState } from 'react';
import {
  ConfirmedEventHeaderCard,
  BeforeTheDayCard,
  TimelineOnTheDayCard,
  BeforeTheDayItem,
  TimelineItem,
} from '@/components/events/confirmed';

const BEFORE_THE_DAY_ITEMS: BeforeTheDayItem[] = [
  {
    id: 'balance',
    title: 'Balance payment',
    subtitle: '80% (LKR 784,000) due by Sat 5 Dec',
    badgeText: 'Due in 41 days',
    badgeVariant: 'amber',
  },
  {
    id: 'vendors',
    title: 'Vendors confirmed',
    subtitle: 'Photography, catering, decoration',
    badgeText: '3 of 3',
    badgeVariant: 'green',
  },
  {
    id: 'rsvps',
    title: 'Guest RSVPs',
    subtitle: '140 yes · 18 no · 92 no reply',
    badgeText: '140 of 250',
    badgeVariant: 'gray',
  },
  {
    id: 'contact',
    title: 'Your on-site contact',
    subtitle: 'Dilini J. from EventHub staff',
    actionLabel: 'Message',
    actionHref: '/client/messages',
  },
];

const TIMELINE_ITEMS: TimelineItem[] = [
  { id: 't1', time: '3.00 pm', activity: 'Decor setup' },
  { id: 't2', time: '3.30 pm', activity: 'Catering setup' },
  { id: 't3', time: '4.30 pm', activity: 'Photographer arrives' },
  { id: 't4', time: '6.30 pm', activity: 'Guests arrive' },
  { id: 't5', time: '11.30 pm', activity: 'Event ends' },
];

export default function ConfirmedEventDetailPage() {
  const [isCancelled, setIsCancelled] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFA] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Event Summary Header Card (no countdown boxes, no My bookings link) */}
        <ConfirmedEventHeaderCard
          label="PERERA–SILVA WEDDING"
          dateTime="Sat 12 Dec 2026 · 6.30 pm"
          venueAndGuests="Waters Edge, Battaramulla · 250 guests"
          imageSrc="/images/light-studio.jpg"
          isCancelled={isCancelled}
          onCancelEvent={() => setIsCancelled(true)}
        />

        {/* 2-Column Content: Before the day & Timeline on the day */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <BeforeTheDayCard items={BEFORE_THE_DAY_ITEMS} />
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-6">
            <TimelineOnTheDayCard items={TIMELINE_ITEMS} />
          </div>
        </div>
      </div>
    </div>
  );
}
