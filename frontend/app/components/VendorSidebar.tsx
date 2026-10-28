import React from 'react';
import Link from 'next/link';

const menuItems = [
  { name: 'Dashboard', path: '/vendor/dashboard', active: true },
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
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between fixed top-0 left-0">
      {/* Top Section: Logo and Menu */}
      <div>
        <div className="p-6 flex items-center gap-2 text-xl font-bold text-gray-900">
          <span className="text-blue-500">📍</span> EventHub
        </div>
        <div className="px-6 text-xs font-semibold text-gray-400 mb-2 tracking-wider">
          VENDOR
        </div>
        <nav className="flex flex-col gap-1 px-4">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.path}>
              <div
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Section: User Profile */}
      <div className="p-4 border-t border-gray-200 flex items-center gap-3">
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