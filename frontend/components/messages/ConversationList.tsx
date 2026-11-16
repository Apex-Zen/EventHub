'use client';

import React, { useState } from 'react';
import { ConversationItem } from './types';

interface ConversationListProps {
  conversations: ConversationItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = conversations.filter((c) =>
    c.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200/80">
      {/* Header with Back Button + Search Bar */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-2.5">
        <button
          type="button"
          aria-label="Back to inbox"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#266665] shadow-xs transition-colors hover:bg-gray-50 hover:border-[#266665]/40 focus:outline-none"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" strokeWidth={2} />
            <path strokeLinecap="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendors"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm text-[#1B2430] placeholder-gray-400 focus:outline-none focus:border-[#266665] focus:ring-1 focus:ring-[#266665] transition-all"
          />
        </div>
      </div>

      {/* Conversation Items List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {filtered.map((item) => {
          const isSelected = item.id === selectedId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                isSelected
                  ? 'border-l-4 border-[#266665] bg-[#EBF4F4]'
                  : 'border-l-4 border-transparent hover:bg-gray-50'
              }`}
            >
              {/* Vendor Avatar */}
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 border border-gray-100">
                <img
                  src={item.avatarSrc}
                  alt={item.vendorName}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Conversation Meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="text-sm font-semibold text-[#1B2430] truncate">
                    {item.vendorName}
                  </h4>
                  <span className="text-[11px] text-[#4B5563] flex-shrink-0">
                    {item.lastMessageTime}
                  </span>
                </div>
                <p className="text-xs text-[#4B5563] truncate leading-relaxed">
                  {item.lastMessage}
                </p>
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-6 text-center text-xs text-[#4B5563]">
            No conversations found.
          </div>
        )}
      </div>
    </div>
  );
}

