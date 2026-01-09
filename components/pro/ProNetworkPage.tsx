
import React, { useState } from 'react';
import { Icons } from '../Icons';
import { AuraCard } from '../widgets/SharedWidgets';
import { MOCK_PARTNERS } from '../../lib/store/defaults';

export const ProNetworkPage: React.FC = () => {
    const [joined, setJoined] = useState<string[]>([]);

    const collaborations = [
        {
            id: 'collab-1',
            address: 'Uranienborgveien 22',
            currentPartner: 'Rørlegger-Vakten Teknikk',
            trade: 'VVS / Bad',
            need: 'Maling / Overflate',
            status: 'Klar for påkobling',
            icon: Icons.Droplets,
            synergy: 'Felles rigging sparer kunden for 4.500,-'
        },
        {
            id: 'collab-2',
            address: 'Hedgehaugsveien 4',
            currentPartner: 'Oslo Snekker & Tak',
            trade: 'Fasade / Vinduer',
            need: 'Maling / Beis',
            status: 'Befaring utført',
            icon: Icons.Hammer,
            synergy: 'Underlag (bilder) delt av snekker'
        }
    ];

    const handleJoin = (id: string) => {
        setJoined([...joined, id]);
    };

    return (
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-32 animate-era-in">
            <header className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                    <Icons.Users className="text-indigo-500" size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Partner Økosystem</span>
                </div>
                <h1 className="text-5xl font-bold tracking-ios-tighter text-white mb-2">Samarbeids-radar</h1>
                <p className="text-zinc-500 text-sm">Koble deg på prosjekter der andre fagfelt har gjort forarbeidet for deg.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Active Collaborative Leads */}
                <div className="md:col-span-8 space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-700 ml-1">Åpne muligheter for samdrift</h3>
                    {collaborations.map(collab => (
                        <AuraCard key={collab.id} className="p-8 bg-[#0A0A0B] border-white/5 hover:border-white/10 transition-all">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 shadow-inner">
                                        <collab.icon size={28} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white leading-none mb-1.5">{collab.address}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-zinc-500">{collab.trade} utføres av </span>
                                            <span className="text-xs font-bold text-indigo-400">{collab.currentPartner}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-full text-[8px] font-black uppercase tracking-widest">
                                    {collab.status}
                                </span>
                            </div>

                            <div className="bg-white/[0.03] rounded-3xl p-6 mb-8 border border-white/5 relative overflow-hidden">
                                <div className="flex items-start gap-4 relative z-10">
                                    <Icons.Sparkles size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h5 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">ERA Synergi-match</h5>
                                        <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                                            {collab.synergy}
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] rounded-full" />
                            </div>

                            <div className="flex gap-3">
                                {joined.includes(collab.id) ? (
                                    <button className="flex-1 h-14 bg-emerald-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
                                        <Icons.Check size={18} /> Forespørsel sendt til partner
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleJoin(collab.id)}
                                        className="flex-1 h-14 bg-white text-black rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all hover:bg-zinc-200"
                                    >
                                        Koble på prosjektet
                                    </button>
                                )}
                                <button className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
                                    <Icons.Info size={20} />
                                </button>
                            </div>
                        </AuraCard>
                    ))}
                </div>

                {/* Vertical Partner List */}
                <div className="md:col-span-4 space-y-8">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-700 ml-1">Dine faste partnere</h3>
                    <div className="space-y-3">
                        {MOCK_PARTNERS.map(partner => (
                            <div key={partner.id} className="p-5 bg-[#0D0D0E] border border-white/5 rounded-3xl flex items-center gap-4 group hover:bg-zinc-900 transition-all cursor-pointer">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 font-bold transition-colors shadow-inner">
                                    {partner.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-white truncate">{partner.name}</h4>
                                    <p className="text-[9px] text-zinc-600 uppercase font-black truncate">{partner.specialties[0]}</p>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                                    <Icons.Award size={10} className="text-amber-500" />
                                    <span className="text-[10px] font-bold text-white">{partner.rating}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 rounded-[40px]">
                        <Icons.Command size={24} className="text-indigo-400 mb-4" />
                        <h4 className="text-base font-bold text-white mb-2 tracking-tight">Ett team, én app</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                            ERA fungerer som prosjektleder. Når du kobler deg på, får du tilgang til alle bilder og mål som er tatt av dine partnere.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
