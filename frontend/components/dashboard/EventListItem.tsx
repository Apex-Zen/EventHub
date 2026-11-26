import React from 'react';
import Link from 'next/link';
import StatusBadge from './StatusBadge';
import { EventListItemProps } from './types';

export default function EventListItem({ event, onDelete }: EventListItemProps) {
  const isDraft = event.isDraft ?? /draft/i.test(event.statusText);

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
            {event.lastEdited && (
              <span className="text-gray-400"> · Edited {event.lastEdited}</span>
            )}
          </p>
        </div>
      </div>

      {/* Status & Action Right Side */}
      <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
        {isDraft ? (
          <button
            type="button"
            onClick={() => onDelete && onDelete(event.id)}
            className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
          >
            Delete
          </button>
        ) : (
          <StatusBadge
            text={event.statusText}
            variant={event.statusVariant}
          />
        )}
        <Link
          href={event.href || '#'}
          className="text-sm font-medium text-[#1B2430] hover:text-[#266665] no-underline hover:no-underline transition-colors"
        >
          {isDraft ? 'Resume' : 'Open'}
        </Link>
      </div>
    </div>
  );
}

