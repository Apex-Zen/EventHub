import React from 'react';

export default function VendorDiary() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-page">
      
      {/* Top Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900 font-serif mb-1">Diary</h1>
        <p className="text-sm font-medium text-green-600 mb-1 cursor-pointer hover:underline">
          Manage blocked dates
        </p>
        <p className="text-sm text-ink-600">
          Booked, free and blocked slots. Dates become Booked only when you accept a client request.
        </p>
      </div>

    </div>
  );
}