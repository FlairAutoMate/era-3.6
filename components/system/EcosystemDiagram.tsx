
import React from 'react';
import { Icons } from '../Icons';
import { AuraCard } from '../widgets/SharedWidgets';

const NODE_CONFIG = {
  core: { label: 'ERA CORE', icon: Icons.Sparkles, color: 'text-white', bg: 'bg-indigo-600', ring: 'ring-indigo-500/50' },
  customer: { label: 'Kunde', sub: 'Eier & Mottaker', icon: Icons.User, color: 'text-zinc-400', pos: 'top-0 left-1/2 -translate-x-1/2' },
  pro: { label: 'Pro Partner', sub: 'Mester-utførelse', icon: Icons.Zap, color: 'text-emerald-400', pos: 'bottom-0 left-1/2 -translate-x-1/2' },
  admin: { label: 'ERA Admin', sub: 'Strategisk styring', icon: Icons.ShieldCheck, color: 'text-indigo-400', pos: 'top-1/2 left-0 -translate-y-1/2' },
  chain: { label: 'Kjede-Admin', sub: 'Aggregert innsikt', icon: Icons.BarChart3, color: 'text-zinc-500', pos: 'top-1/2 right-0 -translate-y-1/2' }
};

export const EcosystemDiagram: React.FC = () => {
  return (
    <div className="space-y-10 py-10">
      <div className="flex items-center gap-4 px-2">
        <div className="h-[1px] w-12 bg-indigo-500/30" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-500">System-topologi: Økosystemet</h3>
      </div>

      <AuraCard className="p-20 bg-[#050505] border-white/5 relative overflow-hidden min-h-[600px] flex items-center justify-center interactive-card">
        {/* Connection Lines Layer (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600">
          <defs>
            <linearGradient id="flowIndigo" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          <path d="M400,300 L400,100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="400" cy="200" r="3" fill="#6366f1" className="animate-pulse">
            <animateMotion dur="3s" repeatCount="indefinite" path="M400,300 L400,100" />
          </circle>

          <path d="M400,300 L400,500" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="400" cy="400" r="3" fill="#10b981" className="animate-pulse">
            <animateMotion dur="2.5s" repeatCount="indefinite" path="M400,300 L400,500" />
          </circle>

          <path d="M400,300 L150,300" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="275" cy="300" r="3" fill="#6366f1" className="animate-pulse">
            <animateMotion dur="4s" repeatCount="indefinite" path="M400,300 L150,300" />
          </circle>

          <path d="M400,300 L650,300" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="525" cy="300" r="3" fill="#71717a" className="animate-pulse">
            <animateMotion dur="5s" repeatCount="indefinite" path="M400,300 L650,300" />
          </circle>
        </svg>

        {/* Nodes Layer */}
        <div className="relative w-full h-full max-w-2xl aspect-square">

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 actor-node">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-600/20 rounded-[40px] blur-3xl animate-pulse scale-150" />
              <div className="w-32 h-32 bg-indigo-600 rounded-[40px] flex flex-col items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.4)] border border-indigo-400/50 transition-transform group-hover:scale-110 duration-700">
                <Icons.Sparkles size={48} className="text-white mb-2" />
                <span className="text-[10px] font-black text-white tracking-[0.3em]">ERA CORE</span>
              </div>
            </div>
          </div>

          <ActorNode config={NODE_CONFIG.customer} />
          <ActorNode config={NODE_CONFIG.pro} />
          <ActorNode config={NODE_CONFIG.admin} />
          <ActorNode config={NODE_CONFIG.chain} />

        </div>

        {/* Legend */}
        <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row justify-between items-end gap-6 pointer-events-none">
            <div className="space-y-1">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Sentral Dirigent</p>
                <p className="text-xs text-zinc-600">ERA orkestrerer all verdiutveksling mellom parter.</p>
            </div>
            <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Sertifisert Økosystem v2.2</span>
            </div>
        </div>
      </AuraCard>
    </div>
  );
};

const ActorNode = ({ config }: { config: any }) => (
  <div className={`absolute ${config.pos} flex flex-col items-center text-center group z-20 actor-node`}>
    <div className={`
      w-16 h-16 rounded-[24px] bg-[#0A0A0B] border border-white/10 flex items-center justify-center
      transition-all duration-500 group-hover:scale-110 group-hover:border-white/20
      shadow-2xl mb-4 ${config.color}
    `}>
      <config.icon size={28} />
    </div>
    <div className="space-y-1">
      <h4 className="text-[11px] font-black text-white uppercase tracking-widest">{config.label}</h4>
      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {config.sub}
      </p>
    </div>
  </div>
);
