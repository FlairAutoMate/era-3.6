
import React, { useState, useEffect } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { Measure, Offer } from '../../types';
import { SlideOver } from '../widgets/SharedWidgets';

interface MeasuresPageProps {
    onNavigate?: (destination: string) => void;
}

const getStatusConfig = (status: Measure['status']) => {
    switch (status) {
        case 'todo':
            return { label: 'Ikke startet', color: 'bg-zinc-500/10 text-zinc-400 border-white/10', icon: Icons.Clock };
        case 'pending_offer':
            return { label: 'Innhenter tilbud', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Icons.Search, pulse: true };
        case 'offer_received':
            return { label: 'Tilbud mottatt', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: Icons.Gift };
        case 'scheduled':
            return { label: 'Planlagt', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: Icons.Calendar };
        case 'done':
            return { label: 'Fullført', color: 'bg-zinc-800 text-zinc-500 border-zinc-700', icon: Icons.CheckCircle };
        default:
            return { label: status, color: 'bg-zinc-500/10 text-zinc-400 border-white/10', icon: Icons.Circle };
    }
};

// --- JOB CARD COMPONENT ---
const JobCard: React.FC<{
    measure: Measure;
    onAction: () => Promise<void>;
    onViewOffer: () => void;
}> = ({ measure, onAction, onViewOffer }) => {

    // UI State for the "Magic" Button
    const [matchState, setMatchState] = useState<'idle' | 'analyzing' | 'matching' | 'sent'>('idle');

    // 1. Determine Strategy (Protect vs Increase)
    const isCritical = measure.tg === 3;
    const isProtect = measure.valueEffect === 'protect' || measure.tg >= 2;

    // 2. Format Cost
    const costEstimate = Math.round((measure.costMin + measure.costMax) / 2);
    const costString = `Ca. ${costEstimate.toLocaleString()} kr`;

    const statusConfig = getStatusConfig(measure.status);
    const StatusIcon = statusConfig.icon;

    const handleMagicClick = async () => {
        if (matchState !== 'idle') return;
        setMatchState('analyzing');
        setTimeout(() => setMatchState('matching'), 800);
        await onAction();
        setMatchState('sent');
        setTimeout(() => setMatchState('idle'), 2000);
    };

    // 3. Status Handling
    const renderCTA = () => {
        switch (measure.status) {
            case 'pending_offer':
                return (
                    <button disabled className="w-full h-14 rounded-xl bg-zinc-800 text-zinc-400 font-medium flex items-center justify-center gap-2 cursor-not-allowed border border-white/5 animate-in fade-in">
                        <Icons.Clock size={18} className="animate-spin-slow" />
                        Venter på svar fra fagperson...
                    </button>
                );
            case 'offer_received':
                return (
                    <button onClick={onViewOffer} className="w-full h-14 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 transition-all shadow-lg flex items-center justify-center gap-2">
                        <Icons.Gift size={20} />
                        Se mottatt tilbud
                    </button>
                );
            case 'scheduled':
                return (
                    <button disabled className="w-full h-14 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 flex items-center justify-center gap-2">
                        <Icons.CheckCircle size={20} />
                        Jobb planlagt
                    </button>
                );
            case 'done':
                 return null;
            default:
                if (matchState === 'analyzing') {
                    return (
                         <button disabled className="w-full h-14 rounded-xl bg-zinc-100 text-black font-bold text-lg transition-all flex items-center justify-center gap-3">
                            <Icons.Sparkles size={20} className="text-purple-600 animate-pulse" />
                            Analyserer oppdrag...
                        </button>
                    );
                }
                if (matchState === 'matching') {
                    return (
                         <button disabled className="w-full h-14 rounded-xl bg-zinc-100 text-black font-bold text-lg transition-all flex items-center justify-center gap-3">
                            <Icons.Search size={20} className="text-blue-600 animate-bounce" />
                            Finner riktig ekspert...
                        </button>
                    );
                }
                if (matchState === 'sent') {
                    return (
                         <button disabled className="w-full h-14 rounded-xl bg-green-500 text-black font-bold text-lg transition-all flex items-center justify-center gap-3">
                            <Icons.Check size={24} className="text-black" />
                            Forespørsel sendt!
                        </button>
                    );
                }
                return (
                    <button
                        onClick={handleMagicClick}
                        className="w-full h-14 rounded-xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        Innhent tilbud <Icons.ArrowRight size={18} />
                    </button>
                );
        }
    };

    return (
        <div className={`bg-[#111214] border rounded-[24px] overflow-hidden relative group transition-all duration-300 ${isCritical ? 'border-red-500/30 shadow-[0_0_30px_-10px_rgba(239,68,68,0.2)]' : 'border-white/5'}`}>

            {/* Top Section */}
            <div className="p-6 border-b border-white/5 bg-gradient-to-r from-zinc-900 to-[#111214]">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isCritical ? 'bg-red-500 text-black border-red-500' : isProtect ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                        {isCritical ? <Icons.AlertTriangle size={24} /> : isProtect ? <Icons.Shield size={24} /> : <Icons.TrendingUp size={24} />}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border shadow-sm ${statusConfig.color}`}>
                            <StatusIcon size={12} className={statusConfig.pulse ? 'animate-pulse' : ''} />
                            {statusConfig.label}
                        </div>
                        <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border ${isCritical ? 'bg-red-500 text-white border-red-500' : isProtect ? 'bg-red-950/30 text-red-400 border-red-500/20' : 'bg-emerald-950/30 text-emerald-400 border-emerald-500/20'}`}>
                            {isCritical ? 'Kritisk (TG3)' : isProtect ? 'Beskytt verdi' : 'Øk verdi'}
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                    {measure.title}
                </h2>
            </div>

            {/* Middle Section */}
            <div className="p-6 space-y-6">
                <div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Hvorfor gjøre dette?</span>
                    <p className="text-zinc-300 text-base leading-relaxed">
                        {measure.why || measure.description || "Dette tiltaket anbefales for å opprettholde boligens standard."}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <span className="text-xs font-bold text-zinc-500 uppercase block mb-1">Estimert kostnad</span>
                        <span className="text-lg font-mono font-bold text-white">{costString}</span>
                    </div>
                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <span className="text-xs font-bold text-zinc-500 uppercase block mb-1">Område</span>
                        <span className="text-lg font-medium text-white flex items-center gap-2">
                            <Icons.MapPin size={16} className="text-zinc-400"/>
                            {measure.location}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="p-4 pt-0">
                {renderCTA()}
                {measure.status === 'todo' && matchState === 'idle' && (
                    <p className="text-center text-[8px] text-zinc-700 mt-4 uppercase tracking-widest font-black leading-relaxed">
                        <strong>UTFØRELSESANSVAR:</strong> Avtale inngås direkte mellom eier og fagaktør. Fagaktøren er alene ansvarlig for utførelse, kvalitet og garanti.
                    </p>
                )}
            </div>
        </div>
    );
}


export const MeasuresPage: React.FC<MeasuresPageProps> = ({ onNavigate }) => {
  const { measures, requestOffer, offers, respondToOffer, openAgent } = useAppStore();
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const [criticalIndex, setCriticalIndex] = useState(0);

  // Filter Active Jobs
  const activeMeasures = measures.filter(m => m.status !== 'done');

  // Split into Critical (TG3) and Normal (TG0-2)
  const criticalMeasures = activeMeasures.filter(m => m.tg === 3);
  const normalMeasures = activeMeasures.filter(m => m.tg !== 3);

  // Handlers
  const handleSendToPro = async (measure: Measure) => {
      await requestOffer(measure, measure.description || '');
  };

  const handleViewOffer = (measureId: number) => {
      const offer = offers.find(o => o.measureId === measureId);
      if (offer) setActiveOffer(offer);
  };

  const handleOfferResponse = (accepted: boolean) => {
      if (activeOffer) {
          respondToOffer(activeOffer.id, accepted);
          setActiveOffer(null);
      }
  };

  // Carousel Navigation
  const nextCritical = () => setCriticalIndex((prev) => (prev + 1) % criticalMeasures.length);
  const prevCritical = () => setCriticalIndex((prev) => (prev - 1 + criticalMeasures.length) % criticalMeasures.length);

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto w-full min-h-screen pb-32 font-sans">

      {/* Header */}
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 font-display">Dine Jobber</h1>
          <p className="text-zinc-400">
              Vi har identifisert <strong className="text-white">{activeMeasures.length}</strong> tiltak som bør utføres.
          </p>
      </div>

      <div className="space-y-12">

          {/* SECTION 1: CRITICAL (CAROUSEL) */}
          {criticalMeasures.length > 0 && (
              <div className="relative">
                  <div className="flex items-center gap-2 mb-4 animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider">
                          {criticalMeasures.length} Kritiske tiltak kreves
                      </h3>
                  </div>

                  <div className="relative">
                      {/* Active Card */}
                      <div className="animate-in slide-in-from-right-4 fade-in duration-300" key={criticalMeasures[criticalIndex].id}>
                          <JobCard
                            measure={criticalMeasures[criticalIndex]}
                            onAction={() => handleSendToPro(criticalMeasures[criticalIndex])}
                            onViewOffer={() => handleViewOffer(criticalMeasures[criticalIndex].id)}
                          />
                      </div>

                      {/* Carousel Controls (Only if > 1) */}
                      {criticalMeasures.length > 1 && (
                          <div className="flex items-center justify-between mt-4 px-2 select-none">
                              <button
                                onClick={prevCritical}
                                className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors border border-white/10 text-white"
                              >
                                  <Icons.ArrowLeft size={20} />
                              </button>

                              <div className="flex gap-2">
                                  {criticalMeasures.map((_, idx) => (
                                      <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === criticalIndex ? 'bg-red-500 w-4' : 'bg-zinc-800'}`}
                                      />
                                  ))}
                              </div>

                              <button
                                onClick={nextCritical}
                                className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors border border-white/10 text-white"
                              >
                                  <Icons.ArrowRight size={20} />
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          )}

          {/* SECTION 2: NORMAL MEASURES (LIST) */}
          {normalMeasures.length > 0 && (
              <div>
                  {criticalMeasures.length > 0 && (
                      <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-6 border-t border-white/5 pt-8 font-display">
                          Andre anbefalinger ({normalMeasures.length})
                      </h3>
                  )}
                  <div className="space-y-8">
                      {normalMeasures.map(measure => (
                          <JobCard
                            key={measure.id}
                            measure={measure}
                            onAction={() => handleSendToPro(measure)}
                            onViewOffer={() => handleViewOffer(measure.id)}
                          />
                      ))}
                  </div>
              </div>
          )}

          {/* EMPTY STATE */}
          {activeMeasures.length === 0 && (
              <div className="text-center py-20 text-zinc-500 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
                  <Icons.CheckCircle size={48} className="mx-auto mb-4 text-emerald-500 opacity-50" />
                  <p className="text-lg font-medium text-white">Alt er på stell</p>
                  <p className="text-sm">Ingen åpne jobber akkurat nå.</p>
              </div>
          )}

      </div>

      {/* OFFER SLIDEOVER (Reused) */}
      <SlideOver isOpen={!!activeOffer} onClose={() => setActiveOffer(null)} title="Mottatt Tilbud">
          {activeOffer && (
              <div className="flex flex-col h-full pb-20 font-sans">
                  <div className="space-y-6 flex-1">
                      {/* Company Header */}
                      <div className="flex items-center justify-between p-4 bg-zinc-900 border border-white/5 rounded-xl">
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white text-black flex items-center justify-center rounded-lg font-bold text-lg">
                                  {activeOffer.companyName.charAt(0)}
                              </div>
                              <div>
                                  <h4 className="font-bold text-white">{activeOffer.companyName}</h4>
                                  <p className="text-xs text-zinc-500">Sertifisert Mesterbedrift</p>
                              </div>
                          </div>
                          <button
                            onClick={() => openAgent({ type: 'offer', data: activeOffer })}
                            className="p-2 bg-indigo-900/20 text-indigo-400 rounded-full hover:bg-indigo-900/40 border border-indigo-500/20 transition-colors"
                          >
                              <Icons.Sparkles size={18} />
                          </button>
                      </div>

                      <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10 text-[10px] text-amber-200/60 font-black uppercase tracking-widest leading-relaxed">
                        <strong>UTFØRELSESANSVAR:</strong> Avtale om utførelse inngås direkte mellom deg og fagaktør. Fagaktøren er alene ansvarlig for kvalitet, garanti og reklamasjon.
                      </div>

                      {/* Offer Details */}
                      <div>
                          <h3 className="text-3xl font-bold text-white mb-1 font-display">{activeOffer.price.toLocaleString()},-</h3>
                          <p className="text-sm text-zinc-500">Fastpris inkludert mva og materiell</p>
                      </div>

                      <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                          {activeOffer.description}
                      </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-4 mt-8 sticky bottom-0 bg-[#0B0C0D] pt-4 border-t border-white/5">
                      <button
                          onClick={() => handleOfferResponse(false)}
                          className="h-16 rounded-xl font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                      >
                          Avslå
                      </button>
                      <button
                          onClick={() => handleOfferResponse(true)}
                          className="h-16 bg-white text-black rounded-xl font-bold text-lg hover:bg-zinc-200 transition-colors shadow-lg flex items-center justify-center gap-2"
                      >
                          <Icons.Check size={20} /> Iverksett
                      </button>
                  </div>
              </div>
          )}
      </SlideOver>

    </div>
  );
};
