'use client';

import React from 'react';
import { NotificationFilter } from './types';

interface NotificationTabsProps {
  activeTab: NotificationFilter;
  onTabChange: (tab: NotificationFilter) => void;
  counts?: Partial<Record<NotificationFilter, number>>;
}

const TABS: { id: NotificationFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'package', label: 'Package responses' },
  { id: 'payment', label: 'Payments' },
  { id: 'message', label: 'Messages' },
];

export default function NotificationTabs({
  activeTab,
  onTabChange,
  counts,
}: NotificationTabsProps) {
  return (
    <div className="flex items-center gap-6 sm:gap-8 border-b border-gray-200/70 text-sm overflow-x-auto no-scrollbar">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = counts?.[tab.id];

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`pb-2.5 -mb-px transition-colors whitespace-nowrap text-sm ${
              isActive
                ? 'border-b-2 border-[#266665] font-semibold text-[#1B2430]'
                : 'border-b-2 border-transparent font-normal text-[#4B5563] hover:text-[#1B2430]'
            }`}
          >
            {tab.label}
            {count !== undefined && count > 0 && tab.id !== 'all' && (
              <span className="ml-1.5 text-xs text-gray-400 font-normal">
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

