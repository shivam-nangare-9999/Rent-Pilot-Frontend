import React, { useState, useEffect } from 'react';
import { X, Zap } from 'lucide-react';
import ReceiptModal from './ReceiptModal';

export default function RecordPaymentModal({ isOpen, tenant, onClose, onPaymentSuccess }) {
  const [amount, setAmount] = useState('');
  const [prevUnits, setPrevUnits] = useState('');
  const [currUnits, setCurrUnits] = useState('');
  const [unitRate, setUnitRate] = useState('10');
  
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const [generatedReceipt, setGeneratedReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  useEffect(() => {
    if (tenant) {
      setAmount(tenant.rent || '');
      
      const savedReceipts = JSON.parse(localStorage.getItem('app_receipts') || '[]');
      const lastReceipt = savedReceipts.find((r) => String(r.tenantId) === String(tenant.id));
      
      if (lastReceipt && lastReceipt.currReading) {
        setPrevUnits(String(lastReceipt.currReading));
      } else if (tenant.lastElectricityReading) {
        setPrevUnits(String(tenant.lastElectricityReading));
      } else {
        setPrevUnits('');
      }

      setCurrUnits('');
      setUnitRate('10');
    }
  }, [tenant, isOpen]);

  if (!isOpen || !tenant) return null;

  const landlordProfile = JSON.parse(localStorage.getItem('landlordProfile') || '{}');

  const pUnits = Number(prevUnits) || 0;
  const cUnits = Number(currUnits) || 0;
  const rate = Number(unitRate) || 0;

  const consumedUnits = cUnits > pUnits ? cUnits - pUnits : 0;
  const lightBill = consumedUnits * rate;
  const rentVal = Number(amount) || 0;
  const grandTotal = rentVal + lightBill;

  const handleSubmit = (e) => {
    e.preventDefault();

    const dateObj = new Date(paymentDate);
    const formattedDate = dateObj.toLocaleDateString('en-GB');
    const derivedMonth = dateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const newReceipt = {
      id: Date.now().toString(),
      tenantId: tenant.id,
      tenantName: tenant.name,
      phone: tenant.phone,
      unit: tenant.unit,
      amount: rentVal,
      electricityAmount: lightBill,
      prevReading: pUnits,
      currReading: cUnits,
      consumedUnits: consumedUnits,
      totalAmount: grandTotal,
      paymentMode,
      month: derivedMonth,
      date: formattedDate,
    };

    const savedTenants = JSON.parse(localStorage.getItem('app_tenants') || '[]');
    const updatedTenants = savedTenants.map((t) => 
      String(t.id) === String(tenant.id) ? { ...t, lastElectricityReading: cUnits } : t
    );
    localStorage.setItem('app_tenants', JSON.stringify(updatedTenants));

    const savedReceipts = JSON.parse(localStorage.getItem('app_receipts') || '[]');
    localStorage.setItem('app_receipts', JSON.stringify([newReceipt, ...savedReceipts]));

    onPaymentSuccess(newReceipt);
    setGeneratedReceipt(newReceipt);
    setIsReceiptOpen(true);
  };

  const displayMonth = new Date(paymentDate).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white w-full max-w-md rounded-[28px] p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Record Rent Payment</h2>
              <p className="text-xs text-slate-400 font-semibold">{tenant.name} • {tenant.unit}</p>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-600 mb-1">Rent Amount (₹) *</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
              />
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Electricity Charges (Sub-meter)
                </span>
                <span className="text-[10px] text-slate-500 font-bold">
                  Units Consumed: <strong className="text-[#1e3a5f] font-black">{consumedUnits}</strong>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Previous Reading</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={prevUnits}
                    onChange={(e) => setPrevUnits(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Current Reading</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={currUnits}
                    onChange={(e) => setCurrUnits(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Rate / Unit (₹)</label>
                  <input
                    type="number"
                    value={unitRate}
                    onChange={(e) => setUnitRate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
                <span className="text-[11px] text-slate-500">
                  {consumedUnits > 0 ? `(${consumedUnits} units × ₹${rate})` : 'Electricity Total:'}
                </span>
                <span className="text-xs font-black text-amber-600">₹{lightBill}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Payment Date *</label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
                />
                <p className="text-[10px] text-[#1e3a5f] font-bold mt-1">For Month: {displayMonth}</p>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
                >
                  <option value="UPI">Google Pay / UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold">Total Received</span>
                <span className="text-xl font-black text-emerald-600">₹{grandTotal.toLocaleString()}</span>
              </div>
              <div className="text-right text-[11px] text-slate-500 font-medium">
                <p>Rent: ₹{rentVal}</p>
                <p className="text-amber-600 font-bold">Light: ₹{lightBill}</p>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
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
                Record & Generate Receipt
              </button>
            </div>
          </form>
        </div>
      </div>

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