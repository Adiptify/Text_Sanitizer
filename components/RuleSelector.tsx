'use client';

import React from 'react';
import { CustomRule, PresetId, RuleConfigState } from '../types';
import { PRESET_PROFILES } from '../lib/presets';
import { SlidersHorizontal, Check } from 'lucide-react';

interface RuleSelectorProps {
  rules: RuleConfigState;
  onToggleRule: (ruleId: keyof RuleConfigState) => void;
  onSelectPreset: (presetId: PresetId) => void;
  activePresetId?: PresetId | null;
  customRules: CustomRule[];
  onOpenCustomRulesModal: () => void;
}

export const RuleSelector: React.FC<RuleSelectorProps> = ({
  rules,
  onToggleRule,
  onSelectPreset,
  activePresetId,
  customRules,
}) => {
  const activeCustomCount = customRules.filter((r) => r.enabled).length;

  const ruleOptions = [
    {
      id: 'markdown' as const,
      label: 'Remove Markdown',
      description: 'Strips ### headers, **bold**, *italics*, lists, links, & code blocks',
    },
    {
      id: 'aiBoilerplate' as const,
      label: 'Remove AI Boilerplate',
      description: 'Strips "As an AI language model..." and closing disclaimers',
    },
    {
      id: 'repeatedSentences' as const,
      label: 'Remove Repeated Sentences',
      description: 'Deduplicates identical consecutive or repeated sentences',
    },
    {
      id: 'extraBlankLines' as const,
      label: 'Remove Extra Blank Lines',
      description: 'Collapses 3+ consecutive newlines down to a single blank line',
    },
    {
      id: 'unnecessarySpaces' as const,
      label: 'Remove Unnecessary Spaces',
      description: 'Trims trailing spaces and collapses double spaces',
    },
    {
      id: 'emojis' as const,
      label: 'Remove Emojis',
      description: 'Scrubs all Unicode emojis (😀, 🚀, ✨, etc.)',
    },
    {
      id: 'customPhrases' as const,
      label: 'Remove Custom Phrases',
      description: `Strips user-defined forbidden words or signatures (${activeCustomCount} active)`,
    },
  ];

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 border border-teal-500/20 dark:border-emerald-500/20 rounded-2xl p-5 shadow-xl shadow-teal-950/5 backdrop-blur-xl space-y-4">
      {/* Top Header & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-teal-500/10 dark:border-emerald-500/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
            <SlidersHorizontal className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
            Cleaning Rules & Presets
          </h2>
        </div>

        {/* Presets Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">Presets:</span>
          {PRESET_PROFILES.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset.id)}
                className={`text-xs px-3 py-1 rounded-xl font-semibold transition-all backdrop-blur-md ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/25 border border-white/20'
                    : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 hover:border-teal-500/40 hover:text-teal-600 dark:hover:text-teal-300'
                }`}
                title={preset.description}
              >
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rules Checkboxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {ruleOptions.map((rule) => {
          const isEnabled = rules[rule.id];
          return (
            <div
              key={rule.id}
              onClick={() => onToggleRule(rule.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex items-start gap-3 select-none backdrop-blur-md ${
                isEnabled
                  ? 'bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-emerald-500/40 text-slate-900 dark:text-white shadow-md shadow-emerald-500/5'
                  : 'bg-slate-50/40 dark:bg-slate-950/40 border-slate-200/50 dark:border-slate-800/50 opacity-60 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div
                className={`mt-0.5 h-4 w-4 rounded-md flex items-center justify-center border transition-all ${
                  isEnabled
                    ? 'bg-gradient-to-tr from-emerald-500 to-cyan-500 border-transparent text-white shadow-xs'
                    : 'border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50'
                }`}
              >
                {isEnabled && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {rule.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">
                  {rule.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
