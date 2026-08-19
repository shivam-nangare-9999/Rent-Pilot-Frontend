import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Plus, 
  ArrowUpRight, 
  CheckCircle2, 
  MessageCircle, 
  TrendingUp, 
  Bell, 
  ArrowDownLeft, 
  Search, 
  Receipt, 
  UserPlus, 
  Home 
} from 'lucide-react';
import Logo from '../components/Logo';
import RecordPaymentModal from '../components/RecordPaymentModal';
import AddTenantModal from '../components/AddTenantModal';
import AddPropertyModal from '../components/AddPropertyModal';

export default function Dashboard({ profile }) {
  const navigate = useNavigate();
  const tenantListRef = useRef(null);

  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [selectedTenantForPay, setSelectedTenantForPay] = useState(null);
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);
  const [isAddPropOpen, setIsAddPropOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('DUE'); // 'DUE' | 'DUE_TODAY' | 'PAID' | 'ALL'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedProps = JSON.parse(localStorage.getItem('app_properties') || '[]');
    const savedTenants = JSON.parse(localStorage.getItem('app_tenants') || '[]');
    setProperties(savedProps);
    setTenants(savedTenants);
  }, []);

  const totalExpectedRent = tenants.reduce((acc, t) => acc + (Number(t.rent) || 0), 0);
  const collectedRent = tenants
    .filter((t) => t.status === 'Paid')
    .reduce((acc, t) => acc + (Number(t.rent) || 0), 0);
  const pendingRent = totalExpectedRent - collectedRent;
  const occupiedUnits = properties.filter((p) => p.status?.toLowerCase() === 'occupied').length;
  const pendingTenants = tenants.filter((t) => t.status !== 'Paid');
  const paidTenants = tenants.filter((t) => t.status === 'Paid');
  const collectionPercent = totalExpectedRent > 0 ? Math.round((collectedRent / totalExpectedRent) * 100) : 0;

  const currentMonthName = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const todayDay = new Date().getDate();

  const dueRentTenants = tenants.filter((tenant) => {
    if (!tenant.startDate || tenant.status === 'Paid') return false;
    const startDay = new Date(tenant.startDate).getDate() || 1;
    return todayDay >= startDay;
  });

  const handlePaymentSuccess = (receipt) => {
    const updated = tenants.map((t) => (t.id === receipt.tenantId ? { ...t, status: 'Paid' } : t));
    setTenants(updated);
    localStorage.setItem('app_tenants', JSON.stringify(updated));
  };

  const handleTenantAdded = (newTenant) => {
    const updated = [newTenant, ...tenants];
    setTenants(updated);
    localStorage.setItem('app_tenants', JSON.stringify(updated));
  };

  const handlePropertyAdded = (newProp) => {
    const updated = [newProp, ...properties];
    setProperties(updated);
    localStorage.setItem('app_properties', JSON.stringify(updated));
  };

  const handleViewDueAlertList = () => {
    setActiveTab('DUE_TODAY');
    if (tenantListRef.current) {
      tenantListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sendWhatsAppReminder = (tenant) => {
    const business = profile?.businessName || 'RentPilot';
    const message = 
      `*RENT PAYMENT REMINDER*\n\n` +
      `Hello *${tenant.name}*,\n` +
      `This is a friendly reminder that your rent for *${tenant.unit}* for ${currentMonthName} is currently due.\n\n` +
      `💵 *Amount Due:* ₹${tenant.rent}\n` +
      (profile?.upiId ? `📲 *UPI ID:* ${profile.upiId}\n\n` : `\n`) +
      `Please complete the payment at your earliest convenience to receive the official receipt.\n` +
      `— *${business}*`;

    const cleanPhone = tenant.phone ? tenant.phone.replace(/[^0-9]/g, '') : '';
    const phoneWithCode = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${phoneWithCode}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const displayedTenants = tenants.filter((t) => {
    const matchesSearch = 
      t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.unit?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.phone?.includes(searchQuery);

    if (!matchesSearch) return false;

    if (activeTab === 'DUE_TODAY') {
      if (!t.startDate || t.status === 'Paid') return false;
      const startDay = new Date(t.startDate).getDate() || 1;
      return todayDay >= startDay;
    }
    if (activeTab === 'DUE') return t.status !== 'Paid';
    if (activeTab === 'PAID') return t.status === 'Paid';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-28">
      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-5 py-3.5 sticky top-0 z-20 flex items-center justify-between">
        <div>
          <div className="md:hidden">
            <Logo size="sm" showText={true} />
          </div>

          <div className="hidden md:block">
            <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">
              Dashboard Overview
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              Welcome back, <span className="text-slate-700 font-bold">{profile?.name || 'Owner'}</span> • {currentMonthName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddTenantOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Tenant</span>
          </button>
          
          <button
            onClick={() => setIsAddPropOpen(true)}
            className="bg-[#1e3a5f] hover:bg-[#162b47] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#1e3a5f]/20 active:scale-95 transition"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Property</span>
          </button>
        </div>
      </header>

      <main className="p-4 sm:p-6 space-y-5 max-w-md md:max-w-4xl mx-auto">
        
        {/* Due Date Alert Banner */}
        {dueRentTenants.length > 0 && (
          <div className="bg-amber-50/90 border border-amber-200/80 text-amber-900 p-4 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Rent Due Alert</h4>
                <p className="text-xs font-bold mt-0.5">
                  <span className="font-extrabold text-amber-950">{dueRentTenants.length} tenants</span> have rent due today.
                </p>
              </div>
            </div>
            <button
              onClick={handleViewDueAlertList}
              className="text-xs font-bold text-amber-800 bg-amber-100/80 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition cursor-pointer active:scale-95 shadow-2xs"
            >
              View List
            </button>
          </div>
        )}

        {/* Financial Hero Card */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] relative overflow-hidden">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[11px]">
                {currentMonthName} Collection
              </span>
            </div>
            <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full text-xs">
              <TrendingUp className="w-3.5 h-3.5" />
              {collectionPercent}% Collected
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              ₹{collectedRent.toLocaleString()}
            </h2>
            <span className="text-xs font-semibold text-slate-400">
              / ₹{totalExpectedRent.toLocaleString()} Expected
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden p-0.5 border border-slate-200/40">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(collectionPercent, 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-100">
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-slate-500 font-bold">Total Expected</p>
                <div className="w-6 h-6 rounded-lg bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center font-bold">
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-lg font-black text-slate-900 mt-2">₹{totalExpectedRent.toLocaleString()}</p>
            </div>

            <div className="bg-rose-50/50 p-3.5 rounded-2xl border border-rose-100 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-rose-600 font-bold">Pending Dues</p>
                <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-lg font-black text-rose-600 mt-2">₹{pendingRent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Quick Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div 
            onClick={() => navigate('/properties')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#1e3a5f]/30 cursor-pointer active:scale-98 transition text-center sm:text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center mx-auto sm:mx-0 mb-2">
              <Building2 className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Properties</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">{properties.length}</p>
          </div>

          <div 
            onClick={() => navigate('/tenants')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#1e3a5f]/30 cursor-pointer active:scale-98 transition text-center sm:text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto sm:mx-0 mb-2">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tenants</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">{tenants.length}</p>
          </div>

          <div 
            onClick={() => navigate('/receipts')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#1e3a5f]/30 cursor-pointer active:scale-98 transition text-center sm:text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto sm:mx-0 mb-2">
              <Receipt className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Paid / Clear</p>
            <p className="text-lg font-black text-emerald-600 mt-0.5">{paidTenants.length}</p>
          </div>
        </div>

        {/* Tenant Rent Status Section (With Ref for Auto-Scroll) */}
        <div ref={tenantListRef} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Tenant Rent Status
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">Monthly collection and tenant dues tracking</p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 bg-slate-100/80 p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('DUE_TODAY')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'DUE_TODAY' 
                    ? 'bg-amber-500 text-white shadow-xs' 
                    : 'text-amber-800 hover:text-amber-950'
                }`}
              >
                Due Today ({dueRentTenants.length})
              </button>
              <button
                onClick={() => setActiveTab('DUE')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'DUE' 
                    ? 'bg-white text-rose-600 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending ({pendingTenants.length})
              </button>
              <button
                onClick={() => setActiveTab('PAID')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'PAID' 
                    ? 'bg-white text-emerald-700 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Paid ({paidTenants.length})
              </button>
              <button
                onClick={() => setActiveTab('ALL')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'ALL' 
                    ? 'bg-white text-[#1e3a5f] shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({tenants.length})
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tenant by name, room or phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1e3a5f]"
            />
          </div>

          {/* List Content */}
          {displayedTenants.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">
                {activeTab === 'DUE_TODAY' ? 'No tenants have rent due today.' : activeTab === 'DUE' ? 'All Clear! No pending rent.' : 'No tenants found.'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">All records are up to date.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {displayedTenants.map((tenant) => {
                const isPaid = tenant.status === 'Paid';
                const dueDay = tenant.startDate ? new Date(tenant.startDate).getDate() : '1';

                return (
                  <div
                    key={tenant.id}
                    className="bg-slate-50/90 hover:bg-slate-100/90 p-3.5 rounded-2xl border border-slate-200/70 flex items-center justify-between transition group"
                  >
                    <div 
                      onClick={() => navigate(`/tenants/${tenant.id}`)}
                      className="cursor-pointer space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1e3a5f] transition">
                          {tenant.name}
                        </h4>
                        <span className="text-[11px] font-extrabold text-[#1e3a5f] bg-[#1e3a5f]/10 border border-[#1e3a5f]/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Home className="w-3 h-3 text-[#1e3a5f]" />
                          {tenant.unit}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-medium">
                        Rent: <strong className="text-slate-900 font-black">₹{tenant.rent}</strong>
                        <span className="mx-1.5">•</span>
                        <span className="text-[11px] text-slate-400">Due Date: Day {dueDay}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isPaid && (
                        <button
                          onClick={() => sendWhatsAppReminder(tenant)}
                          className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition border border-emerald-200/60 shadow-2xs cursor-pointer"
                          title="Send WhatsApp Reminder"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      )}

                      {isPaid ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>PAID</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedTenantForPay(tenant)}
                          className="px-3.5 py-1.5 bg-[#1e3a5f] hover:bg-[#162b47] text-white text-xs font-bold rounded-xl transition shadow-xs active:scale-95 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Collect</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <RecordPaymentModal
        isOpen={!!selectedTenantForPay}
        tenant={selectedTenantForPay}
        onClose={() => setSelectedTenantForPay(null)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <AddTenantModal
        isOpen={isAddTenantOpen}
        onClose={() => setIsAddTenantOpen(false)}
        onTenantAdded={handleTenantAdded}
      />

      <AddPropertyModal
        isOpen={isAddPropOpen}
        onClose={() => setIsAddPropOpen(false)}
        onPropertyAdded={handlePropertyAdded}
      />
    </div>
  );
}