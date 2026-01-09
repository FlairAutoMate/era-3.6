
import React, { useState, useEffect } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { askEraAssist } from '../../services/geminiService';
import { AgentResponse } from '../../types';
import { LoadingState } from '../widgets/SharedWidgets';

const REASONING_STEPS = [
    "Henter boligdata og historikk...",
    "Analyserer værforhold og teknisk risiko...",
    "Beregner finansiell gevinst for tiltak...",
    "Syntetiserer strategisk rådgivning..."
];

export const EraAssist = () => {
    const { isAgentOpen, closeAgent, agentContext, userRole, getHealthScore, matrikkel, getEstimatedValue, fdvEvents, jobs } = useAppStore();
    const [response, setResponse] = useState<AgentResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [reasoningStep, setReasoningStep] = useState(0);

    useEffect(() => {
        if (isAgentOpen && agentContext) {
            setResponse(null);
            setIsLoading(true);
            setReasoningStep(0);

            // Simulation of reasoning for visual communication
            const reasoningInterval = setInterval(() => {
                setReasoningStep(prev => prev < REASONING_STEPS.length - 1 ? prev + 1 : prev);
            }, 1200);

            const valueData = getEstimatedValue();
            const contextData = {
                health: getHealthScore(),
                type: agentContext.type,
                data: agentContext.data,
                property: {
                    address: matrikkel.address,
                    yearBuilt: matrikkel.yearBuilt,
                    energyGrade: matrikkel.energyGrade,
                    bra: matrikkel.bra,
                    category: matrikkel.category
                },
                financials: {
                    current: valueData.current,
                    potential: valueData.potential,
                    enovaPotential: valueData.enovaPotential,
                    appreciation: valueData.verifiedAppreciation,
                    debt: valueData.debt
                },
                plans: jobs.filter(j => j.status === 'recommended').map(j => ({ title: j.tittel, cost: j.estimert_kost, enova: j.enovaSupport, driver: j.driver })),
                historyCount: fdvEvents.length,
                recentHistory: fdvEvents.slice(0, 10).map(e => ({ title: e.title, cost: e.cost, date: e.date, category: e.category }))
            };

            let query = "Analyser min eiendomsstatus og gi strategiske råd basert på verdigap og teknisk tilstand.";

            if (agentContext.type === 'job_insight') {
                query = `Analyser dette tiltaket: ${agentContext.data?.tittel}. Gi gevinst-vurdering, se det i sammenheng med byggeår ${matrikkel.yearBuilt} og sjekk Enova-potensial.`;
            } else if (agentContext.type === 'bank_lead') {
                query = `Basert på verifisert verdiøkning på ${valueData.verifiedAppreciation} kr og en nåverdi på ${valueData.current} kr, lag en finansiell argumentasjon for bedre lånerente.`;
            } else if (agentContext.type === 'insurance_audit') {
                query = `Lag en risikoprofil for forsikring. Vurder helse på ${getHealthScore()}% og systematisk vedlikehold basert på ${fdvEvents.length} logger.`;
            } else if (agentContext.type === 'enova_guide') {
                query = `Lag en optimal Enova-sekvens. Hvordan kan jeg kombinere mine ${contextData.plans.length} planlagte tiltak for å maksimere støtten på ${valueData.enovaPotential} kr?`;
            } else if (agentContext.type === 'fdv_analysis') {
                query = `Analyser vedlikeholdsloggen (FDV) for denne boligen bygget i ${matrikkel.yearBuilt}.
                Loggdata: ${JSON.stringify(contextData.recentHistory)}.

                Mandat:
                1. Evaluer frekvensen og kvaliteten på vedlikeholdet (basert på logg-innhold).
                2. Identifiser åpenbare mangler (f.eks. "Ingen utvendig behandling registrert siste 5 år").
                3. Gi en 'Teknisk Puls'-score (Lav/Middels/Høy) på hvor godt boligen driftes.
                4. Foreslå neste logiske trekk for å tette hull i dokumentasjonen.

                Svar kort, profesjonelt og strategisk.`;
            }

            askEraAssist(query, agentContext, userRole, JSON.stringify(contextData))
                .then(res => {
                    clearInterval(reasoningInterval);
                    setResponse(res);
                    setIsLoading(false);
                })
                .catch(() => {
                    clearInterval(reasoningInterval);
                    setIsLoading(false);
                });
        }
    }, [isAgentOpen, agentContext, getHealthScore, userRole, matrikkel.address]);

    if (!isAgentOpen) return null;

    const getIcon = () => {
        if (agentContext?.type === 'bank_lead') return <Icons.Scale size={32} />;
        if (agentContext?.type === 'insurance_audit') return <Icons.ShieldCheck size={32} />;
        if (agentContext?.type === 'enova_guide') return <Icons.Zap size={32} />;
        if (agentContext?.type === 'fdv_analysis') return <Icons.FileText size={32} />;
        return <Icons.Sparkles size={32} />;
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-end justify-center px-4 pb-4 sm:px-0 sm:pb-0 pointer-events-none">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl pointer-events-auto transition-opacity duration-500" onClick={closeAgent} />

            <div className={`
                relative pointer-events-auto w-full max-w-lg bg-[#0A0A0B] border border-white/10
                rounded-[40px] overflow-hidden flex flex-col mb-4 sm:mb-10
                animate-in slide-in-from-bottom-10 duration-500 shadow-[0_32px_80px_-12px_rgba(0,0,0,1)]
            `}>
                <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-2" />

                <div className="px-8 pt-6 pb-12 overflow-y-auto no-scrollbar max-h-[80vh]">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative w-20 h-20 mb-8 group">
                            <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center text-white z-10">
                                {getIcon()}
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="py-10 w-full space-y-8">
                                <LoadingState text="ERA Intelligence tenker..." />
                                <div className="space-y-3 px-6">
                                    {REASONING_STEPS.map((step, i) => (
                                        <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${i <= reasoningStep ? 'opacity-100 translate-x-0' : 'opacity-20 translate-x-4'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${i < reasoningStep ? 'bg-emerald-500' : 'bg-white animate-pulse'}`} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : response ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left w-full">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Dypdykk: Analyse</span>
                                        <div className="h-[1px] flex-1 bg-white/5" />
                                    </div>
                                    <p className="text-lg font-bold text-white leading-tight tracking-tight mb-2">
                                        {agentContext?.type === 'bank_lead' ? 'Finansiell Strategi' :
                                         (agentContext?.type === 'insurance_audit' ? 'Risikoprofil & Forsikring' :
                                         (agentContext?.type === 'fdv_analysis' ? 'Logg & Drift-status' : 'Systemoppsummering'))}
                                    </p>
                                    <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                                        {response.text}
                                    </p>
                                </div>

                                <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-[9px] text-zinc-600 font-bold leading-relaxed uppercase tracking-wider">
                                        Anbefalinger fra ERA er basert på automatiserte analyser og skal anses som beslutningsstøtte.
                                        Når ERA omtales som "agent", betyr dette en digital koordinator – ikke en juridisk representant.
                                    </p>
                                </div>

                                {response.actions && response.actions.length > 0 && (
                                    <div className="grid grid-cols-1 gap-3">
                                        {response.actions.map((action, idx) => (
                                            <button
                                                key={idx}
                                                className="w-full h-14 bg-white text-black rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl"
                                                onClick={() => {
                                                    closeAgent();
                                                }}
                                            >
                                                {action.label} <Icons.ArrowRight size={16} />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-zinc-500 italic py-10">Kunne ikke hente råd fra ERA.</p>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-black/40 flex justify-between items-center">
                    <button onClick={closeAgent} className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">
                        Lukk
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Core Engine v2.1</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
