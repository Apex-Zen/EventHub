'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ConversationList,
  ChatWindow,
  PackageSidebar,
  ConversationItem,
} from '@/components/messages';

const INITIAL_CONVERSATIONS: ConversationItem[] = [
  {
    id: 'c1',
    vendorId: '1',
    vendorName: 'Lens & Light Studio',
    category: 'Photography',
    statusNote: 'Accepted for 12 Dec',
    avatarSrc: '/images/profile-pic.jpg',
    lastMessage: 'Can we visit the venue on the 5th?',
    lastMessageTime: '9.12 pm',
    packageDetails: {
      title: 'Full-day wedding coverage',
      imageSrc: '/images/kandyan-frames.jpg',
      imageAlt: 'Beach couple photography session',
      price: 'LKR 180,000',
      date: '12 Dec, night',
      status: 'Accepted',
      noticeText:
        'Chat does not change the package or create a booking. Changes go through a new package request.',
    },
    messages: [
      {
        id: 'm1',
        sender: 'vendor',
        text: 'Hi Nadeesha, thanks for the request. We have accepted full-day coverage for the 12th.',
        timestamp: '8.02 pm',
      },
      {
        id: 'm2',
        sender: 'user',
        text: 'Great. Can the album include the homecoming on the 13th?',
        timestamp: '8.30 pm',
      },
      {
        id: 'm3',
        sender: 'vendor',
        text: 'That would be a separate service. Can we visit the venue on the 5th?',
        timestamp: '9.12 pm',
      },
    ],
  },
  {
    id: 'c2',
    vendorId: '3',
    vendorName: 'Ceylon Spice Caterers',
    category: 'Catering',
    statusNote: 'Accepted for 12 Dec',
    avatarSrc: '/images/ceylone-spice.jpg',
    lastMessage: 'Menu attached. Please confirm by Friday.',
    lastMessageTime: 'Mon',
    packageDetails: {
      title: 'Grand Wedding Buffet',
      imageSrc: '/images/ceylone-spice.jpg',
      imageAlt: 'Catering banquet setup',
      price: 'LKR 3,200 / guest',
      date: '12 Dec, night',
      status: 'Accepted',
      noticeText:
        'Chat does not change the package or create a booking. Changes go through a new package request.',
    },
    messages: [
      {
        id: 'm2-1',
        sender: 'vendor',
        text: 'Hello Nadeesha! We have received your guest headcount of 250.',
        timestamp: 'Mon 10:15 am',
      },
      {
        id: 'm2-2',
        sender: 'vendor',
        text: 'Menu attached. Please confirm by Friday.',
        timestamp: 'Mon 10:16 am',
      },
    ],
  },
  {
    id: 'c3',
    vendorId: '4',
    vendorName: 'Bloom Decor',
    category: 'Decoration',
    statusNote: 'Declined for 12 Dec',
    avatarSrc: '/images/bloom-deco.jpg',
    lastMessage: 'Sorry, we are fully booked that night.',
    lastMessageTime: 'Mon',
    packageDetails: {
      title: 'Hall & Poruwa Complete Decor',
      imageSrc: '/images/bloom-deco.jpg',
      imageAlt: 'Poruwa floral backdrop',
      price: 'LKR 220,000',
      date: '12 Dec, night',
      status: 'Declined',
      noticeText:
        'Chat does not change the package or create a booking. Changes go through a new package request.',
    },
    messages: [
      {
        id: 'm3-1',
        sender: 'user',
        text: 'Hi Bloom Decor, wanted to check if your team is available for our wedding on 12 Dec?',
        timestamp: 'Mon 09:00 am',
      },
      {
        id: 'm3-2',
        sender: 'vendor',
        text: 'Sorry, we are fully booked that night.',
        timestamp: 'Mon 09:30 am',
      },
    ],
  },
];

function MessagesContent() {
  const searchParams = useSearchParams();
  const vendorIdParam = searchParams.get('vendorId') || searchParams.get('vendor');

  const [conversations, setConversations] = useState<ConversationItem[]>(INITIAL_CONVERSATIONS);

  const initialSelectedId = useMemo(() => {
    if (vendorIdParam) {
      const match = INITIAL_CONVERSATIONS.find(
        (c) => c.vendorId === vendorIdParam || c.id === vendorIdParam
      );
      if (match) return match.id;
    }
    return 'c1';
  }, [vendorIdParam]);

  const [selectedId, setSelectedId] = useState<string>(initialSelectedId);

  const selectedConversation =
    conversations.find((c) => c.id === selectedId) || conversations[0];

  const handleSendMessage = (conversationId: string, text: string) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user' as const,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase(),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFA] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ── 3-Column Message Container ───────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden h-[calc(100vh-6.5rem)] min-h-[580px] grid grid-cols-1 md:grid-cols-12">
          {/* Left: Conversation List (4 of 12 cols on desktop) */}
          <div className="md:col-span-4 lg:col-span-3 h-full overflow-hidden">
            <ConversationList
              conversations={conversations}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>

          {/* Center: Active Chat Window (5-6 cols on desktop) */}
          <div className="md:col-span-8 lg:col-span-6 h-full overflow-hidden border-r border-gray-200/80">
            <ChatWindow
              conversation={selectedConversation}
              onSendMessage={handleSendMessage}
            />
          </div>

          {/* Right: Package Summary Sidebar (3 cols on desktop) */}
          <div className="hidden lg:block lg:col-span-3 h-full overflow-hidden">
            <PackageSidebar packageDetails={selectedConversation.packageDetails} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={null}>
      <MessagesContent />
    </Suspense>
  );
}

