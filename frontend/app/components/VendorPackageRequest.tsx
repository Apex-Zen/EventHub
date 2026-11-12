import React from 'react';

export default function VendorPackageRequest() {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 border-l-[4px] border-l-teal-700 shadow-sm relative my-6">
      
      {/* Card Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 font-serif">New package request</h2>
        <span className="bg-amber-50 text-amber-700 text-xs px-3 py-1 rounded-full font-medium border border-amber-100">
          Hold ends in 31 h
        </span>
      </div>

      {/* Card Content Layout */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Image & Client Details */}
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="w-24 h-32 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=200&q=80"
              alt="Wedding Couple"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
            <span className="text-gray-500">Client</span>
            <span className="font-semibold text-gray-900">Nadeesha Perera</span>
            
            <span className="text-gray-500">Event</span>
            <span className="font-semibold text-gray-900">Perera-Silva wedding</span>
            
            <span className="text-gray-500">Date</span>
            <span className="font-semibold text-gray-900">Sat 12 Dec, night</span>
          </div>
        </div>

        {/* Divider Line */}
        <div className="hidden md:block h-24 w-px bg-gray-200"></div>

        {/* Right: Service, Price & Action Buttons */}
        <div className="flex flex-col items-end gap-4 w-full md:w-auto">
          
          <div className="grid grid-cols-[max-content_1fr] gap-x-12 gap-y-2 text-sm w-full">
            <span className="text-gray-500 text-left">Service</span>
            <span className="font-semibold text-gray-900 text-right">Full-day coverage</span>
            
            <span className="text-gray-500 text-left">Price</span>
            <span className="font-semibold text-gray-900 text-right">LKR 180,000</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-2">
            <button className="px-6 py-2 border border-teal-700 text-teal-700 rounded text-sm font-medium hover:bg-teal-50 transition-colors">
              Reject
            </button>
            <button className="px-6 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800 transition-colors shadow-sm">
              Accept
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}