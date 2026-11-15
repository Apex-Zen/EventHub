'use client';

import React from 'react';

export interface BookingStep {
  number: number;
  label: string;
}

export const BOOKING_STEPS: readonly BookingStep[] = [
  { number: 1, label: 'Event details' },
  { number: 2, label: 'Choose vendors' },
  { number: 3, label: 'Build package' },
  { number: 4, label: 'Waiting approval' },
  { number: 5, label: 'Pay deposit' },
] as const;

interface BookingStepperProps {
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
  className?: string;
}

export default function BookingStepper({
  currentStep,
  onStepClick,
  className = '',
}: BookingStepperProps) {
  return (
    <nav aria-label="Booking progress" className={`flex items-center gap-3 sm:gap-4 flex-wrap ${className}`}>
      {BOOKING_STEPS.map((step) => {
        const isDone = step.number < currentStep;
        const isCurrent = step.number === currentStep;
        const isClickable = Boolean(onStepClick && isDone);

        const stepContent = (
          <>
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors flex-shrink-0 ${
                isDone || isCurrent
                  ? `bg-[#266665] text-white ${isClickable ? 'group-hover:bg-[#123B3A]' : ''}`
                  : 'border border-gray-300 bg-white text-gray-500'
              }`}
            >
              {isDone ? '✓' : step.number}
            </span>
            <span
              className={`text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                isCurrent || isDone
                  ? `font-semibold text-[#1B2430] ${isClickable ? 'group-hover:text-[#266665]' : ''}`
                  : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </>
        );

        return (
          <div key={step.number} className="flex items-center gap-2">
            {isClickable ? (
              <button
                type="button"
                onClick={() => onStepClick?.(step.number)}
                className="group flex cursor-pointer items-center gap-2 rounded-sm text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#266665] focus-visible:ring-offset-2"
              >
                {stepContent}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {stepContent}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

