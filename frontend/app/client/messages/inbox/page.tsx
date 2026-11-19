'use client';

import React, { useState, useMemo } from 'react';
import {
  InboxHeader,
  InboxTabs,
  InboxList,
  InboxItem,
  InboxFilter,
} from '@/components/messages';

const INITIAL_INBOX_ITEMS: InboxItem[] = [
  {
    id: 'inbox-1',
    name: 'Lens & Light Studio',
    avatarSrc: '/images/profile-pic.jpg',
    lastMessage: 'Kasun: Can we visit the venue on the 5th?',
    timestamp: 'Yesterday',
    unreadCount: 2,
    category: 'vendor',
    href: '/client/messages?vendorId=1',
  },
  {
    id: 'inbox-2',
    name: 'Shehan G.',
    roleOrCategory: 'Event Manager',
    avatarSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Your package for the Perera–Silva wedding is approved.',
    timestamp: 'Yesterday',
    unreadCount: 1,
    category: 'team',
    href: '/client/messages?vendorId=1',
  },
  {
    id: 'inbox-3',
    name: 'Dilini J.',
    roleOrCategory: 'EventHub staff',
    avatarSrc: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'I will be your contact on the day. Here is the timeline.',
    timestamp: 'Yesterday',
    category: 'team',
    href: '/client/messages?vendorId=1',
  },
  {
    id: 'inbox-4',
    name: 'Ceylon Spice Caterers',
    avatarSrc: '/images/ceylone-spice.jpg',
    lastMessage: 'Menu tasting is booked for 28 Nov.',
    timestamp: 'Mon',
    category: 'vendor',
    href: '/client/messages?vendorId=3',
  },
  {
    id: 'inbox-5',
    name: 'Bloom Decor',
    avatarSrc: '/images/bloom-deco.jpg',
    lastMessage: 'Sorry, we are fully booked that night.',
    timestamp: 'Mon 19 Oct',
    category: 'vendor',
    href: '/client/messages?vendorId=4',
  },
];

export default function MessagesInboxPage() {
  const [items] = useState<InboxItem[]>(INITIAL_INBOX_ITEMS);
  const [activeTab, setActiveTab] = useState<InboxFilter>('all');

  const unreadTotal = useMemo(() => {
    return items.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);
  }, [items]);

  const filteredItems = useMemo(() => {
    switch (activeTab) {
      case 'vendors':
        return items.filter((item) => item.category === 'vendor');
      case 'team':
        return items.filter((item) => item.category === 'team');
      case 'unread':
        return items.filter((item) => (item.unreadCount || 0) > 0);
      case 'all':
      default:
        return items;
    }
  }, [items, activeTab]);

  return (
    <div className="min-h-screen bg-[#F8FAFA] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header & Subtitle */}
        <InboxHeader
          title="Messages"
          subtitle="Vendors in your packages and the EventHub team (staff and Event Manager)."
        />

        {/* Filter Tabs */}
        <InboxTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unreadCount={unreadTotal}
        />

        {/* Conversation List Card */}
        <InboxList items={filteredItems} />
      </div>
    </div>
  );
}

