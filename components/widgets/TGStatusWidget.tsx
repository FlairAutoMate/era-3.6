
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Icons } from '../Icons';

interface TGStatusWidgetProps {
  score: number; // 0-100
  tg3Count: number;
  tg2Count: number;
  compact?: boolean;
}

export const TGStatusWidget: React.FC<TGStatusWidgetProps> = ({ score, tg3Count, tg2Count, compact }) => {
  // Data for the Gauge
  const data = [
    { name: 'Health', value: score, color: score > 80 ? '#10b981' : score > 50 ? '#f59e0b' : '#ef4444' }, // Emerald / Amber / Red
    { name: 'Deficit', value: 100 - score, color: 'rgba(255,255,255,0.05)' },
  ];

  const qualityColor = score > 80 ? 'text-emerald-400' : score > 50 ? 'text-amber-400' : 'text-red-400';
  const qualityText = score > 80 ? 'Utmerket' : score > 50 ? 'Moderat' : 'Kritisk';

  return (
    <div className={`card-depth border-gradient relative overflow-hidden rounded-xl p-6 flex flex-col justify-between h-full group`}>

      {/* Header */}
      <div className="flex justify-between items-start relative z-10 mb-4">
        <div>
          <h3 className="text-white text-base font-bold flex items-center gap-2">
             <Icons.Activity className={qualityColor} size={18} /> Eiendomshelse
          </h3>
          <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold mt-1">Totalscore</p>
        </div>
        <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border bg-white/5 ${qualityColor} border-white/10`}>
          {qualityText}
        </div>
      </div>

      {/* Gauge & Main Score */}
      <div className="flex-1 relative flex items-center justify-center min-h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={220}
              endAngle={-40}
              innerRadius="75%"
              outerRadius="90%"
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
            >
              <Cell key="health" fill={data[0].color} />
              <Cell key="void" fill={data[1].color} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-4xl md:text-5xl font-bold text-white tracking-tighter drop-shadow-2xl">{score}</span>
             <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">/ 100</span>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5 relative z-10">
          <div className="flex flex-col items-center bg-zinc-900/50 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-zinc-500 uppercase">TG 3</span>
              <span className={`text-lg font-bold ${tg3Count > 0 ? 'text-red-400' : 'text-zinc-300'}`}>{tg3Count}</span>
          </div>
          <div className="flex flex-col items-center bg-zinc-900/50 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-zinc-500 uppercase">TG 2</span>
              <span className={`text-lg font-bold ${tg2Count > 0 ? 'text-amber-400' : 'text-zinc-300'}`}>{tg2Count}</span>
          </div>
      </div>
    </div>
  );
};
