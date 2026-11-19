'use client';

import React from 'react';

interface NotificationHeaderProps {
  title?: string;
  onMarkAllAsRead?: () => void;
  hasUnread?: boolean;
}

export default function NotificationHeader({
  title = 'Notifications',
  onMarkAllAsRead,
  hasUnread = true,
}: NotificationHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-1">
      <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1B2430]">
        {title}
      </h1>

      {onMarkAllAsRead && (
        <button
          type="button"
          onClick={onMarkAllAsRead}
          disabled={!hasUnread}
          className={`text-sm font-medium transition-colors ${
            hasUnread
              ? 'text-[#266665] hover:text-[#123B3A] hover:underline cursor-pointer'
              : 'text-gray-400 cursor-default'
          }`}
        >
          Mark all as read
        </button>
      )}
    </div>
  );
}

