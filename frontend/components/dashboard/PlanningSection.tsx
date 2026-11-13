import React from 'react';
import PlanningCard from './PlanningCard';
import { PlanningCardData, PlanningSectionProps } from './types';

const defaultPlanningCards: PlanningCardData[] = [
  {
    id: 'private-event',
    category: 'PRIVATE EVENT',
    title: 'Plan a private event',
    description: 'Wedding, birthday, office party. Pick vendors that are free on your date and send them one package.',
    imageSrc: '/images/private-event.jpg',
    imageAlt: 'Private event setting',
    buttonText: 'Plan a private event',
    href: '/client/events/create',
  },
  {
    id: 'public-event',
    category: 'PUBLIC EVENT',
    title: 'Plan a public event',
    description: 'Concert, fair, workshop. Set ticket tiers and prices. Every buyer gets a QR pass.',
    imageSrc: '/images/public-event.jpg',
    imageAlt: 'Public event stage and crowd',
    buttonText: 'Plan a public event',
    href: '#',
  },
];

export default function PlanningSection({
  title = 'What are you planning?',
  cards = defaultPlanningCards,
}: PlanningSectionProps) {
  return (
    <section aria-labelledby="planning-section-heading">
      <h2
        id="planning-section-heading"
        className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1B2430] leading-tight mb-6"
      >
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {cards.map((card) => (
          <PlanningCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}

