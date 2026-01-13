
import React from 'react';
import { Icons } from '../Icons';
import { PrimaryButton } from '../widgets/SharedWidgets';

export const UserView: React.FC<{ step: number; onNext: (s: number) => void }> = ({ step, onNext }) => {
  return (
    <div className="min-h-screen bg-era-bg flex flex-col items-center justify-center p-8 text-center animate-era-in">
        {step === 1 ? (
            <div className="max-w-xs space-y-12">
                <div className="w-20 h-20 bg-white text-black rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl">
                    <Icons.Sparkles size={40} />
                </div>
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tighter text-white">Velkommen til ERA OS</h1>
                    <p className="text-zinc-500 leading-relaxed font-medium text-lg">
                        Eiendom og verdisikring styrt av KI-analyse.
                    </p>
                </div>
                <PrimaryButton onClick={() => onNext(2)}>
                    Kom i gang
                </PrimaryButton>
            </div>
        ) : (
            <div className="max-w-xs space-y-10">
                <div className="w-16 h-16 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Icons.User size={32} className="text-zinc-600" />
                </div>
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold tracking-tighter text-white">Systemet er klart</h1>
                    <p className="text-zinc-500 leading-relaxed">
                        Din profil er opprettet. Vi starter med en gjennomgang av din hovedeiendom.
                    </p>
                </div>
                <PrimaryButton onClick={() => onNext(3)}>
                    Åpne dashbord
                </PrimaryButton>
            </div>
        )}
    </div>
  );
};
