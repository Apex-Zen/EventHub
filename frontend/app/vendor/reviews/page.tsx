import React from 'react';

export default function VendorReviews() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-page">
      
      {/* Top Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900 font-serif mb-1">Reviews</h1>
        <p className="text-sm text-ink-600">Your public score is what clients see on your profile and in matching.</p>
      </div>

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Card 1: Public Score */}
        <div className="bg-white p-5 rounded-sm shadow-sm border border-line">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-600 mb-1">Public score</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-serif text-ink-900">4.8</span>
            <span className="text-xs text-ink-500">out of 5</span>
          </div>
        </div>

        {/* Card 2: Reviews */}
        <div className="bg-white p-5 rounded-sm shadow-sm border border-line">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-600 mb-1">Reviews</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-serif text-ink-900">62</span>
            <span className="text-xs text-ink-500">from completed events</span>
          </div>
        </div>

        {/* Card 3: 5-star share */}
        <div className="bg-white p-5 rounded-sm shadow-sm border border-line">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-600 mb-1">5-star share</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-serif text-ink-900">79%</span>
            <span className="text-xs text-ink-500">49 of 62</span>
          </div>
        </div>

        {/* Card 4: Replied to */}
        <div className="bg-white p-5 rounded-sm shadow-sm border border-line">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-600 mb-1">Replied to</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-serif text-ink-900">90%</span>
            <span className="text-xs text-ink-500">56 of 62</span>
          </div>
        </div>

      </div>

      {/* Main Content Layout (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Rating Breakdown (4 columns) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-sm shadow-sm border border-line space-y-6">
          <h2 className="font-serif font-bold text-xl text-ink-900">Rating breakdown</h2>

          <div className="space-y-3 text-xs">
            
            {/* 5 Stars */}
            <div className="flex items-center space-x-3">
              <span className="w-6 text-ink-600 font-medium">5 ★</span>
              <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-green-700 h-full w-[90%] rounded-full"></div>
              </div>
              <span className="w-6 text-right text-ink-500">49</span>
            </div>

            {/* 4 Stars */}
            <div className="flex items-center space-x-3">
              <span className="w-6 text-ink-600 font-medium">4 ★</span>
              <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-green-700 h-full w-[25%] rounded-full"></div>
              </div>
              <span className="w-6 text-right text-ink-500">9</span>
            </div>

            {/* 3 Stars */}
            <div className="flex items-center space-x-3">
              <span className="w-6 text-ink-600 font-medium">3 ★</span>
              <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-green-700 h-full" style={{ width: '15%' }}></div>
              </div>
              <span className="w-6 text-right text-ink-500">3</span>
            </div>

            {/* 2 Stars */}
            <div className="flex items-center space-x-3">
              <span className="w-6 text-ink-600 font-medium">2 ★</span>
              <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-green-700 h-full w-[5%]"></div>
              </div>
              <span className="w-6 text-right text-ink-500">1</span>
            </div>

            {/* 1 Star */}
            <div className="flex items-center space-x-3">
              <span className="w-6 text-ink-600 font-medium">1 ★</span>
              <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-green-700 h-full w-0"></div>
              </div>
              <span className="w-6 text-right text-ink-500">0</span>
            </div>

          </div>
        </div>

        {/* Right Column: Latest Comments (8 columns) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-sm shadow-sm border border-line space-y-4">
          
          <div className="flex justify-between items-center pb-2 border-b border-line">
            <h2 className="font-serif font-bold text-xl text-ink-900">Latest comments</h2>
            <button className="text-xs font-medium text-green-600 hover:underline">Newest first</button>
          </div>

          <div className="divide-y divide-line">
            
            {/* Review 1 */}
            <div className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold text-ink-900">Ishara W.</span>
                  <span className="text-amber-500 text-xs">★★★★★</span>
                </div>
                <p className="text-xs text-ink-600">Mount Lavinia wedding · “On time, album came early.”</p>
              </div>
              <button className="px-4 py-2 border border-line rounded-sm text-xs font-medium text-ink-900 hover:border-green-600 transition-colors flex-shrink-0">
                Reply
              </button>
            </div>

            {/* Review 2 */}
            <div className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold text-ink-900">Ruwan J.</span>
                  <span className="text-amber-500 text-xs">★★★★☆</span>
                </div>
                <p className="text-xs text-ink-600">Kandy homecoming · “Great photos. Edits took five weeks.”</p>
              </div>
              <span className="text-xs text-ink-400 font-medium flex-shrink-0">Replied</span>
            </div>

            {/* Review 3 */}
            <div className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold text-ink-900">Malini S.</span>
                  <span className="text-amber-500 text-xs">★★★★★</span>
                </div>
                <p className="text-xs text-ink-600">Office awards night · “Professional and friendly.”</p>
              </div>
              <button className="px-4 py-2 border border-line rounded-sm text-xs font-medium text-ink-900 hover:border-green-600 transition-colors flex-shrink-0">
                Reply
              </button>
            </div>

            {/* Review 4 */}
            <div className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold text-ink-900">Dinuka W.</span>
                  <span className="text-amber-500 text-xs">★★★★★</span>
                </div>
                <p className="text-xs text-ink-600">Wickrama birthday · “Kids loved the photo booth.”</p>
              </div>
              <span className="text-xs text-ink-400 font-medium flex-shrink-0">Replied</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}