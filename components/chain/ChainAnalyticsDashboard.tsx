
import React from 'react';
import { Icons } from '../Icons';
import { AuraCard, KPIUnit, PageHeader } from '../widgets/SharedWidgets';
import { EcosystemDiagram } from '../system/EcosystemDiagram';

export const ChainAnalyticsDashboard: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-32 animate-era-in">
            <PageHeader
                label="Partner-OS | Kjede-Admin"
                title="Kjedeinnsikt"
                description="Aggregert oversikt over produksjon og verdisikring for hele medlemsmassen."
            />

            {/* Aggregated KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPIUnit icon={Icons.Briefcase} label="Fullførte oppdrag" value="1,842" sub="Siste 12 mnd" />
                <KPIUnit icon={Icons.TrendingUp} label="Verdi skapt" value="42.5M" sub="Verified Value" color="text-emerald-500" />
                <KPIUnit icon={Icons.ScanLine} label="Vision-bruk" value="12,4k" sub="Befaringer" color="text-indigo-400" />
                <KPIUnit icon={Icons.Users} label="Aktive Medlemmer" value="156" sub="Bedrifter" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Regional Distribution */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center gap-3 px-2">
                         <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-700">Regional Distribusjon (Volum)</span>
                    </div>
                    <AuraCard className="p-10 bg-[#0A0A0B] border-white/5">
                        <div className="space-y-8">
                            <RegionBar label="Viken" value={420} percentage={85} />
                            <RegionBar label="Oslo" value={380} percentage={78} />
                            <RegionBar label="Vestland" value={290} percentage={60} />
                            <RegionBar label="Trøndelag" value={150} percentage={30} />
                            <RegionBar label="Nord-Norge" value={95} percentage={20} />
                        </div>
                    </AuraCard>
                </div>

                {/* System Integrity & White-label Info */}
                <div className="lg:col-span-4 space-y-6">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-700 px-2">System-integritet</span>
                    <div className="space-y-4">
                        <AuraCard className="p-8 bg-indigo-600/5 border-indigo-500/10">
                            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <Icons.ShieldCheck size={16} className="text-indigo-400" />
                                Data-anonymisering
                            </h4>
                            <p className="text-[11px] text-zinc-500 leading-relaxed uppercase tracking-widest font-medium">
                                Enkeltkunder og spesifikk prising er skjult i henhold til kjedeavtalen. Kun aggregert verdi og volum er synlig.
                            </p>
                        </AuraCard>

                        <AuraCard className="p-8 bg-[#0D0D0E] border-white/5">
                             <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest block mb-4">Infrastruktur-last</span>
                             <div className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    <span>API Forespørsler</span>
                                    <span>72%</span>
                                </div>
                                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500" style={{ width: '72%' }} />
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest pt-2">
                                    <span>Vision Analyse</span>
                                    <span>45%</span>
                                </div>
                                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: '45%' }} />
                                </div>
                             </div>
                        </AuraCard>
                    </div>
                </div>
            </div>

            <div className="interactive-card">
              <EcosystemDiagram />
            </div>

            {/* Member Leaderboard (Aggregated) */}
            <section className="space-y-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-700 px-2">Topp-medlemmer (Aktivitet)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MemberCard name="Mesterfarge Oslo AS" jobs={142} value="3.2M" />
                    <MemberCard name="Bergen Malermester" jobs={118} value="2.8M" />
                    <MemberCard name="Trondheim Fasade" jobs={94} value="1.9M" />
                </div>
            </section>
        </div>
    );
};

const RegionBar = ({ label, value, percentage }: any) => (
    <div className="space-y-3">
        <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-white">{label}</span>
            <span className="text-[11px] font-mono text-zinc-500 font-bold">{value} oppdrag</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500/40 rounded-full" style={{ width: `${percentage}%` }} />
        </div>
    </div>
);

const MemberCard = ({ name, jobs, value }: any) => (
    <AuraCard className="p-6 bg-[#0D0D0E] border-white/5 flex items-center justify-between group interactive-card">
        <div>
            <h4 className="text-base font-bold text-white mb-1">{name}</h4>
            <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">{jobs} oppdrag</span>
                <div className="w-1 h-1 rounded-full bg-zinc-800" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">+{value} verdi</span>
            </div>
        </div>
        <Icons.ChevronRight className="text-zinc-800 group-hover:text-white transition-colors" size={16} />
    </AuraCard>
);
