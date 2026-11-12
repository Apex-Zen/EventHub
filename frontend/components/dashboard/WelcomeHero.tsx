import React from 'react';
import { WelcomeHeroProps } from './types';

export default function WelcomeHero({
  userName = 'Nadeesha',
  subtitle = 'Plan a wedding, a birthday or a ticketed public event.',
  backgroundImageSrc = '/images/hero-bg.jpg',
}: WelcomeHeroProps) {
  return (
    <section aria-label="Welcome banner" className="relative h-64 sm:h-72 md:h-80 bg-gray-900 rounded-xl overflow-hidden shadow-sm">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImageSrc}')` }}
      />
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-12 text-white">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight drop-shadow-sm">
          Welcome back, {userName}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-100/90 mt-2 sm:mt-3 font-normal drop-shadow-sm">
          {subtitle}
        </p>
      </div>
    </section>
  );
}

