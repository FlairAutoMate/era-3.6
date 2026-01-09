
import React from 'react';
import { Icons } from '../Icons';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const tabs = [
    { id: 'dashboard', label: 'Hjem', icon: Icons.Home },
    { id: 'analyze', label: 'Vision', icon: Icons.ScanLine, center: true },
    { id: 'actions', label: 'Plan', icon: Icons.TrendingUp },
    { id: 'fdv', label: 'Logg', icon: Icons.FileText },
    { id: 'settings', label: 'Profil', icon: Icons.User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] pb-safe">
      <div className="mx-4 mb-4 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[32px] h-20 flex items-center justify-around px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {tabs.map((tab) => {
          const isActive = currentView === tab.id;
          const Icon = tab.icon;

          if (tab.center) {
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className="relative -top-6 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(255,255,255,0.2)] active:scale-90 transition-all border-4 border-black"
              >
                <Icon size={28} strokeWidth={2.5} />
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${isActive ? 'text-white' : 'text-zinc-600'}`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
