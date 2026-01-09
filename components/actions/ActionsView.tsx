
import React, { useMemo, useState } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { AuraCard, PageHeader, PrimaryButton } from '../widgets/SharedWidgets';

export const ActionsView: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const { jobs, getEstimatedValue } = useAppStore();
  const valueData = getEstimatedValue();
  const recommendedJobs = useMemo(() => jobs.filter(j => j.status === 'recommended'), [jobs]);
  const primaryJob = recommendedJobs[0];

  // Simulator State
  const [delayYears, setDelayYears] = useState(0);
  const costIncreaseFactor = 1.15; // 15% yearly increase due to damage/inflation
  const projectedCost = Math.round(valueData.debt * Math.pow(costIncreaseFactor, delayYears));
  const diff = projectedCost - valueData.debt;

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-era-in pb-32">
      <PageHeader
        title="Verdiplan"
        description="Strategiske tiltak som gir størst verdisikring for din eiendom."
        action={{ label: "Be om rådgivning", onClick: () => {}, icon: Icons.MessageSquare }}
      />

      {/* HERO / KEY METRIC */}
      <section>
        <AuraCard className="p-14 md:p-16 bg-indigo-600/[0.03] border-indigo-500/20 relative overflow-hidden flex flex-col items-center text-center">
            <div className="relative z-10 space-y-4">
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-400 block">Uforløst Verdigap</span>
                <div className="text-8xl md:text-[120px] font-black text-white tracking-tighter leading-none font-display">
                    {Math.round(valueData.debt/1000)}k
                </div>
                <p className="text-zinc-500 text-lg font-medium max-w-sm">Estimert verdiøkning ved fullførelse av prioriterte tiltak.</p>
            </div>
            <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
        </AuraCard>
      </section>

      {/* LOSS AVERSION SIMULATOR */}
      <section>
          <AuraCard className="p-8 bg-[#0D0D0E] border-white/5">
              <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Icons.TrendingUp size={20} />
                  </div>
                  <div>
                      <h3 className="text-sm font-bold text-white">Kostnad ved utsettelse</h3>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Simuler prisutvikling ved skadeutvikling</p>
                  </div>
              </div>

              <div className="space-y-8">
                  <div className="relative pt-6 pb-2 px-2">
                      <input
                          type="range"
                          min="0"
                          max="5"
                          step="1"
                          value={delayYears}
                          onChange={(e) => setDelayYears(Number(e.target.value))}
                          className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                      <div className="flex justify-between mt-4 text-xs font-bold text-zinc-500">
                          <span>I dag</span>
                          <span>1 år</span>
                          <span>2 år</span>
                          <span>3 år</span>
                          <span>4 år</span>
                          <span>5 år</span>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
                          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Estimert kostnad</span>
                          <div className="text-2xl font-mono font-bold text-white mt-1">
                              {(projectedCost / 1000).toFixed(0)}k
                          </div>
                      </div>
                      <div className="p-4 bg-red-900/10 rounded-2xl border border-red-500/20">
                          <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">Ekstra kostnad</span>
                          <div className="text-2xl font-mono font-bold text-red-500 mt-1">
                              +{(diff / 1000).toFixed(0)}k
                          </div>
                      </div>
                  </div>

                  {delayYears > 0 && (
                      <p className="text-center text-xs text-zinc-400 font-medium leading-relaxed">
                          Ved å vente {delayYears} år, risikerer du at følgeskader øker kostnaden med <span className="text-white font-bold">{Math.round((diff / valueData.debt) * 100)}%</span>.
                      </p>
                  )}
              </div>
          </AuraCard>
      </section>

      {/* ACTION CARDS */}
      <section className="grid grid-cols-1 gap-6">
        {primaryJob && (
          <AuraCard highlight className="p-12 md:p-16 bg-[#0A0A0B] border-white/10 shadow-2xl relative overflow-hidden">
             <div className="flex flex-col md:flex-row justify-between items-center gap-16 relative z-10">
                <div className="flex-1 space-y-10">
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                        <Icons.AlertTriangle size={14} /> Kritisk behov identifisert
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                        {primaryJob.tittel}
                    </h2>
                    <p className="text-zinc-500 text-lg leading-relaxed font-medium">
                        {primaryJob.beskrivelse}
                    </p>
                  </div>

                  <PrimaryButton onClick={() => onNavigate('jobs')} variant="white" className="w-full h-16 rounded-2xl shadow-xl">
                    Iverksett tiltak nå <Icons.ArrowRight size={18} />
                  </PrimaryButton>
                </div>

                <div className="w-full md:w-[320px] aspect-square rounded-[40px] overflow-hidden border border-white/10 shrink-0 relative shadow-2xl">
                  <img src={primaryJob.before_images[0]} className="w-full h-full object-cover grayscale opacity-40 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
             </div>
          </AuraCard>
        )}
      </section>

      {/* SECONDARY LISTINGS */}
      <section className="space-y-4 pt-12 border-t border-white/5">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800 px-2">Identifiserte Oppgraderinger</h3>
        <div className="space-y-4">
            {recommendedJobs.slice(1).map(job => (
              <button
                key={job.id}
                onClick={() => onNavigate('jobs')}
                className="w-full p-8 bg-[#0A0A0B] border border-white/5 rounded-[32px] flex items-center justify-between group hover:border-white/15 transition-all text-left"
              >
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-600 border border-white/5">
                        <Icons.Zap size={24} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white tracking-tight leading-none mb-1">{job.tittel}</h4>
                        <p className="text-xs text-zinc-600 font-medium">Forbedring av komfort og verdiøkning.</p>
                    </div>
                 </div>
                 <Icons.ChevronRight className="text-zinc-800 group-hover:text-white transition-all" size={24} />
              </button>
            ))}
        </div>
      </section>
    </div>
  );
};
