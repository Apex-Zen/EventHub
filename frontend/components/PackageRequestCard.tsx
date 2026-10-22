// components/PackageRequestCard.tsx
export default function PackageRequestCard() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
      {/* වම් පැත්තේ කොළ පාට ඉරි */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-800"></div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-gray-900">New package request</h2>
        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full border border-yellow-200">
          Hold ends in 31 h
        </span>
      </div>

      <div className="flex gap-6 items-center">
        <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" className="w-32 h-24 object-cover rounded-lg" alt="Event" />
        
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

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button className="px-6 py-2 border border-teal-700 text-teal-700 rounded hover:bg-teal-50 font-medium">Reject</button>
            <button className="px-6 py-2 bg-teal-800 text-white rounded hover:bg-teal-900 font-medium">Accept</button>
          </div>
          <div className="text-right text-sm text-gray-500 mt-1">
             Sat 12 Dec, night
          </div>
        </div>
      </div>
    </div>
  );
}