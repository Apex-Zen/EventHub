import React from 'react';

export default function VendorHalls() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-page">
      
      {/* Top Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink-900 font-serif mb-1">Halls and time slots</h1>
          <p className="text-sm text-ink-600">For venue vendors. Each hall has its own slots, price and diary.</p>
        </div>
        <button className="px-5 py-2.5 bg-green-600 text-white font-medium hover:bg-[#14532d] transition-colors text-sm rounded-sm">
          + Add hall
        </button>
      </div>

    </div>
  );
}