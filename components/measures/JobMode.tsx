
import React from 'react';
import { useAppStore } from '../../lib/store/useAppStore';
import { Icons } from '../Icons';

export const JobMode: React.FC = () => {
    const { setActiveJob } = useAppStore();
    // This component is deprecated in the current version of ERA OS.
    // All workflows now lead to Proff Hub.
    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-10 text-center">
            <Icons.Briefcase size={48} className="text-indigo-500 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Proff Hub Aktiv</h2>
            <p className="text-zinc-500 text-sm max-w-xs mb-8">
                Denne funksjonen er erstattet med direkte kobling til sertifiserte fagpartnere.
            </p>
            <button
                onClick={() => setActiveJob(null)}
                className="px-8 py-4 bg-white text-black rounded-2xl font-bold"
            >
                Gå tilbake
            </button>
        </div>
    );
};
