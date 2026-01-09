
import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { useAppStore } from '../lib/store/useAppStore';
import { UserRole } from '../types';
import { Sidebar } from './navigation/Sidebar';
import { BottomNav } from './navigation/BottomNav';
import { GlobalSearch } from './search/GlobalSearch';
import { NotificationCenter } from './notifications/NotificationCenter';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  const { userRole, openAgent } = useAppStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
    };
  }, []);

  const isHomeowner = userRole === UserRole.HOMEOWNER;

  return (
    <div className="h-screen bg-[#050505] text-[#F2F2F7] font-sans selection:bg-indigo-500/30 flex overflow-hidden">

      {/* SIDEBAR (2 KOL) */}
      <Sidebar
          currentView={currentView}
          onNavigate={onNavigate}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
      />

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[80] h-20 bg-black/60 backdrop-blur-3xl border-b border-white/[0.05] flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
              <div onClick={() => onNavigate('landing')} className="cursor-pointer">
              <Icons.EraAxis size={24} variant="icon" active />
              </div>
              <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="w-10 h-10 flex items-center justify-center text-white bg-white/5 rounded-xl border border-white/10 active:scale-90 transition-all"
              >
                  <Icons.Menu size={20} />
              </button>
          </div>
          <div className="flex items-center gap-2">
              <button onClick={() => setIsSearchOpen(true)} className="w-10 h-10 flex items-center justify-center text-zinc-500"><Icons.Search size={20} /></button>
              <button onClick={() => setIsNotifOpen(true)} className="w-10 h-10 flex items-center justify-center text-zinc-500 relative"><Icons.Bell size={20} /></button>
          </div>
      </div>

      {/* MAIN CANVAS + CONTEXT RAIL (10 KOL) */}
      <div className={`flex-1 flex flex-col lg:pl-[240px] relative z-10 h-full pt-20 lg:pt-0`}>
        <div className="flex-1 flex w-full h-full overflow-hidden">

          {/* MAIN CONTENT (Responsive Canvas) */}
          <main
            id="era-main-scroll"
            className={`flex-1 min-w-0 p-6 lg:p-12 animate-era-in h-full overflow-y-auto no-scrollbar flex flex-col ${isHomeowner ? 'pb-32 lg:pb-12' : 'pb-12'}`}
          >
            <div className="max-w-[1200px] w-full mx-auto">
              {children}
            </div>
          </main>

          {/* CONTEXT RAIL (Hidden on mobile/tablet) */}
          <aside className="hidden xl:flex w-[280px] p-10 flex-col gap-6 bg-[#050505] border-l border-white/[0.03] h-full shrink-0 sticky top-0">
             <span className="text-[10px] font-black uppercase text-zinc-700 tracking-[0.2em] mb-4">Kontekstuelle Handlinger</span>
             <div className="space-y-3">
                {currentView === 'dashboard' && (
                  <>
                      <ContextAction icon={Icons.Sparkles} label="Foreslå tiltak" onClick={() => onNavigate('actions')} />
                      <ContextAction icon={Icons.ShieldCheck} label="Verifiser helse" onClick={() => onNavigate('analyze')} />
                  </>
                )}
                {currentView === 'actions' && (
                  <>
                      <ContextAction icon={Icons.Briefcase} label="Finn utførende" onClick={() => onNavigate('jobs')} />
                      <ContextAction icon={Icons.Scale} label="Lønnsomhetssjekk" onClick={() => openAgent({ type: 'enova_guide' })} />
                  </>
                )}
                {currentView === 'fdv' && (
                  <>
                      <ContextAction icon={Icons.Download} label="Eksporter FDV" onClick={() => {}} />
                      <ContextAction icon={Icons.Share} label="Del tilgang" onClick={() => {}} />
                  </>
                )}

                <div className="pt-6 border-t border-white/[0.05] mt-4 opacity-40">
                  <ContextAction icon={Icons.HelpCircle} label="Systemstøtte" onClick={() => openAgent({ type: 'general' })} />
                </div>
             </div>

             <div className="mt-auto pt-6 border-t border-white/[0.05]">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Core Engine Active</span>
                </div>
                <p className="text-[9px] text-zinc-800 font-medium">Siste synk: Nettopp</p>
             </div>
          </aside>
        </div>
      </div>

      {isHomeowner && <BottomNav currentView={currentView} onNavigate={onNavigate} />}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={onNavigate} />
      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} onNavigate={onNavigate} />
    </div>
  );
};

const ContextAction = ({ icon: Icon, label, onClick }: any) => (
    <button
        onClick={onClick}
        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-zinc-500 hover:text-white hover:border-white/10 transition-all group"
    >
        <Icon size={18} className="text-zinc-600 group-hover:text-indigo-400" />
        <span className="text-xs font-bold tracking-tight">{label}</span>
    </button>
);
