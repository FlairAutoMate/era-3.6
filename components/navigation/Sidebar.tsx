
import React from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { UserRole } from '../../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onClose }) => {
  const { userRole } = useAppStore();

  const isLanding = currentView === 'landing';
  const isPro = userRole === UserRole.PROFESSIONAL;

  const homeownerItems = [
    { id: 'dashboard', label: 'Oversikt', icon: Icons.LayoutDashboard },
    { id: 'analyze', label: 'ERA Vision', icon: Icons.ScanLine },
    { id: 'value', label: 'Status & Verdi', icon: Icons.Activity },
    { id: 'actions', label: 'Verdiplan', icon: Icons.TrendingUp },
    { id: 'fdv', label: 'Eiendomslogg', icon: Icons.FileText },
    { id: 'partners', label: 'Håndverker', icon: Icons.Users, badge: 'NY' },
  ];

  // UPDATED PRO ITEMS: Operational Focus
  const proItems = [
    { id: 'dashboard', label: 'Produksjon', icon: Icons.LayoutDashboard }, // Dashboard
    { id: 'pro-jobs', label: 'Ordrebank', icon: Icons.Briefcase },         // Active Jobs & Leads
    { id: 'pro-new-job', label: 'Ny Befaring', icon: Icons.ScanLine },     // Inspection Tool
    { id: 'pro-quotes', label: 'Kalkyle & Tilbud', icon: Icons.Calculator }, // Estimating
    { id: 'pro-revenue', label: 'Økonomi', icon: Icons.BarChart3 },        // Revenue/Invoicing
    { id: 'fdv', label: 'FDV & Arkiv', icon: Icons.FileText },             // Documentation
  ];

  const landingItems = [
    { id: 'hero', label: 'Hjem', icon: Icons.Home, isScroll: true },
    { id: 'boligeiere', label: 'For boligeiere', icon: Icons.Home, isScroll: true },
    { id: 'slik-virker-det', label: 'Slik virker det', icon: Icons.Zap, isScroll: true },
    { id: 'sikkerhet', label: 'Sikkerhet & Data', icon: Icons.ShieldCheck, isScroll: true },
    { id: 'pris', label: 'Prismodell', icon: Icons.Coins, isScroll: true },
  ];

  const appItems = isPro ? proItems : homeownerItems;
  const navItems = isLanding ? landingItems : appItems;

  const handleNav = (id: string, isScroll: boolean = false) => {
    if (isScroll) {
        if (!isLanding) {
          onNavigate('landing');
          setTimeout(() => performScroll(id), 150);
        } else {
          performScroll(id);
        }
    } else {
        onNavigate(id);
    }
    onClose();
  };

  const performScroll = (id: string) => {
    const container = document.getElementById('era-main-scroll');
    const target = document.getElementById(id);
    if (container && target) {
        const top = target.getBoundingClientRect().top + container.scrollTop - container.getBoundingClientRect().top;
        container.scrollTo({ top: top - 40, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[500] lg:hidden transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside className={`
        fixed top-0 left-0 bottom-0 z-[600] w-[260px] bg-[#0A0A0B] border-r border-white/10
        transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isOpen ? 'translate-x-0 shadow-[20px_0_60px_rgba(0,0,0,0.8)]' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="pt-12 px-8 pb-10 border-b border-white/5">
          <div onClick={() => onNavigate('landing')} className="cursor-pointer">
            <Icons.EraAxis size={24} variant="wordmark" active />
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item: any) => {
            const isActive = !isLanding && currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id, item.isScroll)}
                className={`
                  w-full flex items-center gap-4 px-6 py-4 transition-all relative group rounded-2xl
                  ${isActive ? 'text-white bg-white/10 border border-white/10 shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'}
                `}
              >
                <item.icon size={20} className={isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'} />
                <span className="text-[14px] font-bold tracking-tight">{item.label}</span>
                {item.badge && (
                    <span className="absolute right-4 text-[9px] font-black bg-indigo-500 text-white px-1.5 py-0.5 rounded shadow-lg animate-pulse">{item.badge}</span>
                )}
                {isActive && !item.badge && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />}
              </button>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-white/10 space-y-4 bg-[#080809]">
            {!isLanding && (
                <button
                    onClick={() => handleNav('settings')}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group border border-transparent ${currentView === 'settings' ? 'bg-white/10 text-white border-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Icons.Settings size={20} className={currentView === 'settings' ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'} />
                    <span className="text-[14px] font-bold tracking-tight">{isPro ? 'Firma-profil' : 'Min Profil'}</span>
                </button>
            )}
            <p className="text-[9px] text-zinc-700 leading-relaxed font-black uppercase tracking-widest px-4 pt-2">
                ERA_OS_{isPro ? 'PRO' : 'CORE'}_V2.4
            </p>
        </div>
      </aside>
    </>
  );
};
