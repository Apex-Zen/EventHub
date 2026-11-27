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
  minimumAllowedMeters: 100,
  allowedWithinMeters: 200,
  arrivalTime: '4.52 pm',
  rejectedDistance: '1.4 km',
  grossPayout: 'LKR 90,000',
  commission: 'LKR 9,000',
  netPayout: 'LKR 81,000',
};

// TODO: replace with POST /api/vendor/check-in and use returned arrival time/distance/payout when backend is ready
export default function CheckInPage() {
  const [view, setView] = useState<View>('ready');

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

      {/* TODO: remove prototype preview switcher when real location/backend check-in is connected */}
      <section
        aria-label="Prototype preview"
        className="rounded-lg border border-dashed border-gray-300 bg-white p-3"
      >
        <p className="text-xs font-medium text-gray-500 mb-2">Prototype preview</p>
        <div className="flex flex-wrap gap-2">
          {(['ready', 'arrived', 'rejected', 'code'] as const).map((previewView) => (
            <button
              key={previewView}
              type="button"
              aria-pressed={view === previewView}
              onClick={() => setView(previewView)}
              className={`min-h-11 rounded-md border px-3 text-xs font-medium capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
                view === previewView
                  ? 'border-teal-700 bg-teal-50 text-teal-700'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {previewView}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-6">
        <h2 className="text-xl font-bold font-serif text-gray-900">
          {eventDetails.name}
        </h2>
        <p className="text-sm text-gray-500 mt-2">{eventDetails.venue}</p>
        <p className="text-sm text-gray-500 mt-1">{eventDetails.callTime}</p>
      </section>

      {view === 'ready' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <section className="bg-gray-100 rounded-lg border border-gray-200 p-6 sm:p-8 flex flex-col items-center justify-center">
            <div
              aria-label="You are within the venue check-in area"
              className="relative w-56 h-56 max-w-full rounded-full border-2 border-dashed border-gray-400 bg-white flex-shrink-0"
            >
              <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-teal-700 ring-4 ring-teal-100" />
                <span className="text-xs font-medium text-gray-700">you</span>
              </div>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                venue
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {mockCheckIn.allowedWithinMeters} m check-in area
            </p>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-6 space-y-5">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4 text-sm">
                <span className="text-gray-500">Distance to venue</span>
                <span className="font-semibold text-gray-900">
                  {mockCheckIn.distanceMeters} m
                </span>
              </div>
              <div className="flex items-start justify-between gap-4 text-sm">
                <span className="text-gray-500">Check-in allowed within</span>
                <span className="font-semibold text-gray-900">
                  {mockCheckIn.minimumAllowedMeters}-{mockCheckIn.allowedWithinMeters} m
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 pt-1">
                <span className="text-sm text-gray-500">Status</span>
                <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  Pending
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setView('arrived')}
              className="min-h-11 w-full rounded-md bg-teal-700 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Check in now
            </button>
            <button
              type="button"
              onClick={() => setView('code')}
              className="min-h-11 w-full rounded-md px-4 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Location off? Use code or QR
            </button>
          </section>
        </div>
      ) : view === 'arrived' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <section
            role="status"
            className="bg-white rounded-lg border border-green-700 shadow-sm p-5 sm:p-6"
          >
            <h2 className="text-xl font-bold font-serif text-green-700">Arrived</h2>
            <p className="text-sm text-gray-700 mt-3">
              Checked in at {mockCheckIn.arrivalTime}, {mockCheckIn.distanceMeters} m
              from the venue. The event manager sees you as green.
            </p>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold font-serif text-gray-900">
                Stage 2 released
              </h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-gray-500">Gross (50%)</span>
                  <span className="font-semibold text-gray-900">
                    {mockCheckIn.grossPayout}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-gray-500">Commission (10%)</span>
                  <span className="font-semibold text-gray-900">
                    {mockCheckIn.commission}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-4 text-sm">
                  <span className="font-medium text-gray-700">Net to you</span>
                  <span className="font-bold text-gray-900">
                    {mockCheckIn.netPayout}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Shows on Payouts as Pending.
            </p>
            <Link
              href="/vendor/payouts"
              className="flex min-h-11 w-full items-center justify-center rounded-md border border-teal-700 px-5 py-3 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Open payouts
            </Link>
          </section>
        </div>
      ) : view === 'rejected' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <section className="bg-gray-100 rounded-lg border border-gray-200 p-6 sm:p-8 flex flex-col items-center justify-center">
            <div
              aria-label="Venue location"
              className="relative w-56 h-56 max-w-full rounded-full border-2 border-dashed border-gray-400 bg-white flex-shrink-0"
            >
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                venue
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              you are {mockCheckIn.rejectedDistance} away
            </p>
          </section>

          <div className="space-y-4">
            <section
              role="alert"
              className="bg-white rounded-lg border border-red-600 shadow-sm p-5 sm:p-6"
            >
              <h2 className="text-xl font-bold font-serif text-red-600">
                Check-in rejected
              </h2>
              <p className="text-sm text-gray-700 mt-3">
                You are {mockCheckIn.rejectedDistance} from the venue. Move within
                200 m and try again. The 50% stage stays held until you check in.
              </p>
            </section>

            <button
              type="button"
              onClick={() => setView('ready')}
              className="min-h-11 w-full rounded-md bg-teal-700 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => setView('code')}
              className="min-h-11 w-full rounded-md px-4 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Location off? Use code or QR
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">{view} view</p>
      )}
    </div>
  );
}
