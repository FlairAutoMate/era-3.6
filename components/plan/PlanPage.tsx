
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { UserRole } from '../../types';
import { SlideOver, AuraCard } from '../widgets/SharedWidgets';
import { generateSmartTasks, calculateBuildingRisk } from '../../lib/utils';

const MONTHS = [
    { name: 'JAN', full: 'Januar', season: 'winter' },
    { name: 'FEB', full: 'Februar', season: 'winter' },
    { name: 'MAR', full: 'Mars', season: 'spring' },
    { name: 'APR', full: 'April', season: 'spring' },
    { name: 'MAI', full: 'Mai', season: 'spring' },
    { name: 'JUN', full: 'Juni', season: 'summer' },
    { name: 'JUL', full: 'Juli', season: 'summer' },
    { name: 'AUG', full: 'August', season: 'summer' },
    { name: 'SEP', full: 'September', season: 'autumn' },
    { name: 'OKT', full: 'Oktober', season: 'autumn' },
    { name: 'NOV', full: 'November', season: 'autumn' },
    { name: 'DES', full: 'Desember', season: 'winter' },
];

export const PlanPage = () => {
  const { getCalendarEvents, matrikkel, loadWeather, weatherForecast, fdvEvents, rooms } = useAppStore();

  const [viewMode, setViewMode] = useState<'timeline' | 'grid' | 'warranty'>('timeline');
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  useEffect(() => {
    if (viewMode === 'timeline' && scrollContainerRef.current) {
        const currentMonth = new Date().getMonth();
        const cardWidth = 320;
        const containerWidth = scrollContainerRef.current.clientWidth;
        scrollContainerRef.current.scrollLeft = (currentMonth * (cardWidth + 24)) - (containerWidth / 2) + (cardWidth / 2);
    }
  }, [viewMode]);

  const baseEvents = getCalendarEvents(UserRole.HOMEOWNER);
  const smartTasks = generateSmartTasks(rooms, matrikkel);
  const events = [...baseEvents, ...smartTasks].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const riskData = calculateBuildingRisk(weatherForecast, rooms);

  const warranties = fdvEvents.filter(e => e.warrantyDate).map(e => ({
      id: e.id,
      title: e.title,
      expiry: e.warrantyDate,
      supplier: e.performedBy || 'ERA Partner',
      daysLeft: Math.ceil((new Date(e.warrantyDate!).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
  })).sort((a, b) => a.daysLeft - b.daysLeft);

  const getEventsForMonth = (monthIndex: number) => {
      return events.filter(e => new Date(e.date).getMonth() === monthIndex);
  };

  const getSeasonColor = (season: string) => {
      switch(season) {
          case 'winter': return 'from-indigo-950/40 to-[#0A0A0B] border-indigo-500/20';
          case 'spring': return 'from-emerald-950/40 to-[#0A0A0B] border-emerald-500/20';
          case 'summer': return 'from-amber-950/40 to-[#0A0A0B] border-amber-500/20';
          case 'autumn': return 'from-red-950/40 to-[#0A0A0B] border-red-500/20';
          default: return 'from-zinc-900 to-black';
      }
  };

  return (
    <div className="min-h-screen flex flex-col pb-48 bg-[#030303] font-sans">
      <div className="px-6 md:px-10 pt-12 max-w-[1600px] mx-auto w-full space-y-12">

         <header className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div>
                <div className="flex items-center gap-2.5 mb-4">
                    <Icons.Calendar className="text-indigo-500" size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Vedlikeholds-OS</span>
                </div>
                <h2 className="text-5xl font-bold text-white tracking-ios-tighter leading-none">
                    Planlegging <span className="text-zinc-800">2026.</span>
                </h2>
            </div>

            <div className="flex bg-[#121214] p-1.5 rounded-[24px] border border-white/5 shadow-2xl">
                <button onClick={() => setViewMode('timeline')} className={`px-7 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest flex items-center gap-2.5 transition-all active:scale-95 ${viewMode === 'timeline' ? 'bg-white text-black shadow-lg' : 'text-zinc-600 hover:text-zinc-300'}`}><Icons.List size={16} /> Tidslinje</button>
                <button onClick={() => setViewMode('warranty')} className={`px-7 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest flex items-center gap-2.5 transition-all active:scale-95 ${viewMode === 'warranty' ? 'bg-white text-black shadow-lg' : 'text-zinc-600 hover:text-zinc-300'}`}><Icons.ShieldCheck size={16} /> Garantier</button>
            </div>
         </header>

         {viewMode === 'timeline' && (
             <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <AuraCard className="p-8 bg-[#0D0D0E] border-white/5 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-10 relative z-10">
                             <div className="flex items-center gap-3 text-white font-bold text-lg">
                                 <Icons.Shield className={riskData.level === 'LOW' ? "text-emerald-400" : "text-amber-400"} size={24} />
                                 Vær-radar
                             </div>
                             <span className="text-[9px] font-black px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-zinc-600 uppercase tracking-widest">MET.NO LIVE</span>
                        </div>
                        <div className="space-y-4 relative z-10">
                            {riskData.factors.map((factor, i) => (
                                <div key={i} className="flex items-start gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-[24px]">
                                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${factor.impact === 'negative' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                    <p className="text-[13px] text-zinc-400 font-medium leading-relaxed">{factor.description}</p>
                                </div>
                            ))}
                        </div>
                    </AuraCard>

                    <AuraCard className="lg:col-span-2 p-10 bg-indigo-500/[0.03] border-indigo-500/10 flex flex-col md:flex-row gap-12 items-center overflow-hidden">
                        <div className="relative w-44 h-44 shrink-0">
                            <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
                            <div className="absolute inset-5 border border-indigo-500/10 rounded-full" />
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <h4 className="text-4xl font-bold text-white tracking-tighter">2026</h4>
                                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-1">Aktivt hjul</p>
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Strategisk årshjul aktivert</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed mb-8 max-w-md">ERA har beregnet vedlikeholdsbehovet for {matrikkel.address} basert på byggeår {matrikkel.yearBuilt} og lokale værprognoser.</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-5">
                                <div className="flex items-center gap-2.5 text-indigo-400">
                                    <Icons.CheckCircle size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Autonom innkalling</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-indigo-400">
                                    <Icons.CheckCircle size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Sertifisert logg</span>
                                </div>
                            </div>
                        </div>
                    </AuraCard>
                </div>

                <div ref={scrollContainerRef} className="flex overflow-x-auto snap-x snap-mandatory py-6 gap-6 no-scrollbar items-center -mx-6 px-6 scroll-smooth">
                    {MONTHS.map((month, idx) => {
                        const monthEvents = getEventsForMonth(idx);
                        const isCurrent = new Date().getMonth() === idx;
                        return (
                            <div key={month.name} className={`snap-center shrink-0 w-[320px] md:w-[360px] h-[520px] rounded-[48px] border flex flex-col bg-gradient-to-b backdrop-blur-sm transition-all duration-700 ${getSeasonColor(month.season)} ${isCurrent ? 'border-white/20 shadow-2xl scale-100 ring-1 ring-white/10' : 'scale-[0.92] opacity-40 border-white/5 hover:opacity-100'}`}>
                                <div className="p-10 border-b border-white/5 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-5xl font-bold text-white tracking-tighter">{month.name}</h3>
                                        <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.3em] mt-2.5">{month.full}</p>
                                    </div>
                                    {isCurrent && <span className="bg-white text-black text-[10px] font-black px-4 py-2 rounded-full shadow-2xl">NÅ</span>}
                                </div>
                                <div className="flex-1 overflow-y-auto p-8 space-y-5 no-scrollbar">
                                    {monthEvents.map(event => (
                                        <button key={event.id} onClick={() => setSelectedEvent(event)} className="w-full p-7 rounded-[32px] bg-black/40 border border-white/5 hover:border-white/20 transition-all text-left group active:scale-95">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${event.priority === 'high' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]' : 'bg-indigo-400'}`} />
                                                <h4 className="text-base font-bold text-zinc-200 group-hover:text-white transition-colors tracking-tight leading-tight">{event.title}</h4>
                                            </div>
                                            <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed font-medium">{event.description}</p>
                                        </button>
                                    ))}
                                    {monthEvents.length === 0 && (
                                        <div className="h-full flex flex-col items-center justify-center opacity-10">
                                            <Icons.CheckCircle size={40} />
                                            <span className="text-[10px] font-black uppercase mt-4 tracking-widest">Alt på stell</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
             </>
         )}

         {viewMode === 'warranty' && (
             <div className="animate-era-in space-y-10 max-w-4xl mx-auto w-full">
                <AuraCard className="p-10 bg-emerald-500/[0.03] border-emerald-500/10">
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Garantioversikt</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-lg">ERA overvåker automatisk reklamasjonsfrister og sørger for at du har dokumentasjonen klar hvis noe svikter.</p>
                </AuraCard>

                <div className="grid grid-cols-1 gap-5">
                    {warranties.length > 0 ? warranties.map(w => (
                        <AuraCard key={w.id} className="p-8 bg-[#0D0D0E] border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 group active:scale-[0.99] transition-transform">
                            <div className="flex items-center gap-8 overflow-hidden">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shrink-0 ${w.daysLeft < 180 ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-white/5 border-white/10 text-zinc-500'}`}>
                                    <Icons.ShieldCheck size={32} />
                                </div>
                                <div className="truncate">
                                    <h4 className="text-xl font-bold text-white mb-1.5 group-hover:text-indigo-400 transition-colors truncate tracking-tight">{w.title}</h4>
                                    <p className="text-zinc-600 text-[10px] uppercase font-black tracking-widest">{w.supplier}</p>
                                </div>
                            </div>

                            <div className="text-right flex flex-col items-end gap-2.5 shrink-0">
                                <div className="flex items-baseline gap-2.5">
                                    <span className={`text-4xl font-mono font-bold tracking-tighter ${w.daysLeft < 180 ? 'text-red-500' : 'text-white'}`}>{w.daysLeft}</span>
                                    <span className="text-[11px] text-zinc-700 font-black uppercase tracking-widest">dager</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 font-mono font-bold">Utløper: {new Date(w.expiry).toLocaleDateString('no-NO')}</p>
                            </div>
                        </AuraCard>
                    )) : (
                        <div className="py-32 text-center border border-dashed border-white/5 rounded-[48px] opacity-20">
                            <Icons.Inbox size={56} className="mx-auto mb-6" />
                            <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500">Ingen aktive garantier registrert</p>
                        </div>
                    )}
                </div>
             </div>
         )}
      </div>

      <SlideOver isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title={selectedEvent?.title || 'Systemdetaljer'}>
         {selectedEvent && (
            <div className="space-y-12 pb-20">
                <div className="p-10 bg-[#0D0D0E] rounded-[40px] border border-white/5 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <span className="text-[11px] text-zinc-600 uppercase font-black tracking-[0.3em]">Autonom Handling</span>
                        <div className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2.5 ${selectedEvent.status === 'done' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'}`}>
                            {selectedEvent.status === 'done' ? <Icons.Check size={14} strokeWidth={3} /> : <Icons.Zap size={14} />}
                            {selectedEvent.status === 'done' ? 'Utført' : 'Klar for iverksettelse'}
                        </div>
                    </div>

                    <button className="w-full h-16 bg-white text-black rounded-[20px] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-95">
                        Innkall Mester-partner <Icons.ArrowRight size={18} />
                    </button>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[50px] rounded-full pointer-events-none" />
                </div>

                <div className="space-y-5">
                    <h4 className="text-[11px] font-black text-zinc-800 uppercase tracking-[0.4em] ml-2">Situasjonsanalyse</h4>
                    <div className="p-8 bg-[#080809] rounded-[32px] border border-white/5">
                        <p className="text-base text-zinc-400 leading-relaxed font-medium">
                            {selectedEvent.description || 'Ingen beskrivelse tilgjengelig fra ERA AI.'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div className="bg-[#0D0D0E] p-8 rounded-[32px] border border-white/5 text-center">
                        <span className="text-[10px] text-zinc-700 uppercase font-black block mb-2 tracking-widest">Prioritet</span>
                        <span className={`text-sm font-bold uppercase tracking-widest ${selectedEvent.priority === 'high' ? 'text-red-500' : 'text-indigo-400'}`}>
                            {selectedEvent.priority === 'high' ? 'Høy' : 'Normal'}
                        </span>
                    </div>
                    <div className="bg-[#0D0D0E] p-8 rounded-[32px] border border-white/5 text-center">
                        <span className="text-[10px] text-zinc-700 uppercase font-black block mb-2 tracking-widest">Analyse v2.1</span>
                        <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Verifisert</span>
                    </div>
                </div>
            </div>
         )}
      </SlideOver>

    </div>
  );
};
