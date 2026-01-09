
import React, { useState, useEffect } from 'react';
import { Icons } from '../Icons';

const SYSTEM_THOUGHTS = [
  "Analyserer nedbørsprognoser for neste uke...",
  "Kryssjekker materialalder mot FDV-logg...",
  "Beregner ROI for planlagte tiltak...",
  "Verifiserer nabolagsindeks i Oslo...",
  "Sjekker Enova-oppdateringer for varmepumpe-støtte...",
  "Overvåker fuktrisiko i kjeller-modul...",
  "Optimaliserer vedlikeholdsplan basert på slitasje-data..."
];

export const LiveSystemFeed: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % SYSTEM_THOUGHTS.length);
        setIsVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-4 group hover:bg-white/[0.04] transition-all">
      <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping" />
        <Icons.Activity size={16} className="text-indigo-400 relative z-10" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[8px] font-black uppercase text-zinc-600 tracking-widest block mb-0.5">Live System Feed</span>
        <p className={`text-[11px] font-medium text-zinc-400 transition-all duration-500 truncate ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
          {SYSTEM_THOUGHTS[currentIndex]}
        </p>
      </div>
      <div className="flex gap-1">
        <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse" />
        <div className="w-1 h-1 bg-indigo-500/40 rounded-full animate-pulse [animation-delay:0.2s]" />
        <div className="w-1 h-1 bg-indigo-500/20 rounded-full animate-pulse [animation-delay:0.4s]" />
      </div>
    </div>
  );
};
