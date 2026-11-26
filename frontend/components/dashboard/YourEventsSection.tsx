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
    isDraft: true,
    lastEdited: '2 days ago',
    href: '/client/events/create',
  },
  {
    id: '5',
    title: 'Colombo Indie Music Fest',
    subtitle: 'Sat 26 Dec 2026 · Public · Colombo',
    imageSrc: '/images/public-event.jpg',
    imageAlt: 'Indie music festival stage',
    statusText: 'Draft',
    statusVariant: 'gray',
    isDraft: true,
    lastEdited: '5 days ago',
    href: '/client/events/public',
  },
  {
    id: '6',
    title: 'Kandy Heritage Dinner',
    subtitle: 'Sun 10 Jan 2027 · Night · Kandy',
    imageSrc: '/images/private-event.jpg',
    imageAlt: 'Heritage dinner setup',
    statusText: 'Draft',
    statusVariant: 'gray',
    isDraft: true,
    lastEdited: '3 weeks ago',
    href: '/client/events/create',
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
  {
    id: '4',
    title: 'Perera–Silva wedding',
    subtitle: 'Sat 12 Dec 2026 · Night · Colombo · All stages released',
    imageSrc: '/images/event-1.jpg',
    imageAlt: 'Completed wedding reception',
    statusText: 'Completed',
    statusVariant: 'green',
    href: '/client/events/4/completed',
  },
];

export default function YourEventsSection({
  title = 'Your events',
  seeAllHref = '#',
  events = defaultEvents,
}: YourEventsSectionProps) {
  const [eventList, setEventList] = useState<EventItemData[]>(events);
  const [activeTab, setActiveTab] = useState<'drafts' | 'confirmed'>('drafts');
  const drafts = eventList.filter((event) =>
    event.isDraft || /draft|in progress|planning/i.test(event.statusText),
  );
  const confirmed = eventList.filter((event) => !drafts.includes(event));
  const visibleEvents = activeTab === 'drafts' ? drafts : confirmed;

  const handleDeleteDraft = (id: string) => {
    setEventList((prev) => prev.filter((item) => item.id !== id));
  };

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
          visibleEvents.map((event) => (
            <EventListItem
              key={event.id}
              event={event}
              onDelete={handleDeleteDraft}
            />
          ))
        ) : (
          <p className="py-8 text-center text-sm text-[#4B5563]">
            No {activeTab === 'drafts' ? 'drafts' : 'confirmed events'}.
          </p>
        )}
      </div>
    </section>
  );
}

