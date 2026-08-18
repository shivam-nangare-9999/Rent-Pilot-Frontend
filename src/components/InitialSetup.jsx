import React, { useState } from 'react';
import { Building2, User, Phone, ArrowRight } from 'lucide-react';

export default function InitialSetup({ onComplete }) {
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const landlordProfile = {
      name: name.trim(),
      businessName: businessName.trim() || 'My Properties',
      phone: phone.trim(),
    };

    // ब्राऊझरमध्ये सेव्ह करा
    localStorage.setItem('landlordProfile', JSON.stringify(landlordProfile));
    onComplete(landlordProfile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in-95">
        
        {/* App Logo & Welcome */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-100">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">RentManager</h2>
          <p className="text-xs text-slate-500 mt-1">
            सुरुवात करण्यासाठी तुमची माहिती भरा (पावत्यांवर हेच नाव दिसेल)
          </p>
        </div>

        {/* Setup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              तुमचे नाव (Landlord Name) *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="उदा. राहुल पाटील"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              प्रॉपर्टी / व्यवसायाचे नाव (ऐच्छिक)
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="उदा. साई रेसिडेन्सी / पाटील इस्टेट"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              मोबाईल नंबर (WhatsApp पावत्यांसाठी)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                placeholder="उदा. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl text-sm shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition"
          >
            <span>सुरू करा (Continue)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}