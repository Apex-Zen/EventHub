import React from 'react';

interface VendorsHeaderProps {
  eventName?: string;
  eventDetailsText?: string;
  currentStep?: number;
  onEventDetailsClick: () => void;
}

export default function VendorsHeader({
  eventName = 'Perera–Silva wedding',
  eventDetailsText = 'Sat 12 Dec 2026 · Night · Colombo · 250 guests · Budget LKR 1,500,000',
  currentStep = 2,
  onEventDetailsClick,
}: VendorsHeaderProps) {
  const steps = [
    { number: 1, label: 'Event details', completed: true },
    { number: 2, label: 'Choose vendors', current: true },
    { number: 3, label: 'Build package' },
    { number: 4, label: 'Pay deposit' },
  ];

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
      <nav aria-label="Progress" className="flex items-center gap-x-4 gap-y-3 pt-1 flex-wrap">
        {steps.map((step) => {
          const isDone = step.completed;
          const isCurrent = step.current;
          const stepContent = (
            <>
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  isDone
                    ? `bg-[#266665] text-white ${step.number === 1 ? 'group-hover:bg-[#123B3A]' : ''}`
                    : isCurrent
                    ? 'bg-[#266665] text-white'
                    : 'border border-gray-300 bg-white text-gray-500'
                }`}
              >
                {isDone ? '✓' : step.number}
              </span>
              <span
                className={`text-xs font-medium sm:text-sm ${
                  isCurrent || isDone
                    ? `font-semibold text-[#1B2430] ${step.number === 1 ? 'group-hover:text-[#266665]' : ''}`
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </>
          );

          return (
            <div key={step.number} className="flex items-center gap-2">
              {step.number === 1 ? (
                <button
                  type="button"
                  onClick={onEventDetailsClick}
                  className="group flex cursor-pointer items-center gap-2 rounded-sm text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#266665] focus-visible:ring-offset-2"
                >
                  {stepContent}
                </button>
              ) : (
                stepContent
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

