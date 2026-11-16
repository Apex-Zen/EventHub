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

    </div>
  );
}