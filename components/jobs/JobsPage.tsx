
import React, { useMemo, useState } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { AuraCard, SlideToConfirm, NumberTicker } from '../widgets/SharedWidgets';
import { LottieAnimation } from '../widgets/LottieAnimation';

export const JobsPage: React.FC<{ onNavigate?: (v: string) => void }> = ({ onNavigate }) => {
    const { jobs, updateJobStatus } = useAppStore();
    const [viewState, setViewState] = useState<'locked' | 'opening' | 'revealed' | 'signed'>('locked');

    // Hent det aktive tilbudet (mock logic: finner første med status 'quoted' eller bruker et default)
    const activeJob = useMemo(() => {
        return jobs.find(j => j.status === 'quoted') || jobs[0];
    }, [jobs]);

    if (!activeJob) return null;

    const handleOpen = () => {
        setViewState('opening');
        setTimeout(() => setViewState('revealed'), 1500);
    };

    const handleSign = () => {
        updateJobStatus(activeJob.id, 'accepted');
        setViewState('signed');
        setTimeout(() => {
            if (onNavigate) onNavigate('dashboard');
        }, 3000);
    };

    const isExpensive = (activeJob.proff_pris || 0) > activeJob.estimert_kost * 1.2;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden animate-era-in">

            {/* Background Atmosphere */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full" />
            </div>

            {/* STATE 1: LOCKED PACKAGE */}
            {viewState === 'locked' && (
                <div className="relative z-10 text-center space-y-12">
                    <div className="relative cursor-pointer group" onClick={handleOpen}>
                        <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full animate-pulse group-hover:bg-indigo-500/50 transition-all" />
                        <div className="relative w-64 h-64 bg-black border border-white/10 rounded-[40px] flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[40px]" />
                            <Icons.Gift size={80} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" strokeWidth={1} />

                            {/* Notification Badge */}
                            <div className="absolute -top-4 -right-4 bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-bounce">
                                1 Nytt Tilbud
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Du har post.</h2>
                        <p className="text-zinc-400">Mesterfarge Oslo AS har sendt et tilbud på "{activeJob.tittel}".</p>
                    </div>
                    <button onClick={handleOpen} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors">
                        Trykk for å åpne
                    </button>
                </div>
            )}

            {/* STATE 2: OPENING ANIMATION */}
            {viewState === 'opening' && (
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-32 h-32 mb-8">
                        <LottieAnimation type="scanning" />
                    </div>
                    <h3 className="text-xl font-bold text-white animate-pulse">Pakker ut detaljer...</h3>
                </div>
            )}

            {/* STATE 3: REVEALED (THE OFFER) */}
            {viewState === 'revealed' && (
                <div className="w-full max-w-lg z-10 animate-in slide-in-from-bottom-10 fade-in duration-700">
                    <AuraCard className="p-8 bg-[#0D0D0E] border-white/10 shadow-2xl relative overflow-hidden">

                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                                <Icons.BadgeCheck size={14} className="text-indigo-400" />
                                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Verifisert Mesterbedrift</span>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">{activeJob.tittel}</h1>
                            <p className="text-zinc-500 text-sm">{activeJob.beskrivelse}</p>
                        </div>

                        {/* Price Reveal */}
                        <div className="bg-zinc-900/50 rounded-3xl p-8 mb-8 border border-white/5 text-center relative overflow-hidden">
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] block mb-2">Fastpris (Inkl. Mva)</span>
                            <div className="text-5xl font-mono font-bold text-white tracking-tighter mb-6">
                                <NumberTicker value={activeJob.proff_pris || activeJob.estimert_kost} />,-
                            </div>

                            {/* Smart Comparison */}
                            <div className="flex items-center justify-center gap-4 text-xs font-medium">
                                <div className="text-zinc-500 line-through">AI Estimat: {(activeJob.estimert_kost).toLocaleString()}</div>
                                <div className={`flex items-center gap-1.5 ${isExpensive ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    {isExpensive ? <Icons.AlertTriangle size={14} /> : <Icons.CheckCircle size={14} />}
                                    <span>{isExpensive ? 'Litt over snitt' : 'Godkjent markedspris'}</span>
                                </div>
                            </div>
                        </div>

                        {/* What's Included (Visual) */}
                        <div className="space-y-4 mb-10">
                            <h4 className="text-[10px] font-black text-zinc-700 uppercase tracking-widest px-2">Dette inngår</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                                    <Icons.Hammer size={20} className="text-zinc-400" />
                                    <span className="text-xs font-bold text-zinc-300">Utførelse</span>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                                    <Icons.Palette size={20} className="text-zinc-400" />
                                    <span className="text-xs font-bold text-zinc-300">Materiell</span>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                                    <Icons.Truck size={20} className="text-zinc-400" />
                                    <span className="text-xs font-bold text-zinc-300">Kjøring/Rigg</span>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                                    <Icons.Trash2 size={20} className="text-zinc-400" />
                                    <span className="text-xs font-bold text-zinc-300">Avfall</span>
                                </div>
                            </div>
                        </div>

                        {/* Action */}
                        <div className="space-y-6">
                            <SlideToConfirm onConfirm={handleSign} label="Dra for å signere avtale" />
                            <p className="text-center text-[9px] text-zinc-600 font-bold uppercase tracking-widest max-w-xs mx-auto">
                                Ved signering opprettes digital kontrakt og prosjektrom i appen.
                            </p>
                        </div>

                    </AuraCard>

                    <button
                        onClick={() => onNavigate && onNavigate('dashboard')}
                        className="w-full mt-6 text-zinc-500 hover:text-white text-xs font-bold transition-colors"
                    >
                        Jeg trenger tenketid (Lukk)
                    </button>
                </div>
            )}

            {/* STATE 4: SIGNED (CONFETTI) */}
            {viewState === 'signed' && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in">
                    <div className="absolute inset-0 pointer-events-none">
                        <LottieAnimation type="confetti" loop={false} />
                    </div>
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_50px_#10b981] mb-8 animate-in zoom-in duration-500">
                        <Icons.Check size={48} className="text-black" strokeWidth={4} />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2">Gratulerer!</h2>
                    <p className="text-zinc-400 text-lg">Prosjektet er i gang.</p>
                </div>
            )}

        </div>
    );
};
