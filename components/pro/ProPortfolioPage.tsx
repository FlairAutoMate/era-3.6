
import React from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { AuraCard } from '../widgets/SharedWidgets';
import { TG_COLORS } from '../../constants';

export const ProPortfolioPage: React.FC = () => {
    const { properties } = useAppStore();

    // Simulerer kunderelasjoner for proffen
    const managedProperties = properties.map((p, i) => ({
        ...p,
        clientName: i === 0 ? 'Ola Nordmann' : 'Kvadraturen Eiendom AS',
        lastWork: i === 0 ? 'Maling av fasade (2023)' : 'Rørinspeksjon (2024)',
        tgTendency: i === 0 ? 'stable' : 'declining'
    }));

    return (
        <div className="max-w-5xl mx-auto px-6 pt-12 pb-32 animate-era-in">
            <header className="mb-12">
                <div className="flex items-center gap-2 mb-4 text-emerald-500">
                    <Icons.Building size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Overvåket Bygningsmasse</span>
                </div>
                <h1 className="text-5xl font-bold tracking-ios-tighter text-white">Kundeportefølje</h1>
                <p className="text-zinc-500 text-sm mt-2">ERA analyserer dine kunders eiendommer og varsler deg når det er tid for oppfølging.</p>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {managedProperties.map(prop => (
                    <AuraCard key={prop.address} className="p-6 bg-[#0A0A0B] border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row items-center gap-8 group">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/5 grayscale group-hover:grayscale-0 transition-all">
                            <img src={prop.imageUrl} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-white truncate">{prop.address.split(',')[0]}</h3>
                                <div className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${TG_COLORS[prop.energyGrade === 'F' ? 3 : 1]}`}>
                                    TG {prop.energyGrade === 'F' ? '3' : '1'}
                                </div>
                            </div>
                            <p className="text-zinc-500 text-sm mb-4">Kunde: <span className="text-white font-bold">{prop.clientName}</span></p>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                    <Icons.History size={12} className="text-zinc-500" />
                                    <span className="text-[9px] font-black uppercase text-zinc-500">{prop.lastWork}</span>
                                </div>
                                {prop.tgTendency === 'declining' && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
                                        <Icons.TrendingDown size={12} className="text-red-500" />
                                        <span className="text-[9px] font-black uppercase text-red-500">TG-fall detektert</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <button className="flex-1 md:flex-none h-14 px-8 bg-white text-black rounded-2xl font-bold text-xs shadow-lg active:scale-95 transition-all">
                                Send Oppfølging
                            </button>
                            <button className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
                                <Icons.ChevronRight size={20} />
                            </button>
                        </div>
                    </AuraCard>
                ))}
            </div>

            <div className="mt-12 p-10 bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">Proaktiv Vedlikeholds-feed</h3>
                    <p className="text-zinc-500 text-sm max-w-lg leading-relaxed">
                        Basert på værdata og materialalder har ERA identifisert 12 mulige oppdrag hos dine eksisterende kunder de neste 30 dagene.
                    </p>
                </div>
                <Icons.Sparkles className="absolute right-10 top-1/2 -translate-y-1/2 text-emerald-500/10" size={120} />
            </div>
        </div>
    );
};
