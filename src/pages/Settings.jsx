import React, { useState } from 'react';
import { Save, Download, User, Shield, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const [profile, setProfile] = useState(() =>
    JSON.parse(localStorage.getItem('landlordProfile') || '{"name":"","businessName":"","phone":"","upiId":""}')
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('landlordProfile', JSON.stringify(profile));
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const handleExportBackup = () => {
    const data = {
      profile: JSON.parse(localStorage.getItem('landlordProfile') || '{}'),
      properties: JSON.parse(localStorage.getItem('app_properties') || '[]'),
      tenants: JSON.parse(localStorage.getItem('app_tenants') || '[]'),
      receipts: JSON.parse(localStorage.getItem('app_receipts') || '[]'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RentPilot_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-28">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-5 py-3.5 sticky top-0 z-20 flex items-center justify-between">
        <div>
          <div className="md:hidden">
            <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">
              App <span className="text-[#1e3a5f]">Settings</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Owner Profile & Data Backup
            </p>
          </div>

          <div className="hidden md:block">
            <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">
              Account & Application Settings
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Manage profile information, UPI and database backups
            </p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4 max-w-md md:max-w-4xl mx-auto">
        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl flex items-center gap-2.5 animate-in fade-in shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs font-bold">Profile details have been saved successfully!</p>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-[32px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Owner Details</h3>
              <p className="text-[10px] text-slate-400 font-medium">This information will appear on generated receipts and reminders</p>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 text-xs font-bold mb-1">Your Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
            />
          </div>

          <div>
            <label className="block text-slate-600 text-xs font-bold mb-1">Property / Business Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Skyline Heights / Doe Properties"
              value={profile.businessName}
              onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
            />
          </div>

          <div>
            <label className="block text-slate-600 text-xs font-bold mb-1">Contact Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="10-digit phone number"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
            />
          </div>

          <div>
            <label className="block text-slate-600 text-xs font-bold mb-1">UPI ID (For Receiving Rent)</label>
            <input
              type="text"
              placeholder="e.g. 9876543210@upi / name@oksbi"
              value={profile.upiId}
              onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
            />
            <p className="text-[10px] text-slate-400 mt-1 font-medium">This UPI ID is automatically added to tenant WhatsApp reminders.</p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#1e3a5f] hover:bg-[#162b47] text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-[#1e3a5f]/20 active:scale-95 transition mt-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </form>

        <div className="bg-white rounded-[32px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] space-y-3">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Data Backup & Export</h3>
              <p className="text-[10px] text-slate-400 font-medium">Export and securely back up your application data</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Download all your properties, tenants, and payment history in a single JSON backup file.
          </p>

          <button
            type="button"
            onClick={handleExportBackup}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition active:scale-95 border border-slate-200/70"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export Data Backup (JSON)</span>
          </button>
        </div>
      </main>
    </div>
  );
}