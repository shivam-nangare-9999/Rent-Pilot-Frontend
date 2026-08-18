import React, { useState } from 'react';
import { Receipt, Download, Share2, Printer, CheckCircle, Search, X, Building2 } from 'lucide-react';

const initialReceipts = [
  {
    id: 'REC-2026-001',
    tenantName: 'Rahul Patil',
    phone: '9876543210',
    property: 'Flat 101 (1BHK), Sai Residency',
    month: 'August 2026',
    amount: 12000,
    paymentDate: '2026-08-05',
    paymentMode: 'UPI (GPay)',
    landlordName: 'Shiva Landlord',
    status: 'Paid',
  },
  {
    id: 'REC-2026-002',
    tenantName: 'Kiran Kirana',
    phone: '9988776655',
    property: 'Shop No. 4, Market Yard',
    month: 'August 2026',
    amount: 25000,
    paymentDate: '2026-08-02',
    paymentMode: 'Bank Transfer (IMPS)',
    landlordName: 'Shiva Landlord',
    status: 'Paid',
  },
  {
    id: 'REC-2026-003',
    tenantName: 'Amit Sharma',
    phone: '9822114477',
    property: 'PG Room A-1, Hinjewadi',
    month: 'July 2026',
    amount: 8000,
    paymentDate: '2026-07-04',
    paymentMode: 'Cash',
    landlordName: 'Shiva Landlord',
    status: 'Paid',
  },
];

export default function Receipts() {
  const [receipts, setReceipts] = useState(initialReceipts);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReceipts = receipts.filter((r) =>
    r.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = (receipt) => {
    const text = `*RENT RECEIPT - ${receipt.id}*\n\n` +
      `Tenant: ${receipt.tenantName}\n` +
      `Property: ${receipt.property}\n` +
      `Month: ${receipt.month}\n` +
      `Amount Paid: ₹${receipt.amount.toLocaleString()}\n` +
      `Payment Date: ${receipt.paymentDate}\n` +
      `Payment Mode: ${receipt.paymentMode}\n` +
      `Status: ✅ PAID\n\n` +
      `Thank you for the payment!\n- ${receipt.landlordName}`;

    window.open(`https://wa.me/91${receipt.phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Rent Receipts ({receipts.length})</h1>
          <p className="text-xs sm:text-sm text-slate-500">भाड्याच्या पावत्या तयार करा, डाऊनलोड करा आणि शेअर करा</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="पावती क्रमांक, भाडेकरू किंवा फ्लॅट सर्च करा..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-indigo-500 shadow-sm"
        />
      </div>

      {/* Receipts Table / List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Receipt No</th>
                <th className="px-5 py-3.5">Tenant & Unit</th>
                <th className="px-5 py-3.5">Rent Month</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Date & Mode</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReceipts.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-4 font-mono font-semibold text-indigo-600 text-xs">
                    {rec.id}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-800">{rec.tenantName}</p>
                    <p className="text-xs text-slate-400">{rec.property}</p>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-700">
                    {rec.month}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-emerald-600">₹{rec.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <p className="text-slate-700">{rec.paymentDate}</p>
                    <p className="text-slate-400">{rec.paymentMode}</p>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedReceipt(rec)}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleWhatsAppShare(rec)}
                        className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition"
                        title="Share on WhatsApp"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            
            {/* Modal Actions */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Rent Receipt</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / PDF
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Card Body */}
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 bg-white space-y-4" id="printable-area">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">RENT RECEIPT</h2>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">Receipt No: {selectedReceipt.id}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5" /> PAID
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                <div>
                  <p className="text-slate-400 font-medium">Tenant Name:</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{selectedReceipt.tenantName}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">For Rent Month:</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{selectedReceipt.month}</p>
                </div>
              </div>

              <div className="text-xs">
                <p className="text-slate-400 font-medium">Rented Property:</p>
                <p className="font-semibold text-slate-700 mt-0.5">{selectedReceipt.property}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center my-3">
                <div>
                  <p className="text-xs text-slate-400">Total Amount Received</p>
                  <p className="text-xs text-slate-500 mt-0.5">Paid via {selectedReceipt.paymentMode}</p>
                </div>
                <p className="text-2xl font-black text-emerald-600">₹{selectedReceipt.amount.toLocaleString()}</p>
              </div>

              <div className="flex justify-between items-end pt-4 border-t border-slate-100 text-xs">
                <div>
                  <p className="text-slate-400">Date of Payment:</p>
                  <p className="font-medium text-slate-700">{selectedReceipt.paymentDate}</p>
                </div>
                <div className="text-right">
                  <p className="border-b border-slate-400 pb-1 text-slate-800 font-semibold">{selectedReceipt.landlordName}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Landlord Signature</p>
                </div>
              </div>
            </div>

            {/* Bottom Modal Share on WhatsApp */}
            <div className="mt-4 pt-2">
              <button
                onClick={() => handleWhatsAppShare(selectedReceipt)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Share2 className="w-4 h-4" />
                <span>Send Receipt on WhatsApp</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}