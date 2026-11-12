import React from 'react';
import { TimeSlot } from './types';

interface TimeSlotSelectorProps {
  selectedSlot?: TimeSlot;
  options?: TimeSlot[];
  onChange?: (slot: TimeSlot) => void;
}

const defaultOptions: TimeSlot[] = ['Day', 'Night', 'Both'];

export default function TimeSlotSelector({
  selectedSlot = 'Night',
  options = defaultOptions,
  onChange,
}: TimeSlotSelectorProps) {
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
    </div>
  );
}

