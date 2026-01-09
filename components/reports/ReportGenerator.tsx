
import React, { useMemo } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { SlideOver } from '../widgets/SharedWidgets';
import { LottieAnimation } from '../widgets/LottieAnimation';

interface ReportGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ isOpen, onClose }) => {
    const { measures, matrikkel, userProfile } = useAppStore();

    // --- AGENT LOGIC: TRANSLATE DATA TO STORY ---
    const reportData = useMemo(() => {
        const completed = measures.filter(m => m.status === 'done');
        const criticalFixed = completed.filter(m => m.tg === 3).length;

        // Estimate value generated (using ROI logic or simplified cost avg)
        const valueCreated = completed.reduce((acc, m) => {
            const cost = (m.costMin + m.costMax) / 2;
            const roi = m.roiFactor || (m.tg === 3 ? 1.5 : 1.0);
            return acc + (cost * roi);
        }, 0);

        // Natural language summary generation
        let headline = "Statusrapport";
        let subtext = "Her er en oversikt over eiendommen.";

        if (completed.length === 0) {
            headline = "Klar til start";
            subtext = "Du har ingen fullførte tiltak ennå, men analysen din ligger klar. Når du utfører vedlikehold, vil denne rapporten vise verdiskapningen din.";
        } else if (criticalFixed > 0) {
            headline = "Du har sikret eiendomsverdiene";
            subtext = `Fantastisk innsats! Du har fjernet ${criticalFixed} ${criticalFixed === 1 ? 'kritisk risikofaktor' : 'kritiske risikofaktorer'}. Dette er penger spart som ellers ville gått til skader.`;
        } else {
            headline = "Godt vedlikehold";
            subtext = "Du tar vare på eiendommen. Jevnlig vedlikehold er den beste investeringen du kan gjøre.";
        }

        return {
            completedCount: completed.length,
            criticalFixed,
            valueCreated,
            headline,
            subtext,
            tasks: completed
        };
    }, [measures]);

    const handleShare = () => {
        // Mock share functionality
        alert("Rapport generert! (Simulert deling/nedlasting)");
        onClose();
    };

    return (
        <SlideOver isOpen={isOpen} onClose={onClose} title="Din ERA Rapport">
            <div className="space-y-8 pb-20">

                {/* 1. AGENT SUMMARY */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 to-black border border-indigo-500/30 p-6 text-center">
                    {reportData.completedCount > 0 && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30 pointer-events-none">
                            <LottieAnimation type="confetti" loop={false} />
                        </div>
                    )}

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
                            <Icons.Award size={32} className="text-indigo-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                            {reportData.headline}
                        </h2>
                        <p className="text-zinc-300 text-sm leading-relaxed max-w-sm mx-auto">
                            {reportData.subtext}
                        </p>
                    </div>
                </div>

                {/* 2. VALUE CARD */}
                {reportData.valueCreated > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#111214] border border-white/5 p-4 rounded-xl">
                            <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Estimert verdiøkning</span>
                            <span className="text-xl font-bold text-emerald-400">
                                +{reportData.valueCreated.toLocaleString()},-
                            </span>
                        </div>
                        <div className="bg-[#111214] border border-white/5 p-4 rounded-xl">
                            <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Risiko dempet</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-white">
                                    {reportData.criticalFixed}
                                </span>
                                <span className="text-xs text-zinc-500">TG3-avvik</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. TASK LIST (The Proof) */}
                <div>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 px-1">
                        Hva ERA har registrert
                    </h3>

                    <div className="bg-[#111214] border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5">
                        {reportData.tasks.length > 0 ? (
                            reportData.tasks.map(task => (
                                <div key={task.id} className="p-4 flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-900/20 flex items-center justify-center text-green-500 border border-green-500/20">
                                            <Icons.Check size={14} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-200">{task.title}</p>
                                            <p className="text-[10px] text-zinc-500">{task.location}</p>
                                        </div>
                                    </div>
                                    {task.tg === 3 && (
                                        <span className="text-[9px] bg-red-900/20 text-red-400 px-2 py-1 rounded border border-red-500/20">
                                            Risiko fjernet
                                        </span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-zinc-500 text-sm">
                                Ingen utførte oppgaver ennå.
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. FOOTER / SHARE */}
                <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5 text-center space-y-4">
                    <p className="text-xs text-zinc-400">
                        Denne rapporten er basert på dine aktiviteter i ERA OS for <span className="text-white font-bold">{matrikkel.address}</span>.
                    </p>
                    <button
                        onClick={handleShare}
                        className="w-full py-4 bg-white text-black rounded-xl font-bold text-sm shadow-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                    >
                        <Icons.Share size={16} /> Del Resultatene (PDF)
                    </button>
                </div>

            </div>
        </SlideOver>
    );
};
