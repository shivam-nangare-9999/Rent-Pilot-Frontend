import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Users, TrendingUp, CheckCircle2, 
  Zap, Receipt, MessageCircle, ChevronRight, Sparkles, Bell
} from 'lucide-react';
import RecordPaymentModal from '../components/RecordPaymentModal';
import { useTranslation } from '../context/LanguageContext';
import { requestNotificationPermission, checkAndTriggerRentNotifications } from '../utils/notifications';

export default function Dashboard({ profile }) {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();

  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [selectedTenantForPay, setSelectedTenantForPay] = useState(null);

  useEffect(() => {
    const savedProps = localStorage.getItem('app_properties');
    const savedTenants = localStorage.getItem('app_tenants');
    
    const parsedProps = savedProps ? JSON.parse(savedProps) : [];
    const parsedTenants = savedTenants ? JSON.parse(savedTenants) : [];

    setProperties(parsedProps);
    setTenants(parsedTenants);

    requestNotificationPermission().then((granted) => {
      if (granted && parsedTenants.length > 0) {
        checkAndTriggerRentNotifications(parsedTenants, lang);
      }
    });
  }, [lang]);

  const totalExpectedRent = tenants.reduce((acc, tenant) => acc + (Number(tenant.rent) || 0), 0);
  const collectedRent = tenants
    .filter((tenant) => tenant.status === 'Paid')
    .reduce((acc, tenant) => acc + (Number(tenant.rent) || 0), 0);
  const pendingRent = totalExpectedRent - collectedRent;

  const occupiedUnits = properties.filter((prop) => prop.status?.toLowerCase() === 'occupied').length;
  const occupancyPercentage = properties.length > 0 ? Math.round((occupiedUnits / properties.length) * 100) : 0;
  
  const pendingTenants = tenants.filter((tenant) => tenant.status !== 'Paid');

  const todayDay = new Date().getDate();
  const dueRentTenants = tenants.filter((tenant) => {
    if (!tenant.startDate || tenant.status === 'Paid') return false;
    const startDay = new Date(tenant.startDate).getDate();
    return todayDay >= startDay;
  });

  const handlePaymentSuccess = (receipt) => {
    const updated = tenants.map((tenant) => (tenant.id === receipt.tenantId ? { ...tenant, status: 'Paid' } : tenant));
    setTenants(updated);
    localStorage.setItem('app_tenants', JSON.stringify(updated));
  };

  const sendWhatsAppReminder = (tenant) => {
    let message = `Hello ${tenant.name}, your rent of ₹${tenant.rent} for ${tenant.unit} is pending. Please pay at the earliest.`;
    if (lang === 'mr') {
      message = `नमस्ते ${tenant.name} जी, आपल्या ${tenant.unit} चे चालू महिन्याचे भाडे ₹${tenant.rent} बाकी आहे. कृपया लवकरात लवकर जमा करावे ही विनंती.`;
    } else if (lang === 'hi') {
      message = `नमस्ते ${tenant.name} जी, आपके ${tenant.unit} का किराया ₹${tenant.rent} बकाया है। कृपया समय पर भुगतान करें।`;
    }
    
    const cleanPhone = tenant.phone ? tenant.phone.replace(/[^0-9]/g, '') : '';
    const phoneWithCode = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${phoneWithCode}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-800 font-sans pb-28">
      {/* Top Header */}
      <div className="bg-white px-5 pt-6 pb-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-[#11294a]">
              {profile?.name ? `${t('welcome')}, ${profile.name}` : t('welcome')}
            </h1>
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {profile?.businessName || t('overviewSubtitle')}
          </p>
        </div>

        <button 
          onClick={() => navigate('/settings')}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-full text-xs font-bold transition"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>{properties.length} {t('units')}</span>
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        
        {/* Due Date Alert Banner */}
        {dueRentTenants.length > 0 && (
          <div className="bg-gradient-to-r from-rose-500 to-red-600 text-white p-4 rounded-3xl shadow-md flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-100">{t('rentReminderTitle')}</h4>
                <p className="text-sm font-black mt-0.5">{dueRentTenants.length} {t('rentReminderText')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Financial Snapshot Card */}
        <div className="bg-[#0a1e3b] text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{t('monthlyIncome')}</p>
              <h2 className="text-3xl font-black mt-1">₹{collectedRent.toLocaleString()}</h2>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-amber-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{tenants.length > 0 ? Math.round((collectedRent / totalExpectedRent) * 100) || 0 : 0}% {t('collected')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
            <div className="bg-white/5 p-3 rounded-2xl">
              <p className="text-[11px] text-slate-300">{t('totalExpected')}</p>
              <p className="text-base font-bold mt-0.5">₹{totalExpectedRent.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl">
              <p className="text-[11px] text-rose-300">{t('pendingRent')}</p>
              <p className="text-base font-bold text-rose-400 mt-0.5">₹{pendingRent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 mb-2.5">
            {t('quickActions')}
          </h3>
          <div className="grid grid-cols-4 gap-2.5">
            <button
              onClick={() => navigate('/properties')}
              className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-1.5 hover:border-[#11294a] transition active:scale-95 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 leading-tight">{t('addProperty')}</span>
            </button>

            <button
              onClick={() => navigate('/tenants')}
              className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-1.5 hover:border-[#11294a] transition active:scale-95 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 leading-tight">{t('addTenant')}</span>
            </button>

            <button
              onClick={() => navigate('/receipts')}
              className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-1.5 hover:border-[#11294a] transition active:scale-95 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 leading-tight">{t('receipts')}</span>
            </button>

            <button
              onClick={() => navigate('/settings')}
              className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-1.5 hover:border-[#11294a] transition active:scale-95 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 leading-tight">{t('settings')}</span>
            </button>
          </div>
        </div>

        {/* Occupancy Status */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center text-xs mb-2 font-bold">
            <span className="text-slate-800">{t('occupancy')}</span>
            <span className="text-indigo-600">{occupiedUnits} / {properties.length} {t('occupied')} ({occupancyPercentage}%)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
        </div>

        {/* Pending Rent Alerts */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('pendingAlerts')} ({pendingTenants.length})
            </h3>
            <button 
              onClick={() => navigate('/tenants')}
              className="text-xs font-bold text-[#11294a] hover:underline flex items-center"
            >
              {t('seeAll')} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingTenants.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center text-xs text-slate-500 flex flex-col items-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-1.5" />
              <p className="font-bold text-slate-800">{t('allCollected')}</p>
              <p className="text-slate-400 mt-0.5">{t('noPending')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingTenants.slice(0, 3).map((tenant) => (
                <div
                  key={tenant.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{tenant.name}</h4>
                    <p className="text-xs text-slate-500">{tenant.unit} • <strong className="text-rose-600">₹{tenant.rent}</strong></p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => sendWhatsAppReminder(tenant)}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSelectedTenantForPay(tenant)}
                      className="px-3 py-1.5 bg-[#0a1e3b] hover:bg-[#11294a] text-white text-xs font-bold rounded-xl transition shadow-sm"
                    >
                      {t('collect')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <RecordPaymentModal
        isOpen={!!selectedTenantForPay}
        tenant={selectedTenantForPay}
        onClose={() => setSelectedTenantForPay(null)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}