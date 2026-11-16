'use client';

import React from 'react';
import Link from 'next/link';
import { NotificationItem } from './types';
import NotificationIcon from './NotificationIcon';

interface NotificationItemCardProps {
  notification: NotificationItem;
  onToggleRead?: (id: string) => void;
}

export default function NotificationItemCard({
  notification,
  onToggleRead,
}: NotificationItemCardProps) {
  const content = (
    <div
      onClick={() => onToggleRead && onToggleRead(notification.id)}
      className={`group flex items-center justify-between gap-4 px-5 sm:px-6 py-4 transition-colors cursor-pointer ${
        notification.isRead
          ? 'bg-white hover:bg-gray-50/70'
          : 'bg-[#EAF3F3] hover:bg-[#E1EDED]'
      }`}
    >
      {/* Left Icon + Text */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <NotificationIcon type={notification.type} />

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[#1B2430] leading-snug">
            {notification.title}
          </h3>
          <p className="text-xs text-[#4B5563] mt-0.5 leading-relaxed truncate sm:whitespace-normal">
            {notification.description}
          </p>
        </div>
      </div>

      {/* Right: Timestamp + Unread Status Dot */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className={`text-xs ${
            notification.isRead ? 'text-gray-400' : 'text-[#4B5563]'
          }`}
        >
          {notification.timestamp}
        </span>
        {!notification.isRead && (
          <span
            className="h-2 w-2 rounded-full bg-[#266665] flex-shrink-0"
            title="Unread notification"
          />
        )}
      </div>
    </div>
  );

  if (notification.link) {
    return (
      <Link href={notification.link} className="block no-underline">
        {content}
      </Link>
    );
  }

  return content;
}

