import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Tenants from './pages/Tenants';
import TenantDetails from './pages/TenantDetails';
import Receipts from './pages/Receipts';
import Settings from './pages/Settings';
import InitialSetup from './components/InitialSetup';
import { Home, Building2, Users, Settings as SettingsIcon } from 'lucide-react';
import { useTranslation } from './context/LanguageContext';

function DesktopSidebar({ profile }) {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { name: t('dashboard') || 'Dashboard', path: '/', icon: Home },
    { name: t('properties') || 'Properties', path: '/properties', icon: Building2 },
    { name: t('tenants') || 'Tenants', path: '/tenants', icon: Users },
    { name: t('settings') || 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 min-h-screen flex-col justify-between p-4 sticky top-0 h-screen">
      <div>
        <div className="flex items-center gap-3 px-2 py-4 mb-4 border-b border-slate-100">
          <div className="bg-[#11294a] text-white p-2.5 rounded-2xl shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#11294a] leading-tight">RentManager</h2>
            <p className="text-xs text-slate-400 font-semibold">Landlord Portal</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#0f233d] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center gap-3 px-2">
        <div className="w-9 h-9 rounded-full bg-[#11294a] text-white flex items-center justify-center font-bold text-xs">
          {profile?.name ? profile.name.charAt(0).toUpperCase() : 'L'}
        </div>
        <div className="text-xs truncate">
          <p className="font-bold text-slate-800 truncate">{profile?.name || 'Landlord'}</p>
          <p className="text-slate-400 truncate">{profile?.businessName || 'My Units'}</p>
        </div>
      </div>
    </aside>
  );
}

function MobileBottomNav() {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { name: t('dashboard') || 'Dashboard', path: '/', icon: Home },
    { name: t('properties') || 'Properties', path: '/properties', icon: Building2 },
    { name: t('tenants') || 'Tenants', path: '/tenants', icon: Users },
    { name: t('settings') || 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 flex justify-around items-center py-2 px-2 shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
              isActive ? 'text-[#11294a] font-bold' : 'text-slate-400 font-medium'
            }`}
          >
            <div
              className={`p-1.5 rounded-full transition-all ${
                isActive ? 'bg-[#11294a] text-white' : 'bg-transparent text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] mt-0.5">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function App() {
  const [profile, setProfile] = useState(null);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    const currentTheme = localStorage.getItem('app_theme');
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const saved = localStorage.getItem('landlordProfile');
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      setNeedsSetup(true);
    }
  }, []);

  const handleSetupComplete = (newProfile) => {
    setProfile(newProfile);
    setNeedsSetup(false);
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-[#f8faff] text-slate-800 relative">
        {needsSetup && <InitialSetup onComplete={handleSetupComplete} />}

        <DesktopSidebar profile={profile} />

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard profile={profile} />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/tenants/:id" element={<TenantDetails />} />
            <Route path="/receipts" element={<Receipts profile={profile} />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

        <MobileBottomNav />
      </div>
    </Router>
  );
}