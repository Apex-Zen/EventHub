import React from 'react';

export default function VendorPortfolio() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-page">
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900 font-serif mb-1">Portfolio</h1>
          <p className="text-sm text-ink-600">Clients see these photos while choosing a vendor.</p>
        </div>
        <button className="px-5 py-2.5 bg-green-600 text-white font-medium hover:bg-[#14532d] transition-colors text-sm rounded-sm">
          Upload photo
        </button>
      </div>

      {/* Upload Dropzone Section */}
      <div className="border-2 border-dashed border-green-600/40 bg-green-50 rounded-sm p-8 text-center mb-10 transition-colors hover:border-green-600">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-1">
            ↑
          </div>
          <p className="text-sm font-medium text-ink-900">
            Drop photos here or <span className="text-green-600 cursor-pointer hover:underline">choose files</span>
          </p>
          <p className="text-xs text-ink-400">
            JPG or PNG, up to 10 MB each. Add a caption so clients know the event.
          </p>
        </div>
      </div>

      {/* Portfolio Photo Grid Section (8 items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Photo Card 1 */}
        <div className="bg-white rounded-sm overflow-hidden border border-line shadow-sm flex flex-col">
          <div className="h-44 bg-gray-200 overflow-hidden">
            <img src="/vendor-images/portfolioimg1.jpg" alt="Wedding" className="w-full h-full object-cover hover:scale-105 transition-transform" />
          </div>
          <div className="p-4 flex flex-col justify-between flex-grow">
            <p className="text-xs font-medium text-ink-900 mb-4 leading-relaxed">Mount Lavinia Hotel wedding, March 2026</p>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-line">
              <button className="text-green-600 hover:underline font-medium">Edit caption</button>
              <button className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        </div>

        {/* Photo Card 2 */}
        <div className="bg-white rounded-sm overflow-hidden border border-line shadow-sm flex flex-col">
          <div className="h-44 bg-gray-200 overflow-hidden">
            <img src="/vendor-images/portfolioimg2.jpg" alt="Homecoming" className="w-full h-full object-cover hover:scale-105 transition-transform" />
          </div>
          <div className="p-4 flex flex-col justify-between flex-grow">
            <p className="text-xs font-medium text-ink-900 mb-4 leading-relaxed">Kandy homecoming, January 2026</p>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-line">
              <button className="text-green-600 hover:underline font-medium">Edit caption</button>
              <button className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        </div>

        {/* Photo Card 3 */}
        <div className="bg-white rounded-sm overflow-hidden border border-line shadow-sm flex flex-col">
          <div className="h-44 bg-gray-200 overflow-hidden">
            <img src="/vendor-images/portfolioimg3.jpg" alt="Awards Night" className="w-full h-full object-cover hover:scale-105 transition-transform" />
          </div>
          <div className="p-4 flex flex-col justify-between flex-grow">
            <p className="text-xs font-medium text-ink-900 mb-4 leading-relaxed">Office awards night, Hilton Colombo</p>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-line">
              <button className="text-green-600 hover:underline font-medium">Edit caption</button>
              <button className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        </div>

        {/* Photo Card 4 */}
        <div className="bg-white rounded-sm overflow-hidden border border-line shadow-sm flex flex-col">
          <div className="h-44 bg-gray-200 overflow-hidden">
            <img src="/vendor-images/portfolioimg4.jpg" alt="Engagement" className="w-full h-full object-cover hover:scale-105 transition-transform" />
          </div>
          <div className="p-4 flex flex-col justify-between flex-grow">
            <p className="text-xs font-medium text-ink-900 mb-4 leading-relaxed">Beach engagement, Bentota</p>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-line">
              <button className="text-green-600 hover:underline font-medium">Edit caption</button>
              <button className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        </div>

        {/* Photo Card 5 */}
        <div className="bg-white rounded-sm overflow-hidden border border-line shadow-sm flex flex-col">
          <div className="h-44 bg-gray-200 overflow-hidden">
            <img src="/vendor-images/portfolioimg1.jpg" alt="Temple Ceremony" className="w-full h-full object-cover hover:scale-105 transition-transform" />
          </div>
          <div className="p-4 flex flex-col justify-between flex-grow">
            <p className="text-xs font-medium text-ink-900 mb-4 leading-relaxed">Temple ceremony, Kelaniya</p>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-line">
              <button className="text-green-600 hover:underline font-medium">Edit caption</button>
              <button className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        </div>

        {/* Photo Card 6 */}
        <div className="bg-white rounded-sm overflow-hidden border border-line shadow-sm flex flex-col">
          <div className="h-44 bg-gray-200 overflow-hidden">
            <img src="/vendor-images/portfolioimg2.jpg" alt="Birthday Party" className="w-full h-full object-cover hover:scale-105 transition-transform" />
          </div>
          <div className="p-4 flex flex-col justify-between flex-grow">
            <p className="text-xs font-medium text-ink-900 mb-4 leading-relaxed">Birthday party, Nugegoda</p>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-line">
              <button className="text-green-600 hover:underline font-medium">Edit caption</button>
              <button className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        </div>

        {/* Photo Card 7 */}
        <div className="bg-white rounded-sm overflow-hidden border border-line shadow-sm flex flex-col">
          <div className="h-44 bg-gray-200 overflow-hidden">
            <img src="/vendor-images/portfolioimg3.jpg" alt="Product Launch" className="w-full h-full object-cover hover:scale-105 transition-transform" />
          </div>
          <div className="p-4 flex flex-col justify-between flex-grow">
            <p className="text-xs font-medium text-ink-900 mb-4 leading-relaxed">Product launch, Colombo 07</p>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-line">
              <button className="text-green-600 hover:underline font-medium">Edit caption</button>
              <button className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        </div>

        {/* Photo Card 8 */}
        <div className="bg-white rounded-sm overflow-hidden border border-line shadow-sm flex flex-col">
          <div className="h-44 bg-gray-200 overflow-hidden">
            <img src="/vendor-images/portfolioimg4.jpg" alt="Pre-shoot" className="w-full h-full object-cover hover:scale-105 transition-transform" />
          </div>
          <div className="p-4 flex flex-col justify-between flex-grow">
            <p className="text-xs font-medium text-ink-900 mb-4 leading-relaxed">Pre-shoot, Galle Fort</p>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-line">
              <button className="text-green-600 hover:underline font-medium">Edit caption</button>
              <button className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}