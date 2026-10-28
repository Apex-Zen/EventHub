import React from 'react';

const services = [
  { name: 'Full-day wedding coverage', hours: '10 hours', price: '180,000' },
  { name: 'Pre-shoot session', hours: '3 hours', price: '45,000' },
  { name: 'Drone add-on', hours: '2 hours', price: '25,000' },
];

export default function VendorServicesCard() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 font-serif">Services</h3>
        <button className="text-xs text-teal-700 font-semibold hover:underline">
          All services
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {services.map((service, index) => (
          <div key={index} className="py-3 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-800">{service.name}</span>
            <div className="flex items-center gap-6">
              <span className="text-xs text-gray-400">{service.hours}</span>
              <span className="font-bold text-gray-900 w-16 text-right">{service.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}