'use client';

import React, { useState, useEffect } from 'react';
import MiniCalendar from './MiniCalendar';
import TimeSlotSelector from './TimeSlotSelector';
import RangeSliderField from './RangeSliderField';
import CustomDropdown from './CustomDropdown';
import {
  EventDetailsFormData,
  TimeSlot,
  EVENT_TYPE_OPTIONS,
  DISTRICT_OPTIONS,
} from './types';

interface EventDetailsFormProps {
  initialData?: Partial<EventDetailsFormData>;
  onSaveDraft?: (data: EventDetailsFormData) => void;
  onFindVendors?: (data: EventDetailsFormData) => void;
}

const defaultFormData: EventDetailsFormData = {
  eventType: 'Wedding',
  targetDate: '',
  timeSlot: 'Night',
  district: 'Colombo',
  expectedAttendance: 250,
  totalBudget: 1500000,
};

export default function EventDetailsForm({
  initialData,
  onSaveDraft,
  onFindVendors,
}: EventDetailsFormProps) {
  const [formData, setFormData] = useState<EventDetailsFormData>({
    ...defaultFormData,
    ...initialData,
  });

  // Safely initialize today's date after mounting on the client side
  useEffect(() => {
    if (!initialData?.targetDate && !formData.targetDate) {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      setFormData((prev) => ({
        ...prev,
        targetDate: `${y}-${m}-${d}`,
      }));
    }
  }, [initialData?.targetDate]);

  const handleSelectDate = (dateStr: string) => {
    setFormData((prev) => ({
      ...prev,
      targetDate: dateStr,
    }));
  };

  const handleTimeSlotChange = (timeSlot: TimeSlot) => {
    setFormData((prev) => ({ ...prev, timeSlot }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFindVendors) onFindVendors(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg border border-gray-200/80 shadow-sm p-6 sm:p-8 space-y-8"
    >
      <h2 className="font-serif text-2xl font-bold text-[#1B2430] leading-snug">
        Event details
      </h2>

      {/* Event type dropdown */}
      <CustomDropdown
        id="event-type"
        label="Event type"
        value={formData.eventType}
        options={EVENT_TYPE_OPTIONS}
        onChange={(val) => setFormData((prev) => ({ ...prev, eventType: val }))}
      />

      {/* Date & Location Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Target date calendar */}
        <div>
          <label className="block text-sm font-medium text-[#1B2430] mb-2">
            Target date
          </label>
          <MiniCalendar
            selectedDate={formData.targetDate}
            onSelectDate={handleSelectDate}
          />
        </div>

        {/* Right: Time slot & Location */}
        <div className="space-y-6">
          <TimeSlotSelector
            selectedSlot={formData.timeSlot}
            onChange={handleTimeSlotChange}
          />

          <CustomDropdown
            id="district"
            label="Location / district"
            value={formData.district}
            options={DISTRICT_OPTIONS}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, district: val }))
            }
            helperText="Only vendors who serve this district are shown."
          />
        </div>
      </div>

      {/* Sliders: Attendance & Budget */}
      <div className="space-y-6 pt-4 border-t border-gray-100">
        <RangeSliderField
          label="Expected attendance"
          valueDisplay={`${formData.expectedAttendance} guests`}
          min={20}
          max={1000}
          step={10}
          value={formData.expectedAttendance}
          minLabel="20"
          maxLabel="1,000"
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, expectedAttendance: val }))
          }
        />

        <RangeSliderField
          label="Total budget"
          valueDisplay={`LKR ${formData.totalBudget.toLocaleString()}`}
          min={100000}
          max={5000000}
          step={50000}
          value={formData.totalBudget}
          minLabel="LKR 100,000"
          maxLabel="LKR 5,000,000"
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, totalBudget: val }))
          }
        />
      </div>

      {/* Info notice box */}
      <div className="flex items-start gap-3 p-4 bg-[#DBECEC]/60 rounded-md text-[#266665]">
        <svg
          className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#266665]"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="10" cy="10" r="8" />
          <line x1="10" y1="9" x2="10" y2="14" />
          <line x1="10" y1="6" x2="10.01" y2="6" />
        </svg>
        <p className="text-sm text-[#1B2430]">
          Matching uses district, budget and the vendor diary. Booked or blocked dates are hidden.
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-6 pt-4">
        <button
          type="button"
          onClick={() => onSaveDraft && onSaveDraft(formData)}
          className="text-sm font-medium text-[#266665] hover:text-[#123B3A] no-underline transition-colors"
        >
          Save draft
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#266665] hover:bg-[#123B3A] active:bg-[#123B3A] text-white text-sm font-medium rounded transition-colors"
        >
          Find vendors
        </button>
      </div>
    </form>
  );
}

