
import React, { useState } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { PageHeader, AuraCard, PrimaryButton } from '../widgets/SharedWidgets';
import { FDVEvent } from '../../types';
import { FDVWizard } from './FDVWizard';

export const FDVPage: React.FC = () => {
    const { fdvEvents, openAgent } = useAppStore();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleRunAnalysis = () => {
        openAgent({ type: 'fdv_analysis', data: fdvEvents });
    };

    const groupedEvents = fdvEvents.reduce((acc, event) => {
        const year = event.date.split('.')[2] || new Date().getFullYear().toString();
        if (!acc[year]) acc[year] = [];
        acc[year].push(event);
        return acc;
    }, {} as Record<string, FDVEvent[]>);

    const sortedYears = Object.keys(groupedEvents).sort((a, b) => Number(b) - Number(a));

    return (
        <div className="max-w-3xl mx-auto w-full animate-era-in pb-40">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-ios-tighter font-display leading-[0.9] mb-4">
                        Eiendomslogg
                    </h1>
                    <p className="text-zinc-400 text-lg font-medium max-w-xl leading-relaxed">
                        Verifisert historikk og teknisk DNA for din bolig.
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={handleRunAnalysis}
                        className="flex-1 md:flex-none h-14 px-6 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-indigo-500 shadow-lg shadow-indigo-900/20 transition-all active:scale-95 group"
                    >
                        <Icons.Sparkles size={16} className="group-hover:rotate-12 transition-transform" /> Diagnose
                    </button>
                    <button
                        onClick={() => setIsWizardOpen(true)}
                        className="flex-1 md:flex-none h-14 px-6 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95"
                    >
                        <Icons.PlusCircle size={16} /> Ny oppføring
                    </button>
                </div>
            </div>

            <div className="relative">
                {/* Neural Spine Line */}
                <div className="absolute left-[28px] top-4 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500 via-white/10 to-transparent" />

                {sortedYears.map(year => (
                    <div key={year} className="mb-12 relative">
                        {/* Year Marker */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-full bg-[#0A0A0B] border border-white/10 flex items-center justify-center z-10 shadow-xl relative group">
                                <span className="text-xs font-black text-white">{year}</span>
                                <div className="absolute inset-0 border border-indigo-500/30 rounded-full animate-pulse-soft" />
                            </div>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                        </div>

                        <div className="space-y-6 pl-20 relative">
                            {/* Horizontal Connector to Spine */}
                            <div className="absolute left-[29px] top-0 bottom-0 w-[1px] bg-transparent" />

                            {groupedEvents[year].map((event, idx) => {
                                const isExpanded = expandedId === event.id;
                                const isValueAdd = event.category === 'upgrade' || (event.cost && event.cost > 20000);

                                return (
                                    <div key={event.id} className="relative group">
                                        {/* Node Connector */}
                                        <div className="absolute -left-[52px] top-8 w-8 h-[1px] bg-white/10 group-hover:bg-indigo-500/50 transition-colors" />
                                        <div className={`absolute -left-[56px] top-[29px] w-2 h-2 rounded-full border border-[#050505] transition-all ${isExpanded ? 'bg-indigo-500 scale-125' : 'bg-zinc-600'}`} />

                                        <div
                                            onClick={() => toggleExpand(event.id)}
                                            className={`
                                                relative overflow-hidden rounded-[24px] border transition-all duration-500 cursor-pointer
                                                ${isExpanded ? 'bg-[#0A0A0B] border-indigo-500/30 shadow-[0_20px_60px_-10px_rgba(99,102,241,0.1)]' : 'bg-[#0A0A0B] border-white/5 hover:border-white/10 hover:bg-[#0E0E10]'}
                                            `}
                                        >
                                            <div className="p-6 flex items-start gap-5 relative z-10">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-colors ${isValueAdd ? 'bg-emerald-900/10 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-white/5 text-zinc-500'}`}>
                                                    {event.category === 'upgrade' ? <Icons.TrendingUp size={20} /> : <Icons.Wrench size={20} />}
                                                </div>

                                                <div className="flex-1 min-w-0 pt-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className={`text-base font-bold transition-colors ${isExpanded ? 'text-white' : 'text-zinc-200'}`}>{event.title}</h4>
                                                        <span className="text-[10px] font-mono text-zinc-500">{event.date}</span>
                                                    </div>
                                                    <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{event.description}</p>

                                                    {isValueAdd && (
                                                        <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                                                            <Icons.Sparkles size={10} className="text-emerald-500" />
                                                            <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">Verdiøkende</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={`transition-transform duration-500 ${isExpanded ? 'rotate-90' : ''}`}>
                                                    <Icons.ChevronRight size={16} className="text-zinc-700" />
                                                </div>
                                            </div>

                                            {/* Expanded Content */}
                                            {isExpanded && (
                                                <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 fade-in duration-300">
                                                    <div className="h-[1px] w-full bg-white/5 mb-6" />

                                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                                        <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                                            <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest block mb-1">Utført av</span>
                                                            <span className="text-sm font-bold text-white flex items-center gap-2">
                                                                <Icons.BadgeCheck size={14} className="text-indigo-400" /> {event.performedBy || 'Ukjent'}
                                                            </span>
                                                        </div>
                                                        <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                                            <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest block mb-1">Kostnad</span>
                                                            <span className="text-sm font-bold text-white font-mono">{event.cost?.toLocaleString()},-</span>
                                                        </div>
                                                    </div>

                                                    <p className="text-sm text-zinc-400 leading-relaxed mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
                                                        {event.description}
                                                    </p>

                                                    <div className="flex gap-3">
                                                        {event.fileUrl && (
                                                            <button className="flex-1 h-12 bg-indigo-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-500 transition-colors">
                                                                <Icons.Eye size={16} /> Vis Dokumentasjon
                                                            </button>
                                                        )}
                                                        <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10">
                                                            <Icons.Share size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <FDVWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
        </div>
    );
};
