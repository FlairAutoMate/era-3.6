
import React, { useState } from 'react';
import { Icons } from '../Icons';
import { AuraCard, PrimaryButton } from '../widgets/SharedWidgets';

export const CampaignManager: React.FC = () => {
    const [isCreating, setIsCreating] = useState(false);

    const activeCampaigns = [
        { id: 'c1', name: 'Vårpuss 2024 - Oslo', reach: '12,400', conv: '4.2%', status: 'active', channel: 'SMS' },
        { id: 'c2', name: 'Enova Oppgradering', reach: '45,000', conv: '1.8%', status: 'scheduled', channel: 'Email' }
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end px-2">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-700">Aktive Kampanjer</h3>
                <button
                    onClick={() => setIsCreating(true)}
                    className="h-10 px-6 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-100 transition-all"
                >
                    <Icons.Plus size={14} /> Ny Kampanje
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {activeCampaigns.map(c => (
                    <AuraCard key={c.id} className="p-8 bg-[#0D0D0E] border-white/5 flex items-center justify-between group">
                        <div className="flex items-center gap-8">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 transition-colors">
                                {c.channel === 'SMS' ? <Icons.Smartphone size={20} /> : <Icons.Mail size={20} />}
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white tracking-tight leading-none mb-1.5">{c.name}</h4>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Kanal: {c.channel}</span>
                                    <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Rekkevidde: {c.reach}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-12">
                            <div className="text-right">
                                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest block mb-1">Konvertering</span>
                                <span className="text-xl font-mono font-bold text-emerald-500">{c.conv}</span>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${c.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-white/5 text-zinc-500 border-white/10'}`}>
                                {c.status}
                            </div>
                        </div>
                    </AuraCard>
                ))}
            </div>

            {isCreating && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsCreating(false)} />
                    <AuraCard className="relative w-full max-w-xl p-12 bg-[#0A0A0B] border-white/10 space-y-10 animate-era-in">
                        <header>
                            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Konfigurer kampanje</h2>
                            <p className="text-zinc-500 text-sm">Velg parametre for utsendelse.</p>
                        </header>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-700 tracking-widest ml-1">Målgruppe / Region</label>
                                <select className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white outline-none">
                                    <option>Hele Norge (Aggregert)</option>
                                    <option>Oslo & Omegn</option>
                                    <option>Trøndelag</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-700 tracking-widest ml-1">Trigger-Hendelse</label>
                                <select className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white outline-none">
                                    <option>Fasade-vedlikehold (Alder > 15 år)</option>
                                    <option>Teknisk avvik detektert</option>
                                    <option>Vær-varsel (Kritisk nedbør)</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-6 flex gap-4">
                            <button onClick={() => setIsCreating(false)} className="flex-1 h-14 bg-zinc-900 text-zinc-500 rounded-2xl font-bold uppercase text-[10px] tracking-widest">Avbryt</button>
                            <PrimaryButton onClick={() => setIsCreating(false)} variant="white" className="flex-[2] h-14">
                                Aktiver Kampanje <Icons.Send size={16} />
                            </PrimaryButton>
                        </div>
                    </AuraCard>
                </div>
            )}
        </div>
    );
};
