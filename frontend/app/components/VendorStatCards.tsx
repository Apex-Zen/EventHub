import React from 'react';

const stats = [
  {
    title: 'Paid this month',
    value: 'LKR 63,000',
    subtext: '2 payouts',
  },
  {
    title: 'Pending payouts',
    value: 'LKR 59,400',
    subtext: 'Sent within 3 working days',
  },
  {
    title: 'Held in escrow',
    value: 'LKR 129,600',
    subtext: 'Released at arrival and completion',
  },
  {
    title: 'Requests waiting',
    value: '1',
    subtext: 'Answer within 48 hours',
  },
];

export default function VendorStatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between"
        >
          <span className="text-xs text-gray-500 font-medium">{stat.title}</span>
          <div className="my-2">
            <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
          </div>
          <span className="text-xs text-gray-400">{stat.subtext}</span>
        </div>
      ))}
    </div>
  );
}