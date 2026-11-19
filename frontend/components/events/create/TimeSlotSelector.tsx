import React from 'react';
import { TimeSlot } from './types';

interface TimeSlotSelectorProps {
  selectedSlot?: TimeSlot;
  options?: TimeSlot[];
  onChange?: (slot: TimeSlot) => void;
}

const defaultOptions: TimeSlot[] = ['Day', 'Night', 'Both'];

const TIME_SLOT_RANGES: Record<TimeSlot, string> = {
  Day: '8:00 AM – 5:00 PM',
  Night: '6:00 PM – 12:00 AM',
  Both: '8:00 AM – 12:00 AM',
};

export default function TimeSlotSelector({
  selectedSlot = 'Night',
  options = defaultOptions,
  onChange,
}: TimeSlotSelectorProps) {
  const currentDuration = TIME_SLOT_RANGES[selectedSlot] || TIME_SLOT_RANGES.Night;

  return (
    <div>
      <label className="block text-sm font-medium text-[#1B2430] mb-2">
        Time slot
      </label>
      <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden bg-white p-0.5">
        {options.map((slot) => {
          const isSelected = slot === selectedSlot;
          return (
            <button
              key={slot}
              type="button"
              onClick={() => onChange && onChange(slot)}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-[#266665] text-white shadow-xs rounded-md'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>

      {/* Read-only time slot range display */}
      <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#4B5563]">
        <svg
          className="w-3.5 h-3.5 text-[#266665] flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>
          Duration: <strong className="font-semibold text-[#1B2430]">{currentDuration}</strong>
        </span>
      </div>
    </div>
  );
}

