
import React, { useState, useEffect } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { SlideOver, FileUpload } from '../widgets/SharedWidgets';
import { FDVCategory, FDVEvent } from '../../types';

interface FDVWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORIES = [
    { id: 'maintenance', label: 'Arbeid & Vedlikehold', icon: Icons.Hammer, desc: 'Utført arbeid av håndverker eller egeninnsats.' },
    { id: 'system', label: 'Utstyr & Tekniske System', icon: Icons.Zap, desc: 'Sikringsskap, VVS, ventilasjon, hvitevarer.' },
    { id: 'upgrade', label: 'Overflater & Oppussing', icon: Icons.Layers, desc: 'Maling, gulv, tak og fasade.' },
];

const TEMPLATES = [
    {
        id: 'filter',
        label: 'Filterskifte',
        icon: Icons.Wind,
        category: 'system',
        title: 'Bytte av ventilasjonsfilter',
        supplier: 'Egeninnsats',
        intervalMonths: 6,
        desc: '6 mnd intervall'
    },
    {
        id: 'heatpump',
        label: 'Varmepumpe-service',
        icon: Icons.Thermometer,
        category: 'system',
        title: 'Periodisk service: Varmepumpe',
        supplier: 'Sertifisert Tekniker',
        intervalMonths: 24,
        desc: 'Anbefalt 2. hvert år'
    },
    {
        id: 'fire',
        label: 'Brannsjekk',
        icon: Icons.ShieldAlert,
        category: 'system',
        title: 'Egenkontroll av brannutstyr',
        supplier: 'Egeninnsats',
        intervalMonths: 12,
        desc: 'Årlig rutine'
    },
    {
        id: 'paint',
        label: 'Maling Interiør',
        icon: Icons.Palette,
        category: 'upgrade',
        title: 'Maling av oppholdsrom',
        supplier: 'Egeninnsats',
        intervalMonths: 84,
        desc: 'Vedlikehold flater'
    }
];

export const FDVWizard: React.FC<FDVWizardProps> = ({ isOpen, onClose }) => {
    const { addDocument } = useAppStore();
    const [step, setStep] = useState(1);

    // Form State
    const [category, setCategory] = useState<FDVCategory>('maintenance');
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [supplier, setSupplier] = useState('');
    const [cost, setCost] = useState('');
    const [description, setDescription] = useState('');
    const [warrantyDate, setWarrantyDate] = useState('');
    const [nextCheckDate, setNextCheckDate] = useState('');

    // Image State
    const [beforeImage, setBeforeImage] = useState<File | null>(null);
    const [afterImage, setAfterImage] = useState<File | null>(null);

    const applyTemplate = (tpl: typeof TEMPLATES[0]) => {
        setCategory(tpl.category as FDVCategory);
        setTitle(tpl.title);
        setSupplier(tpl.supplier);

        const nextDate = new Date();
        nextDate.setMonth(nextDate.getMonth() + tpl.intervalMonths);
        setNextCheckDate(nextDate.toISOString().split('T')[0]);

        setStep(2);
    };

    // AI Logic Simulation for next check date
    useEffect(() => {
        if (title.length > 3 && !nextCheckDate) {
            const today = new Date();
            let suggestion = "";
            const lowerTitle = title.toLowerCase();

            if (lowerTitle.includes('maling') || lowerTitle.includes('beis')) {
                const future = new Date(today.setFullYear(today.getFullYear() + 5));
                suggestion = future.toISOString().split('T')[0];
            } else if (lowerTitle.includes('filter') || lowerTitle.includes('rens') || lowerTitle.includes('service')) {
                const future = new Date(today.setFullYear(today.getFullYear() + 1));
                suggestion = future.toISOString().split('T')[0];
            } else if (lowerTitle.includes('tak') || lowerTitle.includes('pipe')) {
                const future = new Date(today.setFullYear(today.getFullYear() + 2));
                suggestion = future.toISOString().split('T')[0];
            }

            if (suggestion) {
                setNextCheckDate(suggestion);
            }
        }
    }, [title]);

    const handleSave = () => {
        const newDoc: FDVEvent = {
            id: `fdv-${Date.now()}`,
            title,
            date,
            description,
            category,
            cost: Number(cost),
            performedBy: supplier,
            warrantyDate,
            nextCheckDate,
            images: {
                before: beforeImage ? URL.createObjectURL(beforeImage) : undefined,
                after: afterImage ? URL.createObjectURL(afterImage) : undefined
            },
            fileUrl: afterImage ? URL.createObjectURL(afterImage) : (beforeImage ? URL.createObjectURL(beforeImage) : undefined)
        };

        addDocument(newDoc);
        onClose();

        setTimeout(() => {
            setStep(1);
            setTitle('');
            setSupplier('');
            setCost('');
            setDescription('');
            setBeforeImage(null);
            setAfterImage(null);
            setNextCheckDate('');
            setWarrantyDate('');
        }, 500);
    };

    const handleCategorySelect = (catId: string) => {
        setCategory(catId as FDVCategory);
        setStep(2);
    };

    const ImagePreview = ({ file, onRemove, label }: { file: File, onRemove: () => void, label: string }) => (
        <div className="relative group aspect-square bg-zinc-900 rounded-xl overflow-hidden border border-white/10">
            <img src={URL.createObjectURL(file)} alt={label} className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onRemove} className="p-2 bg-red-600 rounded-full text-white shadow-lg">
                    <Icons.Trash2 size={16} />
                </button>
                <span className="text-[9px] font-black uppercase text-white mt-2 tracking-widest">{label}</span>
            </div>
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded border border-white/10">
                 <span className="text-[8px] font-black uppercase text-zinc-300 tracking-widest">{label}</span>
            </div>
        </div>
    );

    return (
        <SlideOver isOpen={isOpen} onClose={onClose} title={step === 1 ? 'Start registrering' : 'Utfylling'}>
            <div className="pb-24">
                {step === 1 && (
                    <div className="space-y-8 animate-era-in">
                        <section>
                            <h3 className="text-[10px] font-black uppercase text-zinc-600 tracking-widest mb-4 ml-1">Bruk en smart-mal</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {TEMPLATES.map(tpl => (
                                    <button
                                        key={tpl.id}
                                        onClick={() => applyTemplate(tpl)}
                                        className="text-left p-4 bg-[#111416] border border-white/5 rounded-2xl hover:border-indigo-500/30 hover:bg-zinc-900 transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-indigo-400 mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            <tpl.icon size={20} />
                                        </div>
                                        <h4 className="font-bold text-white text-xs mb-0.5">{tpl.label}</h4>
                                        <p className="text-[9px] text-zinc-500 font-medium">{tpl.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-[10px] font-black uppercase text-zinc-600 tracking-widest mb-4 ml-1">Eller velg kategori</h3>
                            <div className="space-y-3">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategorySelect(cat.id)}
                                        className="w-full text-left p-5 bg-[#111416] border border-white/5 rounded-2xl hover:border-white/20 hover:bg-zinc-900 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                                                <cat.icon size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-white text-base">{cat.label}</h3>
                                                <p className="text-xs text-zinc-600 mt-0.5">{cat.desc}</p>
                                            </div>
                                            <Icons.ChevronRight className="text-zinc-700" size={20} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4">
                        <div className="space-y-3">
                            <label className="text-xs font-black text-zinc-600 uppercase tracking-widest block">Dokumentasjon (Bilder)</label>
                            <div className="grid grid-cols-2 gap-4">
                                {beforeImage ? (
                                    <ImagePreview file={beforeImage} onRemove={() => setBeforeImage(null)} label="Før" />
                                ) : (
                                    <FileUpload
                                        label="Last opp før"
                                        onFileSelect={setBeforeImage}
                                        className="h-28"
                                    />
                                )}

                                {afterImage ? (
                                    <ImagePreview file={afterImage} onRemove={() => setAfterImage(null)} label="Etter" />
                                ) : (
                                    <FileUpload
                                        label="Last opp etter"
                                        onFileSelect={setAfterImage}
                                        className="h-28"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest block mb-2">Tittel</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#111416] border border-white/10 rounded-xl p-4 text-white text-sm focus:border-indigo-500 outline-none placeholder-zinc-700 transition-all"
                                    placeholder="F.eks. Skiftet kledning på sørvegg"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black text-zinc-600 uppercase tracking-widest block mb-2">Dato Utført</label>
                                    <div className="relative">
                                        <Icons.Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                                        <input
                                            type="date"
                                            className="w-full bg-[#111416] border border-white/10 rounded-xl p-4 pl-10 text-white text-sm focus:border-indigo-500 outline-none"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-black text-zinc-600 uppercase tracking-widest block mb-2">Pris (NOK)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-[#111416] border border-white/10 rounded-xl p-4 text-white text-sm focus:border-indigo-500 outline-none"
                                        placeholder="0"
                                        value={cost}
                                        onChange={(e) => setCost(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest block mb-2">Utført av</label>
                                <div className="relative">
                                    <Icons.Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                                    <input
                                        type="text"
                                        className="w-full bg-[#111416] border border-white/10 rounded-xl p-4 pl-10 text-white text-sm focus:border-indigo-500 outline-none placeholder-zinc-700"
                                        placeholder="Firmanavn eller 'Egeninnsats'"
                                        value={supplier}
                                        onChange={(e) => setSupplier(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black text-zinc-600 uppercase tracking-widest block mb-2">Garantiutløp</label>
                                    <input
                                        type="date"
                                        className="w-full bg-[#111416] border border-white/10 rounded-xl p-4 text-zinc-400 text-sm focus:border-indigo-500 outline-none"
                                        value={warrantyDate}
                                        onChange={(e) => setWarrantyDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-zinc-600 uppercase tracking-widest block mb-2 flex items-center gap-2">
                                        Neste Sjekk
                                        {nextCheckDate && <Icons.Sparkles size={10} className="text-indigo-400" />}
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full bg-[#111416] border border-white/10 rounded-xl p-4 text-zinc-400 text-sm focus:border-indigo-500 outline-none transition-all"
                                        value={nextCheckDate}
                                        onChange={(e) => setNextCheckDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest block mb-2">Beskrivelse / Notater</label>
                                <textarea
                                    rows={4}
                                    className="w-full bg-[#111416] border border-white/10 rounded-xl p-4 text-white text-sm focus:border-indigo-500 outline-none placeholder-zinc-700 resize-none"
                                    placeholder="Noter detaljer som materialvalg, fargekoder eller spesielle hensyn..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="w-1/3 py-4 bg-zinc-900 text-zinc-400 rounded-xl font-black uppercase tracking-widest text-[10px] hover:text-white"
                            >
                                Tilbake
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!title}
                                className="flex-1 py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                            >
                                <Icons.Check size={18} /> Lagre i journal
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </SlideOver>
    );
};
