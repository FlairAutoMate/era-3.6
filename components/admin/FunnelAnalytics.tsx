
import React from 'react';
import { Icons } from '../Icons';
import { AuraCard } from '../widgets/SharedWidgets';

export const FunnelAnalytics: React.FC = () => {
    const funnelSteps = [
        { label: 'Views', value: '1.2M', drop: '100%', icon: Icons.Eye, color: 'bg-zinc-800' },
        { label: 'Activations', value: '420k', drop: '35%', icon: Icons.Zap, color: 'bg-indigo-900/40' },
        { label: 'Analysed', value: '124k', drop: '10%', icon: Icons.ScanLine, color: 'bg-indigo-600/40' },
        { label: 'Jobs', value: '18k', drop: '1.5%', icon: Icons.Hammer, color: 'bg-emerald-600/40' },
        { label: 'Verified Value', value: '4.2k', drop: '0.35%', icon: Icons.BadgeCheck, color: 'bg-emerald-500' }
    ];

    return (
        <div className="space-y-8">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-700 px-2">Conversion Funnel | System-wide</h3>

            <div className="relative flex flex-col md:flex-row items-end gap-1 h-[400px]">
                {funnelSteps.map((step, idx) => (
                    <div key={step.label} className="flex-1 flex flex-col items-center gap-4 group">
                        <div className="text-center mb-2">
                            <span className="text-xl font-bold text-white block leading-none">{step.value}</span>
                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{step.label}</span>
                        </div>
                        <div
                            className={`w-full rounded-t-3xl transition-all duration-1000 group-hover:brightness-125 ${step.color}`}
                            style={{ height: `${100 - (idx * 15)}%` }}
                        />
                        <div className="h-10 flex items-center justify-center">
                            <span className="text-[10px] font-mono font-bold text-zinc-700">{step.drop}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AuraCard className="p-6 bg-[#0D0D0E] border-white/5 flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500"><Icons.TrendingUp size={20} /></div>
                    <div>
                        <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest block mb-0.5">Top performing region</span>
                        <span className="text-sm font-bold text-white uppercase tracking-tight">Oslo West | 4.8% CR</span>
                    </div>
                </AuraCard>
                <AuraCard className="p-6 bg-[#0D0D0E] border-white/5 flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400"><Icons.Users size={20} /></div>
                    <div>
                        <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest block mb-0.5">Active Partners</span>
                        <span className="text-sm font-bold text-white uppercase tracking-tight">842 Certified Firms</span>
                    </div>
                </AuraCard>
            </div>
        </div>
    );
};
