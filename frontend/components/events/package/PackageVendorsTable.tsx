'use client';

import React from 'react';
import { PackageVendor } from './types';
import ServiceDropdown from './ServiceDropdown';

interface PackageVendorsTableProps {
  vendors: PackageVendor[];
  onRemoveVendor?: (id: string) => void;
  onServiceChange?: (id: string, newService: string) => void;
  onAddAnotherVendor?: () => void;
  message?: string;
  onMessageChange?: (message: string) => void;
}

export default function PackageVendorsTable({
  vendors,
  onRemoveVendor,
  onServiceChange,
  onAddAnotherVendor,
  message,
  onMessageChange,
}: PackageVendorsTableProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="p-6 pb-4">
          <h2 className="font-serif text-2xl font-bold text-[#1B2430]">
            Vendors in this package
          </h2>
        </div>

        {/* Table wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#DBECEC]/50 text-xs font-medium text-[#4B5563]">
                <th scope="col" className="py-3 px-6 font-medium">Vendor</th>
                <th scope="col" className="py-3 px-4 font-medium">Service</th>
                <th scope="col" className="py-3 px-4 font-medium">Quantity</th>
                <th scope="col" className="py-3 px-4 font-medium text-right">Price (LKR)</th>
                <th scope="col" className="py-3 px-6 font-medium"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Vendor Info */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-[#1B2430] text-sm truncate">
                          {vendor.name}
                        </p>
                        <p className="text-xs text-[#4B5563]">
                          {vendor.category}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Service selector */}
                  <td className="py-4 px-4">
                    <ServiceDropdown
                      value={vendor.service}
                      options={vendor.serviceOptions}
                      onChange={(newService) => onServiceChange?.(vendor.id, newService)}
                    />
                  </td>

                  {/* Quantity */}
                  <td className="py-4 px-4 text-xs sm:text-sm text-[#1B2430] whitespace-nowrap">
                    {vendor.quantityDisplay}
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 text-right font-medium text-xs sm:text-sm text-[#1B2430] whitespace-nowrap">
                    {vendor.price.toLocaleString()}
                  </td>

                  {/* Remove Button */}
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onRemoveVendor?.(vendor.id)}
                      className="text-xs text-[#4B5563] hover:text-[#1B2430] transition-colors"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {vendors.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-[#4B5563]">
                    No vendors currently in this package.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add another vendor */}
        <div className="p-6 pt-4">
          <button
            type="button"
            onClick={onAddAnotherVendor}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#266665] hover:text-[#123B3A] transition-colors"
          >
            <span className="text-base font-normal leading-none">+</span> Add another vendor
          </button>
        </div>
      </div>

      {/* Message to vendors */}
      {message !== undefined && (
        <div className="space-y-2">
          <label
            htmlFor="vendor-message"
            className="block text-xs sm:text-sm font-medium text-[#1B2430]"
          >
            Message to vendors (optional)
          </label>
          <input
            id="vendor-message"
            type="text"
            value={message}
            onChange={(e) => onMessageChange?.(e.target.value)}
            placeholder="e.g. Venue is Waters Edge, Battaramulla. Ceremony at 7.00 pm."
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-xs sm:text-sm text-[#1B2430] focus:outline-none focus:ring-1 focus:ring-[#266665] focus:border-[#266665]"
          />
        </div>
      )}
    </div>
  );
}

