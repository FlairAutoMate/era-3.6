
import React, { useState } from 'react';
import { Icons } from '../Icons';
import { DailyWeather, Job } from '../../types';
import { getWeatherIconName } from '../../services/weatherService';

// --- CONTAINER ---
interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className = "", cols = 4 }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[cols]} gap-5 ${className}`}>
      {children}
    </div>
  );
};

// --- BASE CARD ---
interface BentoCardProps {
  children?: React.ReactNode;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2;
  className?: string;
  onClick?: () => void;
  highlight?: boolean;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  colSpan = 1,
  rowSpan = 1,
  className = "",
  onClick,
  highlight = false
}) => {
  const spans = {
    col: {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-2 md:col-span-3',
      4: 'col-span-2 md:col-span-4',
    },
    row: {
      1: 'row-span-1',
      2: 'row-span-2',
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl p-8 transition-all duration-500 ease-out
        ${highlight ? 'bg-indigo-600/10 border border-indigo-500/20 shadow-[0_20px_50px_rgba(99,102,241,0.05)]' : 'bg-[#0A0A0B] border border-white/5 shadow-2xl'}
        ${onClick ? 'cursor-pointer hover:bg-[#111113] active:scale-[0.98]' : ''}
        ${spans.col[colSpan]} ${spans.row[rowSpan]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// --- VARIANT: ACTION CARD ---
interface BentoActionMediumProps extends BentoCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
}

export const BentoActionMedium: React.FC<BentoActionMediumProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onClick,
  ...props
}) => (
  <BentoCard {...props} onClick={onClick} className={`flex flex-col justify-between group ${props.className}`}>
      <div className="flex justify-between items-start mb-10">
          <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-indigo-400 shadow-inner">
              <Icon size={28} />
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-600 group-hover:text-white transition-all active:scale-90 shadow-sm">
              <Icons.ArrowRight size={20} />
          </div>
      </div>
      <div>
          <h3 className="text-2xl font-bold text-white mb-3 tracking-tighter">{title}</h3>
          <p className="text-[13px] text-zinc-500 leading-relaxed mb-8 line-clamp-2 font-medium">{description}</p>
          {actionLabel && (
              <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                      {actionLabel}
                  </span>
                  <Icons.ArrowRight size={14} className="text-indigo-500 group-hover:translate-x-1 transition-transform" />
              </div>
          )}
      </div>
  </BentoCard>
);

// --- VARIANT: HERO CARD ---
interface BentoHeroProps extends BentoCardProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
}

export const BentoHero: React.FC<BentoHeroProps> = ({ imageUrl, title, subtitle, badge, ...props }) => (
  <BentoCard {...props} className={`relative p-0 border-0 group overflow-hidden ${props.className}`}>
      <img src={imageUrl} className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" alt={title} />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

      <div className="absolute inset-0 p-10 flex flex-col justify-end z-10">
          <div className="animate-era-slide-up">
              {badge && <div className="mb-6">{badge}</div>}
              <h2 className="text-4xl font-bold text-white tracking-tighter mb-2">{title}</h2>
              <p className="text-zinc-400 text-base font-medium">{subtitle}</p>
          </div>
      </div>
  </BentoCard>
);

// --- VARIANT: STAT CARD ---
interface BentoStatProps extends BentoCardProps {
  icon: React.ElementType;
  value: string | number;
  label: string;
  subLabel?: string;
  iconColor?: string;
}

export const BentoStat: React.FC<BentoStatProps> = ({
  icon: Icon,
  value,
  label,
  subLabel,
  iconColor = "text-zinc-500",
  ...props
}) => (
  <BentoCard {...props} className={`flex flex-col justify-between group ${props.className}`}>
      <div className="flex justify-between items-start mb-10">
          <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shadow-inner ${iconColor}`}>
              <Icon size={24} />
          </div>
      </div>
      <div>
          <span className="text-5xl font-bold text-white tracking-tighter block mb-1.5">{value}</span>
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] block">{label}</span>
          {subLabel && <p className="text-[10px] text-zinc-700 mt-3 font-bold uppercase tracking-widest truncate">{subLabel}</p>}
      </div>
  </BentoCard>
);

// --- VARIANT: WEATHER CARD ---
interface BentoWeatherProps extends BentoCardProps {
  forecast: DailyWeather[];
}

export const BentoWeather: React.FC<BentoWeatherProps> = ({ forecast, ...props }) => {
  if (!forecast || forecast.length < 2) return null;

  const today = forecast[0];
  const tomorrow = forecast[1];

  const WeatherIcon = ({ code, size = 20 }: { code: number; size?: number }) => {
    const iconName = getWeatherIconName(code);
    const Icon = (Icons as any)[iconName] || Icons.Cloud;
    return <Icon size={size} />;
  };

  return (
    <BentoCard {...props} className={`flex flex-col justify-between ${props.className}`}>
      <div className="flex justify-between items-start mb-10">
        <div className="w-12 h-12 rounded-xl bg-blue-500/5 flex items-center justify-center text-blue-400 shadow-inner">
          <Icons.CloudSun size={26} />
        </div>
        <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em]">Radar</span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block mb-3">I dag</span>
          <div className="flex items-center gap-3">
            <div className="text-blue-400">
              <WeatherIcon code={today.code} size={28} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white leading-none tracking-tighter">{today.tempMax}°</span>
            </div>
          </div>
        </div>

        <div className="border-l border-white/5 pl-6">
          <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block mb-3">I morgen</span>
          <div className="flex items-center gap-3">
            <div className="text-zinc-600">
              <WeatherIcon code={tomorrow.code} size={28} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white leading-none tracking-tighter">{tomorrow.tempMax}°</span>
            </div>
          </div>
        </div>
      </div>
    </BentoCard>
  );
};

// --- VARIANT: BUDGET OVERVIEW ---
interface BentoBudgetProps extends BentoCardProps {
  data: {
    maintenance: number;
    system: number;
    upgrade: number;
    total: number;
  };
}

export const BentoBudget: React.FC<BentoBudgetProps> = ({ data, ...props }) => {
  const categories = [
    { id: 'maintenance', label: 'Drift', value: data.maintenance, color: 'bg-indigo-500', icon: Icons.Hammer },
    { id: 'system', label: 'Teknikk', value: data.system, color: 'bg-emerald-500', icon: Icons.Zap },
    { id: 'upgrade', label: 'Verdi', value: data.upgrade, color: 'bg-purple-500', icon: Icons.TrendingUp },
  ];

  const maxVal = Math.max(...categories.map(c => c.value), 1);

  return (
    <BentoCard {...props} className={`flex flex-col justify-between ${props.className}`}>
      <div className="flex justify-between items-start mb-10">
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-zinc-600 shadow-inner">
          <Icons.Coins size={26} />
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block mb-1">Budsjett</span>
          <span className="text-2xl font-bold text-white tracking-tighter">{(data.total / 1000).toFixed(0)}k</span>
        </div>
      </div>

      <div className="space-y-5">
        {categories.map((cat) => (
          <div key={cat.id} className="space-y-2">
            <div className="flex justify-between items-end px-1">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{cat.label}</span>
              <span className="text-[11px] font-mono font-bold text-zinc-500">{(cat.value / 1000).toFixed(0)}k</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full ${cat.color} rounded-full transition-all duration-1000`}
                style={{ width: `${(cat.value / maxVal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </BentoCard>
  );
};

// --- VARIANT: VALUE GAP ---
interface BentoValueGapProps extends BentoCardProps {
    current: number;
    potential: number;
}

export const BentoValueGap: React.FC<BentoValueGapProps> = ({ current, potential, ...props }) => {
    const gap = potential - current;
    const progress = (current / potential) * 100;

    return (
        <BentoCard {...props} className={`flex flex-col justify-between group ${props.className}`}>
            <div className="flex justify-between items-start mb-10">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/5 flex items-center justify-center text-indigo-400 shadow-inner">
                    <Icons.TrendingUp size={26} />
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] block mb-1">Verdigap</span>
                    <span className="text-2xl font-bold text-indigo-500 tracking-tighter">{(gap / 1000).toFixed(0)}k <span className="text-xs uppercase">NOK</span></span>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-end mb-3 px-1">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Sikret Verdi</span>
                    <span className="text-[11px] font-bold text-white">{(current / 1000000).toFixed(1)}M</span>
                </div>
                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                    <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </BentoCard>
    );
};

// --- VARIANT: FDV CAROUSEL (BEFORE/AFTER) ---
interface BentoFDVCarouselProps extends BentoCardProps {
    jobs: Job[];
}

export const BentoFDVCarousel: React.FC<BentoFDVCarouselProps> = ({ jobs, ...props }) => {
    const completedJobs = jobs.filter(j => j.status === 'completed' && j.before_images.length > 0 && j.after_images.length > 0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAfter, setShowAfter] = useState(true);

    if (completedJobs.length === 0) {
        return (
            <BentoCard {...props} className={`flex flex-col items-center justify-center text-center p-12 ${props.className}`}>
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 text-zinc-800 shadow-inner">
                    <Icons.History size={32} />
                </div>
                <h3 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Logg Tom</h3>
            </BentoCard>
        );
    }

    const job = completedJobs[currentIndex];

    const next = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % completedJobs.length);
    };

    return (
        <BentoCard {...props} className={`relative p-0 border-0 group overflow-hidden ${props.className}`}>
            <img
                src={showAfter ? job.after_images[0] : job.before_images[0]}
                className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                alt={job.tittel}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80"></div>

            <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                    <div className="flex gap-1.5 bg-black/40 backdrop-blur-2xl p-1.5 rounded-xl border border-white/10 shadow-2xl">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowAfter(false); }}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${!showAfter ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                        >
                            Før
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowAfter(true); }}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${showAfter ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                        >
                            Etter
                        </button>
                    </div>
                    {completedJobs.length > 1 && (
                        <button onClick={next} className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-2xl flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform shadow-2xl"><Icons.ChevronRight size={18} /></button>
                    )}
                </div>

                <div className="animate-era-slide-up">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2 block">Verifisert tiltak</span>
                    <h3 className="text-xl font-bold text-white tracking-tight truncate leading-none">{job.tittel}</h3>
                </div>
            </div>
        </BentoCard>
    );
};
