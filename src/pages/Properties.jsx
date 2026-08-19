import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Users, ChevronRight } from 'lucide-react';
import AddPropertyModal from '../components/AddPropertyModal';

export default function Properties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const savedProps = JSON.parse(localStorage.getItem('app_properties') || '[]');
    const savedTenants = JSON.parse(localStorage.getItem('app_tenants') || '[]');
    setProperties(savedProps);
    setTenants(savedTenants);
  }, []);

  const handleAddPropertySuccess = (newProperty) => {
    const updated = [newProperty, ...properties];
    setProperties(updated);
    localStorage.setItem('app_properties', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-28">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-5 py-3.5 sticky top-0 z-20 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">
            All <span className="text-[#1e3a5f]">Properties</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            {properties.length} Properties Registered
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#1e3a5f] hover:bg-[#162b47] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#1e3a5f]/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Property</span>
        </button>
      </header>

      <main className="p-4 space-y-4 max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Property List ({properties.length})
          </h3>

          {properties.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No properties added yet.</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-3 px-4 py-2 bg-[#1e3a5f] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                + Add First Property
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {properties.map((prop) => {
                const propTenantsCount = tenants.filter(
                  (t) => t.propertyId === prop.id || t.unit?.toLowerCase().includes(prop.name?.toLowerCase()) || t.propertyName === prop.name
                ).length;

                return (
                  <div
                    key={prop.id}
                    onClick={() => navigate(`/properties/${prop.id}`)}
                    className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 flex items-center justify-between hover:bg-slate-100/70 transition cursor-pointer active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-[#1e3a5f]/10 border border-[#1e3a5f]/20 text-[#1e3a5f] flex items-center justify-center font-bold">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{prop.name}</h4>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                          <span>{prop.type || 'Residential'}</span>
                          <span>•</span>
                          <span className="text-[#1e3a5f] font-bold flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {propTenantsCount} Tenants
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400">
                      <span className="text-xs font-semibold text-slate-500">View</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <AddPropertyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPropertyAdded={handleAddPropertySuccess}
      />
    </div>
  );
}