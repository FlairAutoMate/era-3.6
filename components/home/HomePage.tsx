
import React, { useMemo } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { UserRole } from '../../types';
import { AuraCard, PrimaryButton } from '../widgets/SharedWidgets';
import { TGStatusWidget } from '../widgets/TGStatusWidget';

export const HomePage: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const { jobs, userRole, updateJobStatus, getHealthScore } = useAppStore();

  const recommendedJob = useMemo(() => {
    return jobs
      .filter(j => j.status === 'recommended')
      .sort((a, b) => (b.priorityScore || 0) > (a.priorityScore || 0) ? 1 : -1)[0];
  }, [jobs]);

  if (userRole === UserRole.PROFESSIONAL) return <ProInbox onNavigate={onNavigate} />;

  return (
    <div className="max-w-lg mx-auto w-full px-6 pt-12 pb-32 animate-era-in">
      <header className="mb-10 text-center">
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-3 block">Beregnet Eiendomsverdi</span>
        <h1 className="text-5xl font-bold text-white tracking-tighter">12.5 MNOK</h1>
        <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Status: Optimal</span>
        </div>
      </header>

      <div className="mb-10">
        <TGStatusWidget
          score={getHealthScore()}
          tg3Count={jobs.filter(j => j.risk_level === 'critical' && j.status !== 'completed').length}
          tg2Count={jobs.filter(j => j.risk_level === 'moderate' && j.status !== 'completed').length}
        />
      </div>

      <section className="space-y-6">
        {recommendedJob ? (
          <AuraCard highlight className="relative overflow-hidden border-white/10">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] rotate-12 pointer-events-none">
                <Icons.Sparkles size={140} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                    <Icons.ShieldCheck size={14} className="text-zinc-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Systemanbefaling</span>
                </div>

                <h2 className="text-3xl font-bold text-white mb-3 tracking-tight leading-tight">{recommendedJob.tittel}</h2>
                <p className="text-zinc-400 text-lg leading-relaxed mb-10">{recommendedJob.beskrivelse}</p>

                <div className="grid grid-cols-2 gap-3 mb-10">
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                        <span className="text-[9px] font-black text-zinc-600 uppercase block mb-1">Investering</span>
                        <span className="text-xl font-mono font-bold text-white">{recommendedJob.estimert_kost.toLocaleString()},-</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                        <span className="text-[9px] font-black text-zinc-600 uppercase block mb-1">System-score</span>
                        <span className={`text-xl font-mono font-bold ${recommendedJob.risk_level === 'critical' ? 'text-red-500' : 'text-amber-500'}`}>
                            {recommendedJob.priorityScore}/100
                        </span>
                    </div>
                </div>

                <div className="mb-8 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Tidsfrist for verdisikring</span>
                        <span className="text-[10px] font-mono text-zinc-400">{recommendedJob.predictedFailureDate}</span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500/40 w-2/3" />
                    </div>
                </div>

                <PrimaryButton onClick={() => updateJobStatus(recommendedJob.id, 'sent')}>
                    Godkjenn Tiltak <Icons.ArrowRight size={18} />
                </PrimaryButton>
            </div>
          </AuraCard>
        ) : (
          <div className="text-center py-20 border border-dashed border-white/5 rounded-[32px]">
             <Icons.CheckCircle className="text-zinc-800 mx-auto mb-4" size={48} />
             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Ingen utestående tiltak</p>
          </div>
        )}
      </section>
    </div>
  );
};

const ProInbox = ({ onNavigate }: any) => {
  const { jobs, updateJobStatus } = useAppStore();

  // Available jobs for Mesterfarge partners
  const availableJobs = jobs.filter(j => j.status === 'sent');
  const myJobs = jobs.filter(j => ['accepted', 'in_progress'].includes(j.status));

  return (
    <div className="max-w-lg mx-auto w-full px-6 pt-12 pb-32 animate-era-in">
      <header className="mb-10">
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500 block mb-2">Mesterfarge Partner</span>
        <h1 className="text-4xl font-bold text-white tracking-tighter">Oppdrag</h1>
      </header>

      {myJobs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Mine aktive</h2>
            <div className="space-y-4">
                {myJobs.map(job => (
                    <AuraCard key={job.id} className="p-6 border-white/10" onClick={() => onNavigate('jobs')}>
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                {job.status === 'in_progress' ? 'Pågår' : 'Akseptert'}
                            </span>
                            <span className="text-white font-mono text-sm">{job.estimert_kost.toLocaleString()},-</span>
                        </div>
                        <h3 className="text-xl font-bold text-white truncate">{job.tittel}</h3>
                    </AuraCard>
                ))}
            </div>
          </div>
      )}

      <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Tilgjengelige innboks</h2>
      <div className="space-y-4">
        {availableJobs.map(job => (
          <AuraCard key={job.id} className="p-0 overflow-hidden border-white/5 hover:border-blue-500/30">
            {job.before_images[0] && (
                <div className="h-44 w-full relative">
                    <img src={job.before_images[0]} className="w-full h-full object-cover grayscale-[0.3]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                    <div className="absolute bottom-4 left-6">
                        <span className="text-white font-mono font-bold text-xl">{job.estimert_kost.toLocaleString()},-</span>
                    </div>
                </div>
            )}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white leading-tight">Oppdrag: {job.tittel}</h3>
                    <div className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-400 uppercase">
                        Kvalifisert
                    </div>
                </div>
                <p className="text-zinc-500 text-sm mb-8 line-clamp-2">{job.beskrivelse}</p>
                <PrimaryButton onClick={() => updateJobStatus(job.id, 'accepted')}>
                    Aksepter Oppdrag
                </PrimaryButton>
            </div>
          </AuraCard>
        ))}
        {availableJobs.length === 0 && myJobs.length === 0 && (
            <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-[32px]">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Søker etter nye oppdrag...</p>
            </div>
        )}
      </div>
    </div>
  );
};
