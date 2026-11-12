import React from 'react';
import { StatusBadgeProps, BadgeVariant } from './types';

export default function StatusBadge({
  text,
  variant,
  className = '',
}: StatusBadgeProps) {
  // Automatically choose variant if not explicitly provided
  const resolvedVariant: BadgeVariant =
    variant ||
    (text.toLowerCase().includes('draft')
      ? 'gray'
      : 'teal');

  const variantStyles =
    resolvedVariant === 'gray'
      ? 'bg-gray-100 text-gray-600'
      : 'bg-[#DAEDED] text-[#266665]';

  return (
    <span
      className={`inline-flex items-center px-3.5 py-1 text-xs sm:text-sm font-medium rounded-full ${variantStyles} ${className}`}
    >
      {text}
    </span>
  );
}

