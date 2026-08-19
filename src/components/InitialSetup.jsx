import React, { useState } from 'react';
import { Building, ArrowRight } from 'lucide-react';

export default function InitialSetup({ onComplete }) {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    upiId: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.businessName || !formData.phone) return;
    localStorage.setItem('landlordProfile', JSON.stringify(formData));
    onComplete(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white max-w-md w-full rounded-[32px] p-6 shadow-2xl border border-slate-100">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Building className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Welcome to RentPilot</h2>
          <p className="text-xs text-slate-400 mt-1">Set up your landlord profile to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-semibold">
          <div>
            <label className="block text-slate-600 mb-1">Your Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Property / Business Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Skyline Heights / Doe Properties"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1">WhatsApp Mobile Number *</label>
            <input
              type="tel"
              required
              placeholder="10-digit mobile number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1">UPI ID (For Receiving Rent)</label>
            <input
              type="text"
              placeholder="e.g. mobile@upi / name@okhdfcbank"
              value={formData.upiId}
              onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#1e3a5f] hover:bg-[#162b47] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-[#1e3a5f]/20 active:scale-95 transition mt-2 text-xs"
          >
            <span>Start Managing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}