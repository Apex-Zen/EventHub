import React from 'react';

// Update paths to include the /vendor-images/ folder
const portfolioImages = [
  '/vendor-images/portfolioimg4.jpg',
  '/vendor-images/portfolioimg3.jpg',
  '/vendor-images/portfolioimg1.jpg',
  '/vendor-images/portfolioimg2.jpg',
];

export default function VendorPortfolioCard() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 font-serif">Portfolio</h3>
        <button className="text-xs text-teal-700 font-semibold hover:underline">
          Open gallery
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {portfolioImages.map((src, index) => (
          <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
            <img
              src={src}
              alt={`Portfolio photo ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}