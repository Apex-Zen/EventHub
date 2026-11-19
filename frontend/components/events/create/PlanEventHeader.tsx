import React from 'react';
import BookingStepper from '../BookingStepper';

interface PlanEventHeaderProps {
  title?: string;
  currentStep?: number;
  onStepClick?: (stepNumber: number) => void;
}

export default function PlanEventHeader({
  title = 'Plan a private event',
  currentStep = 1,
  onStepClick,
}: PlanEventHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B2430] leading-tight">
          {title}
        </h1>

        {/* Step Progress Bar */}
        <BookingStepper currentStep={currentStep} onStepClick={onStepClick} />
      </div>
    </div>
  );
}

