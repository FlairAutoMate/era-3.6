
import React, { useState } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { UserRole } from '../../types';

interface AssistIntroModalProps {
    onDismiss: () => void;
}

type Step = 'intro' | 'tut1' | 'tut2';

export const AssistIntroModal: React.FC<AssistIntroModalProps> = ({ onDismiss }) => {
    const { userRole } = useAppStore();
    const [step, setStep] = useState<Step>('intro');
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const handleNext = () => {
        if (step === 'intro') {
            setStep('tut1');
        } else if (step === 'tut1') {
            setStep('tut2');
        } else {
            onDismiss();
        }
    };

    const handleQuickDismiss = () => {
        onDismiss();
    };

    // --- SYSTEM CONTENT CONFIG ---

    const ROLE_CONFIG = {
        [UserRole.HOMEOWNER]: {
            icon: Icons.Sparkles,
            title: "ERA Intelligence v2.0",
            desc: "Autonom overvåking av teknisk tilstand. Systemet detekterer avvik og beregner verdisikringstiltak i sanntid.",
            bullets: [
                { text: "Optimalisert prioriteringsrekkefølge", icon: Icons.List },
                { text: "Risikodeteksjon og verifikasjon", icon: Icons.ShieldCheck },
                { text: "Automatisert FDV-protokollering", icon: Icons.FileText }
            ],
            cta: "Initialiser",
            micro: "Systemet er aktivt i bakgrunnen.",
            footer: "Tilgang via ✨ i kontrollpanelet"
        },
        [UserRole.PROFESSIONAL]: {
            icon: Icons.Zap,
            title: "ERA Intelligence v2.0",
            desc: "Ordrebehandling og prosessoptimalisering. Komplett underlag genereres før iverksettelse.",
            badge: "OS for Partner",
            bullets: [
                { text: "Kalkulerte ordregrunnlag", icon: Icons.Calculator },
                { text: "Prosessovervåking og tidsestimering", icon: Icons.Clock },
                { text: "Digital verifikasjon av utførelse", icon: Icons.FileText }
            ],
            cta: "Initialiser",
            micro: "Systemet integreres i din arbeidsflyt.",
            footer: "ERA Partner Mode"
        }
    };

    const config = ROLE_CONFIG[userRole] || ROLE_CONFIG[UserRole.HOMEOWNER];
    const RoleIcon = config.icon;

    const renderIntro = () => (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-10">
                <div className="w-20 h-20 bg-[#1A1B1E] rounded-[2rem] flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)] relative">
                    <div className="absolute inset-0 bg-white/5 rounded-[2rem] animate-pulse-slow"></div>
                    <RoleIcon size={36} className="text-white relative z-10" />
                </div>

                <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">{config.title}</h1>
                <p className="text-lg text-zinc-400 mb-8 max-w-sm leading-relaxed">
                    {config.desc}
                </p>

                {/* Bullets */}
                <div className="space-y-4 w-full max-w-xs mb-10 text-left">
                    {config.bullets.map((bullet, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400">
                                <bullet.icon size={16} />
                            </div>
                            <span className="text-sm font-medium text-zinc-200">{bullet.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-8 pb-12 w-full max-w-md mx-auto space-y-6">
                <button
                    onClick={dontShowAgain ? handleQuickDismiss : handleNext}
                    className="w-full h-16 bg-white text-black rounded-full font-bold text-lg hover:bg-zinc-200 transition-colors shadow-lg flex items-center justify-center gap-2 group"
                >
                    {config.cta} <Icons.ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex flex-col items-center gap-4">
                    <p className="text-xs text-zinc-500 font-medium">{config.micro}</p>

                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={dontShowAgain}
                            onChange={() => setDontShowAgain(!dontShowAgain)}
                            className="hidden"
                        />
                        <div
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${dontShowAgain ? 'bg-zinc-500 border-zinc-500' : 'bg-transparent border-zinc-700 group-hover:border-zinc-500'}`}
                        >
                            {dontShowAgain && <Icons.Check size={14} className="text-black" />}
                        </div>
                        <span className="text-xs text-zinc-500 group-hover:text-zinc-400 select-none">Ikke vis denne loggen igjen</span>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderTutorialStep1 = () => (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-10">
                <div className="w-64 h-64 relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent rounded-full blur-[60px]"></div>
                    <div className="absolute inset-4 border border-dashed border-white/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Icons.ScanLine size={64} className="text-indigo-500" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">Autonom analyse</h2>
                <p className="text-lg text-zinc-400 max-w-xs leading-relaxed">
                    Systemet prosesserer kontinuerlig visuelle data og værforhold for å detektere tekniske avvik.
                </p>
            </div>

            <div className="p-8 pb-12 w-full max-w-md mx-auto">
                <button
                    onClick={handleNext}
                    className="w-full h-16 bg-zinc-800 text-white border border-white/5 rounded-full font-bold text-lg hover:bg-zinc-700 transition-colors"
                >
                    Neste sekvens
                </button>
            </div>
        </div>
    );

    const renderTutorialStep2 = () => (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-10">
                <div className="relative mb-8">
                    <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center relative z-10 border border-white/10">
                        <Icons.Sparkles size={32} className="text-white" />
                    </div>
                    <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">Kommando-tilgang</h2>
                <p className="text-lg text-zinc-400 max-w-xs leading-relaxed mb-8">
                    Benytt ✨ for systemstøtte:
                </p>
                <ul className="text-left space-y-3 text-zinc-300 bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                    <li className="flex items-center gap-3"><Icons.CheckCircle size={16} className="text-indigo-400"/> Generere statusrapport</li>
                    <li className="flex items-center gap-3"><Icons.Shield size={16} className="text-indigo-400"/> Analysere risikofaktorer</li>
                    <li className="flex items-center gap-3"><Icons.TrendingUp size={16} className="text-indigo-400"/> Simulere verdiscenarioer</li>
                </ul>
            </div>

            <div className="p-8 pb-12 w-full max-w-md mx-auto space-y-4">
                <button
                    onClick={handleNext}
                    className="w-full h-16 bg-white text-black rounded-full font-bold text-lg hover:bg-zinc-200 transition-colors shadow-lg"
                >
                    Ferdigstille
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[150] flex items-end justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500" />

            {/* Sheet */}
            <div className="relative z-10 w-full md:max-w-xl h-[92vh] bg-[#0B0C0E] border-t border-white/10 rounded-t-[32px] shadow-2xl overflow-hidden flex flex-col">
                {/* Handle */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-zinc-800 rounded-full z-20"></div>

                {/* Progress Indicators */}
                {step !== 'intro' && (
                    <div className="absolute top-8 left-0 right-0 flex justify-center gap-2 z-20">
                        <div className={`w-2 h-2 rounded-full transition-colors ${step === 'tut1' ? 'bg-white' : 'bg-zinc-800'}`}></div>
                        <div className={`w-2 h-2 rounded-full transition-colors ${step === 'tut2' ? 'bg-white' : 'bg-zinc-800'}`}></div>
                    </div>
                )}

                {step === 'intro' && renderIntro()}
                {step === 'tut1' && renderTutorialStep1()}
                {step === 'tut2' && renderTutorialStep2()}
            </div>
        </div>
    );
};
