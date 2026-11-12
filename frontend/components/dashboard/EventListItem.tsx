import React from 'react';
import Link from 'next/link';
import StatusBadge from './StatusBadge';
import { EventListItemProps } from './types';

export default function EventListItem({ event }: EventListItemProps) {
  return (
    <div className="flex items-center justify-between py-4 sm:py-5 gap-4 transition hover:bg-gray-50/70 -mx-2 px-2 sm:-mx-3 sm:px-3 rounded-lg">
      {/* Event Details Left Side */}
      <div className="flex items-center gap-4 sm:gap-6 min-w-0">
        <div className="w-24 h-16 sm:w-28 sm:h-20 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
          <img
            src={event.imageSrc}
            alt={event.imageAlt || event.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <h4 className="font-serif font-bold text-lg sm:text-xl text-[#1B2430] leading-snug truncate">
            {event.title}
          </h4>
          <p className="text-xs sm:text-sm text-[#4B5563] mt-1 leading-normal truncate">
            {event.subtitle}
          </p>
        </div>
      </div>

      {/* Status & Action Right Side */}
      <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
        <StatusBadge
          text={event.statusText}
          variant={event.statusVariant}
        />
        <Link
          href={event.href || '#'}
          className="text-sm font-medium text-[#1B2430] hover:text-[#266665] hover:underline transition-colors"
        >
          Open
        </Link>
      </div>
    </div>
  );
}

