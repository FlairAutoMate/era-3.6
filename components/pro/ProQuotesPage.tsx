
import React from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';

export const ProQuotesPage: React.FC = () => {
    const { jobs } = useAppStore();

    // AI Mock Logic for Win Probability
    const getWinProbability = (cost: number) => {
        if (cost < 50000) return { score: 85, label: 'Høy', color: 'text-emerald-500', bar: 'bg-emerald-500' };
        if (cost < 150000) return { score: 62, label: 'Medium', color: 'text-amber-500', bar: 'bg-amber-500' };
        return { score: 40, label: 'Lav', color: 'text-red-500', bar: 'bg-red-500' };
    };

    const columns = [
      { id: 'draft', label: 'Nye Leads', jobs: jobs.filter(j => j.status === 'sent') },
      { id: 'sent', label: 'Tilbud Sendt', jobs: jobs.filter(j => j.status === 'quoted') },
      { id: 'done', label: 'Avgjort', jobs: jobs.filter(j => ['accepted', 'declined'].includes(j.status)) }
    ];

    return (
        <div className="h-full flex flex-col animate-era-in">
            <div className="flex gap-6 h-full overflow-x-auto no-scrollbar pb-10">
                {columns.map(col => (
                    <div key={col.id} className="flex-1 min-w-[340px] flex flex-col gap-4">
                        <div className="px-2 mb-4 flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">{col.label}</span>
                            <span className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{col.jobs.length}</span>
                        </div>

                        <div className="flex-1 space-y-4">
                            {col.jobs.map(job => {
                                const winProb = getWinProbability(job.estimert_kost);

                                return (
                                    <div key={job.id} className="bg-[#0A0A0B] border border-white/5 p-6 rounded-[24px] space-y-6 group hover:border-indigo-500/30 transition-all shadow-xl relative overflow-hidden">

                                        {/* Status Header */}
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-sm font-bold text-white truncate mb-1">{job.adresse.split(',')[0]}</h4>
                                                <p className="text-[10px] text-zinc-500 font-medium truncate uppercase tracking-widest">{job.tittel}</p>
                                            </div>
                                            {col.id === 'draft' && (
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                    <Icons.Sparkles size={14} />
                                                </div>
                                            )}
                                        </div>

                                        {/* AI Insights Section */}
                                        {col.id !== 'done' && (
                                            <div className="bg-zinc-900/40 p-4 rounded-xl border border-white/5 space-y-3">
                                                <div className="flex justify-between items-end">
                                                    <div className="flex items-center gap-2 text-zinc-500">
                                                        <Icons.Target size={12} />
                                                        <span className="text-[9px] font-bold uppercase tracking-wider">AI Win Chance</span>
                                                    </div>
                                                    <span className={`text-xs font-black ${winProb.color}`}>{winProb.score}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                                                    <div className={`h-full ${winProb.bar} rounded-full`} style={{ width: `${winProb.score}%` }} />
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-4 border-t border-white/[0.03] flex justify-between items-end">
                                            <div>
                                                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Verdi</span>
                                                <span className="text-lg font-mono font-bold text-white tracking-tight">{(job.estimert_kost / 1000).toFixed(0)}k</span>
                                            </div>

                                            {col.id === 'draft' ? (
                                                <button className="h-10 px-4 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-2">
                                                    <Icons.Calculator size={14} /> Beregn
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-zinc-500">
                                                    <Icons.Timer size={14} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Venter</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {col.jobs.length === 0 && (
                                <div className="h-32 border border-dashed border-white/5 rounded-[24px] flex flex-col items-center justify-center text-zinc-700 gap-2">
                                    <Icons.Inbox size={24} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Tomt</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
