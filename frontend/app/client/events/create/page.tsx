'use client';

import React, { useState } from 'react';
import {
  PlanEventHeader,
  EventDetailsForm,
  HowMatchingWorksCard,
  EventDetailsFormData,
} from '@/components/events/create';

export default function CreatePrivateEventPage() {
  const [formData, setFormData] = useState<EventDetailsFormData>({
    eventType: 'Wedding',
    targetDate: '2026-12-12',
    timeSlot: 'Night',
    district: 'Colombo',
    expectedAttendance: 250,
    totalBudget: 1500000,
  });

  const [notification, setNotification] = useState<{
    type: 'success' | 'info';
    message: string;
  } | null>(null);

  const handleSaveDraft = (data: EventDetailsFormData) => {
    setFormData(data);
    setNotification({
      type: 'info',
      message: 'Draft saved successfully.',
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFindVendors = (data: EventDetailsFormData) => {
    setFormData(data);
    setNotification({
      type: 'success',
      message: `Searching available vendors in ${data.district} for ${data.eventType} on ${data.targetDate} (${data.timeSlot})...`,
    });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header with Title and Step Progress */}
      <PlanEventHeader currentStep={1} />

      {/* Temporary feedback banner for mock actions */}
      {notification && (
        <div
          role="status"
          className={`mb-6 p-4 rounded-lg text-sm font-medium transition-all ${
            notification.type === 'success'
              ? 'bg-[#DBECEC] text-[#266665] border border-[#266665]/20'
              : 'bg-gray-100 text-[#1B2430] border border-gray-200'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-8">
          <EventDetailsForm
            initialData={formData}
            onSaveDraft={handleSaveDraft}
            onFindVendors={handleFindVendors}
          />
        </div>

        {/* Right Column: How Matching Works Sidebar */}
        <div className="lg:col-span-4">
          <HowMatchingWorksCard />
        </div>
      </div>
    </div>
  );
}

