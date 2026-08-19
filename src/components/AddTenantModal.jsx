import React, { useState, useEffect } from 'react';
import { X, UserPlus, MapPin, Calendar } from 'lucide-react';

export default function AddTenantModal({ isOpen, onClose, onTenantAdded }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [flatNo, setFlatNo] = useState('');
  const [address, setAddress] = useState('');
  const [rent, setRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const savedProps = JSON.parse(localStorage.getItem('app_properties') || '[]');
    setProperties(savedProps);
    if (savedProps.length > 0) {
      setSelectedProperty(savedProps[0].name);
      setRent(savedProps[0].rent || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePropertyChange = (propName) => {
    setSelectedProperty(propName);
    const selected = properties.find((p) => p.name === propName);
    if (selected) setRent(selected.rent || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const unitDisplay = flatNo ? `${flatNo} (${selectedProperty})` : selectedProperty;

    const newTenant = {
      id: Date.now().toString(),
      name,
      phone,
      propertyName: selectedProperty,
      flatNo: flatNo || '',
      unit: unitDisplay,
      address: address || 'No address provided',
      rent: Number(rent),
      deposit: Number(deposit) || 0,
      status: 'Due',
      startDate: startDate,
    };

    onTenantAdded(newTenant);
    setName('');
    setPhone('');
    setFlatNo('');
    setAddress('');
    setRent('');
    setDeposit('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-[28px] p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-black text-slate-900">Add New Tenant</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-semibold">
          <div>
            <label className="block text-slate-600 mb-1">Tenant Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Phone Number (WhatsApp) *</label>
            <input
              type="tel"
              required
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1">Select Property *</label>
              {properties.length === 0 ? (
                <p className="text-[11px] text-rose-500">Please add a property first.</p>
              ) : (
                <select
                  value={selectedProperty}
                  onChange={(e) => handlePropertyChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Flat / Room No.</label>
              <input
                type="text"
                placeholder="e.g. Flat 101"
                value={flatNo}
                onChange={(e) => setFlatNo(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#1e3a5f]" />
              <span>Permanent Address</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 123 Main Street, Pune - 411001"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1">Monthly Rent (₹) *</label>
              <input
                type="number"
                required
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Security Deposit (₹)</label>
              <input
                type="number"
                placeholder="0"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#1e3a5f]" />
              <span>Move-in / Start Date *</span>
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
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
              Save Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}