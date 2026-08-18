import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit2, Trash2, Phone, DoorOpen, 
  PlusCircle, CheckCircle2 
} from 'lucide-react';
import RecordPaymentModal from '../components/RecordPaymentModal';

export default function TenantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tenant, setTenant] = useState(null);
  const [payments, setPayments] = useState([]);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  useEffect(() => {
    const savedTenants = JSON.parse(localStorage.getItem('app_tenants') || '[]');
    const currentTenant = savedTenants.find((t) => String(t.id) === String(id));
    
    if (currentTenant) {
      setTenant(currentTenant);
    }

    const savedReceipts = JSON.parse(localStorage.getItem('app_receipts') || '[]');
    const tenantPayments = savedReceipts.filter((r) => String(r.tenantId) === String(id));
    setPayments(tenantPayments);
  }, [id]);

  if (!tenant) {
    return (
      <div className="min-h-screen bg-[#f8faff] flex flex-col items-center justify-center p-4">
        <p className="text-sm font-bold text-slate-600 mb-3">भाडेकरू सापडला नाही!</p>
        <button
          onClick={() => navigate('/tenants')}
          className="px-4 py-2 bg-[#11294a] text-white text-xs font-bold rounded-xl"
        >
          Back to Tenants
        </button>
      </div>
    );
  }

  // हिशोब
  const monthlyRent = Number(tenant.rent) || 0;
  const securityDeposit = Number(tenant.deposit) || 0;
  const totalCollected = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const currentMonthPaid = tenant.status === 'Paid' ? monthlyRent : 0;
  const currentMonthRemaining = monthlyRent - currentMonthPaid;
  const currentMonthName = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // भाडेकरू काढणे (Vacate)
  const handleVacateTenant = () => {
    const confirmVacate = window.confirm(`तुम्हाला खात्री आहे का? ${tenant.name} ला खोलीतून Vacate करायचे आहे?`);
    if (!confirmVacate) return;

    // भाडेकरूंची यादी अपडेट करणे
    const savedTenants = JSON.parse(localStorage.getItem('app_tenants') || '[]');
    const updatedTenants = savedTenants.filter((t) => String(t.id) !== String(id));
    localStorage.setItem('app_tenants', JSON.stringify(updatedTenants));

    // प्रॉपर्टीचे स्टेटस पुन्हा Vacant करणे
    const savedProps = JSON.parse(localStorage.getItem('app_properties') || '[]');
    const updatedProps = savedProps.map((p) => {
      if (p.name === tenant.unit || p.id === tenant.propertyId) {
        return { ...p, status: 'Vacant', tenantName: null };
      }
      return p;
    });
    localStorage.setItem('app_properties', JSON.stringify(updatedProps));

    alert('भाडेकरू यशस्वीरीत्या Vacate झाला!');
    navigate('/tenants');
  };

  // भाडेकरू डिलीट करणे
  const handleDeleteTenant = () => {
    const confirmDelete = window.confirm('सावधान! हा भाडेकरू आणि त्याचा सर्व डेटा कायमचा डिलीट होईल.');
    if (!confirmDelete) return;

    const savedTenants = JSON.parse(localStorage.getItem('app_tenants') || '[]');
    const updatedTenants = savedTenants.filter((t) => String(t.id) !== String(id));
    localStorage.setItem('app_tenants', JSON.stringify(updatedTenants));

    navigate('/tenants');
  };

  const handlePaymentSuccess = (receipt) => {
    setPayments((prev) => [receipt, ...prev]);
    setTenant((prev) => ({ ...prev, status: 'Paid' }));

    const savedTenants = JSON.parse(localStorage.getItem('app_tenants') || '[]');
    const updatedTenants = savedTenants.map((t) => (String(t.id) === String(id) ? { ...t, status: 'Paid' } : t));
    localStorage.setItem('app_tenants', JSON.stringify(updatedTenants));
  };

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-800 font-sans pb-24">
      {/* Top Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-1 hover:bg-slate-100 rounded-full transition"
          >
            <ArrowLeft className="w-6 h-6 text-[#11294a]" />
          </button>
          <h1 className="text-xl font-bold text-[#11294a]">Tenant Profile</h1>
        </div>

        <div className="flex items-center gap-3 text-slate-600">
          <button 
            onClick={() => alert('Edit Tenant लवकरच उपलब्ध होईल!')}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition"
          >
            <Edit2 className="w-5 h-5 text-slate-700" />
          </button>
          <button 
            onClick={handleDeleteTenant}
            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        
        {/* Main Tenant Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full bg-[#0a1e3b] text-white flex items-center justify-center font-bold text-xl uppercase shadow-inner">
                {tenant.name ? tenant.name.substring(0, 2) : 'TN'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">{tenant.name}</h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{tenant.phone || 'No Phone'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold border border-slate-200 uppercase tracking-wide">
              {tenant.unit} • ROOM
            </span>

            <span className="px-3 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-black tracking-wider uppercase">
              ACTIVE
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium pt-1">
            Tenant since: {tenant.startDate || '19 Aug 2026'}
          </p>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleVacateTenant}
              className="w-full py-3 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99]"
            >
              <DoorOpen className="w-5 h-5 stroke-[2.2]" />
              <span>Vacate Tenant</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Security Deposit */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs text-slate-500 font-semibold">Security Deposit</p>
            <p className="text-xl font-black text-slate-900">₹{securityDeposit}</p>
          </div>

          {/* Monthly Rent */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs text-slate-500 font-semibold">Monthly Rent</p>
            <p className="text-xl font-black text-slate-900">₹{monthlyRent}</p>
          </div>

          {/* Total Collected */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs text-slate-500 font-semibold">Total Collected</p>
            <p className="text-xl font-black text-emerald-600">₹{totalCollected}</p>
          </div>

          {/* Current Month Status */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs text-slate-500 font-semibold">Current Month</p>
            <div className="pt-0.5">
              {tenant.status === 'Paid' ? (
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-black rounded-md uppercase border border-emerald-200">
                  PAID
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-rose-50 text-rose-600 text-[11px] font-black rounded-md uppercase border border-rose-200">
                  DUE
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Current Month Receipt & Add Payment */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{currentMonthName} Receipt</h3>
              <p className="text-xs font-semibold text-emerald-600 mt-1">Paid: ₹{currentMonthPaid}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-700">Total Due: ₹{monthlyRent}</p>
              <p className="text-xs font-semibold text-rose-500 mt-1">Rem: ₹{currentMonthRemaining}</p>
            </div>
          </div>

          <button
            onClick={() => setIsPayModalOpen(true)}
            className="w-full py-3 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99]"
          >
            <PlusCircle className="w-5 h-5 stroke-[2.2]" />
            <span>Add Payment</span>
          </button>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Payment History</h3>

          {payments.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-6 font-medium">
              No payments recorded yet.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {payments.map((p, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{p.month || 'Rent Payment'}</p>
                    <p className="text-slate-400 text-[11px]">{p.date || 'Recent'}</p>
                  </div>
                  <span className="font-black text-emerald-600 text-sm">+₹{p.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Add Payment Modal */}
      <RecordPaymentModal
        isOpen={isPayModalOpen}
        tenant={tenant}
        onClose={() => setIsPayModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}