import React, { useState } from 'react';
import { X, Building2 } from 'lucide-react';

export default function AddPropertyModal({ isOpen, onClose, onPropertyAdded }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Residential Flat / Apartment');
  const [rent, setRent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProp = {
      id: Date.now().toString(),
      name,
      type,
      rent: Number(rent) || 0,
      status: 'Vacant',
    };
    onPropertyAdded(newProp);
    setName('');
    setRent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-[28px] p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-black text-slate-900">Add Property</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-semibold">
          <div>
            <label className="block text-slate-600 mb-1">Property Name / Building Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sunrise Apartments / Building A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Property Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
            >
              <option value="Residential Flat / Apartment">Residential Flat / Apartment</option>
              <option value="Independent House / Villa">Independent House / Villa</option>
              <option value="Commercial Shop / Office">Commercial Shop / Office</option>
              <option value="Hostel / PG Building">Hostel / PG Building</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Standard / Base Monthly Rent (₹)</label>
            <input
              type="number"
              placeholder="e.g. 10000"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
            />
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-3 bg-[#1e3a5f] hover:bg-[#162b47] text-white rounded-xl font-bold transition shadow-md shadow-[#1e3a5f]/20 active:scale-95"
            >
              Save Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}