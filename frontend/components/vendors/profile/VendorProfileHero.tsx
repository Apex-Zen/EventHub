'use client';

import React from 'react';
import Link from 'next/link';

interface VendorProfileHeroProps {
  name: string;
  vendorId?: string;
  ownerName?: string;
  ownerAge?: number;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  heroImage: string;
  profilePic?: string;
  isAdded?: boolean;
  onToggleAdd?: () => void;
  messageHref?: string;
}

export default function VendorProfileHero({
  name,
  vendorId,
  ownerName,
  ownerAge,
  category,
  location,
  rating,
  reviewCount,
  heroImage,
  profilePic = '/images/profile-pic.jpg',
  isAdded = false,
  onToggleAdd,
  messageHref,
}: VendorProfileHeroProps) {
  return (
    /*
     * Full-bleed hero — no rounded card, no border.
     * The cover image fills the full width; text + avatar
     * are absolutely positioned inside it.
     */
    <div className="relative w-full h-[280px] sm:h-[320px] md:h-[360px] overflow-hidden bg-gray-300">
      {/* Cover photo */}
      <img
        src={heroImage}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark gradient — heavier at the bottom where text lives */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* ── Bottom-left: profile pic + text stack ──────────────── */}
      <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 flex items-end gap-5">
        {/* Circular profile picture */}
        <div className="h-[88px] w-[88px] flex-shrink-0 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-lg">
          <img
            src={profilePic}
            alt="Vendor profile"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Name / subtitle / rating */}
        <div className="pb-1 space-y-0.5">
          {/* Category · Location */}
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/80">
            {category} · {location}
          </p>

          {/* Vendor name */}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-white drop-shadow-sm">
            {name}
          </h1>

          {/* Owner name · Age */}
          {(ownerName || ownerAge) && (
            <p className="text-sm text-white/90">
              {ownerName}
              {ownerName && ownerAge ? ' · ' : ''}
              {ownerAge ? `Age ${ownerAge}` : ''}
            </p>
          )}

          {/* Rating */}
          <p className="text-sm text-white/90">
            <span className="font-semibold">★ {rating.toFixed(1)} public score</span>
            {' · '}
            <span>{reviewCount} reviews</span>
          </p>
        </div>
      </div>

      {/* ── Bottom-right: action buttons ──────────────────────── */}
      {onToggleAdd && (
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleAdd}
            className="inline-flex h-10 items-center justify-center rounded-md bg-[#266665] px-6 text-sm font-semibold text-white shadow transition-colors hover:bg-[#123B3A]"
          >
            {isAdded ? 'Added to package ✓' : 'Add to package'}
          </button>
          <Link
            href={messageHref || (vendorId ? `/client/messages?vendorId=${vendorId}` : '/client/messages')}
            className="inline-flex h-10 items-center justify-center rounded-md border border-white bg-transparent px-6 text-sm font-medium text-white shadow backdrop-blur-sm transition-colors hover:bg-white/15 no-underline"
          >
            Message
          </Link>
        </div>
      )}
    </div>
  );
}
