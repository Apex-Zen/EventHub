import React from 'react';
import Link from 'next/link';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { PlanningCardProps } from './types';

export default function PlanningCard({ card }: PlanningCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200/80 overflow-hidden flex flex-col transition hover:shadow-md">
      {/* Card Header Image */}
      <div className="h-60 sm:h-64 md:h-72 bg-gray-200 overflow-hidden">
        <img
          src={card.imageSrc}
          alt={card.imageAlt || card.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Card Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col items-start">
        <span className="text-[11px] font-semibold text-[#266665] tracking-widest uppercase mb-2">
          {card.category}
        </span>
        <h3 className="font-serif text-2xl sm:text-[26px] font-bold text-[#1B2430] leading-snug mb-3">
          {card.title}
        </h3>
        <p className="text-[#4B5563] text-sm sm:text-base leading-relaxed mb-6 flex-1">
          {card.description}
        </p>

        <Link href={card.href} className="inline-block">
          <PrimaryButton>{card.buttonText}</PrimaryButton>
        </Link>
      </div>
    </article>
  );
}

