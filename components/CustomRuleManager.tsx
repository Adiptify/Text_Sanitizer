'use client';

import React, { useState } from 'react';
import { CustomRule } from '../types';
import { X, Plus, Trash2, Sliders, CheckCircle2 } from 'lucide-react';

interface CustomRuleManagerProps {
  isOpen: boolean;
  onClose: () => void;
  customRules: CustomRule[];
  onAddRule: (
    phrase: string,
    isRegex: boolean,
    caseSensitive: boolean,
    useFuzzy: boolean,
    fuzzyThreshold: number
  ) => void;
  onToggleRule: (id: string) => void;
  onDeleteRule: (id: string) => void;
}

export const CustomRuleManager: React.FC<CustomRuleManagerProps> = ({
  isOpen,
  onClose,
  customRules,
  onAddRule,
  onToggleRule,
  onDeleteRule,
}) => {
  const [newPhrase, setNewPhrase] = useState('');
  const [isRegex, setIsRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useFuzzy, setUseFuzzy] = useState(false);
  const [fuzzyThreshold, setFuzzyThreshold] = useState(0.85);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhrase.trim()) return;
    onAddRule(newPhrase.trim(), isRegex, caseSensitive, useFuzzy, fuzzyThreshold);
    setNewPhrase('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Custom Phrase Rules
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Add Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Add New Phrase to Strip
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPhrase}
                onChange={(e) => setNewPhrase(e.target.value)}
                placeholder="e.g. Thank you for reading, Confidential, etc."
                className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!newPhrase.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

            {/* Options */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={isRegex}
                  onChange={(e) => { setIsRegex(e.target.checked); if (e.target.checked) setUseFuzzy(false); }}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Regex Match
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Case Sensitive
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={useFuzzy}
                  onChange={(e) => { setUseFuzzy(e.target.checked); if (e.target.checked) setIsRegex(false); }}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-purple-600 dark:text-purple-400 font-semibold">Fuzzy Match</span>
              </label>
            </div>

            {/* Fuzzy threshold selector */}
            {useFuzzy && (
              <div className="flex items-center gap-3 pl-1 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                  Match threshold:
                </span>
                <div className="flex gap-1.5">
                  {([0.80, 0.85, 0.90, 0.95] as const).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setFuzzyThreshold(val)}
                      className={`px-2.5 py-1 rounded-lg border font-mono transition-colors ${
                        fuzzyThreshold === val
                          ? 'bg-purple-600 border-purple-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-purple-400'
                      }`}
                    >
                      {Math.round(val * 100)}%
                    </button>
                  ))}
                </div>
                <span className="text-slate-400 italic">
                  {fuzzyThreshold === 0.80 ? '(loose – catches more variants)' :
                   fuzzyThreshold === 0.95 ? '(strict – near-exact only)' :
                   '(balanced)'}
                </span>
              </div>
            )}
          </form>

          {/* Existing Rules List */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Custom Phrases ({customRules.length})
            </h4>

            {customRules.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center italic">
                No custom phrase rules defined. Add one above to automatically scrub specific words.
              </p>
            ) : (
              <div className="space-y-2">
                {customRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        onClick={() => onToggleRule(rule.id)}
                        className={`h-4 w-4 rounded flex items-center justify-center border transition-colors ${
                          rule.enabled
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                        }`}
                      >
                        {rule.enabled && <CheckCircle2 className="h-3 w-3" />}
                      </button>
                      <span
                        className={`text-xs font-mono text-slate-900 dark:text-white truncate ${
                          !rule.enabled ? 'line-through opacity-50' : ''
                        }`}
                      >
                        &quot;{rule.phrase}&quot;
                      </span>
                      {rule.isRegex && (
                        <span className="text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded font-mono">
                          regex
                        </span>
                      )}
                      {rule.caseSensitive && (
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                          case-sensitive
                        </span>
                      )}
                      {rule.useFuzzy && (
                        <span className="text-[10px] bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 px-1.5 py-0.5 rounded font-mono">
                          fuzzy ~{Math.round((rule.fuzzyThreshold ?? 0.85) * 100)}%
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onDeleteRule(rule.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete rule"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
