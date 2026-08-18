import React, { useRef } from 'react';
import { X, Share2, Printer, CheckCircle, Building, User, Phone, Calendar } from 'lucide-react';

export default function ReceiptModal({ isOpen, receipt, landlordProfile, onClose }) {
  const receiptRef = useRef();

  if (!isOpen || !receipt) return null;

  // WhatsApp वर थेट पावतीचा मेसेज शेअर करणे
  const handleWhatsAppShare = () => {
    const message = 
`🧾 *भाडे पावती (RENT RECEIPT)*
--------------------------------
*पावती क्र:* #${receipt.id.slice(-6)}
*तारीख:* ${receipt.date}
*महिना:* ${receipt.month}

*घरमालक / फर्म:* ${landlordProfile?.businessName || landlordProfile?.name || 'Landlord'}
*भाडेकरू:* ${receipt.tenantName}
*खोली / युनिट:* ${receipt.unit}

💵 *जमा भाडे रक्कम:* ₹${receipt.amount}
${receipt.electricityAmount ? `⚡ *लाईट बिल:* ₹${receipt.electricityAmount}\n` : ''}
*एकूण जमा रक्कम:* ₹${Number(receipt.amount) + (Number(receipt.electricityAmount) || 0)}
*पेमेंट पद्धत:* ${receipt.paymentMode || 'Cash / UPI'}
*स्थिती:* Paid (यशस्वी)

_धन्यवाद!_`;

    const cleanPhone = receipt.phone ? receipt.phone.replace(/[^0-9]/g, '') : '';
    const phoneWithCode = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    
    if (phoneWithCode) {
      window.open(`https://wa.me/${phoneWithCode}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  // प्रिंट / PDF डाऊनलोड करणे
  const handlePrint = () => {
    window.print();
  };

  const totalPaid = Number(receipt.amount) + (Number(receipt.electricityAmount) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Receipt</span>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Card */}
        <div ref={receiptRef} className="bg-[#fcfdfd] border-2 border-dashed border-slate-200 rounded-2xl p-5 space-y-4">
          
          {/* Header */}
          <div className="text-center pb-3 border-b border-slate-100">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-1.5">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-black text-slate-900 leading-tight">
              {landlordProfile?.businessName || 'RENT RECEIPT'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">{landlordProfile?.name} • {landlordProfile?.phone}</p>
          </div>

          {/* Receipt Info */}
          <div className="grid grid-cols-2 text-[11px] font-semibold text-slate-500 gap-1 pb-2 border-b border-slate-100">
            <div>
              <p>Receipt No: <strong className="text-slate-800">#{receipt.id.slice(-6)}</strong></p>
              <p>Month: <strong className="text-slate-800">{receipt.month}</strong></p>
            </div>
            <div className="text-right">
              <p>Date: <strong className="text-slate-800">{receipt.date}</strong></p>
              <p>Mode: <strong className="text-slate-800 uppercase">{receipt.paymentMode || 'CASH'}</strong></p>
            </div>
          </div>

          {/* Tenant Details */}
          <div className="bg-slate-50 p-3 rounded-xl space-y-1 text-xs">
            <p className="text-slate-500 text-[11px] font-semibold">Tenant Name & Unit:</p>
            <p className="font-bold text-slate-900 text-sm">{receipt.tenantName}</p>
            <p className="text-slate-600 font-medium">{receipt.unit} {receipt.phone ? `• ${receipt.phone}` : ''}</p>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-1.5 text-xs font-semibold">
            <div className="flex justify-between text-slate-600">
              <span>Rent Amount (मासिक भाडे)</span>
              <span className="font-bold text-slate-900">₹{receipt.amount}</span>
            </div>

            {receipt.electricityAmount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Electricity Bill (लाईट बिल)</span>
                <span className="font-bold text-slate-900">₹{receipt.electricityAmount}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
              <span className="font-black text-slate-900">Total Paid (एकूण जमा)</span>
              <span className="font-black text-emerald-600 text-base">₹{totalPaid}</span>
            </div>
          </div>

          {/* Landlord Terms */}
          {landlordProfile?.receiptTerms && (
            <p className="text-[10px] text-slate-400 text-center italic pt-1">
              "{landlordProfile.receiptTerms}"
            </p>
          )}
        </div>

        {/* Share & Print Buttons */}
        <div className="pt-4 grid grid-cols-2 gap-2.5">
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp Share</span>
          </button>

          <button
            onClick={handlePrint}
            className="w-full py-2.5 bg-[#0a1e3b] hover:bg-[#11294a] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
}