import React, { useRef } from 'react';
import { X, Download, Share2, CheckCircle2 } from 'lucide-react';

export default function ReceiptModal({ isOpen, receipt, landlordProfile, onClose }) {
  const receiptRef = useRef(null);

  if (!isOpen || !receipt) return null;

  const rentAmount = Number(receipt.amount) || 0;
  const electricityAmount = Number(receipt.electricityAmount) || 0;
  const grandTotal = rentAmount + electricityAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = `*RENT RECEIPT - ${receipt.month}*\n` +
      `Property: ${landlordProfile?.businessName || 'RentPilot'}\n` +
      `Owner: ${landlordProfile?.name || 'Owner'} (${landlordProfile?.phone || ''})\n\n` +
      `Tenant: ${receipt.tenantName} (${receipt.unit})\n` +
      `Rent Amount: ₹${rentAmount}\n` +
      (electricityAmount > 0 ? `Electricity Bill: ₹${electricityAmount}\n` : '') +
      `*Total Paid: ₹${grandTotal}*\n` +
      `Payment Mode: ${receipt.paymentMode || 'UPI'}\n` +
      `Date: ${receipt.date}\n\n` +
      `Status: PAID ✅\n` +
      `— Generated via RentPilot`;

    const cleanPhone = receipt.phone ? receipt.phone.replace(/[^0-9]/g, '') : '';
    const phoneWithCode = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${phoneWithCode}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-[28px] p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 leading-none">Payment Receipt</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Rent <span className="text-[#1e3a5f]">Pilot</span> Verified
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div ref={receiptRef} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-slate-900 space-y-4">
          <div className="text-center pb-3 border-b border-slate-200">
            <h3 className="text-base font-black text-slate-900">{landlordProfile?.businessName || 'RentPilot Properties'}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Landlord: {landlordProfile?.name || 'Owner'} • {landlordProfile?.phone || ''}
            </p>
          </div>

          <div className="flex justify-between text-xs font-semibold">
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold">Tenant Details</p>
              <p className="text-slate-900 font-bold mt-0.5">{receipt.tenantName}</p>
              <p className="text-[#1e3a5f] text-[11px] font-bold mt-0.5">{receipt.unit}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-[10px] uppercase font-bold">Invoice Date</p>
              <p className="text-slate-900 font-bold mt-0.5">{receipt.date}</p>
              <p className="text-[#1e3a5f] text-[11px] font-bold mt-0.5">{receipt.month}</p>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs">
            <div className="flex justify-between font-medium text-slate-600">
              <span>Monthly Room Rent</span>
              <span className="font-bold text-slate-800">₹{rentAmount}</span>
            </div>
            {electricityAmount > 0 && (
              <div className="flex justify-between font-medium text-slate-600">
                <span>Electricity Charges ({receipt.consumedUnits ? `${receipt.consumedUnits} units` : 'Sub-meter'})</span>
                <span className="font-bold text-slate-800">₹{electricityAmount}</span>
              </div>
            )}
            <div className="flex justify-between font-medium text-slate-600">
              <span>Payment Mode</span>
              <span className="font-bold text-[#1e3a5f]">{receipt.paymentMode || 'UPI'}</span>
            </div>
            <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Paid</span>
              <span className="text-emerald-600 font-black">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-2">
          <button
            onClick={handlePrint}
            className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
          <button
            onClick={handleWhatsAppShare}
            className="w-1/2 py-3 bg-[#1e3a5f] hover:bg-[#162b47] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-[#1e3a5f]/20 active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}