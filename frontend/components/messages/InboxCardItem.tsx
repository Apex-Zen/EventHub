'use client';

import React from 'react';
import Link from 'next/link';
import { InboxItem } from './types';

interface InboxCardItemProps {
  item: InboxItem;
}

export default function InboxCardItem({ item }: InboxCardItemProps) {
  const displayName = item.roleOrCategory
    ? `${item.name} · ${item.roleOrCategory}`
    : item.name;

  return (
    <Link
      href={item.href}
      className="group flex items-center justify-between gap-4 px-6 py-4.5 sm:py-5 transition-colors hover:bg-gray-50/80 no-underline cursor-pointer"
    >
      {/* Left: Avatar + Details */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="h-11 w-11 sm:h-12 sm:w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 border border-gray-100">
          <img
            src={item.avatarSrc}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-semibold text-[#1B2430] leading-snug truncate">
            {displayName}
          </h3>
          <p className="text-xs sm:text-sm text-[#4B5563] mt-0.5 truncate leading-relaxed">
            {item.lastMessage}
          </p>
        </div>
      </div>

      {/* Right: Unread Badge or Timestamp */}
      <div className="flex items-center flex-shrink-0 ml-2">
        {item.unreadCount && item.unreadCount > 0 ? (
          <span className="inline-flex items-center rounded-full bg-[#DBECEC] px-3 py-1 text-xs font-semibold text-[#266665]">
            {item.unreadCount} new
          </span>
        ) : (
          <span className="text-xs sm:text-sm text-[#4B5563]">
            {item.timestamp}
          </span>
        )}
      </div>
    </Link>
  );
}

