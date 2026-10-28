import React from 'react';

export default function VendorPackageRequest() {
  return (
    <div className="bg-white p-6 rounded-xl border border-teal-600/30 shadow-sm relative my-6">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 font-serif">New package request</h2>
        <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full font-medium">
          Hold ends in 31 h
        </span>
      </div>

      {/* Card Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left: Couple Image & Client Details */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=200&q=80"
              alt="Wedding Couple"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex gap-4">
              <span className="text-gray-400 w-12">Client</span>
              <span className="font-semibold text-gray-800">Nadeesha Perera</span>
            </div>
            <div className="flex gap-4">
              <span className="text-gray-400 w-12">Event</span>
              <span className="font-semibold text-gray-800">Perera-Silva wedding</span>
            </div>
            <div className="flex gap-4">
              <span className="text-gray-400 w-12">Date</span>
              <span className="font-semibold text-gray-800">Sat 12 Dec, night</span>
            </div>
          </div>
        </div>

        {/* Middle: Service & Price Info */}
        <div className="space-y-1 text-sm md:border-l md:pl-6 border-gray-100">
          <div>
            <span className="text-xs text-gray-400 block mb-1">Service</span>
            <span className="font-semibold text-gray-800">Full-day coverage</span>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-400 block">Price</span>
            <span className="font-bold text-teal-800 text-base">LKR 180,000</span>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3 justify-end">
          <button className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Reject
          </button>
          <button className="px-5 py-2 bg-teal-700 text-white rounded-lg text-sm font-medium hover:bg-teal-800 transition-colors shadow-sm">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}