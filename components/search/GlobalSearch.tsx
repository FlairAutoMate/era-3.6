
import React, { useState, useMemo, useEffect } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { MatrikkelData, Job, FDVEvent } from '../../types';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

type SearchResult =
  | { type: 'property'; data: MatrikkelData; index: number }
  | { type: 'job'; data: Job }
  | { type: 'document'; data: FDVEvent };

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const { properties, jobs, fdvEvents, setActiveProperty } = useAppStore();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      // Focus input would be nice but requires a ref and timeout for the animation
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (query.length < 2) return [];

    const q = query.toLowerCase();
    const matches: SearchResult[] = [];

    // Search Properties
    properties.forEach((p, idx) => {
      if (p.address.toLowerCase().includes(q) || p.type.toLowerCase().includes(q)) {
        matches.push({ type: 'property', data: p, index: idx });
      }
    });

    // Search Jobs
    jobs.forEach(j => {
      if (j.tittel.toLowerCase().includes(q) || j.beskrivelse.toLowerCase().includes(q)) {
        matches.push({ type: 'job', data: j });
      }
    });

    // Search Documents
    fdvEvents.forEach(e => {
      if (e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.performedBy?.toLowerCase().includes(q)) {
        matches.push({ type: 'document', data: e });
      }
    });

    return matches;
  }, [query, properties, jobs, fdvEvents]);

  if (!isOpen) return null;

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'property') {
      setActiveProperty(result.index);
      onNavigate('dashboard');
    } else if (result.type === 'job') {
      onNavigate('actions');
    } else if (result.type === 'document') {
      onNavigate('fdv');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[600] flex flex-col bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
      {/* Header / Input Area */}
      <div className="pt-14 px-6 pb-6 border-b border-white/5">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="relative flex-1 group">
            <Icons.Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              autoFocus
              type="text"
              placeholder="Søk i eiendom, tiltak eller dokumenter..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 text-xl font-medium text-white focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder-zinc-700 shadow-2xl"
            />
            {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white"
                >
                    <Icons.X size={14} />
                </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="h-16 px-6 text-sm font-bold text-zinc-500 hover:text-white transition-colors"
          >
            Avbryt
          </button>
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-2xl mx-auto px-6 py-10">
          {query.length < 2 ? (
            <div className="space-y-10 py-10 opacity-40">
                <div className="flex flex-col items-center text-center">
                    <Icons.Command size={48} className="text-zinc-800 mb-4" />
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-600 leading-relaxed">
                        Skriv minst to tegn for å søke<br />på tvers av hele systemet.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                        <Icons.Home size={20} className="mb-3 text-zinc-700" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Eiendomsdata</span>
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                        <Icons.ClipboardList size={20} className="mb-3 text-zinc-700" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Aktive tiltak</span>
                    </div>
                </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-10 animate-in slide-in-from-bottom-2 duration-500">
              <ResultSection
                title="Eiendommer"
                items={results.filter(r => r.type === 'property')}
                onClick={handleResultClick}
              />
              <ResultSection
                title="Tiltak & Planer"
                items={results.filter(r => r.type === 'job')}
                onClick={handleResultClick}
              />
              <ResultSection
                title="FDV-Logger & Dokumenter"
                items={results.filter(r => r.type === 'document')}
                onClick={handleResultClick}
              />
            </div>
          ) : (
            <div className="py-32 text-center">
              <Icons.Inbox className="mx-auto text-zinc-800 mb-6" size={56} strokeWidth={1} />
              <p className="text-xl font-bold text-zinc-600 mb-2">Ingen treff på "{query}"</p>
              <p className="text-sm text-zinc-700 font-medium">Prøv med andre søkeord eller sjekk stavingen.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ResultSection = ({ title, items, onClick }: { title: string, items: SearchResult[], onClick: (r: SearchResult) => void }) => {
  if (items.length === 0) return null;

  return (
    <section>
      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 mb-6 pl-1">{title} ({items.length})</h3>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onClick(item)}
            className="w-full p-6 bg-zinc-900/40 border border-white/5 rounded-3xl text-left hover:bg-zinc-800 transition-all flex items-center gap-6 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all shrink-0">
               {item.type === 'property' && <Icons.Home size={20} />}
               {item.type === 'job' && <Icons.Zap size={20} />}
               {item.type === 'document' && <Icons.FileText size={20} />}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-bold text-white mb-1 group-hover:text-white transition-colors truncate">
                {item.type === 'property' ? item.data.address : item.type === 'job' ? item.data.tittel : item.data.title}
              </h4>
              <p className="text-xs text-zinc-500 font-medium truncate">
                 {item.type === 'property' ? `${item.data.type} • ${item.data.gnrBnr}` : item.type === 'job' ? item.data.beskrivelse : item.data.description}
              </p>
            </div>
            <Icons.ArrowRight size={16} className="text-zinc-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>
    </section>
  );
};
