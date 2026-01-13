
import React, { useState, useMemo } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { PageHeader, AuraCard } from '../widgets/SharedWidgets';
import { TG_COLORS } from '../../constants';

type JobFilter = 'new' | 'active' | 'waiting';

export const ProJobsPage: React.FC<{ onNavigate: (v: string, jobId?: string) => void }> = ({ onNavigate }) => {
    const { jobs } = useAppStore();
    const [filter, setFilter] = useState<JobFilter>('new');

    const filteredJobs = useMemo(() => {
        if (filter === 'new') return jobs.filter(j => j.status === 'sent');
        if (filter === 'active') return jobs.filter(j => ['accepted', 'in_progress'].includes(j.status));
        if (filter === 'waiting') return jobs.filter(j => j.status === 'quoted');
        return jobs;
    }, [jobs, filter]);

    return (
        <div className="flex flex-col gap-8 animate-era-in">
            <PageHeader
                title="Jobber"
                description="Administrer ordreflyt og operativ status på tvers av porteføljen."
            />

            <div className="flex bg-[#121214] p-1.5 rounded-[24px] border border-white/5 w-fit">
                <button onClick={() => setFilter('new')} className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'new' ? 'bg-white text-black shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}>Nye</button>
                <button onClick={() => setFilter('active')} className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'active' ? 'bg-white text-black shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}>Pågår</button>
                <button onClick={() => setFilter('waiting')} className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'waiting' ? 'bg-white text-black shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}>Venter kunde</button>
            </div>

            <div className="space-y-4">
                {filteredJobs.map(job => (
                    <button
                        key={job.id}
                        onClick={() => {
                            if (job.status === 'sent') onNavigate('pro-quote-edit', job.id);
                            else onNavigate('pro-project-detail', job.id);
                        }}
                        className="w-full text-left"
                    >
                        <AuraCard className="p-8 bg-[#0A0A0B] border-white/5 hover:border-white/10 transition-all flex items-center justify-between group hover:bg-[#0D0D0E]">
                            <div className="flex items-center gap-8">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xs ${TG_COLORS[job.tg_score as keyof typeof TG_COLORS] || 'bg-zinc-800'}`}>
                                    TG {job.tg_score ?? '?'}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white tracking-tight leading-none mb-1.5 group-hover:text-indigo-400 transition-colors">{job.adresse.split(',')[0]}</h4>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{job.tittel}</span>
                                        <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                        <span className="text-[10px] font-mono font-bold text-indigo-400">{(job.estimert_kost / 1000).toFixed(0)}k NOK</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">{job.status === 'sent' ? 'NY' : 'OPERATIV'}</span>
                                <Icons.ChevronRight className="text-zinc-800 group-hover:text-white transition-all" size={20} />
                            </div>
                        </AuraCard>
                    </button>
                ))}
            </div>
        </div>
    );
};
