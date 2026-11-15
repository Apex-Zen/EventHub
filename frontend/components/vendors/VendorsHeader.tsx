import React from 'react';
import BookingStepper from '@/components/events/BookingStepper';

interface VendorsHeaderProps {
  eventName?: string;
  eventDetailsText?: string;
  currentStep?: number;
  onEventDetailsClick?: () => void;
  onStepClick?: (stepNumber: number) => void;
}

export default function VendorsHeader({
  eventName = 'Perera–Silva wedding',
  eventDetailsText = 'Sat 12 Dec 2026 · Night · Colombo · 250 guests · Budget LKR 1,500,000',
  currentStep = 2,
  onEventDetailsClick,
  onStepClick,
}: VendorsHeaderProps) {
  const handleStepClick = (stepNumber: number) => {
    if (stepNumber === 1 && onEventDetailsClick) {
      onEventDetailsClick();
    } else if (onStepClick) {
      onStepClick(stepNumber);
    }
  };

  return (
    <div className="mb-7 space-y-5">
      {/* Event Title */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1B2430] leading-tight">
          Vendors for {eventName}
        </h1>

        {/* Event context subtitle */}
        <p className="mt-2 text-sm text-gray-500">
          {eventDetailsText}
        </p>
      </div>

      {/* Stepper Progress */}
      <BookingStepper
        currentStep={currentStep}
        onStepClick={handleStepClick}
        className="pt-1"
      />
    </div>
  );
}

