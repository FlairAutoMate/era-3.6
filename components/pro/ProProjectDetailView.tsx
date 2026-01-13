
import React, { useState, useMemo } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { AuraCard, PrimaryButton } from '../widgets/SharedWidgets';
import { TG_COLORS } from '../../constants';
import { GoogleGenAI, Type } from "@google/genai";
import { MagicLink } from '../widgets/MagicLink';
import { MagicLinkFlow } from './MagicLinkFlow';

interface ProProjectDetailViewProps {
    jobId: string;
    onBack: () => void;
}

type Tab = 'overview' | 'checklist' | 'docs';

export const ProProjectDetailView: React.FC<ProProjectDetailViewProps> = ({ jobId, onBack }) => {
    const { jobs, updateJobStatus } = useAppStore();
    const job = useMemo(() => jobs.find(j => j.id === jobId), [jobs, jobId]);
    const [activeTab, setActiveTab] = useState<Tab>('checklist'); // Default to checklist in Field Mode logic

    // Field Mode Toggle
    const [fieldMode, setFieldMode] = useState(false);

    // Mal Proff State
    const [isSyncingMaterials, setIsSyncingMaterials] = useState(false);
    const [materials, setMaterials] = useState<any[]>([]);

    // Checklist State
    const [checklist, setChecklist] = useState([
        { id: 'ks-1', phase: 'Oppstart', label: 'HMS-skilt og sperrebånd oppsatt', checked: false, required: true },
        { id: 'ks-2', phase: 'Oppstart', label: 'Underlag kontrollert for fukt', checked: false, required: true },
        { id: 'ks-3', phase: 'Oppstart', label: 'Tildekking av vinduer/dører utført', checked: true, required: false },
        { id: 'ks-4', phase: 'Utførelse', label: 'Grunning påført (Metode: Sprøyte)', checked: false, required: true },
        { id: 'ks-5', phase: 'Utførelse', label: 'Mellomstrøk utført', checked: false, required: true },
        { id: 'ks-6', phase: 'Avslutning', label: 'Sluttstrøk utført', checked: false, required: true },
        { id: 'ks-7', phase: 'Avslutning', label: 'Avfall fjernet og sortert', checked: false, required: true },
        { id: 'ks-8', phase: 'Avslutning', label: 'Sluttkontroll med kunde gjennomført', checked: false, required: true },
    ]);

    if (!job) return null;

    const milestones = [
        { id: '1', label: 'Rigging', status: job.status === 'in_progress' ? 'active' : 'pending' },
        { id: '2', label: 'Grunnarbeid', status: 'pending' },
        { id: '3', label: 'Utførelse', status: 'pending' },
        { id: '4', label: 'Sluttkontroll', status: 'pending' }
    ];

    const completedChecks = checklist.filter(c => c.checked).length;
    const progress = Math.round((completedChecks / checklist.length) * 100);

    const toggleCheck = (id: string) => {
        setChecklist(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
    };

    const syncMalProff = async () => {
        setIsSyncingMaterials(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Lag en profesjonell plukkliste for Mal Proff basert på dette oppdraget: "${job.tittel} - ${job.beskrivelse}".
                Ta med maling, koster, tildekking og vaskemiddel. Returner JSON-liste med varenavn, mengde og NOBB-nummer (fiktivt).`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                qty: { type: Type.STRING },
                                nobb: { type: Type.STRING }
                            },
                            required: ["name", "qty", "nobb"]
                        }
                    }
                }
            });
            if (response.text) setMaterials(JSON.parse(response.text));
        } catch (e) {
            console.error("Mal Proff sync failed", e);
        } finally {
            setIsSyncingMaterials(false);
        }
    };

    // --- FIELD MODE RENDER ---
    if (fieldMode) {
        return (
            <div className="min-h-screen bg-black text-white p-4 font-sans animate-in fade-in duration-300">
                {/* Field Header */}
                <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
                    <button onClick={() => setFieldMode(false)} className="flex items-center gap-2 p-4 bg-zinc-900 rounded-xl">
                        <Icons.LogOut size={24} />
                        <span className="font-bold text-sm">Avslutt Feltmodus</span>
                    </button>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-500">{progress}%</div>
                        <div className="text-xs text-zinc-500 font-bold uppercase">Progresjon</div>
                    </div>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-black tracking-tight mb-2 leading-tight">{job.tittel}</h1>
                    <p className="text-zinc-400 font-medium text-lg">{job.adresse}</p>
                </div>

                {/* Massive Checklist Buttons */}
                <div className="space-y-4 mb-24">
                    {checklist.map(item => (
                        <button
                            key={item.id}
                            onClick={() => toggleCheck(item.id)}
                            className={`
                                w-full p-6 rounded-2xl flex items-center justify-between border-2 transition-all active:scale-95
                                ${item.checked
                                    ? 'bg-emerald-900/30 border-emerald-500 text-white'
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-300'}
                            `}
                        >
                            <span className="text-lg font-bold text-left">{item.label}</span>
                            <div className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center ${item.checked ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-zinc-600'}`}>
                                {item.checked && <Icons.Check size={28} strokeWidth={4} />}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Sticky Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-black border-t border-zinc-800 flex gap-4">
                    <button className="flex-1 h-20 bg-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-1 active:bg-zinc-700">
                        <Icons.Camera size={28} />
                        <span className="text-xs font-black uppercase">Dokumenter</span>
                    </button>
                    <button className="flex-1 h-20 bg-emerald-600 text-white rounded-2xl flex flex-col items-center justify-center gap-1 active:bg-emerald-700">
                        <Icons.CheckCircle size={28} />
                        <span className="text-xs font-black uppercase">Sjekk inn</span>
                    </button>
                </div>
            </div>
        );
    }

    // --- STANDARD OFFICE VIEW ---
    return (
        <div className="max-w-6xl mx-auto px-6 md:px-8 pt-8 pb-32 animate-era-in">
            {/* --- HEADER --- */}
            <header className="mb-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
                        <Icons.ArrowLeft size={12} /> Tilbake til oversikt
                    </button>
                    <button
                        onClick={() => setFieldMode(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full hover:bg-emerald-500/20 transition-all"
                    >
                        <Icons.Smartphone size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Bytt til Feltmodus</span>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                             <div className={`px-2 py-0.5 rounded text-[9px] font-black text-white ${TG_COLORS[job.tg_score as keyof typeof TG_COLORS] || 'bg-zinc-500'}`}>TG {job.tg_score ?? 0}</div>
                             <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">{job.adresse}</span>
                        </div>
                        <h1 className="text-4xl font-bold text-white tracking-tight leading-none mb-4">{job.tittel}</h1>

                        {/* Tab Navigation */}
                        <div className="flex gap-2">
                            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Prosjekt-oversikt" icon={Icons.LayoutDashboard} />
                            <TabButton active={activeTab === 'checklist'} onClick={() => setActiveTab('checklist')} label={`KS & Sjekkliste (${completedChecks}/${checklist.length})`} icon={Icons.CheckSquare} />
                            <TabButton active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} label="Dokumenter" icon={Icons.FolderOpen} />
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center bg-white/5 border border-white/10 rounded-full pr-6 pl-2 gap-2 h-10">
                             <MagicLink context={`job-${job.id}`} minimal />
                             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Del Fremdrift</span>
                        </div>
                        <PrimaryButton onClick={() => updateJobStatus(job.id, 'completed')} variant="white" className="h-14 shadow-lg shadow-emerald-500/10">
                            <Icons.CheckCircle size={16} /> Fullfør & Fakturer
                        </PrimaryButton>
                    </div>
                </div>
            </header>

            {/* --- CONTENT --- */}
            <div className="min-h-[600px]">

                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
                        <div className="lg:col-span-7 space-y-8">
                            <AuraCard className="p-8 bg-[#0D0D0E] border-white/5">
                                <h3 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] mb-8">MILEPÆLER & FREMDRIFT</h3>
                                <div className="space-y-6">
                                    {milestones.map((m, idx) => (
                                        <div key={m.id} className="flex items-start gap-6 relative group">
                                            {idx < milestones.length - 1 && (
                                                <div className="absolute left-[15px] top-8 bottom-[-24px] w-[1px] bg-zinc-800" />
                                            )}
                                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${m.status === 'active' ? 'bg-indigo-600 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-black border-zinc-800 text-zinc-700'}`}>
                                                {m.status === 'active' ? <Icons.Play size={12} fill="currentColor" /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h4 className={`text-base font-bold ${m.status === 'active' ? 'text-white' : 'text-zinc-500'}`}>{m.label}</h4>
                                                    {m.status === 'active' && <span className="text-[9px] font-black uppercase text-indigo-400 animate-pulse">Pågår</span>}
                                                </div>
                                                <p className="text-xs text-zinc-600">Standard prosedyre verifisert av ERA.</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AuraCard>

                            <AuraCard className="p-8 bg-[#0D0D0E] border-white/5">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em]">MAL PROFF SYNK</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Konto: Mesterfarge Oslo</span>
                                    </div>
                                </div>

                                {materials.length > 0 ? (
                                    <div className="space-y-3 mb-8">
                                        {materials.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                                                <div>
                                                    <p className="text-sm font-bold text-white">{item.name}</p>
                                                    <p className="text-[9px] text-zinc-600 font-mono uppercase">NOBB: {item.nobb}</p>
                                                </div>
                                                <span className="text-xs font-bold text-indigo-400">{item.qty}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-10 border border-dashed border-white/5 rounded-[32px] text-center mb-8">
                                        <Icons.Layers size={32} className="mx-auto text-zinc-800 mb-4" />
                                        <p className="text-xs text-zinc-600 max-w-[200px] mx-auto leading-relaxed">Klikk synkroniser for å hente anbefalt utstyr fra Mal Proff-katalogen.</p>
                                    </div>
                                )}

                                <PrimaryButton
                                    onClick={syncMalProff}
                                    disabled={isSyncingMaterials}
                                    variant={materials.length > 0 ? 'glass' : 'white'}
                                    className="w-full h-14"
                                >
                                    {isSyncingMaterials ? <Icons.Loader2 size={16} className="animate-spin" /> : <Icons.RefreshCw size={16} />}
                                    {materials.length > 0 ? 'Oppdater plukkliste' : 'Synkroniser med Mal Proff'}
                                </PrimaryButton>
                            </AuraCard>
                        </div>

                        <div className="lg:col-span-5 space-y-6">
                            <AuraCard className="p-8 bg-[#0D0D0E] border-white/5">
                                <h3 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] mb-6">BEFARINGSDATA (ERA VISION)</h3>
                                <div className="aspect-video rounded-[32px] overflow-hidden border border-white/10 mb-6 shadow-2xl relative group">
                                    <img src={job.before_images[0]} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 transition-all duration-700" />
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                                        <Icons.ScanLine size={12} className="text-indigo-400"/>
                                        <span className="text-[9px] font-bold text-white">AI-Analysert</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between py-2 border-b border-white/5">
                                        <span className="text-xs text-zinc-500 font-medium">Estimert Areal</span>
                                        <span className="text-xs font-bold text-white">142 m²</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-white/5">
                                        <span className="text-xs text-zinc-500 font-medium">Beregnet Tidsbruk</span>
                                        <span className="text-xs font-bold text-white">32 timer</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-white/5">
                                        <span className="text-xs text-zinc-500 font-medium">Fargevalg</span>
                                        <span className="text-xs font-bold text-indigo-400">JOT 10679 Washed Linen</span>
                                    </div>
                                </div>
                            </AuraCard>

                            <MagicLinkFlow />
                        </div>
                    </div>
                )}

                {/* TAB 2: CHECKLIST (Standard View) */}
                {activeTab === 'checklist' && (
                    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <AuraCard className="p-10 bg-[#0A0A0B] border-white/5">
                            <div className="flex justify-between items-end mb-10">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">KS & Kvalitetssikring</h2>
                                    <p className="text-zinc-500 text-sm">Obligatorisk dokumentasjon iht. Plan- og bygningsloven.</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-bold text-white font-display mb-1">{progress}%</div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Fullført</span>
                                </div>
                            </div>

                            <div className="space-y-10">
                                {['Oppstart', 'Utførelse', 'Avslutning'].map(phase => {
                                    const items = checklist.filter(c => c.phase === phase);
                                    if (items.length === 0) return null;

                                    return (
                                        <div key={phase} className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-[1px] w-6 bg-zinc-800" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">{phase}</span>
                                                <div className="h-[1px] flex-1 bg-zinc-800" />
                                            </div>
                                            <div className="space-y-2">
                                                {items.map(item => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => toggleCheck(item.id)}
                                                        className={`
                                                            p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group
                                                            ${item.checked
                                                                ? 'bg-emerald-900/10 border-emerald-500/20'
                                                                : 'bg-zinc-900/30 border-white/5 hover:bg-zinc-900/60'}
                                                        `}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`
                                                                w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                                                                ${item.checked
                                                                    ? 'bg-emerald-500 border-emerald-500 text-black'
                                                                    : 'border-zinc-600 group-hover:border-zinc-400'}
                                                            `}>
                                                                {item.checked && <Icons.Check size={14} strokeWidth={4} />}
                                                            </div>
                                                            <span className={`text-sm font-medium ${item.checked ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                                                                {item.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </AuraCard>
                    </div>
                )}

                {/* TAB 3: DOCS */}
                {activeTab === 'docs' && (
                    <div className="max-w-4xl mx-auto grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <DocCard title="Oppdragsavtale" type="PDF" date="12.03.2024" />
                        <DocCard title="Endringsmelding #1" type="PDF" date="14.03.2024" />
                        <DocCard title="FDV-Dokumentasjon (Utkast)" type="PDF" date="Under arbeid" pending />
                    </div>
                )}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, label, icon: Icon }: any) => (
    <button
        onClick={onClick}
        className={`
            px-6 py-3 rounded-xl flex items-center gap-3 transition-all text-[11px] font-black uppercase tracking-widest
            ${active
                ? 'bg-white text-black shadow-lg'
                : 'bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10'}
        `}
    >
        <Icon size={16} />
        {label}
    </button>
);

const DocCard = ({ title, type, date, pending }: any) => (
    <div className="p-6 bg-[#0A0A0B] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-indigo-500/30 transition-all cursor-pointer">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${pending ? 'bg-amber-500/10 text-amber-500' : 'bg-zinc-900 text-zinc-400 group-hover:text-white'}`}>
                <Icons.FileText size={20} />
            </div>
            <div>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{title}</h4>
                <p className="text-[10px] font-mono text-zinc-600">{date} • {type}</p>
            </div>
        </div>
        {!pending && <Icons.Download size={16} className="text-zinc-600 group-hover:text-white" />}
    </div>
);
