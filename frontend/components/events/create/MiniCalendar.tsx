'use client';

import React, { useState, useMemo } from 'react';

interface MiniCalendarProps {
  selectedDate?: string; // Format: YYYY-MM-DD
  onSelectDate?: (dateStr: string) => void;
}

export default function MiniCalendar({
  selectedDate,
  onSelectDate,
}: MiniCalendarProps) {
  // Today's real-world date normalized to midnight
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Parse initial selected date or default to today
  const initialDateObj = useMemo(() => {
    if (selectedDate) {
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        const parsed = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        parsed.setHours(0, 0, 0, 0);
        if (!isNaN(parsed.getTime())) return parsed;
      }
    }
    return today;
  }, [selectedDate, today]);

  // Current viewing month and year
  const [viewYear, setViewYear] = useState<number>(initialDateObj.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDateObj.getMonth()); // 0-indexed

  // Rolling 12-month window bounds
  // Min month: current month/year of today
  const minMonthDate = useMemo(() => new Date(today.getFullYear(), today.getMonth(), 1), [today]);
  // Max month: 12 months ahead (e.g. if today is Nov 2026, max is Nov 2027)
  const maxMonthDate = useMemo(() => new Date(today.getFullYear(), today.getMonth() + 11, 1), [today]);

  const currentViewDate = useMemo(() => new Date(viewYear, viewMonth, 1), [viewYear, viewMonth]);

  const canGoPrev = currentViewDate > minMonthDate;
  const canGoNext = currentViewDate < maxMonthDate;

  const handlePrevMonth = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (!canGoNext) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Month header label e.g. "November 2026"
  const monthYearLabel = currentViewDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Days in current viewing month
  const totalDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInMonthArray = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  // Day offset for Monday-first week (0 = Monday, ..., 6 = Sunday)
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const blankDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  // Selected date components
  const selectedDateParts = useMemo(() => {
    if (!selectedDate) return null;
    const parts = selectedDate.split('-');
    if (parts.length === 3) {
      return {
        year: parseInt(parts[0], 10),
        month: parseInt(parts[1], 10) - 1,
        day: parseInt(parts[2], 10),
      };
    }
    return null;
  }, [selectedDate]);

  const handleSelectDay = (day: number) => {
    const targetDate = new Date(viewYear, viewMonth, day);
    targetDate.setHours(0, 0, 0, 0);

    // Guard: past dates cannot be selected
    if (targetDate < today) return;

    const y = viewYear;
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const formatted = `${y}-${m}-${d}`;

    if (onSelectDate) {
      onSelectDate(formatted);
    }
  };

  return (
    <div className="border border-gray-200/90 rounded-lg p-4 bg-white max-w-sm">
      {/* Month Header Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className={`px-2 py-1 text-base font-bold transition-colors focus:outline-none ${
            canGoPrev
              ? 'text-gray-600 hover:text-[#1B2430] cursor-pointer'
              : 'text-gray-200 cursor-not-allowed'
          }`}
        >
          &lsaquo;
        </button>
        <span className="text-sm font-semibold text-[#1B2430]">
          {monthYearLabel}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          disabled={!canGoNext}
          aria-label="Next month"
          className={`px-2 py-1 text-base font-bold transition-colors focus:outline-none ${
            canGoNext
              ? 'text-gray-600 hover:text-[#1B2430] cursor-pointer'
              : 'text-gray-200 cursor-not-allowed'
          }`}
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
        {/* Empty slots before first day */}
        {blankDays.map((blank) => (
          <div key={`blank-${blank}`} />
        ))}

        {daysInMonthArray.map((day) => {
          const thisDate = new Date(viewYear, viewMonth, day);
          thisDate.setHours(0, 0, 0, 0);

          const isPast = thisDate < today;
          const isSelected =
            selectedDateParts !== null &&
            selectedDateParts.year === viewYear &&
            selectedDateParts.month === viewMonth &&
            selectedDateParts.day === day;

          return (
            <button
              key={day}
              type="button"
              disabled={isPast}
              onClick={() => handleSelectDay(day)}
              className={`h-8 w-8 mx-auto flex items-center justify-center rounded-md text-xs sm:text-sm transition-colors ${
                isSelected
                  ? 'bg-[#266665] text-white font-semibold shadow-xs'
                  : isPast
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-[#1B2430] hover:bg-gray-100 cursor-pointer'
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
