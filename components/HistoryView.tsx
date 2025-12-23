import React from 'react';
import { HydrationEntry } from '../types';
import { DrinkUpColors } from '../constants';

interface HistoryViewProps {
  entries: HydrationEntry[];
  onClose: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ entries, onClose }) => {
  const sortedEntries = [...entries].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Chart Data Preparation
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    d.setHours(0,0,0,0);
    return d;
  });

  const chartData = last7Days.map(day => {
    const total = entries
      .filter(e => {
        const entryDate = new Date(e.timestamp);
        return entryDate.getDate() === day.getDate() && entryDate.getMonth() === day.getMonth();
      })
      .reduce((sum, e) => sum + e.mlAmount, 0);
    return { date: day, total };
  });

  const maxVal = Math.max(...chartData.map(d => d.total), 2000);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-2xl animate-in slide-in-from-bottom-10 duration-300">
      
      {/* Top Drag Handle area */}
      <div className="w-full flex justify-center pt-4 pb-2" onClick={onClose}>
        <div className="w-12 h-1.5 rounded-full bg-white/20" />
      </div>

      <div className="px-6 pb-4 flex justify-between items-end border-b border-white/5">
        <div>
           <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">Chronicle</h2>
           <p className="text-xs text-cyan-500 font-mono tracking-wider">INTAKE LOGS & ANALYTICS</p>
        </div>
        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/20"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 no-scrollbar">
        
        {/* Neon Chart */}
        <div className="w-full h-56 bg-black/40 rounded-3xl p-5 border border-white/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between p-5 opacity-10 pointer-events-none">
             <div className="border-b border-white w-full" />
             <div className="border-b border-white w-full" />
             <div className="border-b border-white w-full" />
             <div className="border-b border-white w-full" />
          </div>

          <div className="flex justify-between items-end h-full space-x-3 relative z-10">
            {chartData.map((data, idx) => {
              const heightPct = (data.total / maxVal) * 100;
              const isToday = idx === 6;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                  <div className="w-full h-full flex items-end justify-center relative group">
                    {/* The Bar */}
                    <div 
                      style={{ height: `${heightPct}%` }}
                      className={`w-full min-w-[8px] rounded-t-sm transition-all duration-500 ease-out relative ${isToday ? 'bg-cyan-400 shadow-[0_0_15px_cyan]' : 'bg-white/20 group-hover:bg-white/40'}`}
                    >
                        {/* Top Cap */}
                        <div className={`absolute top-0 w-full h-[2px] ${isToday ? 'bg-white' : 'bg-white/50'}`} />
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-cyan-400' : 'text-white/30'}`}>
                    {data.date.toLocaleDateString('en-US', { weekday: 'narrow' })}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent List */}
        <div className="space-y-4 pb-20">
          <div className="flex items-center space-x-2">
             <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"/>
             <h3 className="text-xs font-mono text-white/50 uppercase tracking-widest">Recent Transmissions</h3>
          </div>
          
          {sortedEntries.length === 0 ? (
             <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center text-white/30 font-mono text-sm">
                NO DATA FRAGMENTS FOUND
             </div>
          ) : (
            sortedEntries.map(entry => (
              <div 
                key={entry.id} 
                className="group relative flex items-center p-4 bg-[#0A0A0A] border-l-2 border-l-transparent hover:border-l-cyan-400 rounded-r-xl transition-all active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Time Badge */}
                <div className="flex flex-col items-center justify-center w-14 h-14 bg-white/5 rounded-lg border border-white/5 mr-4 font-mono">
                   <span className="text-lg font-bold text-white">{entry.timestamp.getHours()}</span>
                   <span className="text-[10px] text-white/40">{entry.timestamp.getMinutes().toString().padStart(2, '0')}</span>
                </div>

                {/* Info */}
                <div className="flex-1 relative z-10">
                  <div className="text-xl font-bold text-white tracking-tight">{entry.mlAmount} <span className="text-sm font-normal text-white/50">mL</span></div>
                  <div className="flex items-center space-x-2 mt-1">
                      <div className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] text-cyan-400 font-mono">
                        VERIFIED
                      </div>
                      <span className="text-[10px] text-white/30">
                        Confidence: {Math.round(entry.confidenceScore * 100)}%
                      </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};