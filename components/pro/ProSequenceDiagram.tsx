
import React from 'react';
import { Icons } from '../Icons';
import { AuraCard } from '../widgets/SharedWidgets';

const STEPS = [
  {
    id: 'initiate',
    actor: 'Pro Partner',
    title: 'Opprettelse',
    desc: 'Pro oppretter oppdraget i ERA OS. Kunden trenger ingen konto.',
    icon: Icons.PlusCircle,
    color: 'text-white'
  },
  {
    id: 'capture',
    actor: 'ERA Vision',
    title: 'Digital Befaring',
    desc: 'Pro bruker ERA Vision-skanning for å fange teknisk tilstand.',
    icon: Icons.ScanLine,
    color: 'text-indigo-400'
  },
  {
    id: 'analyze',
    actor: 'ERA AI',
    title: 'System-analyse',
    desc: 'ERA analyserer bildene, finner avvik og genererer tiltaksplan.',
    icon: Icons.Sparkles,
    color: 'text-indigo-400'
  },
  {
    id: 'execute',
    actor: 'Pro Partner',
    title: 'Utførelse',
    desc: 'Arbeidet utføres basert på de system-scopede behovene.',
    icon: Icons.Hammer,
    color: 'text-white'
  },
  {
    id: 'verify',
    actor: 'ERA AI',
    title: 'Verifikasjon',
    desc: 'ERA sammenligner før/etter og verifiserer fagmessig utførelse.',
    icon: Icons.BadgeCheck,
    color: 'text-emerald-500'
  },
  {
    id: 'log',
    actor: 'ERA OS',
    title: 'Sertifisert Logg',
    desc: 'Permanent FDV-dokumentasjon opprettes automatisk.',
    icon: Icons.FileText,
    color: 'text-white'
  },
  {
    id: 'deliver',
    actor: 'Customer',
    title: 'Magic Link',
    desc: 'Kunden mottar dokumentasjon via en sikker, lese-kun lenke.',
    icon: Icons.Link,
    color: 'text-indigo-400'
  }
];

export const ProSequenceDiagram: React.FC = () => {
  return (
    <div className="space-y-10 py-10">
      <div className="flex items-center gap-4 px-2">
        <div className="h-[1px] w-12 bg-indigo-500/30" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-500">Operasjonell Sekvens: Pro-Ledet</h3>
      </div>

      <AuraCard className="p-12 bg-[#0A0A0B] border-white/5 relative overflow-hidden">
        <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden md:block absolute top-[28px] left-[40px] right-[40px] h-[1px] bg-gradient-to-r from-indigo-500/20 via-indigo-500/40 to-emerald-500/20" />

            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center text-center group">
                <div className={`
                  w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center
                  relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:border-indigo-500/40
                  ${step.color}
                `}>
                  <step.icon size={24} />
                </div>
                <div className="mt-6 space-y-2">
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600 block">{step.actor}</span>
                  <h4 className="text-xs font-bold text-white tracking-tight">{step.title}</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-w-[120px] mx-auto">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sequence Logic Microcopy */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex gap-10">
                <div className="space-y-1">
                    <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest block">Pro Kontroll</span>
                    <p className="text-[11px] text-zinc-500">Styrer hele prosessen fra appen.</p>
                </div>
                <div className="space-y-1">
                    <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest block">Uavhengig Verifikasjon</span>
                    <p className="text-[11px] text-zinc-500">ERA sikrer objektiv dokumentasjon.</p>
                </div>
            </div>
            <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <Icons.Info size={14} className="text-indigo-400" />
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Kunden trenger ingen ERA-bruker</span>
            </div>
        </div>
      </AuraCard>
    </div>
  );
};
