import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Search, ChevronRight, Home } from 'lucide-react';
import AddTenantModal from '../components/AddTenantModal';

export default function Tenants() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('app_tenants') || '[]');
    setTenants(saved);
  }, []);

  const handleAddTenantSuccess = (newTenant) => {
    const updated = [newTenant, ...tenants];
    setTenants(updated);
    localStorage.setItem('app_tenants', JSON.stringify(updated));
  };

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.unit?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.phone?.includes(searchQuery);

    if (filterTab === 'PAID') return matchesSearch && tenant.status === 'Paid';
    if (filterTab === 'DUE') return matchesSearch && tenant.status !== 'Paid';
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-28">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-5 py-3.5 sticky top-0 z-20 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">
            All <span className="text-[#1e3a5f]">Tenants</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            {tenants.length} Total Registered
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#1e3a5f] hover:bg-[#162b47] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#1e3a5f]/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Tenant</span>
        </button>
      </header>

      <main className="p-4 space-y-4 max-w-md mx-auto">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, room or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1e3a5f]"
          />
        </div>

        <div className="flex gap-2 text-xs font-bold">
          {['ALL', 'DUE', 'PAID'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-4 py-1.5 rounded-xl transition ${
                filterTab === tab
                  ? 'bg-[#1e3a5f] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {tab === 'ALL' ? 'All' : tab === 'DUE' ? 'Pending (Due)' : 'Paid'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Directory ({filteredTenants.length})
          </h3>

          {filteredTenants.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No tenants found.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredTenants.map((tenant) => {
                const isPaid = tenant.status === 'Paid';
                return (
                  <div
                    key={tenant.id}
                    onClick={() => navigate(`/tenants/${tenant.id}`)}
                    className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/60 flex items-center justify-between hover:bg-slate-100/70 transition cursor-pointer active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/10 text-[#1e3a5f] border border-[#1e3a5f]/20 flex items-center justify-center font-bold text-xs">
                        {tenant.name ? tenant.name.substring(0, 2).toUpperCase() : 'TN'}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{tenant.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                          <span className="font-semibold text-slate-700 flex items-center gap-1">
                            <Home className="w-3 h-3 text-slate-400" />
                            {tenant.unit}
                          </span>
                          <span>•</span>
                          <span>₹{tenant.rent}/mo</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                        {isPaid ? 'PAID' : 'DUE'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <AddTenantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTenantAdded={handleAddTenantSuccess}
      />
    </div>
  );
}