import React, { useState } from 'react';

interface MiniCalendarProps {
  initialSelectedDay?: number;
  monthYearLabel?: string;
  onSelectDate?: (day: number) => void;
}

export default function MiniCalendar({
  initialSelectedDay = 12,
  monthYearLabel = 'December 2026',
  onSelectDate,
}: MiniCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<number>(initialSelectedDay);

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // December 2026 starts on Tuesday (offset 1 in M-T-W-T-F-S-S week), 31 days
  // 1 offset blank day before day 1
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleSelect = (day: number) => {
    setSelectedDay(day);
    if (onSelectDate) onSelectDate(day);
  };

  return (
    <div className="border border-gray-200/90 rounded-lg p-4 bg-white max-w-sm">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          aria-label="Previous month"
          className="text-gray-400 hover:text-gray-600 px-1 text-sm focus:outline-none"
        >
          &lsaquo;
        </button>
        <span className="text-sm font-semibold text-[#1B2430]">
          {monthYearLabel}
        </span>
        <button
          type="button"
          aria-label="Next month"
          className="text-gray-400 hover:text-gray-600 px-1 text-sm focus:outline-none"
        >
          &rsaquo;
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {daysOfWeek.map((dow, idx) => (
          <span key={idx} className="text-xs text-gray-400 font-medium py-1">
            {dow}
          </span>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Empty slot for Monday before Dec 1 */}
        <div />

        {daysInMonth.map((day) => {
          const isSelected = day === selectedDay;
          return (
            <button
              key={day}
              type="button"
              onClick={() => handleSelect(day)}
              className={`h-8 w-8 mx-auto flex items-center justify-center rounded-md text-xs sm:text-sm transition-colors ${
                isSelected
                  ? 'bg-[#266665] text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

