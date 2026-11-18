import React from 'react';

export default function VendorNotifications() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-page">
      
      {/* Top Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900 font-serif mb-1">Notifications</h1>
          <p className="text-sm text-ink-600">Package requests, payout releases and chat alerts.</p>
        </div>
        <button className="text-xs font-medium text-green-600 hover:underline">
          Mark all as read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-6 border-b border-line pb-3 mb-6 text-sm">
        <button className="font-semibold text-green-600 pb-3 -mb-3 border-b-2 border-green-600">All</button>
        <button className="text-ink-600 hover:text-ink-900 font-medium transition-colors">Requests</button>
        <button className="text-ink-600 hover:text-ink-900 font-medium transition-colors">Payouts</button>
        <button className="text-ink-600 hover:text-ink-900 font-medium transition-colors">Chat</button>
      </div>

    </div>
  );
}