import React from 'react';

export default function VendorChat() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-page">
      
      {/* Top Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-ink-900 font-serif mb-1">Chat</h1>
        <p className="text-sm text-ink-600">Clients who sent you a package request, plus the EventHub team.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-6 border-b border-line pb-3 mb-6 text-sm">
        <button className="font-semibold text-green-600 pb-3 -mb-3 border-b-2 border-green-600">All</button>
        <button className="text-ink-600 hover:text-ink-900 font-medium transition-colors">Clients</button>
        <button className="text-ink-600 hover:text-ink-900 font-medium transition-colors">EventHub team</button>
        <button className="text-ink-600 hover:text-ink-900 font-medium transition-colors">Unread (2)</button>
      </div>

    </div>
  );
}