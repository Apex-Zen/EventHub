'use client';

import React, { useState, useMemo } from 'react';
import {
  NotificationHeader,
  NotificationTabs,
  NotificationItemCard,
  NotificationEventSidebar,
  NotificationItem,
  NotificationFilter,
} from '@/components/notifications';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Bloom Decor rejected your package request',
    description: 'Perera–Silva wedding · 12 Dec is free again for other decorators.',
    timestamp: '2 h ago',
    isRead: false,
    type: 'rejected',
    category: 'package',
    link: '/client/events/1/waiting',
  },
  {
    id: 'notif-2',
    title: 'Ceylon Spice Caterers accepted',
    description: 'Catering for 250 guests is booked for 12 Dec, night.',
    timestamp: '5 h ago',
    isRead: false,
    type: 'accepted',
    category: 'package',
    link: '/client/events/1/waiting',
  },
  {
    id: 'notif-3',
    title: 'Lens & Light Studio accepted',
    description: 'Full-day coverage is booked for 12 Dec, night.',
    timestamp: '9 h ago',
    isRead: false,
    type: 'accepted',
    category: 'package',
    link: '/client/events/1/waiting',
  },
  {
    id: 'notif-4',
    title: 'Responses close in 31 hours',
    description: 'Vendors who do not answer by Wed 21 Oct, 9.40 pm expire.',
    timestamp: '10 h ago',
    isRead: true,
    type: 'warning',
    category: 'package',
    link: '/client/events/1/waiting',
  },
  {
    id: 'notif-5',
    title: 'New message from Kasun Fernando',
    description: '"Can we visit the venue on the 5th?"',
    timestamp: 'Yesterday',
    isRead: true,
    type: 'message',
    category: 'message',
    link: '/client/messages',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<NotificationFilter>('all');

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'all') return notifications;
    return notifications.filter((n) => n.category === activeTab);
  }, [notifications, activeTab]);

  const hasUnread = useMemo(() => {
    return notifications.some((n) => !n.isRead);
  }, [notifications]);

  const counts = useMemo(() => {
    return {
      all: notifications.length,
      package: notifications.filter((n) => n.category === 'package').length,
      payment: notifications.filter((n) => n.category === 'payment').length,
      message: notifications.filter((n) => n.category === 'message').length,
    };
  }, [notifications]);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: !item.isRead } : item))
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFA] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <NotificationHeader
          title="Notifications"
          onMarkAllAsRead={handleMarkAllAsRead}
          hasUnread={hasUnread}
        />

        {/* Filter Tabs */}
        <NotificationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
        />

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-1">
          {/* Left Column: Notification Item List */}
          <div className="lg:col-span-8">
            <div className="rounded-xl border border-gray-200/80 bg-white shadow-xs overflow-hidden divide-y divide-gray-100">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notif) => (
                  <NotificationItemCard
                    key={notif.id}
                    notification={notif}
                    onToggleRead={handleToggleRead}
                  />
                ))
              ) : (
                <div className="py-12 px-6 text-center text-sm text-[#4B5563]">
                  No notifications in this category.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Event Summary Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-6">
            <NotificationEventSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

