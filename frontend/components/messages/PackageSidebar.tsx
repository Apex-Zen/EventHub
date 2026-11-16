import React from 'react';
import { PackageDetails } from './types';

interface PackageSidebarProps {
  packageDetails: PackageDetails;
}

export default function PackageSidebar({ packageDetails }: PackageSidebarProps) {
  return (
    <div className="flex flex-col h-full bg-white p-5 border-l border-gray-200/80">
      {/* Heading */}
      <h3 className="font-serif text-lg font-bold text-[#1B2430] mb-3">
        In your package
      </h3>

      {/* Package Image */}
      <div className="h-36 w-full overflow-hidden rounded-lg bg-gray-100 mb-3">
        <img
          src={packageDetails.imageSrc}
          alt={packageDetails.imageAlt}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Service Title */}
      <h4 className="text-sm font-semibold text-[#1B2430] mb-3">
        {packageDetails.title}
      </h4>

      {/* Details Rows */}
      <div className="space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[#4B5563]">Price</span>
          <span className="font-semibold text-[#1B2430]">{packageDetails.price}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#4B5563]">Date</span>
          <span className="text-[#1B2430]">{packageDetails.date}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#4B5563]">Status</span>
          <span className="inline-flex items-center rounded-full bg-[#DBECEC] px-3 py-0.5 text-xs font-semibold text-[#266665]">
            {packageDetails.status}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-5" />

      {/* Helper / Notice text */}
      <p className="text-xs text-[#4B5563] leading-relaxed">
        {packageDetails.noticeText ||
          'Chat does not change the package or create a booking. Changes go through a new package request.'}
      </p>
    </div>
  );
}

