'use client';

import React, { useState, useMemo } from 'react';
import {
  PublicEventDetailsCard,
  TicketCategoriesCard,
  BeforeYouPublishCard,
  PublicEventFormData,
  TicketTier,
} from '@/components/events/public';

const INITIAL_FORM_DATA: PublicEventFormData = {
  eventName: 'Galle Face Jazz Night',
  date: '2026-11-14',
  startTime: '7.00 pm',
  district: 'Colombo',
  venue: 'Galle Face Green, Colombo 03',
  coverImageSrc: '/images/event-3.jpg',
  coverImageName: 'jazz-night-cover.jpg',
  coverImageMeta: '1600 × 900 · 1.2 MB',
};

const INITIAL_TIERS: TicketTier[] = [
  { id: 'tier-1', name: 'General', price: 2500, ticketsAvailable: 350 },
  { id: 'tier-2', name: 'VIP, front area', price: 6000, ticketsAvailable: 120 },
  { id: 'tier-3', name: 'Student (ID at gate)', price: 1500, ticketsAvailable: 30 },
];

export default function PlanPublicEventPage() {
  const [formData, setFormData] = useState<PublicEventFormData>(INITIAL_FORM_DATA);
  const [tiers, setTiers] = useState<TicketTier[]>(INITIAL_TIERS);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'info';
    message: string;
  } | null>(null);

  const publicSlug = useMemo(() => {
    const trimmed = formData.eventName.trim();
    if (!trimmed || trimmed === 'Galle Face Jazz Night') {
      return 'eventhub.lk/e/galle-face-jazz';
    }
    const slug = trimmed
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `eventhub.lk/e/${slug || 'public-event'}`;
  }, [formData.eventName]);

  const handleAddTier = () => {
    const newTier: TicketTier = {
      id: `tier-${Date.now()}`,
      name: 'New tier',
      price: 2000,
      ticketsAvailable: 50,
    };
    setTiers((prev) => [...prev, newTier]);
  };

  const handleUpdateTier = (
    id: string,
    field: keyof Omit<TicketTier, 'id'>,
    value: string | number
  ) => {
    setTiers((prev) =>
      prev.map((tier) => (tier.id === id ? { ...tier, [field]: value } : tier))
    );
  };

  const handleRemoveTier = (id: string) => {
    setTiers((prev) => prev.filter((tier) => tier.id !== id));
  };

  const handlePublish = () => {
    setFeedback({
      type: 'success',
      message: `Event page published at ${publicSlug}.`,
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSaveDraft = () => {
    setFeedback({
      type: 'info',
      message: 'Public event draft saved successfully.',
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFA] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header Area */}
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B2430] leading-tight">
            Plan a public event
          </h1>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`rounded-lg border px-4 py-3 text-sm font-medium ${
              feedback.type === 'success'
                ? 'border-[#266665]/30 bg-[#DBECEC] text-[#123B3A]'
                : 'border-amber-200 bg-[#FFF8E7] text-[#1B2430]'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Main Column */}
          <div className="lg:col-span-8 space-y-6">
            <PublicEventDetailsCard data={formData} onChange={setFormData} />

            <TicketCategoriesCard
              tiers={tiers}
              onAddTier={handleAddTier}
              onUpdateTier={handleUpdateTier}
              onRemoveTier={handleRemoveTier}
            />
          </div>

          {/* Right Sidebar Summary Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-6">
            <BeforeYouPublishCard
              tiers={tiers}
              publicSlug={publicSlug}
              onPublish={handlePublish}
              onSaveDraft={handleSaveDraft}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
