'use client';

import React from 'react';
import { TicketTier } from './types';

interface TicketCategoriesCardProps {
  tiers: TicketTier[];
  onAddTier: () => void;
  onUpdateTier: (id: string, field: keyof Omit<TicketTier, 'id'>, value: string | number) => void;
  onRemoveTier: (id: string) => void;
}

export default function TicketCategoriesCard({
  tiers,
  onAddTier,
  onUpdateTier,
  onRemoveTier,
}: TicketCategoriesCardProps) {
  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430]">
          Ticket categories
        </h2>
        <button
          type="button"
          onClick={onAddTier}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#266665] hover:text-[#123B3A] transition-colors cursor-pointer"
        >
          <span>+</span> Add tier
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#DBECEC]/60 text-xs font-medium text-[#4B5563]">
              <th className="py-3 px-4 rounded-l-md">Tier</th>
              <th className="py-3 px-4">Price (LKR)</th>
              <th className="py-3 px-4">Tickets available</th>
              <th className="py-3 px-4 rounded-r-md text-right sr-only">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {tiers.map((tier) => (
              <tr key={tier.id} className="group">
                <td className="py-3.5 px-4">
                  <input
                    type="text"
                    value={tier.name}
                    onChange={(e) => onUpdateTier(tier.id, 'name', e.target.value)}
                    aria-label="Tier name"
                    className="w-full bg-transparent text-sm text-[#1B2430] focus:outline-none focus:ring-1 focus:ring-[#266665] rounded px-1.5 py-1 -ml-1.5"
                  />
                </td>
                <td className="py-3.5 px-4">
                  <input
                    type="number"
                    min={0}
                    value={tier.price}
                    onChange={(e) =>
                      onUpdateTier(tier.id, 'price', Math.max(0, Number(e.target.value) || 0))
                    }
                    aria-label="Price in LKR"
                    className="w-28 bg-transparent text-sm tabular-nums text-[#1B2430] focus:outline-none focus:ring-1 focus:ring-[#266665] rounded px-1.5 py-1 -ml-1.5"
                  />
                </td>
                <td className="py-3.5 px-4">
                  <input
                    type="number"
                    min={0}
                    value={tier.ticketsAvailable}
                    onChange={(e) =>
                      onUpdateTier(
                        tier.id,
                        'ticketsAvailable',
                        Math.max(0, Number(e.target.value) || 0)
                      )
                    }
                    aria-label="Tickets available"
                    className="w-24 bg-transparent text-sm tabular-nums text-[#1B2430] focus:outline-none focus:ring-1 focus:ring-[#266665] rounded px-1.5 py-1 -ml-1.5"
                  />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => onRemoveTier(tier.id)}
                    className="text-xs sm:text-sm text-[#4B5563] hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}

            {tiers.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-[#4B5563]">
                  No ticket tiers added yet. Click &ldquo;+ Add tier&rdquo; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
