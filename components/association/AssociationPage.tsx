
import React, { useMemo, useState } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { PageHeader, AuraCard, KPIUnit, PrimaryButton } from '../widgets/SharedWidgets';

export const AssociationPage: React.FC = () => {
    const { residents, matrikkel, openAgent } = useAppStore();
    const [votes, setVotes] = useState({ yes: 2, no: 0, total: 5 });
    const [hasVoted, setHasVoted] = useState(false);

    // Timeline Data
    const timeline = [
        { year: 2022, event: 'Taktekking', status: 'done', cost: '4.2M' },
        { year: 2023, event: 'VVS Sjekk', status: 'done', cost: '0.2M' },
        { year: 2024, event: 'Fasade Sør', status: 'active', cost: '0.8M' },
        { year: 2025, event: 'El-bil Lading', status: 'planned', cost: '1.2M' },
        { year: 2028, event: 'Rørfornying', status: 'planned', cost: '8.5M' },
    ];

    const stats = useMemo(() => {
        if (residents.length === 0) return { avgHealth: 0, criticalCount: 0, backlogCost: 0, totalValue: 0 };
        const criticalCount = residents.filter(r => r.tg === 3).length;
        const needsAction = residents.filter(r => r.tg === 2).length;
        const backlogCost = (criticalCount * 75000) + (needsAction * 15000);
        const avgHealth = Math.round(100 - (criticalCount * 3) - (needsAction * 1));
        const totalValue = residents.length * 4500000;
        return { avgHealth, criticalCount, needsAction, backlogCost, totalValue };
    }, [residents]);

    const handleVote = (vote: 'yes' | 'no') => {
        if (vote === 'yes') setVotes(prev => ({ ...prev, yes: prev.yes + 1 }));
        else setVotes(prev => ({ ...prev, no: prev.no + 1 }));
        setHasVoted(true);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-32 animate-era-in">
            {/* 1. COMMAND HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Styre-modus Aktiv</span>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter">{matrikkel.address.split(',')[0]}</h1>
                </div>
                <div className="flex gap-3">
                    <button className="h-12 px-6 bg-[#1A1B1E] border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                        <Icons.Download size={14} /> Årsrapport
                    </button>
                    <button onClick={() => openAgent({ type: 'general' })} className="h-12 px-6 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-900/20">
                        <Icons.Sparkles size={14} /> AI-Analyse
                    </button>
                </div>
            </div>

            {/* 2. THE INFINITE TIMELINE (Horizontal Scroll) */}
            <section className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 px-2">Livsløps-tidslinje</h3>
                <div className="relative">
                    {/* Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/5 -translate-y-1/2 rounded-full" />

                    <div className="flex overflow-x-auto gap-8 pb-12 pt-8 px-4 no-scrollbar snap-x">
                        {timeline.map((item, i) => {
                            const isPast = item.status === 'done';
                            const isActive = item.status === 'active';

                            return (
                                <div key={item.year} className={`snap-center shrink-0 relative flex flex-col items-center gap-4 group ${isActive ? 'scale-110 opacity-100' : 'opacity-60 hover:opacity-100'}`}>
                                    <div className={`
                                        w-4 h-4 rounded-full border-4 z-10 transition-all duration-300
                                        ${isActive ? 'bg-indigo-500 border-black shadow-[0_0_20px_#6366f1] scale-150' : isPast ? 'bg-zinc-800 border-black' : 'bg-black border-zinc-700'}
                                    `} />
                                    <div className={`
                                        p-5 rounded-2xl border min-w-[160px] text-center transition-all duration-300
                                        ${isActive ? 'bg-[#1A1B1E] border-indigo-500/50 shadow-xl -translate-y-2' : 'bg-[#0D0D0E] border-white/5'}
                                    `}>
                                        <span className={`text-[10px] font-black block mb-1 ${isActive ? 'text-indigo-400' : 'text-zinc-600'}`}>{item.year}</span>
                                        <h4 className="text-sm font-bold text-white mb-2">{item.event}</h4>
                                        <span className="px-2 py-1 rounded bg-white/5 text-[9px] font-mono text-zinc-400 border border-white/5">{item.cost}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 3. DECISION DECK (Voting) */}
                <div className="lg:col-span-7">
                    <AuraCard className="relative overflow-hidden p-0 bg-[#0A0A0B] border-white/10 group">
                        <div className="p-8 border-b border-white/5 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-red-500">Avstemning pågår</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white">Rehabilitering Fasade Sør</h3>
                            </div>
                            <span className="text-4xl font-mono text-white/10 font-bold">#24</span>
                        </div>

                        <div className="p-8 space-y-8">
                            <p className="text-zinc-400 text-lg font-medium leading-relaxed">
                                Styret foreslår å igangsette maling og utbedring av råteskader på sørvegg iht. mottatt tilbud fra Mesterfarge Oslo AS. <br/><br/>
                                <span className="text-white">Ramme: 450.000,-</span>
                            </p>

                            {!hasVoted ? (
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleVote('no')}
                                        className="flex-1 h-20 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400 font-bold text-lg hover:bg-red-900/20 hover:text-red-500 hover:border-red-500/30 transition-all"
                                    >
                                        Avslå
                                    </button>
                                    <button
                                        onClick={() => handleVote('yes')}
                                        className="flex-[2] h-20 rounded-2xl bg-white text-black font-black text-lg shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:bg-emerald-400 transition-all flex items-center justify-center gap-3"
                                    >
                                        Godkjenn <Icons.Check size={24} />
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-zinc-900/50 rounded-2xl p-6 flex flex-col items-center text-center animate-in zoom-in duration-300 border border-white/5">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex flex-col items-center">
                                            <span className="text-3xl font-black text-emerald-500">{votes.yes}</span>
                                            <span className="text-[9px] uppercase font-bold text-zinc-500">For</span>
                                        </div>
                                        <div className="w-[1px] h-8 bg-zinc-800" />
                                        <div className="flex flex-col items-center">
                                            <span className="text-3xl font-black text-red-500">{votes.no}</span>
                                            <span className="text-[9px] uppercase font-bold text-zinc-500">Mot</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
                                        <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(votes.yes / votes.total) * 100}%` }} />
                                    </div>
                                    <p className="text-xs text-zinc-500">3 av 5 styremedlemmer har stemt</p>
                                </div>
                            )}
                        </div>
                    </AuraCard>
                </div>

                {/* 4. HEALTH MATRIX */}
                <div className="lg:col-span-5 space-y-6">
                    <AuraCard className="p-8 bg-[#0D0D0E] border-white/5">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Bygningsmasse</h3>
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                <Icons.Activity size={14} className="text-emerald-500" />
                                <span className="text-[10px] font-bold text-emerald-500">SNITT: {stats.avgHealth}%</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                                        <Icons.AlertTriangle size={20} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-white block">Kritiske Avvik</span>
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Krever umiddelbar handling</span>
                                    </div>
                                </div>
                                <span className="text-2xl font-black text-white">{stats.criticalCount}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                                        <Icons.TrendingDown size={20} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-white block">Estimert Etterslep</span>
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Akkumulert kostnad</span>
                                    </div>
                                </div>
                                <span className="text-lg font-mono font-bold text-zinc-300">{(stats.backlogCost / 1000).toFixed(0)}k</span>
                            </div>
                        </div>
                    </AuraCard>
                </div>
            </div>
        </div>
    );
};
