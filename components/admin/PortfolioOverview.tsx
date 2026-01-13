
import React, { useMemo, useState } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { BentoCard } from '../widgets/BentoGrid';
import { AuraCard } from '../widgets/SharedWidgets';
import { AdminSystemDiagram } from './AdminSystemDiagram';
import { CampaignManager } from './CampaignManager';
import { FunnelAnalytics } from './FunnelAnalytics';
import { EcosystemDiagram } from '../system/EcosystemDiagram';

export const PortfolioOverview: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
    const { properties, setActiveProperty, getPropertyTGScore, getPropertyIndex, getPortfolioStats } = useAppStore();
    const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'warning' | 'ok'>('all');
    const [tab, setTab] = useState<'inventory' | 'intelligence' | 'campaigns'>('inventory');

    const stats = getPortfolioStats();

    const filteredProperties = useMemo(() => {
        return properties.filter(p => {
            if (activeFilter === 'all') return true;
            if (activeFilter === 'critical') return p.energyGrade === 'F' || p.energyGrade === 'G';
            if (activeFilter === 'warning') return p.energyGrade === 'D' || p.energyGrade === 'E';
            if (activeFilter === 'ok') return ['A', 'B', 'C'].includes(p.energyGrade);
            return true;
        });
    }, [properties, activeFilter]);

    const handleSelectProperty = (index: number) => {
        setActiveProperty(index);
        onNavigate('dashboard');
    };

    return (
        <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-44 animate-era-in bg-black min-h-screen text-white font-sans">
            <header className="mb-14">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 block mb-6">PORTFOLIO INTELLIGENCE | RADAR</span>
                <h1 className="text-[54px] font-bold tracking-ios-tighter leading-[0.95] mb-12">
                    Kapital & <span className="text-zinc-700">Portefølje.</span>
                </h1>

                <div className="flex bg-[#121214] p-1.5 rounded-[24px] border border-white/5 w-fit mb-12">
                    <button onClick={() => setTab('inventory')} className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest flex items-center gap-2.5 transition-all ${tab === 'inventory' ? 'bg-white text-black shadow-lg' : 'text-zinc-600'}`}>Inventar</button>
                    <button onClick={() => setTab('intelligence')} className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest flex items-center gap-2.5 transition-all ${tab === 'intelligence' ? 'bg-white text-black shadow-lg' : 'text-zinc-600'}`}>Intelligence</button>
                    <button onClick={() => setTab('campaigns')} className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest flex items-center gap-2.5 transition-all ${tab === 'campaigns' ? 'bg-white text-black shadow-lg' : 'text-zinc-600'}`}>Kampanjer</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    <KPIMedium label="Porteføljeverdi" value="1.24 MRD" sub="+2.4% siste 12 mnd" icon={Icons.TrendingUp} />
                    <KPIMedium label="Snitt EI-Score" value={`${stats.avgEIScore}`} sub="System-benchmark: 72" icon={Icons.Activity} />
                    <KPIMedium label="Utestående CapEx" value="4.8 MNOK" sub="Identifisert vedlikehold" icon={Icons.DollarSign} />
                    <KPIMedium label="System-last" value="12%" sub="API & Analyse-ressurs" icon={Icons.Zap} color="text-emerald-500" />
                </div>
            </header>

            {tab === 'inventory' && (
                <div className="space-y-20 animate-era-in">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <AuraCard className="lg:col-span-4 p-8 bg-[#0D0D0E] border-white/5">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-8">Energiklasse-fordeling (ESG)</h3>
                            <div className="space-y-6">
                                <EnergyBar grade="A-C" percentage={42} color="bg-emerald-500" />
                                <EnergyBar grade="D-E" percentage={38} color="bg-amber-500" />
                                <EnergyBar grade="F-G" percentage={20} color="bg-red-500" />
                            </div>
                        </AuraCard>

                        <AuraCard className="lg:col-span-8 p-8 bg-[#0D0D0E] border-white/5">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Tilstand vs. Verdi-gap</h3>
                            </div>
                            <div className="space-y-8">
                                {properties.slice(0, 5).map(p => {
                                    const score = getPropertyIndex(p.address);
                                    return (
                                        <div key={p.address} className="flex items-center gap-6">
                                            <span className="text-xs font-bold text-zinc-400 w-32 truncate">{p.address.split(',')[0]}</span>
                                            <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden flex">
                                                <div className="h-full bg-indigo-500" style={{ width: `${score}%` }} />
                                            </div>
                                            <span className={`text-[10px] font-mono font-bold w-8 ${score < 50 ? 'text-red-500' : 'text-emerald-500'}`}>{score}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </AuraCard>
                    </div>

                    <section>
                        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4 px-2">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">ENHETSOVERSIKT</h3>
                            <div className="flex bg-[#121214] p-1 rounded-xl border border-white/5">
                                <button onClick={() => setActiveFilter('all')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeFilter === 'all' ? 'bg-white text-black' : 'text-zinc-600'}`}>Alle</button>
                                <button onClick={() => setActiveFilter('critical')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeFilter === 'critical' ? 'bg-red-600 text-white' : 'text-zinc-600'}`}>Kritisk</button>
                                <button onClick={() => setActiveFilter('ok')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeFilter === 'ok' ? 'bg-emerald-600 text-white' : 'text-zinc-600'}`}>Optimal</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {filteredProperties.map((p) => {
                                const propertyIndex = getPropertyIndex(p.address);
                                return (
                                    <BentoCard
                                        key={p.address}
                                        colSpan={4}
                                        onClick={() => handleSelectProperty(properties.indexOf(p))}
                                        className="bg-zinc-900/20 hover:bg-zinc-900/40 border-white/5 group p-8"
                                    >
                                        <div className="flex items-center justify-between w-full gap-8">
                                            <div className="flex items-center gap-8 overflow-hidden flex-1">
                                                <div className="w-20 h-20 rounded-3xl overflow-hidden shrink-0 border border-white/10 relative">
                                                    <img src={p.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                                                </div>
                                                <div className="truncate">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors truncate">{p.address.split(',')[0]}</h3>
                                                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${p.energyGrade === 'F' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>Klasse {p.energyGrade}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                                                        <span>{p.category}</span>
                                                        <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                                        <span>{p.type}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-12 shrink-0">
                                                <div className="text-right">
                                                    <span className="text-[10px] font-black text-zinc-700 uppercase block mb-1">EI SCORE</span>
                                                    <div className={`text-2xl font-mono font-bold ${propertyIndex >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{propertyIndex}</div>
                                                </div>
                                                <Icons.ChevronRight size={20} className="text-zinc-800 group-hover:text-white transition-all" />
                                            </div>
                                        </div>
                                    </BentoCard>
                                );
                            })}
                        </div>
                    </section>
                </div>
            )}

            {tab === 'intelligence' && (
                <div className="space-y-16 animate-era-in">
                    <EcosystemDiagram />
                    <AdminSystemDiagram />
                    <FunnelAnalytics />
                </div>
            )}

            {tab === 'campaigns' && (
                <div className="animate-era-in">
                    <CampaignManager />
                </div>
            )}
        </div>
    );
};

const KPIMedium = ({ label, value, sub, icon: Icon, color = "text-white" }: any) => (
    <AuraCard className="p-7 bg-[#0A0A0B] border-white/5">
        <div className="flex justify-between items-start mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-600">
                <Icon size={20} />
            </div>
        </div>
        <div className={`text-3xl font-bold mb-1 tracking-tighter ${color}`}>{value}</div>
        <div className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{label}</div>
        <p className="text-[9px] text-zinc-800 font-bold mt-3 uppercase">{sub}</p>
    </AuraCard>
);

const EnergyBar = ({ grade, percentage, color }: any) => (
    <div className="space-y-2">
        <div className="flex justify-between items-end px-1">
            <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">{grade}</span>
            <span className="text-[10px] font-mono font-bold text-zinc-500">{percentage}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${percentage}%` }} />
        </div>
    </div>
);
