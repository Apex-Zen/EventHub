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
      : text.toLowerCase().includes('arrived') || text.toLowerCase().includes('paid')
      ? 'green'
      : text.toLowerCase().includes('pending')
      ? 'amber'
      : text.toLowerCase().includes('late') || text.toLowerCase().includes('failed')
      ? 'red'
      : 'teal');

  const variantStyles = {
    teal: 'bg-[#DBECEC] text-[#266665]',
    gray: 'bg-[#E5E7EB] text-[#4B5563]',
    green: 'bg-[#DBECEC] text-[#266665]',
    amber: 'bg-[#FEF3C7] text-[#B45309]',
    red: 'bg-[#FEE2E2] text-[#B91C1C]',
  }[resolvedVariant];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${variantStyles} ${className}`}
    >
      {text}
    </span>
  );
}

