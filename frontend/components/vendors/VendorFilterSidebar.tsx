import React from 'react';

interface CategoryFilterOption {
  id: string;
  label: string;
  checked: boolean;
}

interface VendorFilterSidebarProps {
  categories?: CategoryFilterOption[];
  onToggleCategory?: (id: string) => void;
  fourStarsOnly?: boolean;
  onToggleFourStars?: () => void;
  sortValue?: string;
  onSortChange?: (value: string) => void;
}

const defaultCategories: CategoryFilterOption[] = [
  { id: 'photography', label: 'Photography', checked: true },
  { id: 'catering', label: 'Catering', checked: true },
  { id: 'decoration', label: 'Decoration', checked: true },
  { id: 'sound-lighting', label: 'Sound and lighting', checked: false },
  { id: 'cake', label: 'Cake', checked: false },
  { id: 'transport', label: 'Transport', checked: false },
];

export default function VendorFilterSidebar({
  categories = defaultCategories,
  onToggleCategory,
  fourStarsOnly = true,
  onToggleFourStars,
  sortValue = 'best-match',
  onSortChange,
}: VendorFilterSidebarProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-5">
      <h3 className="font-serif text-lg font-semibold text-[#1B2430]">
        Filter
      </h3>

      {/* Category Checkboxes */}
      <div className="space-y-3">
        <h4         className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          CATEGORY
        </h4>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-600"
            >
              <input
                type="checkbox"
                checked={cat.checked}
                onChange={() => onToggleCategory && onToggleCategory(cat.id)}
                className="w-4 h-4 rounded border-gray-300 text-[#266665] focus:ring-[#266665] accent-[#266665]"
              />
              <span>{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Rating Filter */}
      <div className="space-y-3">
        <h4         className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          RATING
        </h4>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={fourStarsOnly}
            onChange={() => onToggleFourStars && onToggleFourStars()}
            className="w-4 h-4 rounded border-gray-300 text-[#266665] focus:ring-[#266665] accent-[#266665]"
          />
          <span>4 stars and up</span>
        </label>
      </div>

      <div className="border-t border-gray-100" />

      {/* Sort By */}
      <div className="space-y-2">
        <label
          htmlFor="vendor-sort"
          className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
        >
          SORT
        </label>
        <div className="relative">
          <select
            id="vendor-sort"
            value={sortValue}
            onChange={(e) => onSortChange && onSortChange(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-[#1B2430] focus:outline-none focus:ring-1 focus:ring-[#266665] focus:border-[#266665] appearance-none cursor-pointer"
          >
            <option value="best-match">Best match</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rating</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

