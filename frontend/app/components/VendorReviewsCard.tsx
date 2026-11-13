import React from 'react';

const reviews = [
  {
    name: 'Ishara W.',
    rating: 5,
    comment: 'On time, album came early.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
  },
  {
    name: 'Ruwan J.',
    rating: 4,
    comment: 'Edits took five weeks.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
  },
];

export default function VendorReviewsCard() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-900 font-serif">Reviews</h3>
        <button className="text-xs text-teal-700 font-semibold hover:underline">
          All 62
        </button>
      </div>

      {/* Overall Score Header */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold text-gray-900">4.8</span>
        <div className="flex flex-col">
          <div className="text-teal-700 text-xs tracking-tight font-bold">★★★★★</div>
          <span className="text-[11px] text-gray-400">62 reviews</span>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((rev, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-2">
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-bold text-gray-800">{rev.name}</span>
              <span className="text-teal-700 text-[10px]">
                {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
              </span>
            </div>
            <p className="text-xs text-gray-500 pl-8">{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}