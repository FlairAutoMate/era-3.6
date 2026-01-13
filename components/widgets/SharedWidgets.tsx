
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../Icons';

/**
 * Standard Glass Card for all views - Updated with Field Mode and Variants
 */
export const AuraCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  highlight?: boolean;
  variant?: 'glass' | 'field' | 'solid';
}> = ({ children, className = "", onClick, highlight = false, variant = 'glass' }) => {

  const variants = {
    glass: `bg-[#121214]/90 backdrop-blur-3xl border-white/15 ${highlight ? 'border-white/25 ring-1 ring-white/10 shadow-[0_20px_60px_-15px_rgba(255,255,255,0.05)]' : ''}`,
    field: `bg-[#000000] border-zinc-700 border-2 rounded-[24px] shadow-none`, // High contrast, solid
    solid: `bg-[#0A0A0B] border-white/10`
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden
        ${variant === 'field' ? 'rounded-[24px]' : 'rounded-[40px]'}
        ${variants[variant]}
        transition-all duration-300 ease-out
        ${onClick ? 'cursor-pointer hover:bg-white/[0.12] active:scale-[0.98]' : ''}
        ${className}
      `}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

/**
 * Skeleton Loader - For smooth data fetching states
 */
export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`bg-white/5 animate-pulse rounded-2xl ${className}`} />
);

/**
 * Primary Button - UPDATED TO 16PX RADIUS SQUARE
 */
export const PrimaryButton: React.FC<{
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    variant?: 'white' | 'glass' | 'ai' | 'field';
    disabled?: boolean;
}> = ({ children, onClick, className = "", variant = 'white', disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`
            h-14 rounded-2xl
            text-[13px] md:text-[14px] font-black
            uppercase tracking-[0.2em]
            transition-all duration-300 ease-out
            flex items-center justify-center gap-3 px-10
            active:scale-[0.96]
            relative overflow-hidden
            ${disabled ? 'opacity-30 cursor-not-allowed grayscale' : ''}
            ${variant === 'white' ? 'bg-white text-black hover:bg-zinc-200 border border-transparent' : ''}
            ${variant === 'glass' ? 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/25' : ''}
            ${variant === 'ai' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 border border-indigo-400/50' : ''}
            ${variant === 'field' ? 'bg-emerald-500 text-black border-2 border-emerald-400 h-16 rounded-xl text-base shadow-none' : ''}
            ${className}
        `}
    >
        {variant === 'white' && (
            <div className="absolute inset-0 bg-white/20 animate-pulse-soft pointer-events-none opacity-0 hover:opacity-100 transition-opacity" />
        )}
        <span className="relative z-10 flex items-center gap-3">{children}</span>
    </button>
);

export const PageHeader: React.FC<{
    title: string;
    description: string;
    action?: { label: string; onClick: () => void; icon?: React.ElementType };
    label?: string;
}> = ({ title, description, action, label }) => (
    <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-era-in">
        <div className="space-y-2">
            {label && <span className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-400 block mb-2">{label}</span>}
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-ios-tighter font-display leading-[0.9]">
                {title}
            </h1>
            <p className="text-zinc-400 text-lg font-medium max-w-xl leading-relaxed">{description}</p>
        </div>
        {action && (
            <PrimaryButton onClick={action.onClick} variant="white" className="shrink-0 border-2 border-white/10">
                {action.label} {action.icon && <action.icon size={18} />}
            </PrimaryButton>
        )}
    </header>
);

export const KPIUnit: React.FC<{
    label: string;
    value: string | number;
    sub?: string;
    icon: React.ElementType;
    color?: string;
}> = ({ label, value, sub, icon: Icon, color = "text-white" }) => (
    <div className="p-8 flex flex-col h-full bg-[#121214] border border-white/15 rounded-[32px] hover:border-white/25 transition-colors">
        <div className="flex justify-between items-start mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-zinc-300 border border-white/10">
                <Icon size={24} />
            </div>
            {sub && <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border border-white/10 px-2.5 py-1 rounded-lg bg-white/5">{sub}</span>}
        </div>
        <div className={`text-5xl font-black mb-2 tracking-ios-tighter font-display ${color}`}>{value}</div>
        <div className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">{label}</div>
    </div>
);

export const SlideOver: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[700] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-[#121214] rounded-t-[40px] sm:rounded-[40px] border-t sm:border border-white/15 shadow-2xl flex flex-col max-h-[94vh] animate-in slide-in-from-bottom duration-600 overflow-hidden">
        <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mt-4 mb-2" />
        <div className="px-10 py-8 border-b border-white/10 flex justify-between items-center bg-[#121214]">
          <h2 className="text-3xl font-black text-white tracking-tighter font-display">{title}</h2>
          <button onClick={onClose} className="p-3 bg-white/10 rounded-2xl text-zinc-300 hover:text-white transition-colors border border-white/10">
            <Icons.X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-10 no-scrollbar bg-[#050505]">
          {children}
        </div>
      </div>
    </div>
  );
};

export const LoadingState: React.FC<{ text?: string }> = ({ text = "Prosesserer..." }) => (
    <div className="flex flex-col items-center justify-center py-20 gap-8">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-500 animate-pulse">{text}</p>
    </div>
);

export const FileUpload: React.FC<{
  label: string;
  onFileSelect: (file: File) => void;
  className?: string;
}> = ({ label, onFileSelect, className = "" }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div
      onClick={() => inputRef.current?.click()}
      className={`
        border-2 border-dashed border-white/15 rounded-[32px] flex flex-col items-center justify-center p-10
        cursor-pointer hover:border-indigo-500/40 hover:bg-white/[0.02] transition-all group ${className}
      `}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        accept="image/*"
      />
      <Icons.Camera className="text-zinc-500 group-hover:text-indigo-400 mb-4 transition-colors" size={32} />
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">{label}</span>
    </div>
  );
};

// --- LEVENDE ESTIMAT ---

export const NumberTicker: React.FC<{ value: number; className?: string }> = ({ value, className = "" }) => {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        let start = displayValue;
        const end = value;
        if (start === end) return;

        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const current = Math.floor(start + (end - start) * easeOut);
            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value]);

    return <span className={className}>{displayValue.toLocaleString()}</span>;
};

export const SlideToConfirm: React.FC<{ onConfirm: () => void; label?: string }> = ({ onConfirm, label = "Sveip for å bekrefte" }) => {
    const [sliderValue, setSliderValue] = useState(0);
    const [completed, setCompleted] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);

    const handleDrag = (e: React.TouchEvent | React.MouseEvent) => {
        if (completed) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const rect = sliderRef.current?.getBoundingClientRect();
        if (!rect) return;

        const newValue = Math.min(Math.max(0, clientX - rect.left), rect.width - 60);
        setSliderValue(newValue);

        if (newValue >= rect.width - 65) {
            setCompleted(true);
            setSliderValue(rect.width - 60);
            onConfirm();
        }
    };

    const handleEnd = () => {
        if (!completed) setSliderValue(0);
    };

    return (
        <div
            ref={sliderRef}
            className={`
                relative h-16 w-full rounded-full border border-white/10 overflow-hidden select-none
                ${completed ? 'bg-emerald-500 border-emerald-500' : 'bg-black/40'}
                transition-colors duration-500
            `}
            onTouchMove={handleDrag}
            onMouseMove={(e) => e.buttons === 1 && handleDrag(e)}
            onTouchEnd={handleEnd}
            onMouseUp={handleEnd}
        >
            <div className={`absolute inset-0 flex items-center justify-center text-[11px] font-black uppercase tracking-[0.3em] transition-opacity duration-300 ${completed ? 'opacity-0' : 'text-zinc-500 opacity-50'}`}>
                {label} <Icons.ChevronRight className="ml-2 animate-pulse" size={14} />
            </div>

            <div className={`absolute inset-0 flex items-center justify-center text-[11px] font-black uppercase tracking-[0.3em] text-white transition-all duration-500 ${completed ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                Bekreftet <Icons.Check className="ml-2" size={16} />
            </div>

            <div
                className="absolute top-1 bottom-1 w-14 rounded-full bg-white flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing transition-transform duration-75 ease-out z-10"
                style={{ transform: `translateX(${sliderValue}px)` }}
            >
                {completed ? <Icons.Check size={20} className="text-emerald-500" /> : <Icons.ArrowRight size={20} className="text-black" />}
            </div>
        </div>
    );
};

export const PulseRing: React.FC<{ color?: string }> = ({ color = "bg-indigo-500" }) => (
    <span className="relative flex h-3 w-3">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${color}`}></span>
        <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`}></span>
    </span>
);
