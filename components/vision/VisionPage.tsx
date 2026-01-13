
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icons } from '../Icons';
import { analyzeBuildingImage } from '../../services/geminiService';
import { useAppStore } from '../../lib/store/useAppStore';
import { PrimaryButton, AuraCard, LoadingState } from '../widgets/SharedWidgets';
import { VisionAnalysisResult, UserRole } from '../../types';

interface ScanningPoint {
    x: number;
    y: number;
    humanLabel: string;
    techLabel: string;
    confidence: string;
    status: 'ok' | 'warning' | 'critical';
}

const SCAN_GUIDES = [
    "Beveg kameraet sakte over overflaten",
    "Hold rett vinkel mot veggen",
    "Sørg for godt lys på måleområdet",
    "ERA Vision søker etter tekniske avvik"
];

export const VisionPage: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const { saveVisionJob, userRole } = useAppStore();
  const [mode, setMode] = useState<'camera' | 'analyzing' | 'review' | 'success' | 'error'>('camera');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [analysisResult, setAnalysisResult] = useState<VisionAnalysisResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hudPoints, setHudPoints] = useState<ScanningPoint[]>([]);
  const [guideIndex, setGuideIndex] = useState(0);
  const [isStable, setIsStable] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      stopStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera access error:", err);
      setMode('error');
    }
  }, [facingMode, stopStream]);

  useEffect(() => {
    if (mode === 'camera') {
        startCamera();

        const guideInterval = setInterval(() => {
            setGuideIndex(prev => (prev + 1) % SCAN_GUIDES.length);
            setIsStable(Math.random() > 0.4);
        }, 3000);

        const pointsInterval = setInterval(() => {
            const scenarios: Omit<ScanningPoint, 'x' | 'y'>[] = [
                { humanLabel: "Overflate-tilstand", techLabel: "SURFACE_INTEGRITY", confidence: "92%", status: 'ok' },
                { humanLabel: "Mulig fuktrisiko", techLabel: "MOISTURE_INDEX", confidence: "48%", status: 'warning' },
                { humanLabel: "Material-deteksjon", techLabel: "FACADE_TYPE_TRE", confidence: "99%", status: 'ok' },
                { humanLabel: "Isolasjonsegenskap", techLabel: "THERMAL_VALUE", confidence: "74%", status: 'ok' }
            ];

            const scene = scenarios[Math.floor(Math.random() * scenarios.length)];
            setHudPoints(prev => [
                ...prev.slice(-2),
                {
                    ...scene,
                    x: 25 + Math.random() * 50,
                    y: 25 + Math.random() * 50
                }
            ]);
        }, 1200);

        return () => {
            stopStream();
            clearInterval(guideInterval);
            clearInterval(pointsInterval);
        };
    }
  }, [mode, startCamera, stopStream]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const handleCapture = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(dataUrl);
    setMode('analyzing');
    stopStream();

    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });

      const res = await analyzeBuildingImage(file);
      if (!res) throw new Error("Analysis failed");

      setAnalysisResult(res);
      setMode('review'); // New step: Review findings
    } catch (err) {
      console.error("Capture analysis failed:", err);
      setMode('error');
    }
  };

  const handleConfirmReview = () => {
      if (analysisResult && capturedImage) {
          const initiator = userRole === UserRole.PROFESSIONAL ? 'pro' : 'customer';
          saveVisionJob(analysisResult, capturedImage, initiator);
          setMode('success');
      }
  };

  return (
    <div className="fixed inset-0 bg-black z-[1000] overflow-hidden flex flex-col font-sans selection:bg-indigo-500/30">

      {mode === 'camera' && (
        <div className="relative flex-1">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover grayscale-[0.3] opacity-80 ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          />

          <div className="absolute inset-0 z-10 pointer-events-none">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

             {/* TOP HUD */}
             <div className="absolute top-14 left-0 right-0 px-8 flex justify-between items-start animate-era-in">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1">Verdi-risiko</span>
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                             <span className="text-2xl font-bold text-white tracking-tighter uppercase italic font-display">Minimal</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end text-right">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-1">Anbefalt Tiltak</span>
                    <span className="text-lg font-bold text-white tracking-tight italic">+1.4% Verdisikring</span>
                </div>
             </div>

             {/* SIDE HUD */}
             <div className="absolute top-40 left-8 space-y-4">
                <HUDStat label="SIGNAL" val={isStable ? "LOCKED" : "SEARCHING"} />
                <HUDStat label="CORE" val="AI_READY" />
                <HUDStat label="ISO" val="800" />
             </div>

             {/* SCANNING CLUSTERS */}
             {hudPoints.map((pt, i) => (
                 <div
                    key={i}
                    className="absolute transition-all duration-1000 ease-out flex flex-col gap-2"
                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                 >
                    <div className="relative">
                        <div className={`w-3 h-3 rounded-full animate-ping ${pt.status === 'warning' ? 'bg-amber-500' : 'bg-white'}`} />
                        <div className={`absolute inset-0 w-3 h-3 rounded-full border-2 ${pt.status === 'warning' ? 'bg-amber-500 border-white' : 'bg-indigo-600 border-white'}`} />
                    </div>
                    <div className="flex flex-col bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 min-w-[160px] animate-era-in">
                        <span className="text-xs font-bold text-white leading-tight mb-1">{pt.humanLabel}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{pt.techLabel}</span>
                            <div className="w-1 h-1 rounded-full bg-zinc-800" />
                            <span className="text-[8px] font-mono font-bold text-indigo-400">{pt.confidence}</span>
                        </div>
                    </div>
                 </div>
             ))}

             {/* CENTER VIEWFINDER (UPDATED) */}
             <div className="absolute inset-0 flex items-center justify-center transition-all duration-300">
                <div className={`w-64 h-64 relative flex items-center justify-center transition-all duration-500 ${isStable ? 'scale-95' : 'scale-105'}`}>
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${isStable ? 'bg-emerald-500 text-black' : 'bg-indigo-600 text-white animate-pulse'}`}>
                            {isStable ? 'POSISJON LÅST' : SCAN_GUIDES[guideIndex]}
                        </div>
                    </div>

                    {/* Reticle Lines */}
                    <div className={`absolute inset-0 border border-white/20 rounded-[60px] transition-all duration-500 ${isStable ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : ''}`} />
                    <div className="absolute -top-1 -left-1 w-10 h-10 border-t-2 border-l-2 border-white rounded-tl-3xl" />
                    <div className="absolute -top-1 -right-1 w-10 h-10 border-t-2 border-r-2 border-white rounded-tr-3xl" />
                    <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-2 border-l-2 border-white rounded-bl-3xl" />
                    <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-2 border-r-2 border-white rounded-br-3xl" />

                    {/* Center Dot */}
                    <div className={`w-1 h-1 rounded-full transition-all duration-300 ${isStable ? 'bg-emerald-400 w-3 h-3' : 'bg-white/50'}`} />
                </div>
             </div>
          </div>

          <div className="absolute bottom-16 left-0 right-0 z-20 flex flex-col items-center gap-8 px-12">
             <div className="text-center space-y-1">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Skann for å låse verdigrunnlag</p>
                <div className="flex gap-1 justify-center">
                    {[0,1,2,3].map(i => <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === guideIndex ? 'w-4 bg-indigo-500' : 'w-1 bg-zinc-800'}`} />)}
                </div>
             </div>

             <div className="flex items-center justify-center gap-12">
                <button onClick={() => onNavigate('dashboard')} className="w-14 h-14 bg-black/60 backdrop-blur-xl rounded-full flex items-center justify-center text-zinc-400 border border-white/5 pointer-events-auto active:scale-90 transition-all hover:text-white"><Icons.X size={24} /></button>
                <button
                    onClick={handleCapture}
                    className={`relative w-28 h-28 pointer-events-auto group transition-all duration-300 ${isStable ? 'scale-110' : 'scale-100'}`}
                >
                    <div className={`absolute inset-0 rounded-full border-4 transition-colors duration-300 ${isStable ? 'border-emerald-500' : 'border-white/10'}`} />
                    <div className={`absolute inset-2 rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all ${isStable ? 'bg-emerald-500' : 'bg-white'}`}>
                        <div className="w-20 h-20 rounded-full border-4 border-black/5" />
                    </div>
                </button>
                <button onClick={toggleCamera} className="w-14 h-14 bg-black/60 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/5 pointer-events-auto active:scale-90 transition-all">
                    <Icons.RefreshCw size={24} />
                </button>
             </div>
          </div>
        </div>
      )}

      {(mode === 'analyzing' || mode === 'error') && (
        <div className="flex-1 bg-black flex flex-col items-center justify-center p-12 text-center animate-era-in">
          {mode === 'analyzing' ? (
            <>
              <div className="relative mb-12">
                <div className="w-32 h-32 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center"><Icons.Sparkles className="text-indigo-400" size={40} /></div>
              </div>
              <h2 className="text-4xl font-black text-white tracking-ios-tighter mb-4 italic font-display leading-none">Syntetiserer <br /><span className="text-zinc-800">behovsgrunnlag.</span></h2>
              <div className="space-y-4 max-w-xs mx-auto pt-8">
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 animate-[shimmer_2s_infinite_linear]" style={{ width: '100%', background: 'linear-gradient(90deg, #6366f1, #10b981, #6366f1)', backgroundSize: '200% 100%' }} />
                 </div>
                 <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.5em]">ERA_VISION_CORE_ACTIVE</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mb-8"><Icons.AlertTriangle size={40} /></div>
              <h2 className="text-3xl font-bold text-white mb-4">Analyse avbrutt</h2>
              <p className="text-zinc-500 mb-12">Vi kunne ikke lese bildet. Sørg for godt lys og stabil vinkel.</p>
              <PrimaryButton onClick={() => setMode('camera')}>Prøv på nytt</PrimaryButton>
            </>
          )}
        </div>
      )}

      {mode === 'review' && analysisResult && capturedImage && (
          <div className="flex-1 bg-[#050505] p-6 pt-12 pb-40 overflow-y-auto no-scrollbar animate-era-in">
              <div className="max-w-xl mx-auto space-y-8">
                  <header className="text-center">
                      <h2 className="text-3xl font-bold text-white mb-2">Bekreft funn</h2>
                      <p className="text-zinc-500 text-sm">ERA AI har identifisert følgende punkter. Stemmer dette?</p>
                  </header>

                  <div className="relative aspect-video rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
                      <img src={capturedImage} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                          <h3 className="text-xl font-bold text-white mb-1">{analysisResult.tittel}</h3>
                          <p className="text-xs text-zinc-400 line-clamp-2">{analysisResult.beskrivelse}</p>
                      </div>
                  </div>

                  <div className="space-y-4">
                      {analysisResult.findings.technical.map((item, i) => (
                          <div key={i} className="flex items-start gap-4 p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
                              <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                  <Icons.Check size={14} className="text-indigo-400" />
                              </div>
                              <p className="text-sm text-zinc-300">{item}</p>
                          </div>
                      ))}
                  </div>

                  <div className="flex gap-4 pt-4">
                      <button onClick={() => setMode('camera')} className="w-1/3 py-4 bg-zinc-900 rounded-2xl font-bold text-zinc-500 hover:text-white transition-colors">Avvis</button>
                      <PrimaryButton onClick={handleConfirmReview} className="flex-1">
                          Verifiser og Lagre <Icons.ArrowRight size={18} />
                      </PrimaryButton>
                  </div>
              </div>
          </div>
      )}

      {mode === 'success' && analysisResult && capturedImage && (
        <div className="flex-1 bg-[#050505] overflow-y-auto no-scrollbar p-6 pt-16 pb-40 animate-era-in">
          <div className="max-w-xl mx-auto space-y-12">
            <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-emerald-500 text-black rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl">
                    <Icons.BadgeCheck size={40} strokeWidth={2.5} />
                </div>
                <h2 className="text-5xl font-black text-white tracking-ios-tighter leading-none mb-3 font-display italic">Suksess.</h2>
                <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Digital tvilling oppdatert.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <KPIBox label="Est. Kostnad" value={`${analysisResult.estimert_kost.toLocaleString()},-`} icon={Icons.Coins} />
                 <KPIBox label="System-prioritet" value={analysisResult.risk_level === 'critical' ? 'HØY' : 'MODERAT'} icon={Icons.Activity} color={analysisResult.risk_level === 'critical' ? 'text-red-500' : 'text-amber-500'} />
            </div>

            <div className="pt-6">
                <PrimaryButton
                   onClick={() => onNavigate('dashboard')}
                   variant="white"
                   className="w-full h-20 text-lg shadow-2xl"
                >
                    Åpne Tiltaksplan
                </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HUDStat = ({ label, val }: any) => (
    <div className="flex flex-col opacity-60">
        <span className="text-[7px] font-black text-zinc-500 tracking-widest leading-none mb-1 uppercase">{label}</span>
        <span className="text-[10px] font-mono font-bold text-white leading-none">{val}</span>
    </div>
);

const KPIBox = ({ label, value, icon: Icon, color = "text-white" }: any) => (
    <AuraCard className="p-8 bg-[#0D0D0E] border-white/5 flex flex-col justify-between h-32">
        <Icon size={18} className="text-zinc-600" />
        <div>
            <span className="text-[8px] font-black uppercase text-zinc-700 block mb-1 tracking-widest">{label}</span>
            <span className={`text-xl font-bold tracking-tight ${color}`}>{value}</span>
        </div>
    </AuraCard>
);
