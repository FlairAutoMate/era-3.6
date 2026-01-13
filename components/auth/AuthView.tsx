
import React, { useState } from 'react';
import { Icons } from '../Icons';
import { UserRole } from '../../types';
import { PrimaryButton } from '../widgets/SharedWidgets';

interface AuthViewProps {
  role: UserRole;
  onComplete: (isNew: boolean) => void;
  onBack: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ role, onComplete, onBack }) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const isPro = role === UserRole.PROFESSIONAL;
  const isChain = role === UserRole.CHAIN_ADMIN;
  const isBoard = role === UserRole.BOARD_MEMBER;

  const handleSendMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    // Simulerer utsending av Magic Link
    setTimeout(() => {
      onComplete(role === UserRole.HOMEOWNER); // Kun boligeier får onboarding i denne demoen
    }, 2500);
  };

  if (isSent) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 animate-era-in text-center">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl">
          <Icons.Mail size={40} className="text-emerald-500 animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4 tracking-tighter">Sjekk innboksen din</h2>
        <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
          Vi har sendt en magisk påloggingslenke til <br />
          <span className="text-white font-bold">{email}</span>
        </p>
        <button
          onClick={() => setIsSent(false)}
          className="mt-12 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
        >
          Prøv en annen e-post
        </button>
      </div>
    );
  }

  const getRoleLabel = () => {
      if (isPro) return 'Partner';
      if (isChain) return 'Kjede-Admin';
      if (isBoard) return 'Styret';
      return 'Boligeier';
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 animate-era-in">
      <div className="w-full max-w-sm">
        <button onClick={onBack} className="text-zinc-500 hover:text-white mb-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors">
          <Icons.ArrowLeft size={14} /> Tilbake
        </button>

        <div className="text-center mb-12">
            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center mx-auto mb-6 border shadow-2xl ${isPro || isChain ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white text-black'}`}>
                {isPro ? <Icons.Zap size={32} /> : isChain ? <Icons.Briefcase size={32} /> : isBoard ? <Icons.Building size={32} /> : <Icons.User size={32} />}
            </div>
            <h1 className="text-3xl font-bold tracking-tighter text-white mb-2">
                Logg inn som {getRoleLabel()}
            </h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
                Vi bruker magiske lenker for sikkerhet. <br />Ingen passord å huske.
            </p>
        </div>

        <form className="space-y-6" onSubmit={handleSendMagicLink}>
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-700 ml-1">E-postadresse</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="din@epost.no"
                    className="w-full h-16 bg-zinc-900 border border-white/5 rounded-2xl px-6 text-white text-lg outline-none focus:border-white/20 transition-all placeholder:text-zinc-700"
                />
            </div>

            <PrimaryButton onClick={() => {}} className={`h-16 text-xs uppercase tracking-widest font-black ${isPro || isChain ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-white text-black'}`}>
                Send magisk lenke <Icons.Sparkles size={16} />
            </PrimaryButton>
        </form>

        <p className="mt-12 text-center text-[9px] text-zinc-700 font-bold uppercase tracking-widest leading-relaxed">
          Ved å logge inn godtar du våre <br />
          <a href="#" className="underline">Vilkår for bruk</a> og <a href="#" className="underline">Personvern</a>
        </p>
      </div>
    </div>
  );
};
