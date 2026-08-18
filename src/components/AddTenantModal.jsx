import React, { useState, useEffect } from 'react';
import { X, User, Phone, Home, DollarSign, Calendar, Shield } from 'lucide-react';

export default function AddTenantModal({ isOpen, onClose, onTenantAdded }) {
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    unit: '',
    rent: '',
    deposit: '',
    startDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (isOpen) {
      const savedProps = JSON.parse(localStorage.getItem('app_properties') || '[]');
      // फक्त Vacant (रिकाम्या) किंवा सर्व प्रॉपर्टीज दाखवा
      setProperties(savedProps);
      if (savedProps.length > 0 && !formData.unit) {
        setFormData((prev) => ({ 
          ...prev, 
          unit: savedProps[0].name,
          rent: savedProps[0].rent || ''
        }));
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePropertyChange = (e) => {
    const selectedUnitName = e.target.value;
    const prop = properties.find((p) => p.name === selectedUnitName);
    setFormData({
      ...formData,
      unit: selectedUnitName,
      rent: prop ? prop.rent || '' : formData.rent,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.unit || !formData.rent) {
      alert('कृपया आवश्यक सर्व माहिती भरा.');
      return;
    }

    const newTenant = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      unit: formData.unit,
      rent: Number(formData.rent),
      deposit: Number(formData.deposit) || 0,
      startDate: formData.startDate,
      status: 'Due', // नवीन भाडेकरूचे स्टेटस सुरुवातीला Due
    };

    // १. भाडेकरू जोडणे
    onTenantAdded(newTenant);

    // २. प्रॉपर्टीचे स्टेटस आपोआप Occupied करणे
    const savedProps = JSON.parse(localStorage.getItem('app_properties') || '[]');
    const updatedProps = savedProps.map((p) => {
      if (p.name === formData.unit) {
        return { ...p, status: 'Occupied', tenantName: formData.name };
      }
      return p;
    });
    localStorage.setItem('app_properties', JSON.stringify(updatedProps));

    // फॉर्म रिसेट आणि मॉडेल बंद करणे
    setFormData({
      name: '',
      phone: '',
      unit: '',
      rent: '',
      deposit: '',
      startDate: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#11294a] text-white rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add New Tenant</h2>
              <p className="text-[11px] text-slate-400">नवीन भाडेकरूची नोंद करा</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-semibold">
          
          {/* Tenant Name */}
          <div>
            <label className="block text-slate-700 mb-1">भाडेकरूचे नाव (Full Name) *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="उदा. राहुल शिंदे"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#11294a]"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-slate-700 mb-1">मोबाईल नंबर (Phone Number) *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="उदा. 9876543210"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#11294a]"
              />
            </div>
          </div>

          {/* Select Property / Room */}
          <div>
            <label className="block text-slate-700 mb-1">खोली / फ्लॅट निवडा (Select Unit) *</label>
            <div className="relative">
              <Home className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                required
                value={formData.unit}
                onChange={handlePropertyChange}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#11294a]"
              >
                {properties.length === 0 ? (
                  <option value="">कोणतीही खोली उपलब्ध नाही</option>
                ) : (
                  properties.map((prop) => (
                    <option key={prop.id} value={prop.name}>
                      {prop.name} ({prop.type || 'Room'}) - {prop.status === 'Occupied' ? 'Occupied' : 'Vacant'}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Monthly Rent & Security Deposit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1">मासिक भाडे (Rent) *</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  required
                  value={formData.rent}
                  onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                  placeholder="उदा. 5000"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#11294a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">डिपॉझिट (Deposit)</label>
              <div className="relative">
                <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                  placeholder="उदा. 10000"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#11294a]"
                />
              </div>
            </div>
          </div>

          {/* Joining Date */}
          <div>
            <label className="block text-slate-700 mb-1">भाडे सुरू होण्याची तारीख (Start Date) *</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#11294a]"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              रद्द करा (Cancel)
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 bg-[#0a1e3b] hover:bg-[#11294a] text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              भाडेकरू जोडा (Save)
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}