import React from 'react';

interface WaitingStepBannerProps {
  stepText?: string;
  description?: string;
}

export default function WaitingStepBanner({
  stepText = 'Step 2 of 3: waiting for EventHub approval',
  description = 'After vendors accept, EventHub (the Event Manager) approves the package, usually within 4 hours. Then you can pay the deposit.',
}: WaitingStepBannerProps) {
  return (
    <div className="bg-[#FFF8E7] border border-[#FDE68A]/60 rounded-lg p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-[#1B2430] mb-0.5">
        {stepText}
      </h3>
      <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

