
import React, { useState, useMemo } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { PageHeader, AuraCard, PrimaryButton } from '../widgets/SharedWidgets';

export const PartnersPage: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
    const { partners, openAgent } = useAppStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

    // Derive unique filters
    const allTrades = useMemo(() => Array.from(new Set(partners.flatMap(p => p.specialties))), [partners]);
    const allRegions = useMemo(() => Array.from(new Set(partners.flatMap(p => p.serviceAreas))), [partners]);

    const filteredPartners = useMemo(() => {
        return partners.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  p.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTrade = selectedTrade ? p.specialties.includes(selectedTrade) : true;
            const matchesRegion = selectedRegion ? p.serviceAreas.includes(selectedRegion) : true;
            return matchesSearch && matchesTrade && matchesRegion;
        });
    }, [partners, searchTerm, selectedTrade, selectedRegion]);

    const handleContact = (partner: any) => {
        // Use the agent/dialog system to simulate contact initiation
        openAgent({
            type: 'job_insight',
            data: { tittel: `Kontaktforespørsel: ${partner.name}`, description: `Ønsker å komme i kontakt med ${partner.name} angående oppdrag.` }
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-era-in pb-32">
            <PageHeader
                title="Håndverkere"
                description="Sertifiserte fagpartnere klare for ditt neste prosjekt."
                label="Kvalitetssikret"
            />

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Søk etter navn eller tjeneste..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-14 bg-[#0A0A0B] border border-white/10 rounded-2xl pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder-zinc-600"
                    />
                </div>

                {/* Mobile Scrollable Filters */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    <select
                        value={selectedTrade || ''}
                        onChange={(e) => setSelectedTrade(e.target.value || null)}
                        className="h-14 bg-[#0A0A0B] border border-white/10 rounded-2xl px-4 text-sm text-zinc-300 outline-none focus:border-indigo-500/50 min-w-[140px]"
                    >
                        <option value="">Alle fagfelt</option>
                        {allTrades.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>

                    <select
                        value={selectedRegion || ''}
                        onChange={(e) => setSelectedRegion(e.target.value || null)}
                        className="h-14 bg-[#0A0A0B] border border-white/10 rounded-2xl px-4 text-sm text-zinc-300 outline-none focus:border-indigo-500/50 min-w-[140px]"
                    >
                        <option value="">Alle regioner</option>
                        {allRegions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPartners.length > 0 ? (
                    filteredPartners.map(partner => (
                        <AuraCard key={partner.id} className="p-0 bg-[#0D0D0E] border-white/5 flex flex-col h-full group hover:border-indigo-500/30 transition-all">
                            <div className="p-6 pb-4 flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-xl font-bold text-zinc-300 group-hover:text-white group-hover:bg-indigo-600/20 transition-colors border border-white/5">
                                        {partner.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-base leading-tight group-hover:text-indigo-400 transition-colors">{partner.name}</h3>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Icons.Star size={12} className="text-amber-500 fill-amber-500" />
                                            <span className="text-xs font-bold text-zinc-400">{partner.rating}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                                    <Icons.ArrowUpRight size={16} />
                                </div>
                            </div>

                            <div className="px-6 py-2 flex-1">
                                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
                                    {partner.description || "Ingen beskrivelse tilgjengelig."}
                                </p>
                            </div>

                            <div className="p-6 pt-4 space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {partner.specialties.slice(0, 3).map(spec => (
                                        <span key={spec} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black uppercase text-zinc-500 tracking-wider">
                                            {spec}
                                        </span>
                                    ))}
                                    {partner.specialties.length > 3 && (
                                        <span className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] text-zinc-600 font-bold">+{partner.specialties.length - 3}</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-zinc-500 text-xs border-t border-white/5 pt-4">
                                    <Icons.MapPin size={14} />
                                    <span className="truncate">{partner.serviceAreas.join(', ')}</span>
                                </div>

                                <PrimaryButton onClick={() => handleContact(partner)} variant="glass" className="w-full h-12 text-xs">
                                    Kontakt Partner
                                </PrimaryButton>
                            </div>
                        </AuraCard>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center opacity-50">
                        <Icons.Search size={48} className="mx-auto mb-4 text-zinc-700" />
                        <p className="text-zinc-500 font-medium">Ingen partnere funnet med valgte filtre.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedTrade(null); setSelectedRegion(null); }}
                            className="mt-4 text-indigo-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Nullstill filter
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
