
import React, { useMemo } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { AuraCard, KPIUnit } from '../widgets/SharedWidgets';

export const ProDashboard: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
    const { jobs } = useAppStore();

    const stats = useMemo(() => {
        const active = jobs.filter(j => ['accepted', 'in_progress'].includes(j.status));
        const newLeads = jobs.filter(j => j.status === 'sent');
        return { active, newLeads };
    }, [jobs]);

    return (
        <div className="flex flex-col h-full animate-era-in pb-32">

            {/* 1. HEADER - COMPACT & FUNCTIONAL */}
            <header className="flex justify-between items-end mb-8 pt-4 px-2">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Mesterfarge Oslo AS</span>
                    <h1 className="text-4xl font-black text-white tracking-tighter leading-none mt-1">Produksjon</h1>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online</span>
                </div>
            </header>

            {/* 2. URGENT ACTION CARDS (Horizontal Scroll) */}
            <div className="flex overflow-x-auto gap-4 pb-8 -mx-6 px-6 no-scrollbar snap-x">
                {/* Card 1: New Leads */}
                <button
                    onClick={() => onNavigate('pro-jobs')}
                    className="snap-center shrink-0 w-[280px] bg-indigo-600 p-6 rounded-[28px] relative overflow-hidden group transition-transform active:scale-95 shadow-lg shadow-indigo-900/20"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Icons.Inbox size={100} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between items-start text-left">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white mb-4">
                            <Icons.Bell size={20} />
                        </div>
                        <div>
                            <span className="text-4xl font-black text-white leading-none mb-1 block">{stats.newLeads.length}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Nye forespørsler</span>
                        </div>
                    </div>
                </button>

                {/* Card 2: Active Jobs */}
                <button
                    onClick={() => onNavigate('pro-jobs')}
                    className="snap-center shrink-0 w-[280px] bg-[#1A1B1E] border border-white/10 p-6 rounded-[28px] relative overflow-hidden group transition-transform active:scale-95"
                >
                    <div className="relative z-10 flex flex-col h-full justify-between items-start text-left">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-zinc-400 mb-4">
                            <Icons.Hammer size={20} />
                        </div>
                        <div>
                            <span className="text-4xl font-black text-white leading-none mb-1 block">{stats.active.length}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Pågående oppdrag</span>
                        </div>
                    </div>
                </button>

                {/* Card 3: Revenue */}
                <button
                    onClick={() => onNavigate('pro-revenue')}
                    className="snap-center shrink-0 w-[280px] bg-[#1A1B1E] border border-white/10 p-6 rounded-[28px] relative overflow-hidden group transition-transform active:scale-95"
                >
                    <div className="relative z-10 flex flex-col h-full justify-between items-start text-left">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-emerald-500 mb-4">
                            <Icons.TrendingUp size={20} />
                        </div>
                        <div>
                            <span className="text-2xl font-black text-white leading-none mb-1 block">2.4M</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Omsetning i år</span>
                        </div>
                    </div>
                </button>
            </div>

            {/* 3. TASK LIST (High Density) */}
            <div className="flex-1 space-y-4">
                <div className="flex justify-between items-end px-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Dagens Agenda</h3>
                    <button className="text-[10px] font-bold text-indigo-400">Se kalender</button>
                </div>

                {stats.active.slice(0, 3).map(job => (
                    <div key={job.id} onClick={() => onNavigate('pro-project-detail')} className="bg-[#0D0D0E] border border-white/5 p-5 rounded-3xl flex items-center justify-between active:bg-zinc-900 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-500 font-bold text-xs border border-white/5">
                                {new Date().getDate()}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white truncate max-w-[150px]">{job.adresse.split(',')[0]}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{job.status === 'in_progress' ? 'I arbeid' : 'Planlagt'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400">
                            <Icons.ChevronRight size={18} />
                        </div>
                    </div>
                ))}
            </div>

            {/* 4. CONTEXTUAL ACTION ISLAND (Floating Bottom Bar) */}
            <div className="fixed bottom-6 left-6 right-6 z-50">
                <div className="bg-[#18181b]/90 backdrop-blur-xl border border-white/10 p-2 rounded-[24px] shadow-2xl flex items-center justify-between pl-6 pr-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Hurtigmeny</span>
                    <div className="flex gap-2">
                        <ActionButton icon={Icons.ScanLine} label="Ny Befaring" onClick={() => onNavigate('pro-new-job')} primary />
                        <ActionButton icon={Icons.Calculator} label="Kalkyle" onClick={() => onNavigate('pro-quotes')} />
                        <ActionButton icon={Icons.Mic} label="Logg" onClick={() => onNavigate('fdv')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActionButton = ({ icon: Icon, label, onClick, primary }: any) => (
    <button
        onClick={onClick}
        className={`
            h-12 w-12 rounded-[18px] flex items-center justify-center transition-all active:scale-90
            ${primary ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'}
        `}
    >
        <Icon size={20} />
    </button>
);
