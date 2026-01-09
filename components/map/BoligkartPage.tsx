
import React, { useState } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { AuraCard } from '../widgets/SharedWidgets';
import { MatrikkelData } from '../../types';

export const BoligkartPage: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
    const { properties, setActiveProperty, activePropertyIndex } = useAppStore();
    const [selectedProperty, setSelectedProperty] = useState<MatrikkelData | null>(properties[activePropertyIndex]);

    const handleSelect = (prop: MatrikkelData, index: number) => {
        setSelectedProperty(prop);
        setActiveProperty(index);
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col font-sans overflow-hidden animate-era-in">
            {/* Header overlay */}
            <div className="absolute top-0 left-0 right-0 p-8 pt-14 z-20 flex justify-between items-center pointer-events-none">
                <div className="pointer-events-auto">
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className="w-12 h-12 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-center text-white active:scale-90 transition-all shadow-2xl"
                    >
                        <Icons.ChevronLeft size={24} />
                    </button>
                </div>
                <div className="px-6 py-2.5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full pointer-events-auto shadow-2xl">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">PORTFØLJE RADAR</span>
                </div>
                <div className="w-12 pointer-events-auto">
                     <button className="w-12 h-12 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-center text-white">
                        <Icons.Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Simulated Interactive Radar Map */}
            <div className="flex-1 relative bg-[#030303] overflow-hidden">
                {/* Background Grid & Scanline */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]" />

                {/* Simulated Map Markers (SVG) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000">
                    <defs>
                        <radialGradient id="markerGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                        </radialGradient>
                    </defs>

                    {/* Animated scanning rings */}
                    <circle cx="500" cy="500" r="400" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <circle cx="500" cy="500" r="250" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                    {/* Property Markers */}
                    {properties.map((p, idx) => {
                        const coords = [
                            { x: 420, y: 480 },
                            { x: 580, y: 320 },
                            { x: 380, y: 680 }
                        ][idx] || { x: 500, y: 500 };

                        const isSelected = selectedProperty?.address === p.address;

                        return (
                            <g
                                key={p.address}
                                className="cursor-pointer group"
                                onClick={() => handleSelect(p, idx)}
                                style={{ transform: `translate(${coords.x}px, ${coords.y}px)` }}
                            >
                                {isSelected && (
                                    <circle r="50" fill="url(#markerGlow)" className="animate-pulse-slow" />
                                )}
                                <circle
                                    r={isSelected ? "12" : "8"}
                                    fill={isSelected ? "white" : "#6366f1"}
                                    className="transition-all duration-500 ease-out"
                                />
                                {isSelected && (
                                    <circle r="6" fill="#6366f1" />
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Legend / Info Panel */}
                <div className="absolute bottom-40 left-6 right-6 z-10 animate-era-slide-up">
                    {selectedProperty && (
                        <AuraCard className="w-full bg-[#121214]/80 backdrop-blur-3xl border-white/10 p-7 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/[0.03] blur-[40px] rounded-full" />

                            <div className="flex gap-6 items-start relative z-10">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/5 shadow-2xl">
                                    <img src={selectedProperty.imageUrl} className="w-full h-full object-cover grayscale-[0.3]" alt="" />
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <div className="flex items-center gap-2 mb-2.5">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">{selectedProperty.type}</span>
                                        <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">{selectedProperty.gnrBnr}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white tracking-ios-tighter mb-3 truncate">
                                        {selectedProperty.address.split(',')[0]}
                                    </h3>

                                    <div className="flex items-center gap-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${selectedProperty.energyGrade === 'F' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">TG {selectedProperty.energyGrade === 'F' ? '2' : '1'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Icons.TrendingUp size={14} className="text-emerald-500" />
                                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Verdi OK</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3 relative z-10">
                                <button
                                    onClick={() => onNavigate('dashboard')}
                                    className="flex-1 h-14 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all"
                                >
                                    Aktiver enhet
                                </button>
                                <button className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                                    <Icons.MoreHorizontal size={20} />
                                </button>
                            </div>
                        </AuraCard>
                    )}
                </div>
            </div>

            {/* Map Controls */}
            <div className="absolute bottom-10 right-6 flex flex-col gap-2.5 z-20">
                <button className="w-12 h-12 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all">
                    <Icons.Plus size={18} />
                </button>
                <button className="w-12 h-12 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all">
                    <Icons.Minus size={18} />
                </button>
                <button className="w-12 h-12 bg-indigo-600/20 backdrop-blur-2xl border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 active:scale-90 transition-all">
                    <Icons.MapPin size={18} />
                </button>
            </div>
        </div>
    );
};
