
import React, { useMemo } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { PageHeader, AuraCard, KPIUnit } from '../widgets/SharedWidgets';

export const ChainPage: React.FC = () => {
    const { properties, getPropertyIndex } = useAppStore();

    const chainStats = useMemo(() => {
        const totalValue = properties.length * 15.5; // MNOK snitt
        const avgScore = Math.round(properties.reduce((acc, p) => acc + getPropertyIndex(p.address), 0) / properties.length);
        return { totalValue, avgScore, memberCount: 142, activeJobs: 28 };
    }, [properties, getPropertyIndex]);

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-32 animate-era-in">
            <PageHeader
                label="Partner-OS | Kjede-Admin"
                title="System-portefølje"
                description="Aggregert sanntidsdata for hele medlemsmassen og bygningsmassen."
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KPIUnit icon={Icons.TrendingUp} label="Total Verdi" value={`${chainStats.totalValue.toFixed(1)}B`} sub="MNOK" color="text-emerald-500" />
                <KPIUnit icon={Icons.Activity} label="System-helse" value={`${chainStats.avgScore}%`} sub="Avg. EI-score" />
                <KPIUnit icon={Icons.Users} label="Medlemmer" value={chainStats.memberCount} sub="Aktive bedrifter" />
                <KPIUnit icon={Icons.Zap} label="Produksjon" value={chainStats.activeJobs} sub="Aktive sekvenser" color="text-indigo-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <AuraCard className="p-10 bg-[#0A0A0B] border-white/5">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600">Regional Markedsandel</h3>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500" /> <span className="text-[9px] font-black text-zinc-500 uppercase">Vekst</span></div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-zinc-800" /> <span className="text-[9px] font-black text-zinc-500 uppercase">Volum</span></div>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <RegionRow label="Oslo & Viken" progress={85} value="420M" />
                            <RegionRow label="Vestlandet" progress={62} value="180M" />
                            <RegionRow label="Trøndelag" progress={45} value="95M" />
                            <RegionRow label="Nord-Norge" progress={28} value="42M" />
                        </div>
                    </AuraCard>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <AuraCard className="p-8 bg-indigo-600/5 border-indigo-500/10">
                        <Icons.ShieldCheck className="text-indigo-400 mb-6" size={24} />
                        <h4 className="text-lg font-bold text-white mb-2">System-integritet</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-widest font-medium">
                            Alle data er kryptert og anonymisert i henhold til ERA Security Protocol v2.2.
                        </p>
                    </AuraCard>

                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-2">Nylige Hendelser</h4>
                        <EventItem title="Ny Partner: Bergen Malermester" time="2t siden" />
                        <EventItem title="Storfangst: 12 enheter i Oslo" time="5t siden" />
                        <EventItem title="System-oppdatering v2.2.1" time="12t siden" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const RegionRow = ({ label, progress, value }: any) => (
    <div className="space-y-3">
        <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-white">{label}</span>
            <span className="text-[11px] font-mono font-bold text-indigo-400">{value}</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500/40 rounded-full" style={{ width: `${progress}%` }} />
        </div>
    </div>
);

const EventItem = ({ title, time }: any) => (
    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center group hover:bg-white/[0.04] transition-all">
        <span className="text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">{title}</span>
        <span className="text-[9px] font-black text-zinc-700 uppercase">{time}</span>
    </div>
);
