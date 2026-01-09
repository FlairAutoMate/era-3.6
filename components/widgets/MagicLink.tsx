
import React, { useState } from 'react';
import { Icons } from '../Icons';

interface MagicLinkProps {
  context: string;
  className?: string;
  minimal?: boolean;
}

export const MagicLink: React.FC<MagicLinkProps> = ({ context, className = "", minimal = false }) => {
  const [state, setState] = useState<'idle' | 'generating' | 'copied'>('idle');

  const handleGenerate = () => {
    setState('generating');
    // Simulate AI link generation
    setTimeout(() => {
      setState('copied');
      navigator.clipboard.writeText(`https://era.os/access/${Math.random().toString(36).substring(7)}`);
      setTimeout(() => setState('idle'), 3000);
    }, 1200);
  };

  if (minimal) {
    return (
      <button
        onClick={handleGenerate}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${state === 'copied' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-zinc-500 hover:text-white border border-white/10'} ${className}`}
      >
        {state === 'generating' ? <Icons.Loader2 size={16} className="animate-spin" /> :
         state === 'copied' ? <Icons.Check size={16} strokeWidth={3} /> :
         <Icons.Link size={16} />}
      </button>
    );
  }

  return (
    <button
      onClick={handleGenerate}
      className={`
        group relative flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500
        ${state === 'copied' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-indigo-500/5 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10'}
        ${className}
      `}
    >
      {state === 'generating' && (
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-pulse" />
      )}

      <div className="relative z-10 flex items-center gap-2">
        {state === 'generating' ? (
          <Icons.Loader2 size={12} className="animate-spin" />
        ) : state === 'copied' ? (
          <Icons.BadgeCheck size={12} />
        ) : (
          <Icons.Sparkles size={12} className="group-hover:rotate-12 transition-transform" />
        )}
        <span className="text-[9px] font-black uppercase tracking-[0.2em]">
          {state === 'generating' ? 'Signerer...' : state === 'copied' ? 'Link Kopiert' : 'Del Magic Link'}
        </span>
      </div>

      {state === 'copied' && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-900 text-white text-[10px] font-bold rounded-lg border border-white/10 animate-era-slide-up whitespace-nowrap">
          Sikker tilgang kopiert til utklippstavle
        </div>
      )}
    </button>
  );
};
