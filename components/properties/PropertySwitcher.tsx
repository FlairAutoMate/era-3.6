
import React, { useState } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';

export const PropertySwitcher: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { properties, setActiveProperty, activePropertyIndex, getPropertyTGScore, getPropertyIndex } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredProperties = properties.filter(p =>
    p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (idx: number) => {
    setActiveProperty(idx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center px-4 pb-4 sm:px-0 sm:pb-0">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[#0A0A0B] border-t border-white/10 rounded-t-[40px] flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-12 duration-500 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.8)]">
        <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mt-4 mb-6 shrink-0" />

        <div className="px-8 pb-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white tracking-ios-tight">Bytt enhet</h3>
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{properties.length} totalt</span>
          </div>

          <div className="relative mb-6">
            <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input
              type="text"
              placeholder="Søk i adresser, type eller kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-sm text-white focus:border-white/20 outline-none transition-all placeholder-zinc-700"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-12 space-y-3 no-scrollbar">
            {filteredProperties.length > 0 ? filteredProperties.map((p, idx) => (
                <SwitcherItem
                  key={p.address}
                  active={properties.indexOf(p) === activePropertyIndex}
                  property={p}
                  tgScore={getPropertyTGScore(p.address)}
                  propertyIndex={getPropertyIndex(p.address)}
                  onClick={() => handleSelect(properties.indexOf(p))}
                />
            )) : (
              <div className="py-20 text-center opacity-30 italic text-sm text-white">Ingen treff på "{searchTerm}"</div>
            )}
        </div>
      </div>
    </div>
  );
};

const SwitcherItem = ({ property, active, onClick, tgScore, propertyIndex }: any) => {
    const isCommercial = property.category === 'Næring';
    const estimatedValue = isCommercial ? 85.0 : 12.5;

    return (
        <button
            onClick={onClick}
            className={`w-full p-5 rounded-[28px] flex items-center gap-5 border transition-all duration-300 group ${active ? 'bg-white/5 border-white/10 shadow-lg' : 'border-transparent hover:bg-white/[0.02]'}`}
        >
            <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/5 relative">
                <img src={property.imageUrl} className={`w-full h-full object-cover transition-all duration-500 ${active ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`} alt="" />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/40 to-transparent ${active ? 'opacity-100' : 'opacity-0'}`} />
            </div>

            <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                <div className="flex items-center justify-between w-full mb-0.5">
                    <div className="flex items-center gap-1.5">
                        <span className={`text-[8px] font-black uppercase tracking-widest ${active ? 'text-indigo-400' : 'text-zinc-600'}`}>
                          {property.category}
                        </span>
                        <div className="w-0.5 h-0.5 rounded-full bg-zinc-800" />
                        <span className={`text-[8px] font-bold uppercase tracking-widest ${active ? 'text-white/40' : 'text-zinc-700'}`}>
                          {property.type}
                        </span>
                    </div>

                    <div className="flex gap-1.5">
                        <div className={`px-1.5 py-0.5 rounded border text-[8px] font-black uppercase tracking-wider ${
                            propertyIndex >= 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                            'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                            EI {propertyIndex}
                        </div>
                    </div>
                </div>

                <span className={`text-base font-bold tracking-tight text-left truncate w-full ${active ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                    {property.address.split(',')[0]}
                </span>

                <div className="flex flex-col items-start gap-1 mt-1">
                    <div className="flex items-center gap-4">
                        <span className={`text-[9px] font-mono font-bold ${active ? 'text-white/60' : 'text-zinc-600'}`}>
                            {estimatedValue.toFixed(1)} MNOK
                        </span>
                        {active && (
                            <div className="flex items-center gap-1.5 text-indigo-400">
                                 <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                                 <span className="text-[7px] font-black uppercase tracking-widest">Aktiv</span>
                            </div>
                        )}
                    </div>
                    {property.lastAiAnalysisDate && (
                        <div className="flex items-center gap-1 text-indigo-500/60">
                            <Icons.Sparkles size={10} />
                            <span className="text-[8px] font-black uppercase tracking-widest">Siste AI-sjekk: {property.lastAiAnalysisDate}</span>
                        </div>
                    )}
                </div>
            </div>

            <Icons.ChevronRight className={`shrink-0 transition-colors ${active ? 'text-white' : 'text-zinc-800 group-hover:text-zinc-600'}`} size={16} />
        </button>
    );
};
