
import React, { useState } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { PrimaryButton } from '../widgets/SharedWidgets';

interface OnboardingPageProps {
  onComplete: () => void;
}

const SPECIALTIES = [
    { id: 'paint', label: 'Maling & Fasade', icon: Icons.Palette },
    { id: 'vvs', label: 'VVS & Rør', icon: Icons.Droplets },
    { id: 'el', label: 'Elektro', icon: Icons.Zap },
    { id: 'carp', label: 'Snekker & Tak', icon: Icons.Hammer },
    { id: 'mason', label: 'Murer & Flis', icon: Icons.LayoutGrid },
    { id: 'vent', label: 'Ventilasjon', icon: Icons.Wind },
];

const REGIONS = ['Oslo & Akershus', 'Viken', 'Vestlandet', 'Trøndelag', 'Nord-Norge', 'Sørlandet'];

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const { userRole } = useAppStore();
  const isPro = userRole === 'PROFESSIONAL';

  // State for onboarding data
  const [companyName, setCompanyName] = useState('');
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const toggleSpec = (id: string) => {
    setSelectedSpecs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleRegion = (reg: string) => {
    setSelectedRegions(prev => prev.includes(reg) ? prev.filter(i => i !== reg) : [...prev, reg]);
  };

  const handleNext = () => {
    if (step < (isPro ? 4 : 2)) {
        setStep(step + 1);
    } else {
        onComplete();
    }
  };

  if (!isPro) {
    // Simple Homeowner onboarding
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 animate-era-in">
            <div className="max-w-sm text-center space-y-12">
                <div className="w-20 h-20 bg-white text-black rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl">
                    <Icons.Sparkles size={40} />
                </div>
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold tracking-tighter text-white">Systemet er klart</h1>
                    <p className="text-zinc-500 leading-relaxed">Vi starter med en gjennomgang av din primærbolig.</p>
                </div>

                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 text-left space-y-4">
                    <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          id="legal"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="mt-1 w-5 h-5 rounded border-white/10 bg-black text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="legal" className="text-[11px] text-zinc-400 leading-relaxed cursor-pointer select-none">
                            Jeg bekrefter at jeg har lest og forstått vilkårene.
                            <br /><br />
                            <strong>Viktig:</strong> ERA tar ikke automatiserte beslutninger med rettslige konsekvenser. Du kan når som helst overstyre, avvise eller endre anbefalte tiltak (GDPR Art. 22).
                        </label>
                    </div>
                </div>

                <PrimaryButton disabled={!agreed} onClick={onComplete} className={!agreed ? 'opacity-30' : ''}>Åpne Kontrollsenter</PrimaryButton>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center p-6 pt-24 font-sans overflow-x-hidden">
      {/* Progress */}
      <div className="fixed top-12 flex gap-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'w-4 bg-zinc-800'}`} />
        ))}
      </div>

      <div className="w-full max-w-md">
        {step === 1 && (
          <div className="space-y-10 animate-era-in">
            <header className="space-y-3">
              <h2 className="text-4xl font-bold tracking-tighter">Firma-profil</h2>
              <p className="text-zinc-500">Vi trenger basisinformasjon for å matche deg med riktige eiere.</p>
            </header>
            <div className="space-y-6">
                <InputField label="Ditt Navn" placeholder="Ola Nordmann" />
                <InputField
                    label="Firmanavn"
                    placeholder="Mesterfarge Oslo AS"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
                <InputField label="Organisasjonsnummer" placeholder="987 654 321" />
            </div>
            <PrimaryButton onClick={handleNext} className="bg-emerald-500 text-black hover:bg-emerald-400">Neste steg</PrimaryButton>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-era-in">
            <header className="space-y-3">
              <h2 className="text-4xl font-bold tracking-tighter">Hva leverer dere?</h2>
              <p className="text-zinc-500">Velg fagfeltene bedriften er sertifisert for.</p>
            </header>
            <div className="grid grid-cols-2 gap-3">
                {SPECIALTIES.map(s => (
                    <button
                        key={s.id}
                        onClick={() => toggleSpec(s.id)}
                        className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-4 ${selectedSpecs.includes(s.id) ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900/50 border-white/5 text-zinc-600'}`}
                    >
                        <s.icon size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                    </button>
                ))}
            </div>
            <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="w-1/3 h-16 rounded-[24px] border border-white/5 text-zinc-600 font-bold uppercase text-[10px] tracking-widest">Tilbake</button>
                <PrimaryButton onClick={handleNext} className="flex-1 bg-emerald-500 text-black">Bekreft utvalg</PrimaryButton>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 animate-era-in">
            <header className="space-y-3">
              <h2 className="text-4xl font-bold tracking-tighter">Operasjonsområde</h2>
              <p className="text-zinc-500">Hvor ønsker dere å motta oppdrag?</p>
            </header>
            <div className="space-y-2">
                {REGIONS.map(reg => (
                    <button
                        key={reg}
                        onClick={() => toggleRegion(reg)}
                        className={`w-full p-6 rounded-2xl border transition-all flex items-center justify-between ${selectedRegions.includes(reg) ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/5' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}
                    >
                        <span className="font-bold text-sm">{reg}</span>
                        {selectedRegions.includes(reg) && <Icons.Check size={18} />}
                    </button>
                ))}
            </div>
            <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="w-1/3 h-16 rounded-[24px] border border-white/5 text-zinc-600 font-bold uppercase text-[10px] tracking-widest">Tilbake</button>
                <PrimaryButton onClick={handleNext} className="flex-1 bg-emerald-500 text-black">Neste</PrimaryButton>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-10 animate-era-in text-center">
            <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="relative w-full h-full bg-emerald-500 text-black rounded-[40px] flex items-center justify-center shadow-2xl">
                    <Icons.BadgeCheck size={64} strokeWidth={1.5} />
                </div>
            </div>
            <header className="space-y-3">
              <h2 className="text-4xl font-bold tracking-tighter">Klar for oppdrag</h2>
              <p className="text-zinc-500 leading-relaxed">
                Vi har verifisert firmanavn mot Brønnøysund og aktivert din partner-hub.
              </p>
            </header>

            <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 text-left space-y-4">
                <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      id="pro-legal"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-white/10 bg-black text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="pro-legal" className="text-[11px] text-zinc-400 leading-relaxed cursor-pointer select-none">
                        Vi aksepterer Proff-vilkår. Fagaktør opptrer som selvstendig oppdragstaker og er fullt ansvarlig for egne tjenester levert via plattformen.
                        Vi holder ERA skadesløs for krav som springer ut av utført arbeid.
                    </label>
                </div>
            </div>

            <PrimaryButton disabled={!agreed} onClick={onComplete} className={`bg-white text-black shadow-[0_20px_50px_rgba(255,255,255,0.1)] ${!agreed ? 'opacity-30' : ''}`}>Start Porteføljebygging</PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
};

const InputField = ({ label, placeholder, value, onChange }: any) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-700 ml-1">{label}</label>
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl px-5 text-white outline-none focus:border-emerald-500/30 transition-all placeholder-zinc-800"
        />
    </div>
);
