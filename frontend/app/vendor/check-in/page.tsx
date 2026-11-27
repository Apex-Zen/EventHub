'use client';

import Link from 'next/link';
import { useState } from 'react';

type View = 'ready' | 'arrived' | 'rejected' | 'code';

const eventDetails = {
  name: 'Perera-Silva wedding',
  venue: 'Waters Edge, Battaramulla',
  callTime: 'Sat 12 Dec · Call time 5.00 pm',
};

const mockCheckIn = {
  distanceMeters: 140,
  allowedWithinMeters: 200,
  arrivalTime: '4.52 pm',
  rejectedDistance: '1.4 km',
  grossPayout: 'LKR 90,000',
  commission: 'LKR 9,000',
  netPayout: 'LKR 81,000',
};

export default function CheckInPage() {
  const [view] = useState<View>('ready');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex items-center gap-3">
        <Link
          href="/vendor/dashboard"
          aria-label="Back to dashboard"
          className="flex h-11 w-11 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
          >
            <path
              d="M15 18 9 12l6-6M9 12h12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <h1 className="text-3xl font-bold font-serif text-gray-900">Check-in</h1>
      </header>

      <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-6">
        <h2 className="text-xl font-bold font-serif text-gray-900">
          {eventDetails.name}
        </h2>
        <p className="text-sm text-gray-500 mt-2">{eventDetails.venue}</p>
        <p className="text-sm text-gray-500 mt-1">{eventDetails.callTime}</p>
      </section>

      <p className="text-sm text-gray-500">{view} view</p>
    </div>
  );
}
