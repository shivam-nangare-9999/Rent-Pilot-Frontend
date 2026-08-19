import React, { useState, useEffect } from 'react';
import { Receipt, Search, ChevronRight } from 'lucide-react';
import ReceiptModal from '../components/ReceiptModal';

export default function Receipts({ profile }) {
  const [receipts, setReceipts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('app_receipts') || '[]');
    setReceipts(saved);
  }, []);

  const filteredReceipts = receipts.filter((r) =>
    r.tenantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.unit?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.month?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCollectedAmount = receipts.reduce(
    (sum, r) => sum + Number(r.amount || 0) + Number(r.electricityAmount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-28">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-5 py-3.5 sticky top-0 z-20 flex items-center justify-between">
        <div>
          <div className="md:hidden">
            <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">
              Rent <span className="text-[#1e3a5f]">Receipts</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              {profile?.businessName || 'Issued Invoices & History'}
            </p>
          </div>

          <div className="hidden md:block">
            <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">
              Rent Receipts & Invoices
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Manage and print issued tenant receipts
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full text-xs font-bold">
          {receipts.length} Total Issued
        </span>
      </header>

      <main className="p-4 space-y-4 max-w-md md:max-w-4xl mx-auto">
        <div className="bg-white rounded-[32px] p-5 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Invoices Value</p>
            <h2 className="text-2xl font-black text-slate-900 mt-0.5">₹{totalCollectedAmount.toLocaleString()}</h2>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#1e3a5f]/10 border border-[#1e3a5f]/20 text-[#1e3a5f] flex items-center justify-center font-bold">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tenant name, unit or month..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1e3a5f]"
          />
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Issued Receipts ({filteredReceipts.length})
            </h3>
            <span className="text-[10px] font-bold text-slate-400">Tap to view receipt</span>
          </div>

          {filteredReceipts.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No receipts found.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredReceipts.map((rcpt) => {
                const totalAmt = Number(rcpt.amount || 0) + Number(rcpt.electricityAmount || 0);
                return (
                  <div
                    key={rcpt.id}
                    onClick={() => setSelectedReceipt(rcpt)}
                    className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/60 flex items-center justify-between hover:bg-slate-100/70 transition cursor-pointer active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/10 text-[#1e3a5f] border border-[#1e3a5f]/20 flex items-center justify-center font-bold">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{rcpt.tenantName}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {rcpt.unit} • <span className="text-[#1e3a5f] font-semibold">{rcpt.month}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-black text-emerald-600">₹{totalAmt.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{rcpt.date}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <ReceiptModal
        isOpen={!!selectedReceipt}
        receipt={selectedReceipt}
        landlordProfile={profile}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}