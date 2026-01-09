
import React, { useState } from 'react';
import { Icons } from '../Icons';
// Fixed: Removed non-existent PAINT_PRODUCTS import
import { AuraCard } from '../widgets/SharedWidgets';

const PALETTES = [
    {
        id: 'nordic',
        name: 'Nordic Calm',
        colors: [
            { name: 'Tidløs', code: 'JOT 1024', ncs: 'S1002-Y', hex: '#e3e1d9' },
            { name: 'Waswashed Linen', code: 'JOT 10679', ncs: 'S2005-Y20R', hex: '#cbc3b7' },
            { name: 'Grå skifer', code: 'JOT 1462', ncs: 'S4502-Y', hex: '#8e8b82' },
            { name: 'Elegant', code: 'JOT 1434', ncs: 'S7502-Y', hex: '#4b4a46' },
        ]
    },
    {
        id: 'earth',
        name: 'Warm Earth',
        colors: [
            { name: 'Space', code: 'JOT 10678', ncs: '1704-Y19R', hex: '#d9d1c1' },
            { name: 'Sands beige', code: 'JOT 1140', ncs: 'S2005-Y30R', hex: '#cdc3b1' },
            { name: 'Mohair', code: 'JOT 1233', ncs: 'S3005-Y20R', hex: '#afa594' },
            { name: 'Muskatnøtt', code: 'JOT 1929', ncs: 'S4005-Y20R', hex: '#948a79' },
        ]
    }
];

export const ColorsPage = () => {
    const [activePalette, setActivePalette] = useState(PALETTES[0]);
    const [selectedColor, setSelectedColor] = useState(PALETTES[0].colors[0]);

    return (
        <div className="min-h-screen bg-[#050505] pb-32 p-6 md:p-10 max-w-5xl mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-2 text-zinc-500 mb-2 text-sm font-bold uppercase tracking-widest">
                    <Icons.Palette size={16} />
                    <span>Mesterfarge Utvalg</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Fargevelger</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Selector Side */}
                <div className="lg:col-span-7 space-y-8">
                    {/* Palette Tabs */}
                    <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                        {PALETTES.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setActivePalette(p)}
                                className={`flex-1 py-3 px-4 rounded-lg text-xs font-black uppercase tracking-tighter transition-all ${activePalette.id === p.id ? 'bg-white text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>

                    {/* Color Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {activePalette.colors.map(c => (
                            <button
                                key={c.code}
                                onClick={() => setSelectedColor(c)}
                                className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selectedColor.code === c.code ? 'border-white scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 'border-transparent hover:border-white/20'}`}
                            >
                                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110" style={{ backgroundColor: c.hex }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-4 left-4 right-4 text-left translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                    <span className="block text-white font-bold text-sm">{c.name}</span>
                                    <span className="block text-white/60 text-[10px] font-mono">{c.code}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Detail Side (The OS Part) */}
                <div className="lg:col-span-5">
                    <div className="sticky top-10 space-y-6 animate-in slide-in-from-right-4">
                        <div className="bg-[#111214] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
                            <div className="h-40 w-full" style={{ backgroundColor: selectedColor.hex }}></div>
                            <div className="p-8">
                                <div className="mb-8">
                                    <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{selectedColor.name}</h3>
                                    <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Jotun Proff-serien</p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase">System-kode</span>
                                        <span className="font-mono text-sm text-white">{selectedColor.code}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase">NCS-referanse</span>
                                        <span className="font-mono text-sm text-white">{selectedColor.ncs}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase">Anbefalt produkt</span>
                                        <span className="text-sm text-emerald-400 font-bold">Lady Pure Color</span>
                                    </div>
                                </div>

                                <button className="w-full h-16 bg-white text-black rounded-2xl font-black uppercase tracking-tighter text-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-xl">
                                    <Icons.Check size={20} /> Lagre i Prosjekt
                                </button>
                            </div>
                        </div>

                        <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-2xl flex gap-4 items-start">
                            <Icons.Sparkles size={20} className="text-blue-400 shrink-0 mt-1" />
                            <p className="text-xs text-blue-200/70 leading-relaxed">
                                <strong>ERA Tips:</strong> Denne fargen harmonerer godt med ditt registrerte gulv i stuen (Eikeparkett).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
