import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, DoorOpen, Calendar, User, LogOut, Lock } from 'lucide-react';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  // LocalStorage मधून प्रॉपर्टी वाचणे
  const properties = JSON.parse(localStorage.getItem('app_properties') || '[]');
  const propData = properties.find((p) => String(p.id) === String(id));

  // जर प्रॉपर्टी मिळाली नाही तर डिफॉल्ट डेटा
  const property = propData || {
    id: id || 1,
    name: 'Room Unit',
    status: 'OCCUPIED',
    isExclusive: true,
    baseRent: 1000,
    fixedCharges: 0,
    tenant: 'yd',
    phone: '91 6464878784',
    startDate: '19 Aug 2026',
  };

  const handleVacate = () => {
    if (window.confirm('तुम्हाला या भाडेकरूला खोलीतून Vacate (बाहेर) करायचे आहे का?')) {
      const updated = properties.map((p) =>
        String(p.id) === String(id)
          ? { ...p, status: 'Vacant', tenant: null, phone: '', startDate: null }
          : p
      );
      localStorage.setItem('app_properties', JSON.stringify(updated));
      alert('Tenant Vacated Successfully!');
      navigate('/properties');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-800 font-sans pb-24">
      {/* Top App Bar */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 text-[#11294a] hover:bg-slate-100 rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-[#11294a]">Property Details</h1>
        </div>

        <div className="flex items-center gap-3 text-slate-700">
          <button className="p-1 hover:text-[#11294a]">
            <Edit3 className="w-5 h-5" />
          </button>
          <button className="p-1 text-rose-700 hover:text-rose-800">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Segmented Tab Switcher */}
        <div className="bg-[#f0f3f8] p-1 rounded-full flex items-center">
          <button
            onClick={() => setActiveTab('Overview')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all ${
              activeTab === 'Overview'
                ? 'bg-white text-[#11294a] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('RentReceipts')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all ${
              activeTab === 'RentReceipts'
                ? 'bg-white text-[#11294a] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Rent Receipts
          </button>
        </div>

        {activeTab === 'Overview' ? (
          <>
            {/* Property Identity Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#eaf1fb] flex items-center justify-center text-[#11294a]">
                <DoorOpen className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-900">{property.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="bg-[#e7f7ed] text-[#1b7a43] text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                    {property.status || 'VACANT'}
                  </span>
                  {property.isExclusive && (
                    <span className="bg-[#e8f2fe] text-[#2563eb] text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> EXCLUSIVE
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-3">
                FINANCIAL DETAILS
              </p>
              <div className="grid grid-cols-2 divide-x divide-slate-100">
                <div className="pr-3">
                  <span className="text-xs text-slate-500 font-medium">Base rent</span>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">₹{property.rent || property.baseRent || 0}</p>
                </div>
                <div className="pl-4">
                  <span className="text-xs text-slate-500 font-medium">Fixed charges</span>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">₹{property.fixedCharges || 0}</p>
                </div>
              </div>
            </div>

            {/* Active Occupants Section */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2.5">Active Occupants</h3>

              {property.tenant ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#0d2745] text-white flex items-center justify-center font-bold text-base">
                      {typeof property.tenant === 'string' ? property.tenant.charAt(0).toUpperCase() : 'T'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{property.tenant}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        📞 {property.phone || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 my-3.5" />

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-4 h-4" />
                      <span>Started: {property.startDate || 'N/A'}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-slate-700 font-semibold hover:text-[#11294a]">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={handleVacate}
                        className="flex items-center gap-1 text-rose-600 font-semibold hover:text-rose-700"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Vacate</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-400 text-xs">
                  सध्या ही खोली रिकामी (Vacant) आहे.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-400 text-sm border border-slate-200">
            या प्रॉपर्टीसाठी सध्या कोणतीही पावती उपलब्ध नाही.
          </div>
        )}
      </div>
    </div>
  );
}