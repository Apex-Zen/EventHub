import React from 'react';
import { StepItem } from './types';

interface PlanEventHeaderProps {
  title?: string;
  currentStep?: number;
  steps?: StepItem[];
}

const defaultSteps: StepItem[] = [
  { number: 1, label: 'Event details' },
  { number: 2, label: 'Choose vendors' },
  { number: 3, label: 'Build package' },
  { number: 4, label: 'Pay deposit' },
];

export default function PlanEventHeader({
  title = 'Plan a private event',
  currentStep = 1,
  steps = defaultSteps,
}: PlanEventHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B2430] leading-tight">
          {title}
        </h1>

        {/* Step Progress Bar */}
        <nav aria-label="Progress" className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {steps.map((step) => {
            const isActive = step.number === currentStep;
            return (
              <div key={step.number} className="flex items-center gap-2">
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                    isActive
                      ? 'bg-[#266665] text-white'
                      : 'border border-gray-300 text-gray-500 bg-white'
                  }`}
                >
                  {step.number}
                </span>
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    isActive ? 'text-[#1B2430] font-semibold' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

