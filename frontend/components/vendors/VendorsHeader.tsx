import React from 'react';

interface VendorsHeaderProps {
  eventName?: string;
  wishlistCount?: number;
  compareCount?: number;
  eventDetailsText?: string;
  currentStep?: number;
}

export default function VendorsHeader({
  eventName = 'Perera–Silva wedding',
  wishlistCount = 4,
  compareCount = 3,
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
    <div className="mb-8 space-y-4">
      {/* Event Title */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B2430] leading-tight">
          Vendors for {eventName}
        </h1>

        {/* Wishlist and Compare links */}
        <div className="flex items-center gap-3 text-xs sm:text-sm text-[#266665] mt-1.5 font-medium">
          <button type="button" className="hover:underline">
            Wishlist ({wishlistCount})
          </button>
          <span>·</span>
          <button type="button" className="hover:underline">
            Compare ({compareCount})
          </button>
        </div>

        {/* Event context subtitle */}
        <p className="text-xs sm:text-sm text-[#4B5563] mt-1">
          {eventDetailsText}
        </p>
      </div>

      {/* Stepper Progress */}
      <nav aria-label="Progress" className="flex items-center gap-4 pt-2 flex-wrap">
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

