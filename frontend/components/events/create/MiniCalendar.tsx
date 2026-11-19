'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface MiniCalendarProps {
  selectedDate?: string; // Format: YYYY-MM-DD
  onSelectDate?: (dateStr: string) => void;
}

export default function MiniCalendar({
  selectedDate,
  onSelectDate,
}: MiniCalendarProps) {
  // State for today's date, initialized strictly on the client
  const [today, setToday] = useState<Date | null>(null);

  // Parse year/month from selectedDate if provided, otherwise null initially
  const initialYear = selectedDate ? parseInt(selectedDate.split('-')[0], 10) : null;
  const initialMonth = selectedDate ? parseInt(selectedDate.split('-')[1], 10) - 1 : null;

  const [viewYear, setViewYear] = useState<number>(initialYear || 2026);
  const [viewMonth, setViewMonth] = useState<number>(initialMonth !== null && !isNaN(initialMonth) ? initialMonth : 10);

  // Initialize today and default view month/year safely on client mount
  useEffect(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    setToday(now);

    // If no selectedDate was passed, sync view to current month/year
    if (!selectedDate) {
      setViewYear(now.getFullYear());
      setViewMonth(now.getMonth());
    } else {
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        if (!isNaN(y) && !isNaN(m)) {
          setViewYear(y);
          setViewMonth(m);
        }
      }
    }
  }, [selectedDate]);

  // Rolling 12-month window bounds
  const minMonthDate = useMemo(() => {
    if (!today) return null;
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }, [today]);

  const maxMonthDate = useMemo(() => {
    if (!today) return null;
    return new Date(today.getFullYear(), today.getMonth() + 11, 1);
  }, [today]);

  const currentViewDate = useMemo(() => new Date(viewYear, viewMonth, 1), [viewYear, viewMonth]);

  const canGoPrev = minMonthDate ? currentViewDate > minMonthDate : false;
  const canGoNext = maxMonthDate ? currentViewDate < maxMonthDate : true;

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

  // Month header label e.g. "December 2026"
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
    if (today && targetDate < today) return;

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

          const isPast = today ? thisDate < today : false;
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
