'use client';

import React from 'react';
import { CleaningMetrics } from '../types';
import { Clock, Zap, FileText, TrendingDown } from 'lucide-react';

interface StatsBarProps {
  metrics: CleaningMetrics;
}

export const StatsBar: React.FC<StatsBarProps> = ({ metrics }) => {
  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      {/* Words Count */}
      <div className="bg-white/60 dark:bg-slate-900/60 border border-teal-500/20 dark:border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg shadow-teal-950/5 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-300">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <FileText className="h-4 w-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Word Count
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              {metrics.cleanedWordCount.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 line-through">
              {metrics.originalWordCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Reduction % */}
      <div className="bg-white/60 dark:bg-slate-900/60 border border-teal-500/20 dark:border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg shadow-teal-950/5 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-300">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500/10 to-cyan-500/20 text-teal-600 dark:text-teal-300 border border-teal-500/20">
          <TrendingDown className="h-4 w-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Size Reduced
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-extrabold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
              {metrics.reductionPercentage}%
            </span>
            <span className="text-xs text-slate-400">
              ({metrics.charsRemoved.toLocaleString()} chars)
            </span>
          </div>
        </div>
      </div>

      {/* Processing Time */}
      <div className="bg-white/60 dark:bg-slate-900/60 border border-teal-500/20 dark:border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg shadow-teal-950/5 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-300">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
          <Zap className="h-4 w-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Processing Speed
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              {metrics.processingTimeMs} ms
            </span>
            <span className="text-xs text-slate-400">instant</span>
          </div>
        </div>
      </div>

      {/* Time Saved */}
      <div className="bg-white/60 dark:bg-slate-900/60 border border-teal-500/20 dark:border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg shadow-teal-950/5 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-300">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <Clock className="h-4 w-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Time Saved
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              ~{metrics.timeSavedSeconds}s
            </span>
            <span className="text-xs text-slate-400">reading time</span>
          </div>
        </div>
      </div>
    </div>
  );
};
