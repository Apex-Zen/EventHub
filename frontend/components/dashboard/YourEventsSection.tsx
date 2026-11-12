import React from 'react';
import Link from 'next/link';
import EventListItem from './EventListItem';
import { EventItemData, YourEventsSectionProps } from './types';

const defaultEvents: EventItemData[] = [
  {
    id: '1',
    title: 'Perera–Silva wedding',
    subtitle: 'Sat 12 Dec 2026 · Night · Colombo · 4 vendors',
    imageSrc: '/images/event-1.jpg',
    imageAlt: 'Wedding reception',
    statusText: '2 of 4 accepted',
    statusVariant: 'teal',
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
          className="text-sm font-medium text-[#266665] hover:text-[#123B3A] hover:underline transition-colors"
        >
          See all
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {events.map((event) => (
          <EventListItem key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}

