'use client';

import React, { useState } from 'react';
import MiniCalendar from './MiniCalendar';
import TimeSlotSelector from './TimeSlotSelector';
import RangeSliderField from './RangeSliderField';
import { EventDetailsFormData, TimeSlot } from './types';

interface EventDetailsFormProps {
  initialData?: Partial<EventDetailsFormData>;
  onSaveDraft?: (data: EventDetailsFormData) => void;
  onFindVendors?: (data: EventDetailsFormData) => void;
}

const defaultFormData: EventDetailsFormData = {
  eventType: 'Wedding',
  targetDate: '2026-12-12',
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

  const handleSelectDay = (day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    setFormData((prev) => ({
      ...prev,
      targetDate: `2026-12-${formattedDay}`,
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
      <div>
        <label
          htmlFor="event-type"
          className="block text-sm font-medium text-[#1B2430] mb-2"
        >
          Event type
        </label>
        <div className="relative">
          <select
            id="event-type"
            value={formData.eventType}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, eventType: e.target.value }))
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-[#1B2430] focus:outline-none focus:ring-1 focus:ring-[#266665] focus:border-[#266665] appearance-none cursor-pointer"
          >
            <option value="Wedding">Wedding</option>
            <option value="Birthday party">Birthday party</option>
            <option value="Office party">Office party</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Private dinner">Private dinner</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Date & Location Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Target date calendar */}
        <div>
          <label className="block text-sm font-medium text-[#1B2430] mb-2">
            Target date
          </label>
          <MiniCalendar
            initialSelectedDay={parseInt(formData.targetDate.split('-')[2], 10) || 12}
            onSelectDate={handleSelectDay}
          />
        </div>

        {/* Right: Time slot & Location */}
        <div className="space-y-6">
          <TimeSlotSelector
            selectedSlot={formData.timeSlot}
            onChange={handleTimeSlotChange}
          />

          <div>
            <label
              htmlFor="district"
              className="block text-sm font-medium text-[#1B2430] mb-2"
            >
              Location / district
            </label>
            <div className="relative">
              <select
                id="district"
                value={formData.district}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, district: e.target.value }))
                }
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-[#1B2430] focus:outline-none focus:ring-1 focus:ring-[#266665] focus:border-[#266665] appearance-none cursor-pointer"
              >
                <option value="Colombo">Colombo</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kalutara">Kalutara</option>
                <option value="Kandy">Kandy</option>
                <option value="Galle">Galle</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              Only vendors who serve this district are shown.
            </p>
          </div>
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

