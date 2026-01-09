
import React from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';

export const ProPage: React.FC = () => {
    const { jobs, updateJobStatus } = useAppStore();

    const available = jobs.filter(j => j.status === 'sent');
    const myJobs = jobs.filter(j => ['accepted', 'in_progress'].includes(j.status));

    return (
        <div className="min-h-screen bg-era-bg p-6 max-w-4xl mx-auto w-full pt-12 pb-32">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Oppdragsoversikt</h1>
                <p className="text-zinc-500 text-sm">Administrer aktive prosjekter og innboks.</p>
            </header>

            <div className="grid grid-cols-1 gap-12">
                {/* Active Projects */}
                {myJobs.length > 0 && (
                    <section className="space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Aktive Prosjekter</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {myJobs.map(job => (
                                <div key={job.id} className="bg-era-surface border border-white/10 rounded-[32px] p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase text-white ${job.status === 'in_progress' ? 'bg-emerald-600 animate-pulse' : 'bg-blue-600'}`}>
                                            {job.status === 'in_progress' ? 'Arbeid pågår' : 'Tildelt'}
                                        </span>
                                        <span className="text-white font-mono font-bold">{job.estimert_kost.toLocaleString()},-</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{job.tittel}</h3>
                                    <p className="text-sm text-zinc-500 mb-8 line-clamp-2">{job.beskrivelse}</p>
                                    <div className="flex gap-3">
                                        {job.status === 'accepted' ? (
                                            <button onClick={() => updateJobStatus(job.id, 'in_progress')} className="flex-1 h-14 bg-white text-black rounded-xl font-bold">Start Arbeid</button>
                                        ) : (
                                            <button onClick={() => updateJobStatus(job.id, 'completed')} className="flex-1 h-14 bg-emerald-600 text-white rounded-xl font-bold">Fullfør & Dokumenter</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* New Leads */}
                <section className="space-y-6">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-blue-500">Nye Forespørsler</h2>
                    {available.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {available.map(job => (
                                <div key={job.id} className="bg-era-surface border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all">
                                    <div className="flex justify-between mb-4">
                                        <span className="text-white font-bold">{job.estimert_kost.toLocaleString()},-</span>
                                        <span className={`text-[10px] font-black uppercase ${job.risk_level === 'critical' ? 'text-red-500' : 'text-amber-500'}`}>{job.risk_level}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 truncate">{job.tittel}</h3>
                                    <p className="text-xs text-zinc-500 mb-6 line-clamp-2">{job.adresse}</p>
                                    <button onClick={() => updateJobStatus(job.id, 'accepted')} className="w-full py-3 bg-white text-black rounded-xl font-bold text-xs hover:bg-zinc-200 transition-all">Aksepter</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-zinc-600 text-sm italic py-10">Ingen nye oppdrag tilgjengelig akkurat nå.</p>
                    )}
                </section>
            </div>
        </div>
    );
};
