
import React from 'react';
import { Icons } from '../Icons';
import { AuraCard } from '../widgets/SharedWidgets';

const FLOW_STEPS = [
  {
    id: 'generate',
    actor: 'Pro Partner',
    title: 'Generer Tilgang',
    desc: 'Pro velger "Del Magic Link" i prosjektet. Systemet signerer en unik hash.',
    icon: Icons.Link,
    status: 'trigger'
  },
  {
    id: 'secure',
    actor: 'ERA System',
    title: 'Sikring & Omfang',
    desc: 'ERA begrenser tilgangen til kun denne eiendommen i 30 dager.',
    icon: Icons.ShieldCheck,
    status: 'system'
  },
  {
    id: 'distribute',
    actor: 'Customer',
    title: 'Mottak',
    desc: 'Kunden mottar lenken på SMS/E-post. Ingen app-installasjon kreves.',
    icon: Icons.Smartphone,
    status: 'user'
  },
  {
    id: 'consume',
    actor: 'Customer',
    title: 'Visning (Read-only)',
    desc: 'Kunden ser status, verifisert logg og dokumentert verdiøkning.',
    icon: Icons.Eye,
    status: 'user'
  },
  {
    id: 'activate',
    actor: 'Customer',
    title: 'Aktivering (Opsjon)',
    desc: 'Kunden kan velge å overta eierskapet til loggen permanent.',
    icon: Icons.Zap,
    status: 'upgrade'
  }
];

export const MagicLinkFlow: React.FC = () => {
  return (
    <div className="space-y-10 py-10">
      <div className="flex items-center gap-4 px-2">
        <div className="h-[1px] w-12 bg-indigo-500/30" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-500">Systemflyt: Magic Link Distribusjon</h3>
      </div>

      <AuraCard className="p-12 bg-[#0A0A0B] border-white/5 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-7 left-10 right-10 h-[1px] bg-white/5" />

          {FLOW_STEPS.map((step, idx) => (
            <div key={step.id} className="flex flex-col items-center text-center group">
              <div className={`
                w-14 h-14 rounded-2xl flex items-center justify-center relative z-10 transition-all duration-500
                ${step.status === 'trigger' ? 'bg-white text-black shadow-lg shadow-white/5' :
                  step.status === 'system' ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-400' :
                  step.status === 'upgrade' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-500' :
                  'bg-zinc-900 border border-white/5 text-zinc-400'}
                group-hover:scale-110
              `}>
                <step.icon size={24} />
              </div>

              <div className="mt-6 space-y-2">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600 block">{step.actor}</span>
                <h4 className="text-xs font-bold text-white tracking-tight">{step.title}</h4>
                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 max-w-[130px] mx-auto">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0"><Icons.Info size={14} className="text-zinc-500" /></div>
                <div className="space-y-1">
                    <p className="text-[11px] font-black text-white uppercase tracking-widest">Sikkerhetsmodell</p>
                    <p className="text-[10px] text-zinc-600 leading-relaxed">Lenken er lese-kun og utløper automatisk. Ingen personopplysninger deles før kunden velger å aktivere egen konto.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0"><Icons.Sparkles size={14} className="text-indigo-400" /></div>
                <div className="space-y-1">
                    <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">Verdi-bevis</p>
                    <p className="text-[10px] text-zinc-600 leading-relaxed">Magic Link fungerer som boligens digitale verdipapir ved salg eller refinansiering.</p>
                </div>
            </div>
        </div>
      </AuraCard>
    </div>
  );
};
