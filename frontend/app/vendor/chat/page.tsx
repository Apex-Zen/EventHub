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

      {/* Chat Threads Container */}
      <div className="bg-white rounded-sm border border-line shadow-sm overflow-hidden divide-y divide-line">
        
        {/* Chat Item 1 (Unread) */}
        <div className="p-4 flex items-center justify-between hover:bg-green-50/30 transition-colors cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              <img src="/vendor-images/portfolioimg1.jpg" alt="Nadeesha Perera" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink-900">Nadeesha Perera</h2>
              <p className="text-xs text-ink-600">Perera–Silva wedding · Can we visit the venue on the 5th?</p>
            </div>
          </div>
          <div>
            <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-[10px] font-bold">
              2 new
            </span>
          </div>
        </div>

        {/* Chat Item 2 (Unread) */}
        <div className="p-4 flex items-center justify-between hover:bg-green-50/30 transition-colors cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              <img src="/vendor-images/portfolioimg2.jpg" alt="Shehan G." className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink-900">Shehan G. · Event Manager</h2>
              <p className="text-xs text-ink-600">Please confirm your call time for 12 Dec.</p>
            </div>
          </div>
          <div>
            <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-[10px] font-bold">
              1 new
            </span>
          </div>
        </div>

        {/* Chat Item 3 (Read) */}
        <div className="p-4 flex items-center justify-between hover:bg-green-50/30 transition-colors cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              <img src="/vendor-images/portfolioimg3.jpg" alt="Dinuka Wickrama" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-ink-900">Dinuka Wickrama</h2>
              <p className="text-xs text-ink-500">Wickrama birthday · Thanks, photos look great!</p>
            </div>
          </div>
          <div>
            <span className="text-xs text-ink-400 font-medium">Sat</span>
          </div>
        </div>

        {/* Chat Item 4 (Read) */}
        <div className="p-4 flex items-center justify-between hover:bg-green-50/30 transition-colors cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              <img src="/vendor-images/portfolioimg4.jpg" alt="Roshan Fonseka" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-ink-900">Roshan Fonseka</h2>
              <p className="text-xs text-ink-500">Fonseka anniversary · Is the drone add-on available?</p>
            </div>
          </div>
          <div>
            <span className="text-xs text-ink-400 font-medium">12 Oct</span>
          </div>
        </div>

      </div>

    </div>
  );
}