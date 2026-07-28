'use client';

import React, { useState } from 'react';
import { CustomRule } from '../types';
import { Tag, Plus, Scissors, Check, Trash2 } from 'lucide-react';

interface QuickPhraseBarProps {
  customRules: CustomRule[];
  onAddPhrase: (phrase: string) => void;
  onTogglePhrase: (id: string) => void;
  onDeletePhrase: (id: string) => void;
  onStripPhraseNow: (phrase: string) => void;
}

export const QuickPhraseBar: React.FC<QuickPhraseBarProps> = ({
  customRules,
  onAddPhrase,
  onTogglePhrase,
  onDeletePhrase,
  onStripPhraseNow,
}) => {
  const [newPhraseInput, setNewPhraseInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhraseInput.trim()) return;
    onAddPhrase(newPhraseInput.trim());
    setNewPhraseInput('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-indigo-500" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Quick Custom Phrase Strippers
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">
            (Click chip to toggle rule or click ✂️ to strip instantly from text)
          </span>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> Save New Phrase
          </button>
        )}
      </div>

      {/* Inline Quick Add Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            autoFocus
            value={newPhraseInput}
            onChange={(e) => setNewPhraseInput(e.target.value)}
            placeholder="Type phrase to save (e.g. As an AI language model, Confidential...)"
            className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
          />
          <button
            type="submit"
            disabled={!newPhraseInput.trim()}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Save Chip
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Chips List */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {customRules.length === 0 ? (
          <span className="text-xs text-slate-400 italic">
            No saved phrase chips yet. Click &quot;Save New Phrase&quot; to add quick one-click strippers.
          </span>
        ) : (
          customRules.map((rule) => (
            <div
              key={rule.id}
              className={`group relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                rule.enabled
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/80 shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 line-through opacity-75'
              }`}
            >
              {/* Toggle Enable/Disable Badge */}
              <button
                onClick={() => onTogglePhrase(rule.id)}
                className="flex items-center gap-1 hover:underline"
                title={rule.enabled ? 'Rule active (Click to disable)' : 'Rule disabled (Click to enable)'}
              >
                {rule.enabled && <Check className="h-3 w-3 text-indigo-500" />}
                <span>&quot;{rule.phrase}&quot;</span>
              </button>

              {/* Instant Strip Button */}
              <button
                onClick={() => onStripPhraseNow(rule.phrase)}
                className="p-0.5 text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-200 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                title={`Instantly strip "${rule.phrase}" from current pasted text`}
              >
                <Scissors className="h-3 w-3" />
              </button>

              {/* Delete Chip Button */}
              <button
                onClick={() => onDeletePhrase(rule.id)}
                className="p-0.5 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete this phrase chip"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
