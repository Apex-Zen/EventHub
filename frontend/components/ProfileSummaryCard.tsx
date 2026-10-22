// components/ProfileSummaryCard.tsx
export default function ProfileSummaryCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      <img src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full h-32 object-cover" alt="Cover" />
      
      <div className="p-6 pt-0 relative flex-1 flex flex-col justify-between">
        <div>
          <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" className="w-16 h-16 rounded-full border-4 border-white object-cover absolute -top-8 left-6" alt="Profile" />
          
          <div className="mt-10">
            <h3 className="text-xl font-serif font-bold text-gray-900">Lens & Light Studio</h3>
            <p className="text-sm text-gray-500 mt-1">Photography • Colombo • Age 34</p>
          </div>
        </div>
        
        <div className="flex justify-between items-end mt-6 pt-4 border-t border-gray-100">
          <div>
            <span className="text-3xl font-serif font-bold text-[#0f5132]">4.8</span>
            <span className="text-sm text-gray-500 ml-1">public score</span>
          </div>
          <a href="/profile" className="text-sm font-semibold text-[#0f5132] hover:underline">View profile</a>
        </div>
      </div>
    </div>
  );
}