'use client';

import React, { useState } from 'react';
import { CustomRule } from '../types';
import { Plus, X, Check, Tag, AlertCircle, Sparkles } from 'lucide-react';

interface PhrasePanelProps {
  phrases: CustomRule[];
  enabled: boolean;
  onToggleEnabled: () => void;
  onAddPhrase: (phrase: string, threshold: number) => void;
  onRemovePhrase: (id: string) => void;
  onTogglePhrase: (id: string) => void;
  onClearAll: () => void;
  onSetGlobalThreshold: (threshold: number) => void;
}

export const PhrasePanel: React.FC<PhrasePanelProps> = ({
  phrases,
  enabled,
  onToggleEnabled,
  onAddPhrase,
  onRemovePhrase,
  onTogglePhrase,
  onClearAll,
}) => {
  const [input, setInput] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    onAddPhrase(trimmed, 0.85);
    setInput('');
  };

  const activeCount = phrases.filter(p => p.enabled).length;

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 border border-teal-500/20 dark:border-emerald-500/20 rounded-2xl shadow-xl shadow-teal-950/5 backdrop-blur-xl overflow-hidden">

      {/* ── Header ── */}
      <div className="px-5 py-3.5 border-b border-teal-500/10 dark:border-emerald-500/10 flex items-center justify-between gap-3 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            <Tag className="h-4 w-4 shrink-0" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Custom Phrase Filter
          </span>
          {activeCount > 0 && (
            <span className="text-[10px] bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
              {activeCount} active
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {phrases.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-[11px] font-semibold text-slate-400 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          )}
          {/* Master ON/OFF */}
          <button
            onClick={onToggleEnabled}
            title={enabled ? 'Phrase removal is ON — click to disable' : 'Phrase removal is OFF — click to enable'}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all shadow-xs backdrop-blur-md ${
              enabled
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-400 text-white shadow-emerald-500/20'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${enabled ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
            {enabled ? 'ENABLED' : 'OFF'}
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">

        {/* ── Add phrase input ── */}
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='Type or paste any phrase/disclaimer to remove (e.g. "As an AI language model...")'
            className="flex-1 min-w-0 px-4 py-2.5 text-sm bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-teal-500/20 shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add Phrase
          </button>
        </form>

        {/* ── Warning if OFF ── */}
        {!enabled && phrases.length > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-600 dark:text-amber-300 backdrop-blur-md">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Custom phrase removal is currently <strong className="mx-1">DISABLED</strong>. Toggle ENABLED above to activate.
          </div>
        )}

        {/* ── Phrase chips ── */}
        {phrases.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-2">
            No custom phrases added yet. Type a phrase above and click Add.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {phrases.map(rule => (
              <div
                key={rule.id}
                className={`group inline-flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-xl text-xs font-medium border transition-all max-w-full backdrop-blur-md ${
                  rule.enabled && enabled
                    ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 text-emerald-800 dark:text-emerald-200 border-emerald-500/30 shadow-xs'
                    : 'bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-700/60 line-through opacity-60'
                }`}
              >
                <button
                  onClick={() => onTogglePhrase(rule.id)}
                  className="hover:opacity-80 transition-opacity shrink-0"
                  title={rule.enabled ? 'Click to disable' : 'Click to enable'}
                >
                  {rule.enabled
                    ? <Check className="h-3.5 w-3.5 text-emerald-500" />
                    : <span className="h-3.5 w-3.5 block rounded-full border border-slate-400" />
                  }
                </button>

                {/* Phrase text */}
                <span
                  className="max-w-[320px] truncate font-sans"
                  title={rule.phrase}
                >
                  &ldquo;{rule.phrase}&rdquo;
                </span>

                <button
                  onClick={() => onRemovePhrase(rule.id)}
                  className="ml-1 p-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors shrink-0"
                  title="Remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── Help ── */}
        <div className="text-[11px] text-slate-400 leading-relaxed border-t border-teal-500/10 dark:border-emerald-500/10 pt-3 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-teal-500 shrink-0" />
          <span>
            <strong>Word Sequence Match:</strong> Plain phrases automatically match sequence of words across case, punctuation, line breaks, or markdown symbols.
          </span>
        </div>
      </div>
    </div>
  );
};
