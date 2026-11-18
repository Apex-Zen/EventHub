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

      {/* Notifications List Card */}
      <div className="bg-white rounded-sm shadow-sm border border-line divide-y divide-line">
        
        {/* Item 1: Package Request */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-green-50/20 transition-colors">
          <div>
            <h2 className="text-sm font-bold text-ink-900 mb-0.5">New package request from Nadeesha Perera</h2>
            <p className="text-xs text-ink-500">Perera–Silva wedding · Sat 12 Dec, night · hold ends in 31 h</p>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-sm text-xs hover:bg-[#14532d] transition-colors flex-shrink-0">
            Open request
          </button>
        </div>

        {/* Item 2: Payout Released */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-green-50/20 transition-colors">
          <div>
            <h2 className="text-sm font-bold text-ink-900 mb-0.5">Stage 1 payout released</h2>
            <p className="text-xs text-ink-500">LKR 32,400 net for Perera–Silva wedding · shows on Payouts as Pending</p>
          </div>
          <button className="text-xs font-medium text-green-600 hover:underline flex-shrink-0">
            View payout
          </button>
        </div>

        {/* Item 3: Package Approved */}
        <div className="p-4 sm:p-5 flex justify-between items-center gap-4 hover:bg-green-50/20 transition-colors">
          <div>
            <h2 className="text-sm font-bold text-ink-900 mb-0.5">Package approved by EventHub</h2>
            <p className="text-xs text-ink-500">The Event Manager approved the Perera–Silva wedding package</p>
          </div>
          <span className="text-xs text-ink-400 flex-shrink-0">2 h ago</span>
        </div>

        {/* Item 4: New Message */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-green-50/20 transition-colors">
          <div>
            <h2 className="text-sm font-bold text-ink-900 mb-0.5">New message from Dinuka Wickrama</h2>
            <p className="text-xs text-ink-500 italic">“Thanks, photos look great!”</p>
          </div>
          <button className="text-xs font-medium text-green-600 hover:underline flex-shrink-0">
            Reply
          </button>
        </div>

        {/* Item 5: Payout Failed (Action Needed) */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-green-50/20 transition-colors">
          <div>
            <h2 className="text-sm font-bold text-ink-900 mb-0.5">Payout failed</h2>
            <p className="text-xs text-ink-500">Fonseka anniversary · bank rejected the transfer. Update your payout account.</p>
          </div>
          <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold flex-shrink-0">
            Action needed
          </span>
        </div>

        {/* Item 6: New Review */}
        <div className="p-4 sm:p-5 flex justify-between items-center gap-4 hover:bg-green-50/20 transition-colors">
          <div>
            <h2 className="text-sm font-bold text-ink-900 mb-0.5">New review: 5 stars</h2>
            <p className="text-xs text-ink-500">Ishara W. · “On time, album came early.”</p>
          </div>
          <span className="text-xs text-ink-400 flex-shrink-0">Mon</span>
        </div>

      </div>

    </div>
  );
}