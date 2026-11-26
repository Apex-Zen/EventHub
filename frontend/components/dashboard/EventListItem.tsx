import React from 'react';
import Link from 'next/link';
import StatusBadge from './StatusBadge';
import { EventListItemProps } from './types';

export default function EventListItem({
  event,
  onDelete,
  onDownloadReceipt,
}: EventListItemProps) {
  const isDraft = event.tabCategory === 'drafts' || event.isDraft || /draft/i.test(event.statusText);
  const isPast = event.tabCategory === 'past' || /completed/i.test(event.statusText);
  const isCancelled = event.tabCategory === 'cancelled' || /cancelled/i.test(event.statusText);

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
      <div className="flex items-center gap-4 sm:gap-5 flex-shrink-0">
        {isDraft ? (
          <>
            <button
              type="button"
              onClick={() => onDelete && onDelete(event.id)}
              className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
            >
              Delete
            </button>
            <Link
              href={event.href || '#'}
              className="text-sm font-medium text-[#1B2430] hover:text-[#266665] no-underline hover:no-underline transition-colors"
            >
              Resume
            </Link>
          </>
        ) : isPast ? (
          <>
            <StatusBadge
              text={event.statusText}
              variant={event.statusVariant}
            />
            <Link
              href={event.href || `/client/events/${event.id}/completed`}
              className="text-sm font-medium text-[#266665] hover:text-[#123B3A] no-underline hover:no-underline transition-colors"
            >
              Rate vendors
            </Link>
            <button
              type="button"
              onClick={() => onDownloadReceipt && onDownloadReceipt(event)}
              className="text-sm font-medium text-[#1B2430] hover:text-[#266665] transition-colors cursor-pointer"
            >
              Receipt
            </button>
          </>
        ) : isCancelled ? (
          <StatusBadge
            text={event.statusText}
            variant={event.statusVariant}
          />
        ) : (
          <>
            <StatusBadge
              text={event.statusText}
              variant={event.statusVariant}
            />
            <Link
              href={event.href || '#'}
              className="text-sm font-medium text-[#1B2430] hover:text-[#266665] no-underline hover:no-underline transition-colors"
            >
              Open
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
