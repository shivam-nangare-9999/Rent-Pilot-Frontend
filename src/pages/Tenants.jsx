import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserPlus, Phone, Home, 
  ChevronRight, Search, PlusCircle 
} from 'lucide-react';
import AddTenantModal from '../components/AddTenantModal';
import { useTranslation } from '../context/LanguageContext';

export default function Tenants() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [tenants, setTenants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('app_tenants');
    if (saved) {
      setTenants(JSON.parse(saved));
    }
  }, []);

  const handleAddTenantSuccess = (newTenant) => {
    const updated = [newTenant, ...tenants];
    setTenants(updated);
    localStorage.setItem('app_tenants', JSON.stringify(updated));
  };

  const filteredTenants = tenants.filter((tenant) =>
    tenant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.unit?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.phone?.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-800 font-sans pb-28">
      {/* Top Header */}
      <div className="bg-white px-5 pt-6 pb-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#11294a] flex items-center justify-center text-white shadow-sm">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#11294a]">{t('tenants') || 'Tenants'}</h1>
            <p className="text-xs text-slate-400 font-medium">{tenants.length} Total Registered</p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#11294a] hover:bg-[#0a1e3b] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow transition active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('addTenant') || '+ Tenant'}</span>
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tenant by name, room or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#11294a] shadow-sm"
          />
        </div>

        {/* Tenant Cards List */}
        {filteredTenants.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3 shadow-sm">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-600">कोणतेही भाडेकरू सापडले नाहीत.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-[#11294a] text-white text-xs font-bold rounded-xl shadow-sm"
            >
              + पहिला भाडेकरू जोडा
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTenants.map((tenant) => (
              <div
                key={tenant.id}
                onClick={() => navigate(`/tenants/${tenant.id}`)}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-[#11294a] hover:shadow-md transition active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#0a1e3b] text-white flex items-center justify-center font-bold text-base uppercase shadow-inner flex-shrink-0">
                    {tenant.name ? tenant.name.substring(0, 2) : 'TN'}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {tenant.name}
                    </h3>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        <Home className="w-3 h-3 text-slate-500" />
                        {tenant.unit}
                      </span>
                      <span>•</span>
                      <span>₹{tenant.rent}/mo</span>
                    </div>

                    {tenant.phone && (
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {tenant.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      tenant.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-600 border border-rose-200'
                    }`}
                  >
                    {tenant.status === 'Paid' ? 'PAID' : 'DUE'}
                  </span>

                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Add Tenant Modal */}
      <AddTenantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTenantAdded={handleAddTenantSuccess}
      />
    </div>
  );
}