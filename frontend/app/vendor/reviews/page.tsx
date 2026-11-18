import React from 'react';

export default function VendorReviews() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-page">
      
      {/* Top Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900 font-serif mb-1">Reviews</h1>
        <p className="text-sm text-ink-600">Your public score is what clients see on your profile and in matching.</p>
      </div>

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Card 1: Public Score */}
        <div className="bg-white p-5 rounded-sm shadow-sm border border-line">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-600 mb-1">Public score</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-serif text-ink-900">4.8</span>
            <span className="text-xs text-ink-500">out of 5</span>
          </div>
        </div>

        {/* Card 2: Reviews */}
        <div className="bg-white p-5 rounded-sm shadow-sm border border-line">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-600 mb-1">Reviews</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-serif text-ink-900">62</span>
            <span className="text-xs text-ink-500">from completed events</span>
          </div>
        </div>

        {/* Card 3: 5-star share */}
        <div className="bg-white p-5 rounded-sm shadow-sm border border-line">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-600 mb-1">5-star share</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-serif text-ink-900">79%</span>
            <span className="text-xs text-ink-500">49 of 62</span>
          </div>
        </div>

        {/* Card 4: Replied to */}
        <div className="bg-white p-5 rounded-sm shadow-sm border border-line">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-600 mb-1">Replied to</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-serif text-ink-900">90%</span>
            <span className="text-xs text-ink-500">56 of 62</span>
          </div>
        </div>

      </div>

    </div>
  );
}

