// components/ServicesAndReviews.tsx
export default function ServicesAndReviews() {
  return (
    <div className="grid grid-cols-2 gap-6 mt-6">
      
      {/* Services Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-serif font-bold">Services</h3>
          <a href="/services" className="text-sm text-teal-700 hover:underline">All services</a>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <p className="font-semibold text-gray-800">Full-day wedding coverage</p>
            <div className="flex gap-8">
              <p className="text-sm text-gray-500 w-16">10 hours</p>
              <p className="font-semibold">180,000</p>
            </div>
          </div>
          <div className="flex justify-between items-center border-b pb-3">
            <p className="font-semibold text-gray-800">Pre-shoot session</p>
            <div className="flex gap-8">
              <p className="text-sm text-gray-500 w-16">3 hours</p>
              <p className="font-semibold">45,000</p>
            </div>
          </div>
          <div className="flex justify-between items-center pb-3">
            <p className="font-semibold text-gray-800">Drone add-on</p>
            <div className="flex gap-8">
              <p className="text-sm text-gray-500 w-16">2 hours</p>
              <p className="font-semibold">25,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-serif font-bold">Reviews</h3>
          <a href="#" className="text-sm text-teal-700 hover:underline">All 62</a>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <p className="text-5xl font-serif font-bold text-teal-700">4.8</p>
          <div>
            <div className="text-yellow-500 text-lg">★★★★★</div>
            <p className="text-sm text-gray-500">62 reviews</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <img src="https://i.pravatar.cc/150?img=5" className="w-6 h-6 rounded-full" alt="User" />
              <p className="font-semibold text-sm">Ishara W.</p>
              <div className="text-yellow-500 text-xs">★★★★★</div>
            </div>
            <p className="text-sm text-gray-600">On time, album came early.</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <img src="https://i.pravatar.cc/150?img=11" className="w-6 h-6 rounded-full" alt="User" />
              <p className="font-semibold text-sm">Ruwan J.</p>
              <div className="text-yellow-500 text-xs">★★★★☆</div>
            </div>
            <p className="text-sm text-gray-600">Edits took five weeks.</p>
          </div>
        </div>
      </div>

    </div>
  );
}