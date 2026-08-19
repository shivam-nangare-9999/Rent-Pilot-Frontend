import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Phone, 
  DoorOpen, 
  Plus, 
  Receipt, 
  ChevronRight, 
  Edit3, 
  MessageCircle, 
  ShieldCheck, 
  Calendar,
  MapPin,
  X,
  Save
} from 'lucide-react';
import RecordPaymentModal from '../components/RecordPaymentModal';
import ReceiptModal from '../components/ReceiptModal';

export default function TenantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tenant, setTenant] = useState(null);
  const [payments, setPayments] = useState([]);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: '',
    rent: '',
    deposit: '',
    idProof: '',
    agreementExpiry: ''
  });

  const landlordProfile = JSON.parse(localStorage.getItem('landlordProfile') || '{}');

  useEffect(() => {
    const savedTenants = JSON.parse(localStorage.getItem('app_tenants') || '[]');
    const current = savedTenants.find((t) => String(t.id) === String(id));
    if (current) {
      setTenant(current);
      setEditForm({
        name: current.name || '',
        phone: current.phone || '',
        address: current.address || '',
        rent: current.rent || '',
        deposit: current.deposit || '',
        idProof: current.idProof || '',
        agreementExpiry: current.agreementExpiry || ''
      });
    }

    const savedReceipts = JSON.parse(localStorage.getItem('app_receipts') || '[]');
    setPayments(savedReceipts.filter((r) => String(r.tenantId) === String(id)));
  }, [id]);

  if (!tenant) return null;

  const monthlyRent = Number(tenant.rent) || 0;
  const securityDeposit = Number(tenant.deposit) || 0;
  const totalCollected = payments.reduce((sum, p) => sum + (Number(p.amount) || 0) + (Number(p.electricityAmount) || 0), 0);

  const handleVacateTenant = () => {
    if (!window.confirm(`Are you sure you want to vacate ${tenant.name}?`)) return;
    
    const savedTenants = JSON.parse(localStorage.getItem('app_tenants') || '[]');
    localStorage.setItem('app_tenants', JSON.stringify(savedTenants.filter((t) => String(t.id) !== String(id))));

    const savedProps = JSON.parse(localStorage.getItem('app_properties') || '[]');
    localStorage.setItem(
      'app_properties',
      JSON.stringify(savedProps.map((p) => (p.name === tenant.propertyName || p.name === tenant.unit ? { ...p, status: 'Vacant', tenantName: null } : p)))
    );

    navigate('/tenants');
  };

  const handlePaymentSuccess = (receipt) => {
    setPayments((prev) => [receipt, ...prev]);
    setTenant((prev) => ({ ...prev, status: 'Paid' }));
    const savedTenants = JSON.parse(localStorage.getItem('app_tenants') || '[]');
    localStorage.setItem(
      'app_tenants',
      JSON.stringify(savedTenants.map((t) => (String(t.id) === String(id) ? { ...t, status: 'Paid' } : t)))
    );
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...tenant,
      name: editForm.name,
      phone: editForm.phone,
      address: editForm.address,
      rent: Number(editForm.rent),
      deposit: Number(editForm.deposit),
      idProof: editForm.idProof,
      agreementExpiry: editForm.agreementExpiry
    };

    setTenant(updated);
    const savedTenants = JSON.parse(localStorage.getItem('app_tenants') || '[]');
    localStorage.setItem(
      'app_tenants',
      JSON.stringify(savedTenants.map((t) => (String(t.id) === String(id) ? updated : t)))
    );
    setIsEditModalOpen(false);
  };

  const startWhatsApp = () => {
    const cleanPhone = tenant.phone ? tenant.phone.replace(/[^0-9]/g, '') : '';
    const phoneWithCode = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${phoneWithCode}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-24">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3.5 sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-slate-100 rounded-xl transition">
            <ArrowLeft className="w-5 h-5 text-slate-900" />
          </button>
          <h1 className="text-base font-bold text-slate-900">Tenant Details</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-[#1e3a5f] bg-[#1e3a5f]/10 hover:bg-[#1e3a5f]/20 p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleVacateTenant}
            className="text-rose-600 bg-rose-50 hover:bg-rose-100 p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition"
          >
            <DoorOpen className="w-4 h-4" />
            <span>Vacate</span>
          </button>
        </div>
      </header>

      <main className="p-4 space-y-4 max-w-md mx-auto">
        <div className="bg-white rounded-[32px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1e3a5f]/10 border border-[#1e3a5f]/20 text-[#1e3a5f] flex items-center justify-center font-black text-xl shadow-xs">
              {tenant.name ? tenant.name.substring(0, 2).toUpperCase() : 'TN'}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">{tenant.name}</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{tenant.unit}</p>
            </div>
          </div>

          <div className="mt-3.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-start gap-2 text-xs">
            <MapPin className="w-4 h-4 text-[#1e3a5f] shrink-0 mt-0.5" />
            <p className="text-slate-600 font-medium leading-relaxed">{tenant.address || 'No address provided'}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
            <a
              href={`tel:${tenant.phone}`}
              className="py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/70 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5 text-[#1e3a5f]" />
              <span>Call ({tenant.phone})</span>
            </a>
            <button
              onClick={startWhatsApp}
              className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 rounded-xl text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5 transition"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">
              Join Date: <strong>{tenant.startDate || 'N/A'}</strong>
            </span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${tenant.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
              {tenant.status === 'Paid' ? 'PAID' : 'DUE'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Rent</p>
            <p className="text-sm font-black text-slate-900 mt-0.5">₹{monthlyRent}</p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Deposit</p>
            <p className="text-sm font-black text-slate-900 mt-0.5">₹{securityDeposit}</p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Total Paid</p>
            <p className="text-sm font-black text-emerald-600 mt-0.5">₹{totalCollected}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-2.5 text-xs">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">KYC & Document Records</h3>
          
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#1e3a5f]" />
              Aadhaar / ID Proof
            </span>
            <span className="font-bold text-slate-900">{tenant.idProof || 'Not Provided'}</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Calendar className="w-4 h-4 text-[#1e3a5f]" />
              Agreement Validity
            </span>
            <span className="font-bold text-slate-900">{tenant.agreementExpiry || 'Not Specified'}</span>
          </div>
        </div>

        <button
          onClick={() => setIsPayModalOpen(true)}
          className="w-full py-3.5 bg-[#1e3a5f] hover:bg-[#162b47] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-[#1e3a5f]/20 active:scale-95 transition text-xs"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Record New Payment</span>
        </button>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Payment History</h3>
            <span className="text-[10px] font-bold text-slate-400">Tap to view receipt</span>
          </div>

          {payments.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-6">No payment records available.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {payments.map((p, idx) => {
                const totalPaid = Number(p.amount) + Number(p.electricityAmount || 0);
                return (
                  <div 
                    key={p.id || idx} 
                    onClick={() => setSelectedReceipt(p)}
                    className="py-3 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 px-2 rounded-xl transition active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center font-bold">
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{p.month || 'Rent Payment'}</p>
                        <p className="text-slate-400 text-[11px]">
                          {p.date} • <span className="text-[#1e3a5f] font-semibold">{p.paymentMode || 'UPI'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-right">
                      <div>
                        <span className="font-black text-emerald-600 text-sm block">₹{totalPaid}</span>
                        {p.electricityAmount > 0 && (
                          <span className="text-[10px] text-slate-400 block font-medium">Electricity: ₹{p.electricityAmount}</span>
                        )}
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

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[28px] p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#1e3a5f]" />
                <h2 className="text-base font-black text-slate-900">Edit Tenant Details</h2>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-3.5 text-xs font-semibold">
              <div>
                <label className="block text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Permanent Address</label>
                <textarea
                  rows={2}
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Rent Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={editForm.rent}
                    onChange={(e) => setEditForm({ ...editForm, rent: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={editForm.deposit}
                    onChange={(e) => setEditForm({ ...editForm, deposit: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Aadhaar / ID Card No.</label>
                <input
                  type="text"
                  placeholder="xxxx xxxx xxxx"
                  value={editForm.idProof}
                  onChange={(e) => setEditForm({ ...editForm, idProof: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Agreement Expiry Date</label>
                <input
                  type="date"
                  value={editForm.agreementExpiry}
                  onChange={(e) => setEditForm({ ...editForm, agreementExpiry: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-[#1e3a5f] hover:bg-[#162b47] text-white rounded-xl font-bold transition shadow-md shadow-[#1e3a5f]/20 active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <RecordPaymentModal
        isOpen={isPayModalOpen}
        tenant={tenant}
        onClose={() => setIsPayModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <ReceiptModal
        isOpen={!!selectedReceipt}
        receipt={selectedReceipt}
        landlordProfile={landlordProfile}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}