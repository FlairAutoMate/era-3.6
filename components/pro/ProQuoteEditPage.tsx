
import React, { useState, useMemo, useEffect } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { NumberTicker, PrimaryButton } from '../widgets/SharedWidgets';

interface ProQuoteEditPageProps {
    jobId: string | null;
    onBack: () => void;
    onComplete: () => void;
}

const PRODUCT_CATALOG = [
    { id: 'p1', name: 'Lady Pure Color', supplier: 'Jotun', price: 899, img: 'https://www.jotun.com/images/no/lady-pure-color_tcm109-138379.png', category: 'Maling', coverage: 8 },
    { id: 'p2', name: 'Sperregrunn', supplier: 'Jotun', price: 649, img: 'https://www.jotun.com/images/no/kvist-og-sperregrunning_tcm109-138375.png', category: 'Grunning', coverage: 6 },
    { id: 'p3', name: 'Dekkpapp', supplier: 'Jordan', price: 199, img: '', category: 'Utstyr', coverage: 15 },
    { id: 'p4', name: 'Rullesett Ultimate', supplier: 'Jordan', price: 349, img: '', category: 'Verktøy', coverage: 0 },
    { id: 'p5', name: 'Maskeringstape', supplier: 'Tesa', price: 89, img: '', category: 'Utstyr', coverage: 0 },
];

export const ProQuoteEditPage: React.FC<ProQuoteEditPageProps> = ({ jobId, onBack, onComplete }) => {
    const { jobs, updateJobDetails } = useAppStore();
    const job = useMemo(() => jobs.find(j => j.id === jobId), [jobs, jobId]);

    const [markup, setMarkup] = useState(25);
    const [sqm, setSqm] = useState(42);
    const [selectedProducts, setSelectedProducts] = useState<{item: any, qty: number}[]>([
        { item: PRODUCT_CATALOG[0], qty: Math.ceil(42 / 8) }, // Auto-calc based on sqm
        { item: PRODUCT_CATALOG[2], qty: 2 }
    ]);
    const [hourlyRate, setHourlyRate] = useState(950);
    const [hours, setHours] = useState(Math.ceil(42 * 0.4)); // Auto-calc labor
    const [activeTab, setActiveTab] = useState<'scan' | 'materials' | 'labor'>('scan');
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsScanning(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    // Auto-update quantities when SQM changes (Smart logic)
    useEffect(() => {
        setSelectedProducts(prev => prev.map(p => {
            if (p.item.coverage > 0) {
                return { ...p, qty: Math.ceil(sqm / p.item.coverage) };
            }
            return p;
        }));
        setHours(Math.ceil(sqm * 0.4));
    }, [sqm]);

    if (!job) return null;

    const materialCost = selectedProducts.reduce((acc, p) => acc + (p.item.price * p.qty), 0);
    const laborCost = hourlyRate * hours;
    const subTotal = materialCost + laborCost;
    const totalCost = Math.round(subTotal * (1 + markup / 100));

    const toggleProduct = (product: any) => {
        const exists = selectedProducts.find(p => p.item.id === product.id);
        if (exists) {
            setSelectedProducts(prev => prev.filter(p => p.item.id !== product.id));
        } else {
            const qty = product.coverage > 0 ? Math.ceil(sqm / product.coverage) : 1;
            setSelectedProducts(prev => [...prev, { item: product, qty }]);
        }
    };

    const handleSend = () => {
        updateJobDetails(job.id, {
            proff_pris: totalCost,
            beskrivelse: `Inkluderer ${sqm}m² overflatebehandling. Produkter: ${selectedProducts.map(p => p.item.name).join(', ')}.`,
            status: 'quoted'
        });
        onComplete();
    };

    return (
        <div className="flex flex-col h-screen bg-[#050505] animate-era-in font-sans">
            {/* Header */}
            <header className="px-6 py-6 border-b border-white/5 bg-[#050505] z-20 flex justify-between items-center shrink-0">
                <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                    <Icons.ArrowLeft size={20} /> <span className="text-sm font-bold">Avbryt</span>
                </button>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Total Eks. Mva</span>
                    <div className="text-2xl font-mono font-bold text-white tracking-tighter">
                        <NumberTicker value={totalCost} />,-
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative">

                {/* 1. VISUAL SCANNER */}
                <div className="relative h-[40vh] w-full bg-zinc-900 border-b border-white/10 group overflow-hidden">
                    <img src={job.before_images[0]} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-all duration-700" />

                    {/* AI Mesh Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Horizontal Scanners */}
                        <div className={`absolute top-1/4 left-0 w-full h-[1px] bg-indigo-500/30 shadow-[0_0_15px_#6366f1] transition-all duration-[3000ms] ${isScanning ? 'translate-y-full opacity-100' : 'top-1/2 opacity-0'}`} />
                        <div className={`absolute top-3/4 left-0 w-full h-[1px] bg-indigo-500/30 shadow-[0_0_15px_#6366f1] transition-all duration-[2500ms] ${isScanning ? '-translate-y-full opacity-100' : 'top-1/2 opacity-0'}`} />

                        {/* Static Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />

                        {/* Detected Points */}
                        {!isScanning && (
                            <>
                                <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-white rounded-full animate-ping" />
                                <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-indigo-500 border border-white rounded-full" />
                                <div className="absolute top-1/3 left-1/4 ml-4 mt-[-6px] bg-black/60 backdrop-blur px-2 py-1 rounded border border-white/20 text-[9px] font-mono text-white animate-in fade-in slide-in-from-left-2">
                                    VEGG: GIPS
                                </div>

                                <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-white rounded-full animate-ping [animation-delay:0.2s]" />
                                <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-indigo-500 border border-white rounded-full" />
                                <div className="absolute bottom-1/3 right-1/3 ml-4 mt-[-6px] bg-black/60 backdrop-blur px-2 py-1 rounded border border-white/20 text-[9px] font-mono text-white animate-in fade-in slide-in-from-left-2 [animation-delay:0.2s]">
                                    AREAL: {sqm}m²
                                </div>
                            </>
                        )}
                    </div>

                    {/* Manual Override Controls */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                        <div className="flex items-center gap-3 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 pl-4">
                            <span className="text-xs font-bold text-white">{sqm} m²</span>
                            <div className="flex gap-1">
                                <button onClick={() => setSqm(s => Math.max(1, s - 1))} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 text-white"><Icons.Minus size={14}/></button>
                                <button onClick={() => setSqm(s => s + 1)} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 text-white"><Icons.Plus size={14}/></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. CONTROLS CONTAINER */}
                <div className="px-6 py-8 pb-32 max-w-4xl mx-auto space-y-10">

                    {/* Material Picker */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Velg Materiell</h3>
                            <button className="text-[10px] font-bold text-indigo-400 hover:text-white transition-colors">Se Mal Proff katalog</button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {PRODUCT_CATALOG.map(prod => {
                                const isSelected = selectedProducts.find(p => p.item.id === prod.id);
                                return (
                                    <button
                                        key={prod.id}
                                        onClick={() => toggleProduct(prod)}
                                        className={`
                                            relative p-4 rounded-2xl border text-left transition-all duration-300 group
                                            ${isSelected ? 'bg-indigo-600/10 border-indigo-500/50' : 'bg-[#0A0A0B] border-white/5 hover:border-white/10'}
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[10px] font-bold text-black shadow-sm">
                                                {prod.supplier.charAt(0)}
                                            </div>
                                            {isSelected && (
                                                <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center animate-in zoom-in">
                                                    <Icons.Check size={12} className="text-white" strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-wide">{prod.category}</p>
                                            <h4 className="text-sm font-bold text-white leading-tight">{prod.name}</h4>
                                            <p className="text-xs font-mono text-zinc-400 mt-2">{prod.price},-</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Labor & Margin Sliders */}
                    <section className="bg-[#0A0A0B] border border-white/5 rounded-3xl p-6 space-y-8">
                        <div>
                            <div className="flex justify-between mb-3">
                                <span className="text-xs font-bold text-white flex items-center gap-2"><Icons.Clock size={14} className="text-zinc-500"/> Arbeidstimer</span>
                                <span className="text-xs font-mono text-zinc-400">{hours}t x {hourlyRate},-</span>
                            </div>
                            <input
                                type="range"
                                min="1" max="100"
                                value={hours}
                                onChange={(e) => setHours(Number(e.target.value))}
                                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-3">
                                <span className="text-xs font-bold text-white flex items-center gap-2"><Icons.TrendingUp size={14} className="text-zinc-500"/> Påslag / Margin</span>
                                <span className="text-xs font-mono text-emerald-400">{markup}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="50"
                                value={markup}
                                onChange={(e) => setMarkup(Number(e.target.value))}
                                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>
                    </section>

                </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="border-t border-white/10 bg-[#050505]/90 backdrop-blur-xl p-4 pb-8 z-30">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <div className="flex-1">
                        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">Netto Profitt</p>
                        <p className="text-xl font-bold text-white">{(totalCost - subTotal).toLocaleString()},-</p>
                    </div>
                    <PrimaryButton onClick={handleSend} className="w-48 h-14 shadow-lg shadow-indigo-500/20">
                        Send Tilbud <Icons.Send size={16} />
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};
