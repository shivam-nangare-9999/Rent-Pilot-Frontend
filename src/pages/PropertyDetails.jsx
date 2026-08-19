import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Users, Calendar, ChevronRight, Plus, Home } from 'lucide-react';
import AddTenantModal from '../components/AddTenantModal';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);

  useEffect(() => {
    const savedProps = JSON.parse(localStorage.getItem('app_properties') || '[]');
    const current = savedProps.find((p) => String(p.id) === String(id));
    if (current) setProperty(current);

    const savedTenants = JSON.parse(localStorage.getItem('app_tenants') || '[]');
    const propertyTenants = savedTenants.filter(
      (t) => t.propertyId === id || t.unit?.toLowerCase().includes(current?.name?.toLowerCase()) || t.propertyName === current?.name
    );
    setTenants(propertyTenants);
  }, [id]);

  if (!property) return null;

  const handleTenantAdded = (newTenant) => {
    const allTenants = JSON.parse(localStorage.getItem('app_tenants') || '[]');
    const updated = [{ ...newTenant, propertyId: property.id, propertyName: property.name }, ...allTenants];
    localStorage.setItem('app_tenants', JSON.stringify(updated));
    setTenants((prev) => [{ ...newTenant, propertyId: property.id, propertyName: property.name }, ...prev]);
  };

  const totalRent = tenants.reduce((acc, t) => acc + (Number(t.rent) || 0), 0);
  const paidTenants = tenants.filter((t) => t.status === 'Paid');

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-28">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3.5 sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-slate-100 rounded-xl transition">
            <ArrowLeft className="w-5 h-5 text-slate-900" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900">{property.name}</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase">{property.type || 'Property'}</p>
          </div>
        </div>

        <button
          onClick={() => setIsAddTenantOpen(true)}
          className="bg-[#1e3a5f] hover:bg-[#162b47] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#1e3a5f]/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Tenant</span>
        </button>
      </header>

      <main className="p-4 space-y-4 max-w-md mx-auto">
        <div className="bg-white rounded-[32px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1e3a5f]/10 border border-[#1e3a5f]/20 text-[#1e3a5f] flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">{property.name}</h2>
                <p className="text-xs text-slate-500 font-medium">{property.type || 'Residential'}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full text-xs font-bold">
              {tenants.length} Tenants
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-100">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Income</p>
              <p className="text-lg font-black text-slate-900 mt-0.5">₹{totalRent.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Collection Status</p>
              <p className="text-sm font-bold text-emerald-600 mt-1">
                {paidTenants.length}/{tenants.length} Paid
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            All Tenants & Flats ({tenants.length})
          </h3>

          {tenants.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No tenants registered for this property.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {tenants.map((t) => {
                const isPaid = t.status === 'Paid';
                const dueDay = t.startDate ? new Date(t.startDate).getDate() : '1';
                return (
                  <div
                    key={t.id}
                    onClick={() => navigate(`/tenants/${t.id}`)}
                    className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/60 flex items-center justify-between hover:bg-slate-100/70 transition cursor-pointer active:scale-[0.99]"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                        <span className="text-[11px] font-extrabold text-[#1e3a5f] bg-[#1e3a5f]/10 border border-[#1e3a5f]/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Home className="w-3 h-3 text-[#1e3a5f]" />
                          {t.unit}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span>Rent: <strong className="text-slate-800">₹{t.rent}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-600 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Due: <strong>Day {dueDay}</strong>
                        </span>
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
        isOpen={isAddTenantOpen}
        onClose={() => setIsAddTenantOpen(false)}
        onTenantAdded={handleTenantAdded}
      />
    </div>
  );
}