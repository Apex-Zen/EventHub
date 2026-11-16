'use client';

import React from 'react';
import { InboxFilter } from './types';

interface InboxTabsProps {
  activeTab: InboxFilter;
  onTabChange: (tab: InboxFilter) => void;
  unreadCount?: number;
}

export default function InboxTabs({
  activeTab,
  onTabChange,
  unreadCount = 3,
}: InboxTabsProps) {
  const tabs: { id: InboxFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'vendors', label: 'Vendors' },
    { id: 'team', label: 'EventHub team' },
    { id: 'unread', label: `Unread (${unreadCount})` },
  ];

  return (
    <div className="flex items-center gap-6 sm:gap-8 border-b border-gray-200/80 text-sm mb-6 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`pb-2.5 -mb-px transition-colors whitespace-nowrap text-sm cursor-pointer ${
              isActive
                ? 'border-b-2 border-[#266665] font-semibold text-[#1B2430]'
                : 'border-b-2 border-transparent font-normal text-[#4B5563] hover:text-[#1B2430]'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

