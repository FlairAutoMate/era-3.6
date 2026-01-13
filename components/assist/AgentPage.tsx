
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../lib/store/useAppStore';
import { askEraAssist } from '../../services/geminiService';
import { LoadingState } from '../widgets/SharedWidgets';

export const AgentPage: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const { userRole, getHealthScore, jobs, matrikkel, fdvEvents, weatherForecast, getEstimatedValue } = useAppStore();

  const initialMessage = () => {
    const health = getHealthScore();
    const value = getEstimatedValue();
    const status = health > 85 ? "utmerket" : (health > 60 ? "god" : "kritisk");
    return `Hei! Jeg har analysert ${matrikkel.address}. Bolighelsen din er ${status} (${health}%).
    Basert på byggeår ${matrikkel.yearBuilt} og energiklasse ${matrikkel.energyGrade}, ser jeg et uforløst verdisikringspotensial på ${(value.debt / 1000).toFixed(0)}k.
    Vi har også kartlagt Enova-tiltak verdt ${(value.enovaPotential / 1000).toFixed(0)}k i tilskudd. Hvilken strategi skal vi starte med?`;
  };

  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; text: string; actions?: any[] }>>([
    { role: 'ai', text: initialMessage() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);

    try {
      const valueData = getEstimatedValue();

      // DEEP CONTEXT for the AI
      const contextData = {
        property: matrikkel,
        health: getHealthScore(),
        financials: {
          currentValue: valueData.current,
          potentialValue: valueData.potential,
          maintenanceDebt: valueData.debt,
          enovaPotential: valueData.enovaPotential,
          verifiedAppreciation: valueData.verifiedAppreciation
        },
        activePlans: jobs.filter(j => j.status === 'recommended').map(j => ({ title: j.tittel, cost: j.estimert_kost, enova: j.enovaSupport, driver: j.driver, risk: j.risk_level })),
        history: fdvEvents.slice(0, 10).map(e => ({ title: e.title, date: e.date, cost: e.cost, category: e.category })),
        weather: weatherForecast[0]
      };

      const res = await askEraAssist(text, { type: 'general' }, userRole, JSON.stringify(contextData));
      setMessages(prev => [...prev, { role: 'ai', text: res.text, actions: res.actions }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Systemet prosesserer for øyeblikket store mengder data. Prøv igjen om et sekund." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const QuickChip = ({ label, icon: Icon, onClick, highlight = false }: any) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 border rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${highlight ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-white/5 border-white/5 text-zinc-500 hover:text-white hover:bg-white/10'}`}
    >
      <Icon size={14} /> {label}
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-era-bg animate-era-in relative overflow-hidden font-sans">

      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="p-8 pt-14 border-b border-white/5 flex items-center justify-between relative z-10 bg-era-bg/50 backdrop-blur-3xl">
          <div className="flex items-center gap-6">
            <div className="relative w-14 h-14">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center text-white">
                    <Icons.Sparkles size={28} />
                </div>
            </div>
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tighter leading-none mb-1">ERA Intelligence ✨</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">Property Brain Active</p>
            </div>
          </div>
          <button onClick={() => onNavigate('dashboard')} className="p-3 bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors">
             <Icons.X size={20} />
          </button>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar relative z-10 pb-48">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-era-in`}>
            <div className={`
              max-w-[85%] p-7 rounded-[32px] text-base font-medium leading-relaxed
              ${m.role === 'user'
                ? 'bg-[#1C1C1E] text-white border border-white/10 rounded-tr-none'
                : 'bg-zinc-900/50 text-zinc-300 border border-white/5 rounded-tl-none backdrop-blur-3xl shadow-2xl'}
            `}>
              {m.text}

              {m.actions && m.actions.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {m.actions.map((action: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => onNavigate(action.actionId)}
                      className="px-5 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all hover:bg-zinc-200"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start animate-pulse">
              <div className="bg-white/5 p-6 rounded-[32px] rounded-tl-none">
                 <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-bounce" />
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* Input Center */}
      <div className="absolute bottom-0 left-0 right-0 p-8 pt-0 bg-gradient-to-t from-era-bg via-era-bg/90 to-transparent z-20">
        <div className="max-w-xl mx-auto space-y-6">
           {/* Quick Chips */}
           <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              <QuickChip
                label="Enova Synergi"
                icon={Icons.Zap}
                highlight
                onClick={() => handleSend("Hvilke tiltak gir mest Enova-støtte hvis jeg kombinerer dem?")}
              />
              <QuickChip
                label="Verdigap Analyse"
                icon={Icons.TrendingUp}
                onClick={() => handleSend("Hvilke tekniske avvik tynger boligverdien min mest akkurat nå?")}
              />
              <QuickChip
                label="Rente-case"
                icon={Icons.Scale}
                onClick={() => handleSend("Lag et business case for banken min basert på utført vedlikehold.")}
              />
              <QuickChip
                label="Vedlikeholds-Gevinst"
                icon={Icons.Award}
                onClick={() => handleSend("Hva er det smarteste vedlikeholdstiltaket for verdisikring i 2024?")}
              />
           </div>

           <div className="relative group">
              <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                  placeholder="Spør ERA om din eiendom..."
                  className="w-full h-20 bg-black/60 border border-white/10 rounded-[28px] px-8 pr-20 text-white text-lg font-medium focus:border-indigo-500/50 outline-none backdrop-blur-3xl transition-all placeholder-zinc-800 shadow-2xl"
              />
              <button
                  onClick={() => handleSend(input)}
                  className="absolute right-4 top-4 w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center era-active-state shadow-2xl hover:bg-zinc-200 transition-colors"
              >
                  <Icons.ArrowUp size={24} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
