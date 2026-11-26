'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LocationIcon from './icons/LocationIcon';
import ProfileAvatar from './profile/ProfileAvatar';

export default function Navbar() {
  const pathname = usePathname();

  const isHomeActive = pathname === '/client/dashboard' || pathname === '/';
  const isEventsActive = pathname.startsWith('/client/events');
  const isPaymentsActive = pathname.startsWith('/client/payments');
  const isMessagesActive = pathname.startsWith('/client/messages');

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex min-h-[58px] max-w-[1224px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-0">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 font-serif text-2xl font-bold tracking-tight text-gray-900">
            <LocationIcon />
            EventHub
          </Link>
        </div>

        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link
            href="/client/dashboard"
            className={isHomeActive ? 'text-[#266665] font-semibold' : 'text-gray-600 hover:text-[#266665]'}
          >
            Home
          </Link>
          <Link
            href="/client/events"
            className={isEventsActive ? 'text-[#266665] font-semibold' : 'text-gray-600 hover:text-[#266665]'}
          >
            My events
          </Link>
          <Link
            href="/client/payments"
            className={isPaymentsActive ? 'text-[#266665] font-semibold' : 'text-gray-600 hover:text-[#266665]'}
          >
            Payments
          </Link>
          <Link
            href="/client/messages"
            className={isMessagesActive ? 'text-[#266665] font-semibold' : 'text-gray-600 hover:text-[#266665]'}
          >
            Messages
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-5">
          <Link
            href="/client/notifications"
            className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Notifications"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E05342] px-1 text-[11px] font-bold text-white">
              3
            </span>
          </Link>

          <Link
            href="/client/profile"
            className="flex items-center gap-2 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#266665]"
            aria-label="Nadeesha P. profile"
          >
            <ProfileAvatar alt="" className="h-9 w-9 bg-gray-300" />
            <span className="text-sm font-medium text-gray-800">Nadeesha P.</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}