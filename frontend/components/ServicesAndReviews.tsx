// components/ServicesAndReviews.tsx
export default function ServicesAndReviews() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Services */}
      <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-serif font-bold">Services</h3>
          <a href="#" className="text-sm text-[#0f5132] hover:underline">All services</a>
        </div>
        <div className="space-y-5">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <p className="font-semibold text-gray-800 text-sm">Full-day wedding coverage</p>
            <div className="flex gap-10 items-center">
              <p className="text-sm text-gray-400">10 hours</p>
              <p className="font-bold text-gray-900">180,000</p>
            </div>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <p className="font-semibold text-gray-800 text-sm">Pre-shoot session</p>
            <div className="flex gap-10 items-center">
              <p className="text-sm text-gray-400">3 hours</p>
              <p className="font-bold text-gray-900">45,000</p>
            </div>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <p className="font-semibold text-gray-800 text-sm">Drone add-on</p>
            <div className="flex gap-10 items-center">
              <p className="text-sm text-gray-400">2 hours</p>
              <p className="font-bold text-gray-900">25,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-serif font-bold">Reviews</h3>
          <a href="#" className="text-sm text-[#0f5132] hover:underline">All 62</a>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <p className="text-6xl font-serif font-bold text-[#0f5132]">4.8</p>
          <div>
            <div className="text-[#f59e0b] text-lg">★★★★★</div>
            <p className="text-sm text-gray-500">62 reviews</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img src="https://i.pravatar.cc/150?img=5" className="w-8 h-8 rounded-full" alt="User" />
              <p className="font-bold text-gray-900">Ishara W.</p>
              <div className="text-[#f59e0b] text-sm">★★★★★</div>
            </div>
            <p className="text-sm text-gray-600 ml-11">On time, album came early.</p>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img src="https://i.pravatar.cc/150?img=11" className="w-8 h-8 rounded-full" alt="User" />
              <p className="font-bold text-gray-900">Ruwan J.</p>
              <div className="text-[#f59e0b] text-sm">★★★★☆</div>
            </div>
            <p className="text-sm text-gray-600 ml-11">Edits took five weeks.</p>
          </div>
        </div>
      </div>

    </div>
  );
}