
import React, { useMemo, useState, useEffect } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { AuraCard, PrimaryButton } from '../widgets/SharedWidgets';
import { LiveSystemFeed } from '../system/LiveSystemFeed';

export const HomeView: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const { getEstimatedValue, jobs, getHealthScore } = useAppStore();
  const valueData = getEstimatedValue();
  const health = getHealthScore();

  // "Breathing" animation state for the asset
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 3000);
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (score: number) => {
      if (score > 80) return 'from-emerald-500 to-teal-500';
      if (score > 50) return 'from-amber-500 to-orange-500';
      return 'from-red-500 to-pink-600';
  };

  const getHealthStatus = (score: number) => {
      if (score > 80) return 'Optimal tilstand';
      if (score > 50) return 'Tiltak anbefales';
      return 'Kritisk risiko';
  };

  return (
    <div className="flex flex-col gap-8 pb-32 animate-era-in">

      {/* 1. THE LIVING ASSET (Hero) */}
      <section className="relative pt-10">
        <div className="flex justify-between items-start mb-4 px-2">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Min Boligverdi</h1>
                <p className="text-zinc-500 text-sm">Sanntidsanalyse aktivert</p>
            </div>
            <button onClick={() => onNavigate('analyze')} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all active:scale-90">
                <Icons.ScanLine size={20} className="text-white" />
            </button>
        </div>

        <AuraCard className="relative overflow-hidden bg-[#0A0A0B] border-white/10 shadow-2xl h-[420px] flex flex-col items-center justify-center group">

            {/* The Living Orb / Digital Twin Representation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className={`w-[280px] h-[280px] rounded-full bg-gradient-to-tr ${getHealthColor(health)} blur-[80px] transition-all duration-[3000ms] ${pulse ? 'scale-110 opacity-60' : 'scale-100 opacity-40'}`} />
                <div className="absolute w-[200px] h-[200px] rounded-full bg-white/5 blur-[40px] mix-blend-overlay" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Estimert Markedsverdi</span>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-7xl md:text-8xl font-black text-white tracking-tighter font-display leading-none drop-shadow-2xl">
                            {(valueData.current / 1000000).toFixed(1)}
                        </h2>
                        <span className="text-2xl font-bold text-zinc-500">MNOK</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getHealthColor(health)} animate-pulse`} />
                    <span className="text-xs font-bold text-white tracking-wide">{getHealthStatus(health)} ({health}%)</span>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-4 border-t border-white/5 w-full max-w-xs">
                    <div>
                        <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest block mb-1">Potensial</span>
                        <span className="text-xl font-bold text-indigo-400">+{Math.round((valueData.potential - valueData.current)/1000)}k</span>
                    </div>
                    <div>
                        <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest block mb-1">Sikret</span>
                        <span className="text-xl font-bold text-emerald-500">+{Math.round(valueData.verifiedAppreciation/1000)}k</span>
                    </div>
                </div>
            </div>

            {/* Interactive decorative rings */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                <circle cx="200" cy="200" r="140" fill="none" stroke="url(#gradient)" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="4 4" className="animate-[spin_60s_linear_infinite]" />
                <circle cx="200" cy="200" r="180" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.05" className="animate-[spin_40s_linear_infinite_reverse]" />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="white" stopOpacity="0" />
                        <stop offset="50%" stopColor="white" stopOpacity="1" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </AuraCard>
      </section>

      {/* 2. CONTEXTUAL ACTION STREAM (Swipe Cards Concept) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600">Neste Trekk</h3>
            <LiveSystemFeed />
        </div>

        {/* Primary Action Card */}
        <button
            onClick={() => onNavigate('actions')}
            className="w-full text-left group relative overflow-hidden rounded-[32px] p-1"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 group-hover:opacity-30 transition-opacity blur-xl" />
            <div className="relative bg-[#121214] border border-white/10 rounded-[28px] p-8 flex justify-between items-center transition-transform group-hover:scale-[0.99]">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Icons.Sparkles size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Anbefaling</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Iverksett Verdisikring</h3>
                    <p className="text-sm text-zinc-400 max-w-[200px]">3 tiltak identifisert som stopper verdifall.</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform">
                    <Icons.ArrowRight size={24} />
                </div>
            </div>
        </button>

        {/* Secondary Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
            <button onClick={() => onNavigate('fdv')} className="bg-[#0D0D0E] border border-white/5 p-6 rounded-[24px] hover:bg-white/5 transition-colors text-left group">
                <Icons.FileText className="text-zinc-500 mb-4 group-hover:text-emerald-400 transition-colors" size={24} />
                <span className="block text-sm font-bold text-white">Eiendomslogg</span>
                <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Sertifisert</span>
            </button>
            <button onClick={() => onNavigate('settings')} className="bg-[#0D0D0E] border border-white/5 p-6 rounded-[24px] hover:bg-white/5 transition-colors text-left group">
                <Icons.User className="text-zinc-500 mb-4 group-hover:text-indigo-400 transition-colors" size={24} />
                <span className="block text-sm font-bold text-white">Min Profil</span>
                <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Innstillinger</span>
            </button>
        </div>
      </section>
    </div>
  );
};
