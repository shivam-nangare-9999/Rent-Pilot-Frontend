import React, { useState } from 'react';
import { X, DollarSign, Zap, Calendar, CreditCard } from 'lucide-react';
import ReceiptModal from './ReceiptModal';

export default function RecordPaymentModal({ isOpen, tenant, onClose, onPaymentSuccess }) {
  const [amount, setAmount] = useState(tenant?.rent || '');
  const [electricityAmount, setElectricityAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [month, setMonth] = useState(
    new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })
  );

  const [generatedReceipt, setGeneratedReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  if (!isOpen || !tenant) return null;

  const landlordProfile = JSON.parse(localStorage.getItem('landlordProfile') || '{}');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReceipt = {
      id: Date.now().toString(),
      tenantId: tenant.id,
      tenantName: tenant.name,
      phone: tenant.phone,
      unit: tenant.unit,
      amount: Number(amount) || Number(tenant.rent),
      electricityAmount: Number(electricityAmount) || 0,
      paymentMode,
      month,
      date: new Date().toLocaleDateString('en-GB'),
    };

    // १. पावती डेटाबेसमध्ये सेव्ह करणे
    const savedReceipts = JSON.parse(localStorage.getItem('app_receipts') || '[]');
    localStorage.setItem('app_receipts', JSON.stringify([newReceipt, ...savedReceipts]));

    // २. भाडेकरूचे स्टेटस पेड करणे
    onPaymentSuccess(newReceipt);

    // ३. पावती मॉडेल उघडणे
    setGeneratedReceipt(newReceipt);
    setIsReceiptOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-100">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Record Rent Payment</h2>
              <p className="text-xs text-slate-400">{tenant.name} • {tenant.unit}</p>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-semibold">
            <div>
              <label className="block text-slate-700 mb-1">भाडे रक्कम (Rent Amount) *</label>
              <input
                type="number"
                required
                defaultValue={tenant.rent}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#11294a]"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">लाईट बिल (Electricity Bill - Optional)</label>
              <input
                type="number"
                value={electricityAmount}
                onChange={(e) => setElectricityAmount(e.target.value)}
                placeholder="उदा. 450"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#11294a]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1">महिना (Month)</label>
                <input
                  type="text"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#11294a]"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">पेमेंट मोड (Mode)</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#11294a]"
                >
                  <option value="UPI">Google Pay / UPI</option>
                  <option value="Cash">Cash (रोख)</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
              >
                रद्द करा
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 bg-[#0a1e3b] hover:bg-[#11294a] text-white rounded-xl font-bold transition shadow-sm"
              >
                भाडे जमा करा & पावती द्या
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* पावती पॉपअप */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        receipt={generatedReceipt}
        landlordProfile={landlordProfile}
        onClose={() => {
          setIsReceiptOpen(false);
          onClose();
        }}
      />
    </>
  );
}