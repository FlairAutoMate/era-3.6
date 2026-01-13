
import React from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { AppNotification } from '../../types';

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose, onNavigate }) => {
    const { notifications, markAsRead, clearAllNotifications } = useAppStore();

    const handleAction = (n: AppNotification) => {
        markAsRead(n.id);
        if (n.linkTo) {
            onNavigate(n.linkTo);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm bg-[#09090b] h-full shadow-2xl border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <Icons.Bell className="text-indigo-500" size={20} />
                        <h2 className="text-lg font-bold text-white tracking-tight">Systemvarsler</h2>
                        {notifications.filter(n => !n.read).length > 0 && (
                            <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {notifications.filter(n => !n.read).length}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={clearAllNotifications} className="p-2 text-zinc-500 hover:text-white" title="Nullstill logg">
                            <Icons.Trash2 size={16} />
                        </button>
                        <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700">
                            <Icons.X size={16} className="text-zinc-300" />
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-700">
                            <Icons.Activity size={32} className="mb-2 opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Ingen aktive loggføringer</p>
                        </div>
                    ) : (
                        notifications.map(n => (
                            <div
                                key={n.id}
                                onClick={() => handleAction(n)}
                                className={`
                                    p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden group
                                    ${n.read ? 'bg-zinc-900/30 border-white/5 opacity-70 hover:opacity-100' : 'bg-zinc-900 border-white/10 hover:border-indigo-500/30'}
                                `}
                            >
                                {!n.read && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                                )}
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-sm font-bold tracking-tight ${n.read ? 'text-zinc-400' : 'text-white'}`}>{n.title}</h4>
                                    <span className="text-[10px] font-mono text-zinc-600">{new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <p className="text-xs text-zinc-500 leading-relaxed mb-2">{n.message}</p>
                                {n.linkTo && (
                                    <span className="flex items-center gap-1 text-[10px] text-indigo-400 font-bold uppercase tracking-widest group-hover:text-indigo-300">
                                        Iverksett sekvens <Icons.ArrowRight size={10} />
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
