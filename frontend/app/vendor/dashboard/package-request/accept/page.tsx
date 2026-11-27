'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

const request = {
  client: 'Nadeesha Perera',
  event: 'Perera-Silva wedding',
  date: 'Sat 12 Dec (night)',
  service: 'Full-day coverage',
  price: 'LKR 180,000',
  hold: 'Hold ends in 31 h',
  image:
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=200&q=80',
};

export default function AcceptPackageRequestPage() {
  const [message, setMessage] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!confirmed) {
      setError('Please confirm your availability and the agreed price.');
      return;
    }

    setError('');
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-gray-900">
            Accept package request
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review the request before confirming this booking.
          </p>
        </div>

        <Link
          href="/vendor/dashboard"
          className="inline-block text-sm text-teal-700 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          Back to dashboard
        </Link>

        <section className="bg-white rounded-lg border border-gray-200 border-l-[4px] border-l-teal-700 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="w-24 h-32 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
              <img
                src={request.image}
                alt="Wedding Couple"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-bold font-serif text-gray-900">
                  Request summary
                </h2>
                <span className="bg-amber-50 text-amber-700 text-xs px-3 py-1 rounded-full font-medium border border-amber-100">
                  {request.hold}
                </span>
              </div>

              <div className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 text-sm">
                <span className="text-gray-500">Client</span>
                <span className="font-semibold text-gray-900">{request.client}</span>

                <span className="text-gray-500">Event</span>
                <span className="font-semibold text-gray-900">{request.event}</span>

                <span className="text-gray-500">Date</span>
                <span className="font-semibold text-gray-900">{request.date}</span>

                <span className="text-gray-500">Service</span>
                <span className="font-semibold text-gray-900">{request.service}</span>

                <span className="text-gray-500">Price</span>
                <span className="font-semibold text-gray-900">{request.price}</span>
              </div>
            </div>
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-5"
        >
          <div>
            <label
              htmlFor="client-message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Message to client <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              id="client-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={300}
              rows={4}
              className="w-full rounded-md border border-gray-300 p-3 text-sm text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              aria-describedby="message-count"
            />
            <p id="message-count" className="text-xs text-gray-500 text-right mt-1">
              {message.length}/300
            </p>
          </div>

          <div>
            <label htmlFor="confirm-availability" className="flex items-start gap-3 text-sm text-gray-700">
              <input
                id="confirm-availability"
                type="checkbox"
                checked={confirmed}
                onChange={(event) => {
                  setConfirmed(event.target.checked);
                  if (event.target.checked) setError('');
                }}
                aria-describedby={error ? 'confirmation-error' : undefined}
                className="mt-1 accent-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              />
              <span>
                I confirm I am available and the agreed price is LKR 180,000
              </span>
            </label>
            {error && (
              <p id="confirmation-error" className="text-xs text-red-600 mt-2">
                {error}
              </p>
            )}
          </div>

          <p className="rounded-md bg-teal-50 p-4 text-sm text-gray-700">
            Accepting will mark Sat 12 Dec (night) as Booked in your diary and notify
            the client.
          </p>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Link
              href="/vendor/dashboard"
              className="px-6 py-2 border border-teal-700 text-teal-700 rounded text-sm font-medium hover:bg-teal-50 transition-colors text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!confirmed}
              className="px-6 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800 transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Confirm acceptance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
