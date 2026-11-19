import React from 'react';
import { WelcomeHeroProps } from './types';

export default function WelcomeHero({
  userName = 'Nadeesha',
  subtitle = 'Plan a wedding, a birthday or a ticketed public event.',
  backgroundImageSrc = '/images/hero-bg.jpg',
}: WelcomeHeroProps) {
  return (
    <section aria-label="Welcome banner" className="relative w-full h-72 sm:h-80 md:h-96 bg-[#1B2430] overflow-hidden shadow-sm">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImageSrc}')` }}
      />
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-[#1B2430]/65" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center h-full max-w-6xl mx-auto px-6 md:px-8 text-white">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-sm">
          Welcome back, {userName}
        </h1>
        <p className="text-base sm:text-lg text-gray-100 mt-2 sm:mt-3 font-normal leading-relaxed drop-shadow-sm">
          {subtitle}
        </p>
      </div>
    </section>
  );
}

