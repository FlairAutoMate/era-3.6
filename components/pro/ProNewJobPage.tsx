
import React from 'react';
import { Icons } from '../Icons';
import { PrimaryButton } from '../widgets/SharedWidgets';

export const ProNewJobPage: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center animate-era-in max-w-lg mx-auto w-full">
            {/* Header Text */}
            <div className="text-center mb-12 space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">DIGITALT VERKTØY</span>
                <h1 className="text-4xl font-bold text-white tracking-tight">Ny Befaring</h1>
                <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                    Start en ny tilstandsanalyse for å generere et presist tilbudsunderlag.
                </p>
            </div>

            {/* Center Card */}
            <div className="w-full bg-[#0D0D0E] border border-white/[0.08] p-10 rounded-[40px] text-center space-y-8 mb-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

                <div className="w-24 h-24 bg-white text-black rounded-[32px] flex items-center justify-center mx-auto shadow-[0_20px_60px_-10px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-500">
                    <Icons.ScanLine size={40} strokeWidth={1.5} />
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight">Start ERA Vision</h3>
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Kamera-basert mengdeberegning</p>
                </div>

                <PrimaryButton onClick={() => onNavigate('analyze')} className="w-full h-16 rounded-2xl text-sm">
                    Åpne kamera <Icons.Camera size={18} />
                </PrimaryButton>
            </div>

            {/* Manual Entry Option */}
            <div className="w-full space-y-6">
                <div className="relative flex justify-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.05]"></div></div>
                    <span className="relative bg-[#050505] px-6 text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em]">MANUELL REGISTRERING</span>
                </div>

                <button className="w-full h-16 bg-[#0A0A0B] border border-white/[0.05] rounded-2xl flex items-center justify-between px-6 hover:bg-zinc-900 transition-all group">
                    <div className="flex items-center gap-4">
                        <Icons.Edit2 size={18} className="text-zinc-600 group-hover:text-white transition-colors" />
                        <span className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">Opprett uten befaring</span>
                    </div>
                    <Icons.ChevronRight size={16} className="text-zinc-700" />
                </button>
            </div>
        </div>
    );
};
