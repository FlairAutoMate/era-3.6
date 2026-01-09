
import React from 'react';
import { Icons } from '../Icons';
import { AuraCard, PrimaryButton } from '../widgets/SharedWidgets';

export const PropertiesView: React.FC<{ step: number; onNavigate: (v: string, s?: number) => void }> = ({ step, onNavigate }) => {

  // Screen 16-17: Add Property Flow
  if (step === 3 || step === 4) {
    return (
        <div className="px-6 py-8 animate-era-in max-w-lg mx-auto">
            {step === 3 ? (
                <>
                    <header className="mb-10">
                        <h1 className="text-4xl font-bold tracking-tighter">Legg til eiendom</h1>
                    </header>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Adresse</label>
                            <input type="text" className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white outline-none focus:border-white/20" placeholder="Eksempelveien 12" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Type</label>
                            <select className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white outline-none appearance-none">
                                <option>Enebolig</option>
                                <option>Leilighet</option>
                                <option>Hytte</option>
                            </select>
                        </div>
                        <PrimaryButton onClick={() => onNavigate('properties', 4)}>
                            Opprett eiendom
                        </PrimaryButton>
                    </div>
                </>
            ) : (
                <div className="py-20 text-center animate-era-in">
                    <div className="w-16 h-16 bg-emerald-500 text-black rounded-full flex items-center justify-center mx-auto mb-8">
                        <Icons.Check size={32} />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Eiendom registrert</h2>
                    <p className="text-zinc-500 mb-10 max-w-[240px] mx-auto">Du kan nå starte analyse av den nye enheten.</p>
                    <button onClick={() => onNavigate('properties', 1)} className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Til mine eiendom</button>
                </div>
            )}
        </div>
    );
  }

  // Screens 13-14: Property List
  const isEmpty = step === 2;
  return (
    <div className="px-6 py-8 animate-era-in max-w-lg mx-auto">
      <header className="mb-10 flex justify-between items-end">
        <h1 className="text-4xl font-bold tracking-tighter">Mine eiendom</h1>
        <button onClick={() => onNavigate('properties', 3)} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center active:scale-90 transition-transform">
          <Icons.Plus size={20} />
        </button>
      </header>

      {isEmpty ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-[32px]">
          <p className="text-zinc-600 italic">Ingen eiendom registrert.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <PropertyItem address="Eksempelveien 12" type="Enebolig" status="Optimal" />
          <PropertyItem address="Fjellstua 42" type="Hytte" status="Vedlikehold påkrevd" alert />
        </div>
      )}
    </div>
  );
};

const PropertyItem = ({ address, type, status, alert }: any) => (
  <AuraCard className="flex justify-between items-center p-6 border-white/5">
    <div className="flex flex-col">
        <span className="text-[9px] font-black uppercase tracking-widest mb-1 text-zinc-600">{type}</span>
        <span className="text-lg font-bold text-white">{address}</span>
        <span className={`text-[10px] font-bold mt-1 ${alert ? 'text-amber-500' : 'text-emerald-500'}`}>{status}</span>
    </div>
    <Icons.ChevronRight className="text-zinc-800" />
  </AuraCard>
);
