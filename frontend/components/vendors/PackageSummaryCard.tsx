import React from 'react';
import { PackageItem } from './types';

interface PackageSummaryCardProps {
  title?: string;
  items?: PackageItem[];
  totalBudget?: number;
  onReviewPackage?: () => void;
}

const defaultPackageItems: PackageItem[] = [
  { id: '1', name: 'Lens & Light Studio', price: 180000 },
  { id: '2', name: 'Ceylon Spice Caterers × 250', price: 800000 },
  { id: '3', name: 'Bloom Decor', price: 220000 },
];

export default function PackageSummaryCard({
  title = 'Your package',
  items = defaultPackageItems,
  totalBudget = 1500000,
  onReviewPackage,
}: PackageSummaryCardProps) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const diff = totalBudget - total;
  const isUnderBudget = diff >= 0;

  return (
    <aside className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-5 font-serif text-lg font-semibold leading-snug text-[#1B2430]">
        {title}
      </h3>

      {/* Package Items */}
      <ul className="mb-5 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
            <span className="min-w-0 flex-1 leading-snug text-gray-600">{item.name}</span>
            <span className="shrink-0 text-right font-semibold tabular-nums text-[#1B2430]">
              {item.price.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>

      {/* Divider */}
      <div className="mb-2 border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">Total</span>
          <span className="font-serif text-lg font-bold tabular-nums text-[#1B2430] sm:text-xl">
            LKR {total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Budget difference indicator */}
      <div className="mb-5">
        <p className="text-xs text-[#266665] font-medium">
          {isUnderBudget
            ? `LKR ${diff.toLocaleString()} under budget`
            : `LKR ${Math.abs(diff).toLocaleString()} over budget`}
        </p>
      </div>

      {/* Action button */}
      <button
        type="button"
        onClick={onReviewPackage}
        className="h-11 w-full rounded-md bg-[#266665] text-sm font-medium text-white transition-colors hover:bg-[#123B3A] active:bg-[#123B3A]"
      >
        Review package
      </button>
    </aside>
  );
}

