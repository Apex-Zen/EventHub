'use client';

import React, { useRef } from 'react';
import { PublicEventFormData } from './types';
import CustomDropdown from '../create/CustomDropdown';
import MiniCalendar from '../create/MiniCalendar';
import { DISTRICT_OPTIONS } from '../create/types';

interface PublicEventDetailsCardProps {
  data: PublicEventFormData;
  onChange: (updated: PublicEventFormData) => void;
}

export default function PublicEventDetailsCard({
  data,
  onChange,
}: PublicEventDetailsCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (field: keyof PublicEventFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleImageReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    onChange({
      ...data,
      coverImageSrc: objectUrl,
      coverImageName: file.name,
      coverImageMeta: `1600 × 900 · ${sizeMb} MB`,
    });
  };

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430]">
        Event details
      </h2>

      {/* Event Name */}
      <div className="space-y-1.5">
        <label
          htmlFor="public-event-name"
          className="block text-xs sm:text-sm font-medium text-[#1B2430]"
        >
          Event name
        </label>
        <input
          id="public-event-name"
          type="text"
          value={data.eventName}
          onChange={(e) => handleFieldChange('eventName', e.target.value)}
          className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-[#1B2430] focus:border-[#266665] focus:outline-none focus:ring-1 focus:ring-[#266665]"
        />
      </div>

      {/* Date (MiniCalendar), Start Time & District */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-sm font-medium text-[#1B2430]">
            Target date
          </label>
          <MiniCalendar
            selectedDate={data.date}
            onSelectDate={(dateStr) => handleFieldChange('date', dateStr)}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="public-event-time"
              className="block text-xs sm:text-sm font-medium text-[#1B2430]"
            >
              Start time
            </label>
            <input
              id="public-event-time"
              type="text"
              value={data.startTime}
              onChange={(e) => handleFieldChange('startTime', e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-[#1B2430] focus:border-[#266665] focus:outline-none focus:ring-1 focus:ring-[#266665]"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="public-event-district"
              className="block text-xs sm:text-sm font-medium text-[#1B2430]"
            >
              District
            </label>
            <CustomDropdown
              id="public-event-district"
              value={data.district}
              options={DISTRICT_OPTIONS}
              onChange={(val) => handleFieldChange('district', val)}
            />
          </div>
        </div>
      </div>

      {/* Venue */}
      <div className="space-y-1.5">
        <label
          htmlFor="public-event-venue"
          className="block text-xs sm:text-sm font-medium text-[#1B2430]"
        >
          Venue
        </label>
        <input
          id="public-event-venue"
          type="text"
          value={data.venue}
          onChange={(e) => handleFieldChange('venue', e.target.value)}
          className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-[#1B2430] focus:border-[#266665] focus:outline-none focus:ring-1 focus:ring-[#266665]"
        />
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <span className="block text-xs sm:text-sm font-medium text-[#1B2430]">
          Cover image
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="h-32 w-full sm:w-56 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200/80">
            <img
              src={data.coverImageSrc}
              alt={data.eventName}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium text-[#1B2430]">
              {data.coverImageName}
            </p>
            <p className="text-xs text-[#4B5563]">{data.coverImageMeta}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageReplace}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="pt-1 text-sm font-medium text-[#266665] hover:text-[#123B3A] transition-colors cursor-pointer"
            >
              Replace image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
