
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icons } from './Icons';
import { UserRole } from '../types';
import { AuraCard, PrimaryButton, NumberTicker } from './widgets/SharedWidgets';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
  onStartAnalyse: () => void;
  onNavigate?: (view: string) => void;
}

const NAV_ITEMS = [
    { id: 'hero', label: 'Hjem', icon: Icons.Home },
    { id: 'risk-monitor', label: 'Risiko', icon: Icons.ShieldAlert },
    { id: 'smart-utforelse', label: 'Metode', icon: Icons.Hammer },
    { id: 'proff-portal', label: 'Håndverker', icon: Icons.Briefcase }, // Changed from Partner to Håndverker
    { id: 'era-dna', label: 'DNA', icon: Icons.Fingerprint },
    { id: 'gevinst', label: 'Verdi', icon: Icons.Coins },
    { id: 'pris', label: 'Pris', icon: Icons.Tag }
];

const HERO_VERBS = [
    "maksimerer",
    "sikrer",
    "øker",
    "beskytter",
    "synliggjør"
];

const TICKER_EVENTS = [
    "Lars i Oslo fikk 15.000,- i Enova-støtte",
    "Fasade utbedret og verifisert i Bergen",
    "Ny verdiøkning registrert: +120.000,- (Bærum)",
    "Sameie i Trondheim sparte 40% på fellesutgifter",
    "Kari aktiverte Smart-Utførelse på taksjekk"
];

const PROCESS_STEPS = [
    {
        step: "01",
        title: "Du skanner",
        desc: "Ta bilde av problemet. ERA Vision analyserer skadeomfang og beregner kostnad umiddelbart.",
        icon: Icons.ScanLine
    },
    {
        step: "02",
        title: "ERA matcher",
        desc: "Systemet finner beste sertifiserte Mesterbedrift i ditt nabolag som har ledig kapasitet.",
        icon: Icons.Users
    },
    {
        step: "03",
        title: "Jobben gjøres",
        desc: "Håndverker utfører arbeidet etter ERAs spesifikasjon. Du følger fremdriften i appen.",
        icon: Icons.Hammer
    },
    {
        step: "04",
        title: "Verdi låses",
        desc: "Ferdigstillelse verifiseres, og verdiøkningen skrives direkte inn i din digitale eiendomslogg.",
        icon: Icons.BadgeCheck
    }
];

// NEW: Explicit Data Provenance Partners
const INTEGRITY_PARTNERS = [
    { name: 'Mesterfarge', role: 'Pris- & Produktbase', icon: Icons.Palette, color: 'text-orange-500', desc: 'Sanntids materialpriser' },
    { name: 'Kartverket', role: 'Matrikkeldata', icon: Icons.Map, color: 'text-green-500', desc: 'Offentlig eiendomsdata' },
    { name: 'Met.no', role: 'Klima-analyse', icon: Icons.CloudSun, color: 'text-blue-400', desc: 'Lokale værdata' },
    { name: 'Enova', role: 'Tilskuddsregister', icon: Icons.Zap, color: 'text-emerald-400', desc: 'Oppdaterte støtteregler' },
    { name: 'Google Gemini', role: 'AI Core Engine', icon: Icons.Sparkles, color: 'text-indigo-400', desc: 'Bildeanalyse & Logikk' },
    { name: 'Byggforsk', role: 'Standarder', icon: Icons.BookOpen, color: 'text-zinc-400', desc: 'Sintef Byggforskserien' }
];

const INDUSTRY_PARTNERS = [
    "Mestergruppen",
    "Mesterfarge",
    "Mal Proff",
    "Malorama",
    "Jotun",
    "Glava"
];

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onStartAnalyse, onNavigate }) => {
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [tickerIndex, setTickerIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [verbIndex, setVerbIndex] = useState(0);
  const [valueVisible, setValueVisible] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const tickerInterval = setInterval(() => {
        setTickerIndex((prev) => (prev + 1) % TICKER_EVENTS.length);
    }, 5000);

    const stepInterval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % PROCESS_STEPS.length);
    }, 2000);

    const verbInterval = setInterval(() => {
        setVerbIndex((prev) => (prev + 1) % HERO_VERBS.length);
    }, 2500);

    return () => {
        clearInterval(tickerInterval);
        clearInterval(stepInterval);
        clearInterval(verbInterval);
    };
  }, []);

  // Intersection Observer for Value Section Animation
  useEffect(() => {
      const observer = new IntersectionObserver(
          ([entry]) => {
              if (entry.isIntersecting) {
                  setValueVisible(true);
              }
          },
          { threshold: 0.3 }
      );
      const target = document.getElementById('gevinst');
      if (target) observer.observe(target);
      return () => { if (target) observer.unobserve(target); };
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const container = document.getElementById('landing-content-scroll');
    const target = document.getElementById(id);
    if (container && target) {
        setActiveSection(id);
        const top = target.offsetTop;
        container.scrollTo({ top: top, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const container = document.getElementById('landing-content-scroll');
    const sections = NAV_ITEMS.map(i => i.id);

    const handleScroll = () => {
        if (!container) return;
        const scrollPos = container.scrollTop + 350;
        for (const sectionId of sections) {
            const el = document.getElementById(sectionId);
            if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
                setActiveSection(sectionId);
                break;
            }
        }
    };
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  if (showRoleSelector) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06)_0%,transparent_70%)]" />
        <div className="max-w-7xl w-full z-10 animate-era-in text-center">
            <button onClick={() => setShowRoleSelector(false)} className="text-zinc-400 hover:text-white mb-16 inline-flex items-center gap-4 font-black uppercase text-[11px] tracking-[0.3em] transition-all group">
                <Icons.ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Tilbake
            </button>
            <h2 className="text-6xl md:text-8xl font-black text-white mb-20 tracking-ios-tighter font-display leading-none italic">
                Velg <span className="text-zinc-600">modus.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                <RoleCard role={UserRole.HOMEOWNER} icon={Icons.Home} title="Boligeier" desc="Få full kontroll over din viktigste formue." onClick={onLogin} />
                <RoleCard role={UserRole.BOARD_MEMBER} icon={Icons.Building} title="Styret" desc="Forvaltning av Sameie & BRL." onClick={onLogin} accent="blue" />
                <RoleCard role={UserRole.PROFESSIONAL} icon={Icons.Zap} title="Partner" desc="Lever dokumentert kvalitet." onClick={onLogin} accent="emerald" />
                <RoleCard role={UserRole.CHAIN_ADMIN} icon={Icons.BarChart3} title="Admin" desc="Kjedeledelse og analyse." onClick={onLogin} accent="purple" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-[#050505] text-[#F2F2F7] font-sans flex overflow-hidden selection:bg-indigo-500/30">

      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[1200px] h-[1200px] bg-indigo-600/[0.04] rounded-full blur-[200px]" />
          <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-emerald-600/[0.03] rounded-full blur-[200px]" />
      </div>

      {/* LEFT NAVIGATION PANEL */}
      <aside className="hidden lg:flex w-[280px] flex-col py-12 px-6 shrink-0 z-50 relative border-r border-white/10 bg-[#0A0A0B]/90 backdrop-blur-xl">
        <div className="mb-14 px-4">
          <Icons.EraAxis size={26} variant="wordmark" active />
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar pr-2">
            {NAV_ITEMS.map((item) => (
                <SideNavAnchor
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    active={activeSection === item.id}
                    onClick={() => scrollToSection(item.id)}
                />
            ))}
        </nav>

        <div className="mt-8 pt-8 space-y-4 border-t border-white/10 px-4">
            <button onClick={() => setShowRoleSelector(true)} className="w-full h-12 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-all text-left">Logg inn (OS)</button>
            <PrimaryButton onClick={onStartAnalyse} variant="white" className="w-full !px-0 border-2 border-transparent">
                Start Analyse
            </PrimaryButton>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main id="landing-content-scroll" className="flex-1 overflow-y-auto no-scrollbar relative scroll-smooth selection:bg-indigo-500/50">

        {/* 1. HERO SECTION */}
        <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-6 md:px-12 text-center relative overflow-hidden pt-20">
          <div className="max-w-[1200px] w-full relative z-20 animate-era-in flex flex-col items-center">

            {/* SOCIAL PROOF BADGE */}
            <div className="mb-12 inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/15 rounded-full backdrop-blur-xl animate-era-slide-up">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-zinc-300">
                    ERA OS v2.1
                </span>
            </div>

            {/* H1 ODOMETER */}
            <h1 className="text-[50px] md:text-[90px] lg:text-[110px] font-black tracking-tighter leading-[1.15] mb-10 font-display text-white text-center">
                <div className="flex flex-wrap justify-center items-baseline gap-x-3 md:gap-x-5">
                    <span className="shrink-0">KI som</span>

                    {/* Odometer Window */}
                    <div className="relative h-[1.15em] overflow-hidden grid place-items-start">
                        <span className="opacity-0 select-none col-start-1 row-start-1 pointer-events-none" aria-hidden="true">maksimerer</span>
                        <div
                            className="col-start-1 row-start-1 flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                            style={{ transform: `translateY(calc(-${verbIndex} * 1.15em))` }}
                        >
                            {HERO_VERBS.map((verb, i) => (
                                <span
                                    key={i}
                                    className="h-[1.15em] flex items-center leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#9effc3] via-[#7ab5ff] to-[#9d9aff] pb-[0.1em]"
                                >
                                    {verb}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="block">verdien av din</div>
                <div className="block">bolig.</div>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-400 max-w-[800px] mb-12 leading-relaxed font-medium mt-2">
                Løft teknisk tilstand og dokumentert markedsverdi med Norges første AI-baserte operativsystem for eiendom.
            </p>

            <div className="flex flex-col md:flex-row gap-6 mb-20">
                <button
                    onClick={onStartAnalyse}
                    className="h-16 px-12 rounded-full bg-white text-black font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                    START GRATIS ANALYSE
                </button>
            </div>

            {/* TRUST SIGNALS */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 hover:opacity-100 transition-all duration-500">
                <div className="flex items-center gap-3">
                    <Icons.BadgeCheck size={28} className="text-white" />
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Mesterbedrift</span>
                </div>
                <div className="flex items-center gap-3">
                    <Icons.Lock size={28} className="text-white" />
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-300">BankID Signering</span>
                </div>
                <div className="flex items-center gap-3">
                    <Icons.ShieldCheck size={28} className="text-white" />
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Byggteknisk Godkjent</span>
                </div>
            </div>

          </div>
        </section>

        {/* 2. RISK MONITOR */}
        <section id="risk-monitor" className="min-h-screen flex flex-col justify-center py-32 px-6 md:px-12 lg:px-32 bg-black border-t border-white/10 relative overflow-hidden">
             <div className="max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
                    <div className="lg:col-span-6 space-y-12">
                        <span className="text-xs font-black uppercase tracking-[0.5em] text-red-500 block">DET USYNLIGE FORFALLET</span>
                        <h2 className="text-5xl md:text-8xl font-black tracking-ios-tighter text-white leading-[0.9] font-display italic">
                            Hver dag du venter <br /><span className="text-zinc-800">taper du penger.</span>
                        </h2>
                        <div className="space-y-8 text-zinc-400 text-2xl leading-relaxed font-medium">
                            <p>ERA ser det blotte øye ikke ser. En liten sprekk i fasaden i dag, er en råteskade til 200.000 kr om to år.</p>
                            <p className="text-white">
                                Vi varsler deg <span className="text-emerald-400 font-bold border-b border-emerald-500/50">før</span> skaden skjer, og gir deg fasiten på hva det koster å fikse det.
                            </p>
                        </div>
                    </div>
                    <div className="lg:col-span-6">
                        <AuraCard className="p-12 bg-[#121214] border-red-500/30 relative overflow-hidden shadow-2xl">
                            <div className="flex justify-between items-end mb-12">
                                <div>
                                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest block mb-1">Ditt Akkumulerte Etterslep</span>
                                    <div className="text-6xl font-black text-white font-display tracking-tighter">342.000,-</div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-black text-red-500 uppercase tracking-widest block mb-1">Verditap pr mnd</span>
                                    <div className="text-2xl font-black text-red-500 font-display">-4.200,-</div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <RiskBar label="Taktekking (Kritisk)" progress={92} color="bg-red-500" />
                                <RiskBar label="Drenering (Moderat)" progress={65} color="bg-orange-500" />
                                <RiskBar label="Fasade (Forebyggende)" progress={35} color="bg-emerald-500" />
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/10 flex items-center gap-4">
                                <Icons.AlertTriangle className="text-red-500 animate-pulse" size={32} />
                                <p className="text-xs md:text-sm font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
                                    ERA anbefaler umiddelbar utbedring av tak for å unngå følgeskader på konstruksjon.
                                </p>
                            </div>
                        </AuraCard>
                    </div>
                </div>
             </div>
        </section>

        {/* 3. SMART-UTFØRELSE */}
        <section id="smart-utforelse" className="min-h-screen flex flex-col justify-center py-32 px-6 md:px-12 lg:px-32 bg-[#050505] border-t border-white/10 relative overflow-hidden">
             <div className="max-w-7xl mx-auto w-full relative">
                <div className="text-center mb-32 space-y-8">
                    <span className="text-xs font-black uppercase tracking-[0.5em] text-indigo-500 block">ERA SMART-UTFØRELSE</span>
                    <h2 className="text-5xl md:text-9xl font-black text-white tracking-tighter font-display italic leading-none">Fra funn <br /><span className="text-zinc-800">til fiks.</span></h2>
                    <p className="text-zinc-400 text-2xl max-w-3xl mx-auto">Slik kobler ERA kunstig intelligens med ekte håndverkskraft.</p>
                </div>

                <div className="relative">
                    <div className="absolute top-[50px] left-0 w-full h-[2px] bg-white/5 hidden md:block rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm transition-all duration-700 ease-linear"
                            style={{
                                width: '25%',
                                transform: `translateX(${activeStep * 100}%)`
                            }}
                        />
                    </div>

                    <div className="absolute top-0 bottom-0 left-[28px] w-[2px] bg-white/5 md:hidden rounded-full overflow-hidden">
                        <div
                            className="w-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent blur-sm transition-all duration-700 ease-linear"
                            style={{
                                height: '25%',
                                transform: `translateY(${activeStep * 100}%)`
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
                        {PROCESS_STEPS.map((step, idx) => (
                            <div key={idx} className="relative group">
                                <div className={`md:hidden absolute left-[14px] top-[24px] w-8 h-[2px] -translate-x-1/2 transition-colors duration-500 ${idx === activeStep ? 'bg-indigo-500 shadow-[0_0_10px_#6366f1]' : 'bg-transparent'}`} />
                                <ProcessCard
                                    step={step.step}
                                    title={step.title}
                                    desc={step.desc}
                                    icon={step.icon}
                                    isActive={idx === activeStep}
                                />
                            </div>
                        ))}
                    </div>
                </div>
             </div>
        </section>

        {/* --- PROFF PARTNER SECTION (WORLD CLASS) --- */}
        <section id="proff-portal" className="min-h-screen flex flex-col justify-center py-32 px-6 md:px-12 lg:px-32 bg-[#020202] border-t border-white/10 relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.05)_0%,transparent_60%)] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

            <div className="max-w-7xl mx-auto w-full relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

                    {/* LEFT: CONTENT HOOK */}
                    <div className="lg:col-span-5 flex flex-col justify-center space-y-10">
                        <div className="space-y-6">
                            <span className="text-xs font-black uppercase tracking-[0.5em] text-emerald-500 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                ERA Partner OS
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter font-display leading-[0.95]">
                                Din nye <br />
                                <span className="text-zinc-700">Driftsassistent.</span>
                            </h2>
                            <p className="text-2xl text-zinc-400 leading-relaxed font-medium">
                                Fyll ordreboken uten befaringer. ERA leverer ferdigkalkulerte jobber rett i lomma, og automatiserer all dokumentasjon.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 group">
                                <div className="w-14 h-14 rounded-2xl bg-[#1A1B1E] border border-white/5 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform shadow-lg">
                                    <Icons.Briefcase size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-0.5 text-lg">Jobb uten befaring</h4>
                                    <p className="text-sm text-zinc-500">Vi leverer komplett underlag med bilder og mål. Du priser jobben digitalt.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-14 h-14 rounded-2xl bg-[#1A1B1E] border border-white/5 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform shadow-lg">
                                    <Icons.Zap size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-0.5 text-lg">Auto-Dokumentasjon</h4>
                                    <p className="text-sm text-zinc-500">Sjekklister, KS og FDV fylles ut automatisk basert på din aktivitet.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-14 h-14 rounded-2xl bg-[#1A1B1E] border border-white/5 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform shadow-lg">
                                    <Icons.TrendingUp size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-0.5 text-lg">Sikker Betaling</h4>
                                    <p className="text-sm text-zinc-500">Verifisert ferdigstillelse utløser umiddelbar fakturering.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={() => onLogin(UserRole.PROFESSIONAL)}
                                className="h-16 px-10 bg-white text-black rounded-full font-black uppercase tracking-widest text-sm hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center gap-3"
                            >
                                Søk Partner-Status <Icons.ArrowRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: WORKFLOW ENGINE VISUALIZATION */}
                    <div className="lg:col-span-7 relative">
                        <div className="relative z-10 grid grid-cols-2 gap-4">
                            {/* Card 1: Incoming */}
                            <AuraCard className="col-span-2 md:col-span-1 p-6 bg-[#0D0D0E] border-emerald-500/20 shadow-[0_20px_50px_-20px_rgba(16,185,129,0.1)] group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <Icons.Inbox size={24} />
                                    </div>
                                    <span className="text-xs font-black uppercase bg-emerald-500 text-black px-2 py-1 rounded">Ny Lead</span>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <h4 className="text-lg font-bold text-white">Maling Fasade</h4>
                                    <p className="text-sm text-zinc-500">Grefsenkollveien 12</p>
                                    <div className="flex gap-2">
                                        <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2 py-1 rounded">142 m²</span>
                                        <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2 py-1 rounded">Stillas OK</span>
                                    </div>
                                </div>
                                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 animate-[shimmer_2s_infinite_linear]" style={{ width: '100%', background: 'linear-gradient(90deg, transparent, #10b981, transparent)' }} />
                                </div>
                            </AuraCard>

                            {/* Card 2: Revenue */}
                            <AuraCard className="col-span-2 md:col-span-1 p-6 bg-[#0D0D0E] border-white/5 flex flex-col justify-between">
                                <div>
                                    <span className="text-xs font-black text-zinc-600 uppercase tracking-widest block mb-2">Din Inntjening</span>
                                    <div className="text-4xl font-mono font-bold text-white tracking-tighter">84.500,-</div>
                                </div>
                                <div className="flex items-center gap-2 mt-4 text-emerald-500">
                                    <Icons.TrendingUp size={20} />
                                    <span className="text-sm font-bold">+12% vs forrige mnd</span>
                                </div>
                            </AuraCard>

                            {/* Card 3: The Engine (Wide) */}
                            <AuraCard className="col-span-2 p-8 bg-[#121214] border-white/10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_8s_infinite_linear]" />

                                <div className="flex justify-between items-center relative z-10">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-14 h-14 rounded-full border border-white/10 bg-black flex items-center justify-center text-zinc-500">
                                            <Icons.User size={24} />
                                        </div>
                                        <span className="text-xs font-black uppercase text-zinc-600">Kunde</span>
                                    </div>

                                    {/* Connection Line */}
                                    <div className="flex-1 h-[2px] bg-zinc-800 mx-4 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-1/2 animate-[marquee_2s_linear_infinite]" />
                                    </div>

                                    <div className="w-24 h-24 rounded-[30px] bg-emerald-600 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] relative">
                                        <Icons.Cpu size={40} className="text-white animate-pulse" />
                                        <div className="absolute -bottom-8 text-xs font-black uppercase text-emerald-500 tracking-widest">ERA Core</div>
                                    </div>

                                    {/* Connection Line */}
                                    <div className="flex-1 h-[2px] bg-zinc-800 mx-4 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-1/2 animate-[marquee_2s_linear_infinite]" />
                                    </div>

                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-14 h-14 rounded-full border-2 border-emerald-500 bg-black flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                            <Icons.Briefcase size={24} />
                                        </div>
                                        <span className="text-xs font-black uppercase text-white">Partner</span>
                                    </div>
                                </div>
                            </AuraCard>
                        </div>

                        {/* Decor elements behind */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>

        {/* PARTNER MARQUEE */}
        <section className="py-16 bg-[#020202] border-t border-b border-white/5 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#020202] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#020202] to-transparent z-10" />

            <div className="flex w-full">
                <div className="flex items-center gap-24 animate-marquee whitespace-nowrap pl-24">
                    {[...INDUSTRY_PARTNERS, ...INDUSTRY_PARTNERS, ...INDUSTRY_PARTNERS, ...INDUSTRY_PARTNERS].map((partner, i) => (
                        <div key={i} className="flex items-center gap-4 group cursor-default">
                            <span className="text-3xl md:text-5xl font-black text-zinc-800 uppercase tracking-tighter group-hover:text-white transition-colors duration-500 font-display">
                                {partner}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* 4. ERA DNA */}
        <section id="era-dna" className="py-32 px-6 md:px-12 lg:px-32 bg-black border-t border-white/10 relative overflow-hidden">
            <div className="max-w-7xl mx-auto w-full">

                <div className="mb-24 md:text-center space-y-8">
                    <span className="text-xs font-black uppercase tracking-[0.5em] text-indigo-500 block">ERA INTELLIGENCE</span>
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white font-display italic leading-[0.9]">
                        Ikke en markedsplass. <br />
                        <span className="text-zinc-800">Et operativsystem.</span>
                    </h2>
                    <p className="text-zinc-400 text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
                        Andre lister opp håndverkere. ERA forteller deg *hva* du trenger, *når* du trenger det, og *hvorfor* det lønner seg – før du i det hele tatt spør.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AuraCard className="p-10 bg-[#0D0D0E] border-white/5 space-y-6 hover:border-indigo-500/20 transition-colors group">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                            <Icons.Sparkles size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Autonom Innsikt</h3>
                        <p className="text-zinc-500 text-base leading-relaxed">
                            Vi eliminerer synsing. ERA bruker data fra tusenvis av boliger, værprognoser og material-fakta for å gi deg fasiten på boligens tilstand.
                        </p>
                    </AuraCard>
                    <AuraCard className="p-10 bg-[#0D0D0E] border-white/5 space-y-6 hover:border-emerald-500/20 transition-colors group">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                            <Icons.ShieldCheck size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Radikal Integritet</h3>
                        <p className="text-zinc-500 text-base leading-relaxed">
                            Ingen skjulte påslag. Ingen ukjente aktører. Vi matcher kun mot sertifiserte Mesterbedrifter og verifiserer arbeidet digitalt mot norsk standard.
                        </p>
                    </AuraCard>
                    <AuraCard className="p-10 bg-[#0D0D0E] border-white/5 space-y-6 hover:border-purple-500/20 transition-colors group">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                            <Icons.Layers size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Sømløst System</h3>
                        <p className="text-zinc-500 text-base leading-relaxed">
                            Slutt på papirkvitteringer og tapte dokumenter. ERA samler tilstand, utbedring og verdiøkning i én levende, bank-godkjent logg.
                        </p>
                    </AuraCard>
                </div>
            </div>
        </section>

        {/* 5. GEVINST - THE VALUE EQUATION */}
        <section id="gevinst" className="min-h-screen flex flex-col justify-center py-32 px-6 md:px-12 lg:px-32 bg-[#030303] border-t border-white/10 relative overflow-hidden">
            <div className="max-w-7xl mx-auto w-full">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                    <div className="lg:col-span-5 space-y-12">
                        <div className="space-y-6">
                            <span className="text-xs font-black uppercase tracking-[0.5em] text-emerald-500 block">ØKONOMISK GEVINST</span>
                            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white font-display italic leading-none">
                                Din skjulte <br />
                                <span className="text-zinc-800">egenkapital.</span>
                            </h2>
                            <p className="text-zinc-400 text-2xl leading-relaxed font-medium">
                                Vedlikehold er ikke en kostnad, det er en investering med høyere avkastning enn banken gir deg. ERA finner pengene.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <Icons.Check size={20} />
                                </div>
                                <span className="text-base font-bold text-white">Automatisk søknad om Enova-støtte</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <Icons.Check size={20} />
                                </div>
                                <span className="text-base font-bold text-white">Dokumentert verdiøkning ved salg</span>
                            </div>
                        </div>

                        <PrimaryButton onClick={onStartAnalyse} variant="ai" className="h-16 w-full md:w-auto shadow-emerald-500/20">
                            Kalkuler min gevinst
                        </PrimaryButton>
                    </div>

                    <div className="lg:col-span-7 relative">
                        <div className="bg-[#0A0A0B] border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                            <div className="relative z-10 space-y-6">
                                <ValueRow label="Enova Støtte" amount={45000} icon={Icons.Zap} color="text-emerald-400" delay={0} visible={valueVisible} />
                                <ValueRow label="Verdiøkning (Estimert)" amount={120000} icon={Icons.TrendingUp} color="text-blue-400" delay={500} visible={valueVisible} />
                                <ValueRow label="Energibesparelse (5 år)" amount={84000} icon={Icons.Droplets} color="text-zinc-400" delay={1000} visible={valueVisible} />
                                <div className="h-[1px] w-full bg-white/10 my-4" />
                                <div className="flex justify-between items-end pt-4">
                                    <span className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-2">Total Gevinst</span>
                                    <div className={`text-5xl md:text-6xl font-black text-white font-display tracking-tighter transition-all duration-1000 ${valueVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                        {valueVisible ? <NumberTicker value={249000} /> : 0},-
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* INTEGRITY GRID REPLACEMENT */}
                        <div className="mt-16 pt-10 border-t border-white/5 opacity-80 hover:opacity-100 transition-opacity">
                            <p className="text-center text-zinc-500 text-xs font-black uppercase tracking-[0.3em] mb-8">
                                Datagrunnlag & System-Integritet
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {INTEGRITY_PARTNERS.map((p, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors cursor-help" title={p.desc}>
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-black/40 ${p.color}`}>
                                            <p.icon size={18} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white leading-none mb-1">{p.name}</span>
                                            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide group-hover:text-zinc-400">{p.role}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 6. PRIS SECTION */}
        <section id="pris" className="min-h-screen flex flex-col justify-center py-32 px-6 md:px-12 lg:px-32 bg-[#050505] border-t border-white/10 relative scroll-mt-0">
            <div className="max-w-7xl mx-auto w-full">
                <div className="text-center mb-16 space-y-10">
                    <span className="text-xs font-black uppercase tracking-[0.5em] text-indigo-500 block">INVESTERING</span>
                    <h2 className="text-6xl md:text-9xl font-black tracking-ios-tighter text-white leading-none font-display italic">Velg ditt <br /><span className="text-zinc-800">kontrollnivå.</span></h2>

                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-zinc-500'}`}>Månedlig</span>
                        <button onClick={() => setBillingCycle(c => c === 'monthly' ? 'yearly' : 'monthly')} className="w-16 h-9 bg-white/10 rounded-full relative p-1 transition-colors hover:bg-white/20">
                            <div className={`w-7 h-7 bg-white rounded-full shadow-md transition-all duration-300 ${billingCycle === 'yearly' ? 'translate-x-7' : ''}`} />
                        </button>
                        <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-white' : 'text-zinc-500'}`}>Årlig <span className="text-emerald-500 text-xs ml-1">SPAR 20%</span></span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <PricePlan
                        name="Utforsker"
                        price="0"
                        billing={billingCycle}
                        desc="For den nysgjerrige. Få full oversikt over teknisk tilstand uten forpliktelser."
                        features={["ERA Vision bildeanalyse", "Teknisk tilstandsindeks", "Risiko-overvåking (Sanntid)", "Tilgang til Mester-nettverk"]}
                        cta="Last ned (Gratis)"
                        onClick={onStartAnalyse}
                    />
                    <PricePlan
                        name="Aktiv eier"
                        price={billingCycle === 'monthly' ? "490" : "390"}
                        billing={billingCycle}
                        featured
                        desc="For investoren. Bygg varig verdi gjennom sertifisert dokumentasjon og smart forvaltning."
                        features={["Sertifisert Eiendomslogg", "Enova Navigator (Auto-søknad)", "Bank-klar FDV-eksport", "Digital Bolig-ID for salg", "Ubegrenset verifikasjon"]}
                        cta="Start Verdisikring"
                        onClick={() => onLogin(UserRole.HOMEOWNER)}
                    />
                </div>
            </div>
        </section>

        {/* FAT FOOTER */}
        <footer className="py-24 px-6 md:px-32 border-t border-white/10 bg-black text-center md:text-left relative">
           <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="md:col-span-2 space-y-8">
                 <Icons.EraAxis size={40} variant="wordmark" active />
                 <p className="text-zinc-500 text-base leading-relaxed max-w-md">
                    Datadrevet. Autonom. Lønnsom. ERA er operativsystemet som digitaliserer verdens største aktivaklasse, og transformerer bolighold fra utgift til verdiskapning.
                 </p>
              </div>
              <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">Selskap</h4>
                  <ul className="space-y-2 text-base text-zinc-500">
                      <li><a href="#" className="hover:text-white transition-colors">Om oss</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Karriere</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
                  </ul>
              </div>
              <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">Kontakt</h4>
                  <ul className="space-y-2 text-base text-zinc-500">
                      <li>kontakt@era.os</li>
                      <li>Teknologihuset, Oslo</li>
                      <li className="pt-4 flex gap-4">
                          <Icons.Linkedin size={20} className="hover:text-white cursor-pointer" />
                          <Icons.Instagram size={20} className="hover:text-white cursor-pointer" />
                      </li>
                  </ul>
              </div>
           </div>
           <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex justify-between text-xs font-bold text-zinc-600 uppercase tracking-widest">
               <span>© 2024 ERA Intelligence AS</span>
               <div className="flex gap-6">
                   <span>Personvern</span>
                   <span>Vilkår</span>
               </div>
           </div>
        </footer>

        {/* LIVE TICKER */}
        <div className="fixed bottom-8 right-8 z-50 hidden md:block">
            <div className="bg-[#0A0A0B]/90 backdrop-blur-xl border border-white/15 rounded-full py-3 px-6 shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom duration-1000">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-white tracking-wide min-w-[280px]">
                    {TICKER_EVENTS[tickerIndex]}
                </span>
            </div>
        </div>

      </main>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const ValueRow = ({ label, amount, icon: Icon, color, delay, visible }: any) => (
    <div
        className={`flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 transition-all duration-700 transform ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ transitionDelay: `${delay}ms` }}
    >
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center ${color}`}>
                <Icon size={20} />
            </div>
            <span className="text-sm font-bold text-white uppercase tracking-wider">{label}</span>
        </div>
        <span className={`text-xl font-mono font-bold ${color}`}>
            +{amount.toLocaleString()},-
        </span>
    </div>
);

const RiskBar = ({ label, progress, color }: any) => (
    <div className="space-y-2">
        <div className="flex justify-between items-end px-1">
            <span className="text-sm font-bold text-white tracking-tight">{label}</span>
            <span className={`text-sm font-mono font-bold ${color === 'bg-red-500' ? 'text-red-500' : 'text-zinc-500'}`}>{progress}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full transition-all duration-1000 shadow-lg`} style={{ width: `${progress}%` }} />
        </div>
    </div>
);

const ProcessCard = ({ step, title, desc, icon: Icon, isActive }: any) => (
    <AuraCard className={`
        p-8 h-full flex flex-col justify-between transition-all duration-500 ease-out
        ${isActive
            ? 'bg-[#121214] border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)] opacity-100 scale-[1.02]'
            : 'bg-[#0A0A0B] border-white/5 opacity-40 grayscale'}
    `}>
        <div>
            <div className="flex justify-between items-start mb-8">
                <span className={`text-4xl font-black italic tracking-tighter ${isActive ? 'text-white' : 'text-zinc-800'}`}>{step}</span>
                <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500
                    ${isActive ? 'bg-indigo-500 text-white scale-110 rotate-12' : 'bg-white/10 text-zinc-500'}
                `}>
                    <Icon size={24} />
                </div>
            </div>
            <h4 className={`text-xl font-bold mb-4 tracking-tight ${isActive ? 'text-white' : 'text-zinc-500'}`}>{title}</h4>
            <p className={`text-base leading-relaxed font-medium ${isActive ? 'text-zinc-400' : 'text-zinc-700'}`}>{desc}</p>
        </div>
    </AuraCard>
);

const PricePlan = ({ name, price, desc, features, cta, onClick, featured = false, billing = 'monthly' }: any) => (
    <div className={`p-12 rounded-[40px] border flex flex-col transition-all duration-1000 relative overflow-hidden group ${featured ? 'bg-[#121214] border-indigo-500/40 shadow-2xl scale-105 z-10' : 'bg-[#0A0A0B] border-white/10'}`}>
        <div className="mb-10 relative z-10">
            <h3 className="text-4xl font-black text-white mb-4 tracking-tight font-display italic leading-none">{name}</h3>
            <p className="text-zinc-400 text-base leading-relaxed font-medium italic">{desc}</p>
        </div>
        <div className="mb-12 relative z-10">
            <div className="flex items-baseline gap-4">
                <span className="text-7xl font-black text-white tracking-tighter font-display">{price},-</span>
                <span className="text-sm font-black text-zinc-500 uppercase tracking-widest">{billing === 'monthly' ? 'per mnd' : 'per mnd / år'}</span>
            </div>
        </div>
        <div className="flex-1 space-y-5 mb-12 relative z-10">
            {features.map((f: string, i: number) => (
                <div key={i} className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${featured ? 'bg-indigo-500 shadow-[0_0_10px_#6366f1]' : 'bg-zinc-800'}`} />
                    <span className="text-base font-bold text-zinc-300">{f}</span>
                </div>
            ))}
        </div>
        <button onClick={onClick} className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm transition-all active:scale-95 shadow-2xl relative z-10 ${featured ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}>{cta}</button>
    </div>
);

const RoleCard = ({ icon: Icon, title, desc, onClick, role, accent = 'white' }: any) => {
  const accents: any = {
    white: 'text-white border-white/15',
    emerald: 'text-emerald-400 border-emerald-500/30',
    blue: 'text-blue-400 border-blue-500/30',
    purple: 'text-purple-400 border-purple-500/30'
  };
  return (
    <button onClick={() => onClick(role)} className="liquid-glass p-8 lg:p-12 rounded-[32px] text-left h-full flex flex-col justify-between group overflow-hidden relative interactive-card border-white/15 hover:border-white/30 hover:bg-white/[0.08]">
      <div className="relative z-10 w-full">
        <div className={`w-20 h-20 liquid-glass rounded-2xl flex items-center justify-center mb-10 shadow-2xl transition-transform group-hover:scale-110 ${accents[accent]}`}><Icon size={36} strokeWidth={1.5} /></div>
        <h3 className="text-3xl font-black text-white mb-4 tracking-tighter font-display italic leading-none">{title}</h3>
        <p className="text-zinc-400 text-base font-medium leading-relaxed italic">{desc}</p>
      </div>
    </button>
  );
};

const SideNavAnchor = ({ label, icon: Icon, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-500 group relative ${active ? 'text-white bg-white/10 border border-white/10 shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-white/[0.05] border border-transparent'}`}
    >
        <div className={`transition-all duration-500 ${active ? 'text-indigo-400 scale-110' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
            <Icon size={20} />
        </div>
        <span className={`text-sm font-bold tracking-tight transition-all duration-500 ${active ? 'translate-x-1' : ''}`}>
            {label}
        </span>
        {active && (
            <div className="absolute right-4 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]" />
        )}
    </button>
);
