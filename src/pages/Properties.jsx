import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, DoorOpen, User, Plus, HelpCircle } from 'lucide-react';
import AddPropertyModal from '../components/AddPropertyModal';

export default function Properties() {
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('app_properties');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'oddy',
        type: 'Room',
        rent: 1000,
        tenant: 'yd',
        phone: '91 6464878784',
        status: 'Occupied',
        fixedCharges: 0,
        startDate: '19 Aug 2026',
        isExclusive: true,
      }
    ];
  });

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // डेटा सेव्ह ठेवणे
  useEffect(() => {
    localStorage.setItem('app_properties', JSON.stringify(properties));
  }, [properties]);

  // नवीन प्रॉपर्टी ॲड करण्याचे फंक्शन
  const handleAddProperty = (newProp) => {
    setProperties((prev) => [newProp, ...prev]);
  };

  const filteredProperties = properties.filter((p) => {
    const matchesFilter =
      activeFilter === 'All' ? true : p.status.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tenant && p.tenant.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8faff] pb-24 text-slate-800 font-sans">
      {/* Top Header */}
      <div className="bg-white px-5 pt-6 pb-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#11294a] flex items-center justify-center text-white shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#11294a] tracking-tight">Properties</h1>
        </div>

        <button className="flex items-center gap-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm transition">
          <HelpCircle className="w-4 h-4" />
          <span>How to use</span>
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
          <input
            type="text"
            placeholder="Search by name, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-300 rounded-full text-sm placeholder-slate-400 focus:outline-none focus:border-[#11294a]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2.5 pt-1">
          {['All', 'Occupied', 'Vacant'].map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  isActive
                    ? 'bg-[#0f233d] text-white border-[#0f233d]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Plan Limit Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center text-xs mb-2">
            <p className="font-bold text-slate-800">
              {properties.length} / 5 Properties <span className="font-normal text-slate-500">(Free Plan)</span>
            </p>
            <button className="text-[#f59e0b] font-bold hover:underline">Upgrade</button>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-[#f59e0b] rounded-full"
              style={{ width: `${Math.min((properties.length / 5) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Upgrade for Unlimited</p>
        </div>

        {/* Properties List */}
        <div className="space-y-3">
          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-400 text-sm border border-slate-200">
              कोणतीही प्रॉपर्टी सापडली नाही.
            </div>
          ) : (
            filteredProperties.map((prop) => (
              <div
                key={prop.id}
                onClick={() => navigate(`/properties/${prop.id}`)}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-[#11294a]/40 transition cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <DoorOpen className="w-6 h-6 text-[#11294a]" />
                    <span className="text-lg font-bold text-slate-900">{prop.name}</span>
                    <span className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                      {prop.type}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-bold text-[#11294a]">₹{prop.rent}</span>
                    <span className="text-xs text-slate-500 font-medium">/mo</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3 pt-2">
                  <div className="flex items-center gap-2 text-slate-600">
                    <User className="w-4 h-4 text-slate-700" />
                    <span className="text-sm font-semibold">{prop.tenant || 'No Tenant'}</span>
                  </div>

                  <span
                    className={`text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                      prop.status.toLowerCase() === 'occupied' ? 'bg-[#107048]' : 'bg-slate-500'
                    }`}
                  >
                    {prop.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button (+) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-[#0a1e3b] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#11294a] active:scale-95 transition z-30"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>

      {/* Add Property Modal */}
      <AddPropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProperty}
      />
    </div>
  );
}