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
    <aside className="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 flex flex-col">
      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430] leading-snug mb-5">
        {title}
      </h3>

      {/* Package Items */}
      <ul className="space-y-3.5 mb-6">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between text-sm">
            <span className="text-[#1B2430] font-medium">{item.name}</span>
            <span className="text-[#1B2430] font-semibold">
              {item.price.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>

      {/* Divider */}
      <div className="border-t border-gray-100 pt-4 mb-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#4B5563]">Total</span>
          <span className="font-serif font-bold text-xl sm:text-2xl text-[#1B2430]">
            LKR {total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Budget difference indicator */}
      <div className="mb-6">
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
        className="w-full py-3 bg-[#266665] hover:bg-[#123B3A] active:bg-[#123B3A] text-white text-sm font-medium rounded transition-colors"
      >
        Review package
      </button>
    </aside>
  );
}

