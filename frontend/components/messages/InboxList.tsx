import React from 'react';
import { InboxItem } from './types';
import InboxCardItem from './InboxCardItem';

interface InboxListProps {
  items: InboxItem[];
  emptyMessage?: string;
}

export default function InboxList({
  items,
  emptyMessage = 'No messages in this category.',
}: InboxListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white shadow-xs p-12 text-center text-sm text-[#4B5563]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-xs overflow-hidden divide-y divide-gray-100">
      {items.map((item) => (
        <InboxCardItem key={item.id} item={item} />
      ))}
    </div>
  );
}

