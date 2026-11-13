import React from 'react';

export default function VendorDiaryCard() {
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const bookedDays = [5, 12, 19, 26];
  const heldDays = [24];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 font-serif">Diary, December 2026</h3>
          <button className="text-xs text-teal-700 font-semibold hover:underline">
            Open diary
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {daysOfWeek.map((day, idx) => (
            <div key={idx} className="text-xs font-medium text-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          <div className="h-7"></div> {/* හිස් කොටුවක් */}
          
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
            const isBooked = bookedDays.includes(day);
            const isHeld = heldDays.includes(day);

            return (
              <div
                key={day}
                className={`h-7 flex items-center justify-center rounded-md font-medium transition-colors cursor-pointer ${
                  isBooked
                    ? 'bg-teal-700 text-white font-bold'
                    : isHeld
                    ? 'bg-amber-100 text-amber-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-teal-700 block"></span>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-100 border border-amber-300 block"></span>
          <span>Held</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-gray-200 block"></span>
          <span>Blocked</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm border border-gray-300 block"></span>
          <span>Free</span>
        </div>
      </div>
    </div>
  );
}