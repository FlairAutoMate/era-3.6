
import React from 'react';
import { Icons } from '../Icons';
import { PrimaryButton } from '../widgets/SharedWidgets';

export const StaticViews = {
    Privacy: ({ onBack }: any) => (
        <div className="px-6 py-8 animate-era-in max-w-lg mx-auto font-sans">
            <button onClick={onBack} className="mb-10 text-zinc-600"><Icons.ArrowLeft /></button>
            <h1 className="text-3xl font-bold mb-8 tracking-tighter font-display">Personvern & Data</h1>
            <div className="prose prose-invert text-zinc-400 space-y-6 text-sm leading-relaxed">
                <section>
                  <h4 className="text-white font-bold mb-2">Behandling av data</h4>
                  <p>ERA behandler eiendoms- og bruksdata for å levere analyse, anbefalinger og dokumentasjon. Personopplysninger behandles i samsvar med gjeldende personvernlovgivning og deles kun med relevante fagaktører når dette er nødvendig for å gjennomføre valgte tiltak.</p>
                </section>

                <section>
                  <h4 className="text-white font-bold mb-2">Automatisert beslutningsstøtte</h4>
                  <p>ERA tar ikke automatiserte beslutninger med rettslige eller vesentlige konsekvenser for brukeren (GDPR Art. 22). Systemet fungerer som beslutningsstøtte, og bruker kan når som helst overstyre, avvise eller endre anbefalte tiltak.</p>
                </section>

                <section>
                  <h4 className="text-white font-bold mb-2">Eiendomslogg</h4>
                  <p>ERA lagrer dokumentasjon knyttet til utførte tiltak basert på informasjon levert av fagaktør. ERA verifiserer ikke fysisk utførelse og er ikke ansvarlig for eventuelle feil eller mangler i dokumentasjonen levert av tredjeparter.</p>
                </section>

                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest pt-8 border-t border-white/5">Sist oppdatert: Juni 2024</p>
            </div>
        </div>
    ),
    Logout: ({ onCancel, onConfirm }: any) => (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative w-full max-w-xs bg-zinc-950 border border-white/5 rounded-xl p-8 text-center animate-in zoom-in duration-300">
                <h3 className="text-xl font-bold mb-4 tracking-tight font-display text-white">Logg ut?</h3>
                <p className="text-zinc-500 text-sm mb-10 leading-relaxed font-sans">Dine aktive tiltak og logg lagres trygt i skyen.</p>
                <div className="space-y-3 font-sans">
                    <button
                        onClick={onConfirm}
                        className="w-full h-14 bg-red-600 text-white rounded-xl font-bold"
                    >
                        Logg ut
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full h-14 bg-zinc-900 text-zinc-500 rounded-xl font-bold"
                    >
                        Avbryt
                    </button>
                </div>
            </div>
        </div>
    )
};
