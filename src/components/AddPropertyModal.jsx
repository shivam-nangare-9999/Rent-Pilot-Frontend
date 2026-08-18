import React, { useState } from 'react';
import { X, Building2, Plus } from 'lucide-react';

export default function AddPropertyModal({ isOpen, onClose, onAdd }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    type: 'Room',
    baseRent: '',
    fixedCharges: '0',
    isExclusive: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.baseRent) return;

    onAdd({
      id: Date.now(),
      name: formData.name,
      type: formData.type,
      rent: Number(formData.baseRent),
      fixedCharges: Number(formData.fixedCharges) || 0,
      status: 'Vacant',
      tenant: null,
      phone: '',
      startDate: null,
      isExclusive: formData.isExclusive,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#11294a]" />
            <h3 className="text-base font-bold text-slate-900">Add New Property</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-slate-700 mb-1">Property Name / Unit No. *</label>
            <input
              type="text"
              required
              placeholder="उदा. Flat 101 किंवा Room 2"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#11294a]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#11294a]"
              >
                <option value="Room">Room</option>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="Shop">Shop</option>
                <option value="PG Bed">PG Bed</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 mb-1">Monthly Base Rent (₹) *</label>
              <input
                type="number"
                required
                placeholder="1000"
                value={formData.baseRent}
                onChange={(e) => setFormData({ ...formData, baseRent: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#11294a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Fixed Extra Charges (₹/mo)</label>
            <input
              type="number"
              placeholder="0 (उदा. मेंटेनन्स / पाणीपट्टी)"
              value={formData.fixedCharges}
              onChange={(e) => setFormData({ ...formData, fixedCharges: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#11294a]"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#0a1e3b] hover:bg-[#11294a] text-white rounded-xl shadow transition"
            >
              Save Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}