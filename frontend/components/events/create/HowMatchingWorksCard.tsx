import React from 'react';
import { MatchingRule } from './types';

interface HowMatchingWorksCardProps {
  imageSrc?: string;
  imageAlt?: string;
  title?: string;
  rules?: MatchingRule[];
}

const defaultRules: MatchingRule[] = [
  { text: 'We only show vendors whose diary is free on your date and time slot.' },
  { text: 'Prices are checked against your total budget.' },
  { text: 'You send one package. Each vendor has 48 hours to accept or reject.' },
];

export default function HowMatchingWorksCard({
  imageSrc = '/images/select-page.jpg',
  imageAlt = 'Private event setting',
  title = 'How matching works',
  rules = defaultRules,
}: HowMatchingWorksCardProps) {
  return (
    <aside className="bg-white rounded-lg border border-gray-200/80 shadow-sm overflow-hidden flex flex-col">
      {/* Top Image */}
      <div className="h-56 sm:h-64 w-full bg-gray-100 overflow-hidden">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Rules Content */}
      <div className="p-6 sm:p-7 flex-1">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430] leading-snug mb-5">
          {title}
        </h3>

        <ul className="space-y-4">
          {rules.map((rule, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-[#266665] flex-shrink-0 mt-0.5"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="4 11 8 15 16 6" />
              </svg>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                {rule.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

