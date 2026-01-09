
import React from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { UserRole } from '../../types';

export const MegaMenu: React.FC<{ isOpen: boolean; onClose: () => void; onNavigate: (v: string) => void }> = ({ isOpen, onClose, onNavigate }) => {
    const { userRole, setUserRole } = useAppStore();

    if (!isOpen) return null;

    const nav = (v: string) => { onNavigate(v); onClose(); };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white text-black font-bold flex items-center justify-center rounded">E</div>
                    <span className="text-xl font-bold">ERA Meny</span>
                </div>
                <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-colors">
                    <Icons.X />
                </button>
            </div>

            <div className="grid gap-4 flex-1">
                <button onClick={() => nav('dashboard')} className="flex items-center gap-6 p-6 bg-zinc-900/50 border border-white/5 rounded-3xl text-left hover:bg-zinc-800 transition-all">
                    <Icons.Home className="text-zinc-500" />
                    <div>
                        <span className="block text-lg font-bold text-white">Dashbord</span>
                        <span className="block text-xs text-zinc-500">Status og kjerneoppgave</span>
                    </div>
                </button>
                <button onClick={() => nav('jobs')} className="flex items-center gap-6 p-6 bg-zinc-900/50 border border-white/5 rounded-3xl text-left hover:bg-zinc-800 transition-all">
                    <Icons.Zap className="text-zinc-500" />
                    <div>
                        <span className="block text-lg font-bold text-white">Aktiv Jobb</span>
                        <span className="block text-xs text-zinc-500">Oppfølging og fremdrift</span>
                    </div>
                </button>
                <button onClick={() => nav('fdv')} className="flex items-center gap-6 p-6 bg-zinc-900/50 border border-white/5 rounded-3xl text-left hover:bg-zinc-800 transition-all">
                    <Icons.FileText className="text-zinc-500" />
                    <div>
                        <span className="block text-lg font-bold text-white">Logg</span>
                        <span className="block text-xs text-zinc-500">Dokumentert historikk</span>
                    </div>
                </button>
            </div>

            <div className="mt-auto space-y-4 pt-8 border-t border-white/5">
                 <button
                    onClick={() => {
                        setUserRole(userRole === UserRole.HOMEOWNER ? UserRole.PROFESSIONAL : UserRole.HOMEOWNER);
                        onClose();
                    }}
                    className="w-full py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white hover:border-white/30 transition-all"
                >
                    Bytt til {userRole === UserRole.HOMEOWNER ? 'Proff-modus' : 'Kunde-modus'}
                </button>
            </div>
        </div>
    );
};
