'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LocationIcon from '../components/icons/locationicon'; // 

const menuItems = [
  { name: 'Dashboard', path: '/vendor/dashboard' },
  { name: 'Profile', path: '/vendor/profile' },
  { name: 'Services', path: '/vendor/services' },
  { name: 'Halls', path: '/vendor/halls' },
  { name: 'Pricing', path: '/vendor/pricing' },
  { name: 'Portfolio', path: '/vendor/portfolio' },
  { name: 'Diary', path: '/vendor/diary' },
  { name: 'Chat', path: '/vendor/chat' },
  { name: 'Reviews', path: '/vendor/reviews' },
  { name: 'Notifications', path: '/vendor/notifications' },
  { name: 'Check-in', path: '/vendor/check-in' },
  { name: 'Payouts', path: '/vendor/payouts' },
];

export default function VendorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-gray-200 bg-white lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 lg:justify-between lg:border-b-0 lg:border-r">
      {/* Top Section: Logo and Menu */}
      <div>
        <div className="flex items-center gap-2 p-4 text-xl font-bold text-gray-900 lg:p-6">
          <LocationIcon />
          <span>EventHub</span>
        </div>
        <div className="px-6 text-xs font-semibold text-gray-400 mb-2 tracking-wider">
          VENDOR
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-3 lg:flex-col lg:overflow-visible lg:pb-0">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.path || pathname.startsWith(`${item.path}/`);

            return (
              <Link
                key={item.name}
                href={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={`shrink-0 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors lg:shrink ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-600'
                    : 'text-gray-600 hover:bg-[#DBECEC]'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: User Profile */}
      <div className="flex items-center gap-3 border-t border-gray-200 p-4">
        {/* Profile Avatar with Initials */}
        <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-semibold flex items-center justify-center text-sm shadow-sm">
          KF
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-900">Kasun Fernando</div>
          <div className="text-xs text-gray-500">Lens & Light Studio</div>
        </div>
        <button className="text-gray-400 hover:text-gray-600" title="Logout">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </aside>
  );
}