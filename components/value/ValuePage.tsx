
import React, { useState } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { AuraCard, PageHeader, PrimaryButton } from '../widgets/SharedWidgets';
import { generatePropertyReport } from '../../services/reportService';

export const ValuePage: React.FC = () => {
    const { matrikkel, getEstimatedValue, getPropertyIndex, fdvEvents } = useAppStore();
    const [isGenerating, setIsGenerating] = useState<string | null>(null);

    const valueData = getEstimatedValue();
    const displayScore = getPropertyIndex(matrikkel.address);

    const handleExport = async (type: 'bank' | 'insurance') => {
        setIsGenerating(type);
        await generatePropertyReport(
            type,
            matrikkel,
            {
                currentValue: valueData.current,
                verifiedAppreciation: valueData.verifiedAppreciation,
                healthScore: 68,
                index: displayScore
            },
            fdvEvents
        );
        setIsGenerating(null);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-era-in pb-32">
            <PageHeader
                title="Status"
                description="Sanntidsdata basert på byggeår, marked og verifisert vedlikehold."
                action={{ label: "Generer bank-rapport", onClick: () => handleExport('bank'), icon: Icons.Download }}
            />

            {/* HERO / KEY METRIC */}
            <section>
                <AuraCard className="p-16 bg-[#0A0A0B] border-white/10 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        <span className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-400 block">Eiendomsindeks (EI)</span>
                        <div className="text-[120px] font-black text-white tracking-ios-tighter leading-none font-display">
                            {displayScore}
                        </div>
                        <p className="text-zinc-500 text-lg font-medium max-w-sm">Eiendomsindeksen representerer boligens tekniske og markedsmessige integritet.</p>
                    </div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03)_0%,transparent_70%)] pointer-events-none" />
                </AuraCard>
            </section>

            {/* ACTION CARDS */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AuraCard className="p-10 bg-[#0D0D0E] border-white/5 flex flex-col justify-between h-[260px]">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block">Markedsverdi</span>
                        <div className="text-4xl font-black text-white tracking-tighter font-display">
                            {(valueData.current / 1000000).toFixed(1)} MNOK
                        </div>
                        <p className="text-zinc-600 text-sm leading-relaxed">Verdien reflekterer boligens tilstand ved siste Vision-skann.</p>
                    </div>
                </AuraCard>

                <AuraCard highlight className="p-10 bg-emerald-500/[0.03] border-emerald-500/10 flex flex-col justify-between h-[260px]">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block">Sikret gevinst</span>
                        <div className="text-4xl font-black text-emerald-500 tracking-tighter font-display">
                            +{Math.round(valueData.verifiedAppreciation/1000)}k
                        </div>
                        <p className="text-zinc-500 text-sm leading-relaxed">Verdiøkning dokumentert via verifiserte fagutførte tiltak.</p>
                    </div>
                </AuraCard>
            </section>
        </div>
    );
};
