
import React from 'react';
import { Icons } from '../Icons';
import { PageHeader, KPIUnit } from '../widgets/SharedWidgets';

export const ProRevenuePage: React.FC = () => {
    return (
        <div className="flex flex-col gap-12 animate-era-in">
            <PageHeader
                title="Omsetning"
                description="Finansiell oversikt over verifisert produksjon."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPIUnit icon={Icons.TrendingUp} label="Total Verdi i år" value="2.4M" sub="NOK" color="text-white" />
                <KPIUnit icon={Icons.Activity} label="Endring vs. 2023" value="+12%" sub="Vekst" color="text-emerald-500" />
                <KPIUnit icon={Icons.Award} label="Gevinst pr. jobb" value="18%" sub="Gj.snitt margin" />
            </div>

            <div className="bg-[#0A0A0B] border border-white/5 rounded-[40px] p-12 space-y-10">
                <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">Månedlig akkumulering</span>
                    <div className="h-64 flex items-end gap-2">
                        {[45, 62, 58, 85, 92, 78].map((h, i) => (
                            <div key={i} className="flex-1 bg-white/5 rounded-t-xl group relative">
                                <div className="absolute inset-0 bg-indigo-500/20 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">{(h * 10).toLocaleString()}k</div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between px-2 pt-4 border-t border-white/5">
                        {['JAN', 'FEB', 'MAR', 'APR', 'MAI', 'JUN'].map(m => (
                            <span key={m} className="text-[10px] font-black text-zinc-700">{m}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
