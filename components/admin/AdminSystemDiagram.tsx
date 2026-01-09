
import React from 'react';
import { Icons } from '../Icons';
import { AuraCard } from '../widgets/SharedWidgets';

const NODES = [
  { id: 'admin', label: 'ERA Admin', sub: 'Strategisk kontroll', icon: Icons.ShieldCheck, color: 'text-white' },
  { id: 'engine', label: 'Campaign Engine', sub: 'Distribusjon & Segmentering', icon: Icons.Zap, color: 'text-indigo-400' },
  { id: 'pro', label: 'Pro Partners', sub: 'Aggregert Kapasitet', icon: Icons.Briefcase, color: 'text-emerald-500' },
  { id: 'customer', label: 'Eiere (Målguppe)', sub: 'Aktivisering', icon: Icons.Users, color: 'text-white' },
  { id: 'value', label: 'Verdi-logg', sub: 'Sluttresultat', icon: Icons.BarChart3, color: 'text-indigo-400' }
];

export const AdminSystemDiagram: React.FC = () => {
  return (
    <div className="space-y-10 py-10">
      <div className="flex items-center gap-4 px-2">
        <div className="h-[1px] w-12 bg-indigo-500/30" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-500">Systemarkitektur: Kampanje & Styring</h3>
      </div>

      <AuraCard className="p-16 bg-[#0A0A0B] border-white/5 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
            {/* Background Connection Path */}
            <div className="hidden md:block absolute top-[28px] left-[50px] right-[50px] h-[2px] bg-gradient-to-r from-zinc-800 via-indigo-500/40 to-emerald-500/20" />

            {NODES.map((node, idx) => (
              <div key={node.id} className="flex flex-col items-center text-center group z-10">
                <div className={`
                  w-16 h-16 rounded-[24px] bg-zinc-900 border border-white/5 flex items-center justify-center
                  transition-all duration-700 group-hover:scale-110 group-hover:border-indigo-500/40
                  shadow-2xl shadow-black
                  ${node.color}
                `}>
                  <node.icon size={28} />
                </div>
                <div className="mt-8 space-y-1.5">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest">{node.label}</h4>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest max-w-[100px]">
                    {node.sub}
                  </p>
                </div>

                {/* Visual Flow Indicator */}
                {idx < NODES.length - 1 && (
                    <div className="md:hidden w-[2px] h-12 bg-zinc-800 my-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legend / Logical Constraints */}
        <div className="mt-20 pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-indigo-400">
                    <Icons.Shield size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Sikkerhet</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">Admin har kun tilgang til aggregerte data. Personvern er ivaretatt gjennom segmentering uten PII-eksponering.</p>
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-500">
                    <Icons.TrendingUp size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">KPI-Logikk</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">Kampanjer måles direkte på "Verified Value". Systemet sporer konvertering fra varsel til ferdigstilt FDV-logg.</p>
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-white">
                    <Icons.Command size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Lastbalansering</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">Utsending justeres automatisk basert på partnere sin ledige kapasitet i den valgte regionen.</p>
            </div>
        </div>
      </AuraCard>
    </div>
  );
};
