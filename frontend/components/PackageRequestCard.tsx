// components/PackageRequestCard.tsx
export default function PackageRequestCard() {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm relative border-l-4 border-l-[#0f5132]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-gray-900">New package request</h2>
        <span className="bg-[#fef3c7] text-[#92400e] text-xs font-semibold px-3 py-1 rounded-full">
          Hold ends in 31 h
        </span>
      </div>

      <div className="flex gap-6 items-center">
        <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" className="w-32 h-24 object-cover rounded-md" alt="Event" />
        
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Client</p>
            <p className="font-semibold text-gray-900">Nadeesha Perera</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Service</p>
            <p className="font-semibold text-gray-900">Full-day coverage</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Event</p>
            <p className="font-semibold text-gray-900">Perera–Silva wedding</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="font-semibold text-gray-900">LKR 180,000</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 items-end">
          <div className="flex gap-3">
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium">Reject</button>
            <button className="px-6 py-2 bg-[#0f5132] text-white rounded-md hover:bg-[#0a3d24] font-medium">Accept</button>
          </div>
          <p className="text-sm text-gray-600 mt-2">Sat 12 Dec, night</p>
        </div>
      </div>
    </div>
  );
}