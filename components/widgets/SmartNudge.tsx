
import React, { useEffect, useState } from 'react';
import { Icons } from '../Icons';
import { AppNotification } from '../../types';

interface SmartNudgeProps {
    notification: AppNotification | null;
    onDismiss: () => void;
    onAction: (view: string) => void;
}

export const SmartNudge: React.FC<SmartNudgeProps> = ({ notification, onDismiss, onAction }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (notification) {
            setIsVisible(true);
            // Auto-dismiss after 10 seconds if ignored
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onDismiss, 500); // Allow exit animation
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [notification, onDismiss]);

    if (!notification) return null;

    const isCritical = notification.type === 'alert' || notification.type === 'warning';
    const isAgent = notification.type === 'info' || notification.type === 'success'; // Agent mode

    return (
        <div className={`
            fixed bottom-[100px] left-4 right-4 md:left-auto md:right-24 md:bottom-24 md:w-96 z-[55]
            transition-all duration-500 ease-out transform
            ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'}
        `}>
            <div className={`
                relative bg-[#09090b]/95 backdrop-blur-xl border rounded-2xl p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex gap-4
                ${isCritical ? 'border-red-500/30' : 'border-white/10'}
            `}>
                {/* Glow Effect */}
                <div className={`absolute -inset-1 blur-xl opacity-20 -z-10 rounded-2xl ${isCritical ? 'bg-red-500' : 'bg-white'}`}></div>

                {/* Icon / Avatar */}
                <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-lg border
                    ${isCritical ? 'bg-red-500 text-white border-white/10' : 'bg-zinc-800 text-white border-white/10'}
                `}>
                    {isCritical ? <Icons.AlertTriangle size={20} /> : <Icons.Sparkles size={20} className="text-white" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                    <h4 className="text-sm font-bold text-white mb-1 flex items-center justify-between">
                        {notification.title}
                        {isAgent && <span className="text-[9px] font-bold text-white bg-white/10 px-1.5 py-0.5 rounded border border-white/10 uppercase tracking-wider">ERA</span>}
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                        {notification.message}
                    </p>

                    <div className="flex gap-3">
                        {notification.linkTo && (
                            <button
                                onClick={() => onAction(notification.linkTo!)}
                                className={`text-xs font-bold flex items-center gap-1 hover:underline ${isCritical ? 'text-red-400' : 'text-white'}`}
                            >
                                Se detaljer <Icons.ArrowRight size={12} />
                            </button>
                        )}
                        <button
                            onClick={() => { setIsVisible(false); setTimeout(onDismiss, 500); }}
                            className="text-xs text-zinc-500 hover:text-white"
                        >
                            Lukk
                        </button>
                    </div>
                </div>

                {/* Close X (Top Right) */}
                <button
                    onClick={() => { setIsVisible(false); setTimeout(onDismiss, 500); }}
                    className="absolute top-2 right-2 p-1 text-zinc-600 hover:text-white rounded-full hover:bg-white/10"
                >
                    <Icons.X size={14} />
                </button>
            </div>
        </div>
    );
};
