'use client';

import React from 'react';
import Link from 'next/link';
import { EventSummary } from './types';

interface NotificationEventSidebarProps {
  event?: EventSummary;
  onPayDeposit?: () => void;
}

const DEFAULT_EVENT: EventSummary = {
  title: 'Perera–Silva wedding',
  imageSrc: '/images/event-1.jpg',
  imageAlt: 'Perera–Silva wedding reception',
  date: 'Sat 12 Dec 2026, night',
  acceptedVendorsText: '2 of 3 vendors',
  depositDue: 'LKR 196,000',
  payDepositHref: '/client/events/1/waiting',
};

export default function NotificationEventSidebar({
  event = DEFAULT_EVENT,
  onPayDeposit,
}: NotificationEventSidebarProps) {
  return (
    <aside className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs space-y-4">
      {/* Event Cover Photo */}
      <div className="h-44 w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          src={event.imageSrc}
          alt={event.imageAlt}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Event Title */}
      <h2 className="font-serif text-xl font-bold text-[#1B2430]">
        {event.title}
      </h2>

      {/* Metadata Rows */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[#4B5563]">Date</span>
          <span className="font-medium text-[#1B2430]">{event.date}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#4B5563]">Accepted</span>
          <span className="font-medium text-[#1B2430]">{event.acceptedVendorsText}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#4B5563]">Deposit due</span>
          <span className="font-semibold text-[#1B2430]">{event.depositDue}</span>
        </div>
      </div>

      {/* Pay Deposit Button */}
      {event.payDepositHref ? (
        <Link
          href={event.payDepositHref}
          className="mt-4 block w-full rounded-lg bg-[#266665] py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#123B3A] no-underline"
        >
          Pay deposit
        </Link>
      ) : (
        <button
          type="button"
          onClick={onPayDeposit}
          className="mt-4 block w-full rounded-lg bg-[#266665] py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#123B3A]"
        >
          Pay deposit
        </button>
      )}
    </aside>
  );
}

