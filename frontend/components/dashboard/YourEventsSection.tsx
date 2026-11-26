'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import EventListItem from './EventListItem';
import { EventItemData, EventTabCategory, YourEventsSectionProps } from './types';

const defaultEvents: EventItemData[] = [
  {
    id: '1',
    title: 'Perera–Silva wedding',
    subtitle: 'Sat 12 Dec 2026 · Night · Colombo · 2 of 4 vendors confirmed',
    imageSrc: '/images/event-1.jpg',
    imageAlt: 'Wedding reception',
    statusText: 'Deposit paid',
    statusVariant: 'green',
    tabCategory: 'upcoming',
    href: '/client/events/1/waiting',
  },
  {
    id: '3',
    title: 'Galle Face Jazz Night',
    subtitle: 'Sat 14 Nov 2026 · Public · 312 of 500 sold',
    imageSrc: '/images/event-3.jpg',
    imageAlt: 'Jazz performance night',
    statusText: 'On sale',
    statusVariant: 'teal',
    tabCategory: 'upcoming',
    href: '/client/events/public/sales',
  },
  {
    id: '7',
    title: 'Perera–Silva wedding',
    subtitle: 'Sat 12 Dec 2026 · Night · Colombo · 2 of 3 accepted',
    imageSrc: '/images/event-1.jpg',
    imageAlt: 'Wedding reception on hold',
    statusText: 'Dates on hold',
    statusVariant: 'amber',
    tabCategory: 'upcoming',
    href: '/client/events/7/hold',
  },
  {
    id: '4',
    title: 'Perera–Silva wedding',
    subtitle: 'Sat 12 Dec 2026 · Night · Colombo · All stages released',
    imageSrc: '/images/event-1.jpg',
    imageAlt: 'Completed wedding reception',
    statusText: 'Completed',
    statusVariant: 'green',
    tabCategory: 'past',
    href: '/client/events/4/completed',
  },
  {
    id: '8',
    title: 'Negombo Beach Brunch',
    subtitle: 'Sun 08 Nov 2026 · Day · Negombo · Cancelled by client',
    imageSrc: '/images/kandyan-frames.jpg',
    imageAlt: 'Beach brunch',
    statusText: 'Cancelled',
    statusVariant: 'red',
    tabCategory: 'cancelled',
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
    tabCategory: 'drafts',
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
    tabCategory: 'drafts',
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
    tabCategory: 'drafts',
    href: '/client/events/create',
  },
];

const TABS: { id: EventTabCategory; label: string }[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'drafts', label: 'Drafts' },
];

export default function YourEventsSection({
  title = 'Your events',
  seeAllHref = '#',
  events = defaultEvents,
}: YourEventsSectionProps) {
  const [eventList, setEventList] = useState<EventItemData[]>(events);
  const [activeTab, setActiveTab] = useState<EventTabCategory>('upcoming');

  const getCategory = (event: EventItemData): EventTabCategory => {
    if (event.tabCategory) return event.tabCategory;
    if (event.isDraft || /draft|in progress|planning/i.test(event.statusText)) {
      return 'drafts';
    }
    if (/completed/i.test(event.statusText)) return 'past';
    if (/cancelled/i.test(event.statusText)) return 'cancelled';
    return 'upcoming';
  };

  const visibleEvents = eventList.filter((e) => getCategory(e) === activeTab);

  const handleDeleteDraft = (id: string) => {
    setEventList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDownloadReceipt = (event: EventItemData) => {
    const receiptText = [
      'EVENTHUB - EVENT RECEIPT',
      '========================',
      `Event: ${event.title}`,
      `Details: ${event.subtitle}`,
      `Status: ${event.statusText}`,
      `Generated: ${new Date().toLocaleDateString()}`,
    ].join('\n');

    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-receipt.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

      <div role="tablist" aria-label="Event status" className="flex gap-6 border-b border-gray-200 mb-2 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const count = eventList.filter((e) => getCategory(e) === tab.id).length;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`${tab.id}-tab`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="events-panel"
              onClick={() => setActiveTab(tab.id)}
              className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[#266665] text-[#266665]'
                  : 'border-transparent text-gray-500 hover:text-[#1B2430]'
              }`}
            >
              {tab.label} <span className="ml-1.5 text-xs text-gray-500">{count}</span>
            </button>
          );
        })}
      </div>

      <div
        id="events-panel"
        role="tabpanel"
        aria-labelledby={`${activeTab}-tab`}
        className="divide-y divide-gray-100"
      >
        {visibleEvents.length ? (
          visibleEvents.map((event) => (
            <EventListItem
              key={event.id}
              event={event}
              onDelete={handleDeleteDraft}
              onDownloadReceipt={handleDownloadReceipt}
            />
          ))
        ) : (
          <p className="py-8 text-center text-sm text-[#4B5563]">
            No {activeTab} events.
          </p>
        )}
      </div>
    </section>
  );
}
