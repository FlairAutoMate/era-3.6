
import React from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';

export const ProductionDiagnostics = () => {
    const { getSystemHealth } = useAppStore();
    const health = getSystemHealth();

    const CheckItem = ({ label, ok, detail }: { label: string; ok: boolean; detail: string }) => (
        <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${ok ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`} />
                <span className="text-xs font-bold text-zinc-300">{label}</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-600 uppercase">{detail}</span>
        </div>
    );

    return (
        <div className="bg-[#0D0D0E] border border-white/5 rounded-3xl p-6 mt-12 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                <Icons.Activity size={80} />
            </div>

            <header className="mb-6 flex items-center gap-2">
                <Icons.ShieldCheck className="text-indigo-500" size={16} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">System Diagnostics</h3>
            </header>

            <div className="space-y-1">
                <CheckItem label="Supabase Backend" ok={health.supabase} detail={health.supabase ? "Connected" : "Mock Mode"} />
                <CheckItem label="Gemini AI Engine" ok={health.gemini} detail={health.gemini ? "Active" : "Key Missing"} />
                <CheckItem label="Weather Radar (Met.no)" ok={health.weather} detail={health.weather ? "Live Feed" : "Offline"} />
                <CheckItem label="Persistens-lag" ok={true} detail={health.storage === 'cloud' ? "Cloud Sync" : "Local Storage"} />
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-zinc-700">
                    <span>Build Version</span>
                    <span>v2.1.0-prod-ready</span>
                </div>
            </div>
        </div>
    );
};
