import React from 'react';

interface VendorsHeaderProps {
  eventName?: string;
  eventDetailsText?: string;
  currentStep?: number;
}

export default function VendorsHeader({
  eventName = 'Perera–Silva wedding',
  eventDetailsText = 'Sat 12 Dec 2026 · Night · Colombo · 250 guests · Budget LKR 1,500,000',
  currentStep = 2,
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

          return (
            <div key={step.number} className="flex items-center gap-2">
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                  isDone
                    ? 'bg-[#266665] text-white'
                    : isCurrent
                    ? 'bg-[#266665] text-white'
                    : 'border border-gray-300 text-gray-500 bg-white'
                }`}
              >
                {isDone ? '✓' : step.number}
              </span>
              <span
                className={`text-xs sm:text-sm font-medium ${
                  isCurrent || isDone
                    ? 'text-[#1B2430] font-semibold'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

