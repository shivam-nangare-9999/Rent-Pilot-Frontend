import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  HelpCircle, 
  Award, 
  ChevronRight, 
  ArrowRight,
  Globe
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function Settings() {
  const { lang, setLang, t } = useTranslation();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('app_theme') === 'dark';
  });

  const handleThemeToggle = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('app_theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('app_theme', 'dark');
      setDarkMode(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-800 font-sans pb-28">
      {/* Top Header */}
      <div className="bg-white px-5 pt-6 pb-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#11294a] flex items-center justify-center text-white shadow-sm">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#11294a] tracking-tight">{t('settings')}</h1>
        </div>

        <button className="flex items-center gap-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm transition">
          <HelpCircle className="w-4 h-4" />
          <span>How to use</span>
        </button>
      </div>

      <div className="p-4 space-y-5 max-w-lg mx-auto">
        {/* Free Plan Banner */}
        <div className="bg-gradient-to-br from-[#fed7aa] via-[#fdba74] to-[#f97316]/70 p-5 rounded-3xl shadow-sm border border-amber-200/60">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-[#7c2d12] flex-shrink-0">
              <Award className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#431407] leading-tight">{t('freePlan')}</h2>
              <p className="text-xs text-[#7c2d12] font-medium mt-0.5">5 properties limit, ads enabled.</p>
            </div>
          </div>

          <button 
            onClick={() => alert('Upgrade to Pro लवकरच उपलब्ध होईल!')}
            className="w-full py-3 bg-[#0a1e3b] hover:bg-[#11294a] text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md transition active:scale-[0.99]"
          >
            <span>{t('upgradeToPro')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* OWNER PROFILE */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase px-2">
            {t('ownerProfile')}
          </p>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
            <button 
              onClick={() => alert('Landlord Profile')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left"
            >
              <span className="text-sm font-bold text-slate-800">Landlord Profile</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <button 
              onClick={() => alert('Rent Receipts')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left"
            >
              <span className="text-sm font-bold text-slate-800">{t('receipts')}</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* PREFERENCES */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase px-2">
            {t('preferences')}
          </p>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
            
            {/* Language Switcher */}
            <div className="px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-bold text-slate-800">{t('language')}</span>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold">
                {[
                  { code: 'mr', label: 'मराठी' },
                  { code: 'hi', label: 'हिंदी' },
                  { code: 'en', label: 'Eng' }
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => setLang(item.code)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      lang === item.code 
                        ? 'bg-[#11294a] text-white shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => alert('Backup & Restore')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left"
            >
              <span className="text-sm font-bold text-slate-800">{t('backupRestore')}</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">{t('darkMode')}</span>
              
              <button
                type="button"
                onClick={handleThemeToggle}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 border-2 ${
                  darkMode ? 'bg-slate-900 border-slate-900 justify-end' : 'bg-white border-slate-900 justify-start'
                }`}
              >
                <div className={`w-5 h-5 rounded-full shadow-sm transition-all duration-300 ${
                  darkMode ? 'bg-white' : 'bg-slate-900'
                }`} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}