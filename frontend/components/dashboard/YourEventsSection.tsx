"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import EventListItem from './EventListItem';
import { EventItemData, YourEventsSectionProps } from './types';

const defaultEvents: EventItemData[] = [
  {
    id: '1',
    title: 'Perera–Silva wedding',
    subtitle: 'Sat 12 Dec 2026 · Night · Colombo · 2 of 4 vendors confirmed',
    imageSrc: '/images/event-1.jpg',
    imageAlt: 'Wedding reception',
    statusText: 'Deposit paid',
    statusVariant: 'green',
    href: '#',
  },
  {
    id: '2',
    title: 'Office year-end party',
    subtitle: 'Fri 18 Dec 2026 · Day · Gampaha',
    imageSrc: '/images/event-2.jpg',
    imageAlt: 'Office party celebration',
    statusText: 'Draft',
    statusVariant: 'gray',
    href: '#',
  },
  {
    id: '3',
    title: 'Galle Face Jazz Night',
    subtitle: 'Sat 14 Nov 2026 · Public · 312 of 500 sold',
    imageSrc: '/images/event-3.jpg',
    imageAlt: 'Jazz performance night',
    statusText: 'On sale',
    statusVariant: 'teal',
    href: '#',
  },
];

export default function YourEventsSection({
  title = 'Your events',
  seeAllHref = '#',
  events = defaultEvents,
}: YourEventsSectionProps) {
  const [activeTab, setActiveTab] = useState<'drafts' | 'confirmed'>('drafts');
  const drafts = events.filter((event) =>
    /draft|in progress|planning/i.test(event.statusText),
  );
  const confirmed = events.filter((event) => !drafts.includes(event));
  const visibleEvents = activeTab === 'drafts' ? drafts : confirmed;

  return (
    <section
      aria-labelledby="your-events-heading"
      className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-6 sm:p-8"
    >
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h2
          id="your-events-heading"
          className="font-serif text-2xl sm:text-3xl font-bold text-[#1B2430] leading-tight"
        >
          {title}
        </h2>
        <Link
          href={seeAllHref}
          className="text-sm font-medium text-[#266665] hover:text-[#123B3A] no-underline hover:no-underline transition-colors"
        >
          See all
        </Link>
      </div>

      <div role="tablist" aria-label="Event status" className="flex gap-6 border-b border-gray-200 mb-2">
        <button
          id="drafts-tab"
          type="button"
          role="tab"
          aria-selected={activeTab === 'drafts'}
          aria-controls="events-panel"
          onClick={() => setActiveTab('drafts')}
          className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors ${
            activeTab === 'drafts'
              ? 'border-[#266665] text-[#266665]'
              : 'border-transparent text-gray-500 hover:text-[#1B2430]'
          }`}
        >
          Drafts <span className="ml-2 text-xs text-gray-500">{drafts.length}</span>
        </button>
        <button
          id="confirmed-tab"
          type="button"
          role="tab"
          aria-selected={activeTab === 'confirmed'}
          aria-controls="events-panel"
          onClick={() => setActiveTab('confirmed')}
          className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors ${
            activeTab === 'confirmed'
              ? 'border-[#266665] text-[#266665]'
              : 'border-transparent text-gray-500 hover:text-[#1B2430]'
          }`}
        >
          Confirmed <span className="ml-2 text-xs text-gray-500">{confirmed.length}</span>
        </button>
      </div>

      <div
        id="events-panel"
        role="tabpanel"
        aria-labelledby={activeTab === 'drafts' ? 'drafts-tab' : 'confirmed-tab'}
        className="divide-y divide-gray-100"
      >
        {visibleEvents.length ? (
          visibleEvents.map((event) => <EventListItem key={event.id} event={event} />)
        ) : (
          <p className="py-8 text-center text-sm text-[#4B5563]">
            No {activeTab === 'drafts' ? 'drafts' : 'confirmed events'}.
          </p>
        )}
      </div>
    </section>
  );
}

