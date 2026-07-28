'use client';

import React, { useEffect, useState } from 'react';
import { CustomRule, PresetId, RuleConfigState } from '../types';
import { cleanText } from '../lib/cleaner';
import { PRESET_PROFILES } from '../lib/presets';
import { DEFAULT_SAMPLES } from '../lib/defaultSamples';
import { Header } from './Header';
import { StatsBar } from './StatsBar';
import { RuleSelector } from './RuleSelector';
import { PhrasePanel } from './PhrasePanel';
import { ApiModal } from './ApiModal';
import { TextInputPanel } from './TextInputPanel';
import { TextOutputPanel } from './TextOutputPanel';

const LS_VERSION = 'v3';
const LS_KEY = 'text_cleaner_custom_rules';
const LS_VER_KEY = 'text_cleaner_rules_version';

const DEFAULT_CUSTOM_RULES: CustomRule[] = [
  { id: '1', phrase: 'As an AI language model', enabled: true },
  { id: '2', phrase: 'Thank you for reading',   enabled: true },
  { id: '3', phrase: 'I hope this helps',        enabled: true },
];

const DEFAULT_RULE_CONFIG: RuleConfigState = {
  markdown:          true,
  aiBoilerplate:     true,
  repeatedSentences: true,
  extraBlankLines:   true,
  unnecessarySpaces: true,
  emojis:            true,
  customPhrases:     true,
};

function loadCustomRules(): CustomRule[] {
  try {
    const version = localStorage.getItem(LS_VER_KEY);
    if (version !== LS_VERSION) {
      localStorage.removeItem(LS_KEY);
      localStorage.setItem(LS_VER_KEY, LS_VERSION);
      return DEFAULT_CUSTOM_RULES;
    }
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_CUSTOM_RULES;
    const parsed: CustomRule[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.some(r => !r.id || typeof r.phrase !== 'string')) {
      return DEFAULT_CUSTOM_RULES;
    }
    return parsed;
  } catch {
    return DEFAULT_CUSTOM_RULES;
  }
}

function saveCustomRulesToStorage(rules: CustomRule[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(rules));
    localStorage.setItem(LS_VER_KEY, LS_VERSION);
  } catch { /* ignore */ }
}

export const EditorWorkspace: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>('');
  const [rules, setRules] = useState<RuleConfigState>(DEFAULT_RULE_CONFIG);
  const [activePresetId, setActivePresetId] = useState<PresetId | null>('all');
  const [customRules, setCustomRules] = useState<CustomRule[]>(DEFAULT_CUSTOM_RULES);

  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // ── Boot: load sample text + custom rules from localStorage ─────────────
  useEffect(() => {
    setInputText(DEFAULT_SAMPLES[0].content);
    setCustomRules(loadCustomRules());
  }, []);

  // ── Dark mode sync ───────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // ── Custom rules helpers ─────────────────────────────────────────────────
  const persistRules = (updated: CustomRule[]) => {
    setCustomRules(updated);
    saveCustomRulesToStorage(updated);
  };

  const handleAddPhrase = (phrase: string, threshold = 0.85) => {
    const already = customRules.some(
      r => r.phrase.trim().toLowerCase() === phrase.trim().toLowerCase()
    );
    if (already) return;
    persistRules([
      ...customRules,
      {
        id: Date.now().toString(),
        phrase: phrase.trim(),
        enabled: true,
        fuzzyThreshold: threshold,
      },
    ]);
  };

  const handleSetGlobalThreshold = (threshold: number) => {
    persistRules(customRules.map(r => ({ ...r, fuzzyThreshold: threshold })));
  };

  const handleRemovePhrase = (id: string) => {
    persistRules(customRules.filter(r => r.id !== id));
  };

  const handleTogglePhrase = (id: string) => {
    persistRules(customRules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleClearAllPhrases = () => {
    persistRules([]);
  };

  // ── Rule toggle / preset ─────────────────────────────────────────────────
  const handleToggleRule = (ruleId: keyof RuleConfigState) => {
    setRules(prev => ({ ...prev, [ruleId]: !prev[ruleId] }));
    setActivePresetId(null);
  };

  const handleSelectPreset = (presetId: PresetId) => {
    const preset = PRESET_PROFILES.find(p => p.id === presetId);
    if (preset) {
      setRules({ ...preset.rules, customPhrases: true });
      setActivePresetId(presetId);
    }
  };

  // ── Cleaning ─────────────────────────────────────────────────────────────
  const { cleanedText, metrics } = cleanText(inputText, rules, customRules);

  return (
    <div className="relative min-h-screen bg-slate-100 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 overflow-x-hidden">
      
      {/* Ambient Glassmorphism Background Glowing Orbs (Green & Blue Gradients) */}
      <div className="fixed top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/15 to-transparent rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-bl from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-[140px] pointer-events-none z-0" />

      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenApiModal={() => setIsApiModalOpen(true)}
      />

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats */}
        <StatsBar metrics={metrics} />

        {/* Rule selector */}
        <RuleSelector
          rules={rules}
          onToggleRule={handleToggleRule}
          onSelectPreset={handleSelectPreset}
          activePresetId={activePresetId}
          customRules={customRules}
          onOpenCustomRulesModal={() => {}}
        />

        {/* Unified Phrase Panel */}
        <PhrasePanel
          phrases={customRules}
          enabled={rules.customPhrases}
          onToggleEnabled={() => handleToggleRule('customPhrases')}
          onAddPhrase={handleAddPhrase}
          onRemovePhrase={handleRemovePhrase}
          onTogglePhrase={handleTogglePhrase}
          onClearAll={handleClearAllPhrases}
          onSetGlobalThreshold={handleSetGlobalThreshold}
        />

        {/* Split-screen editor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TextInputPanel
            value={inputText}
            onChange={setInputText}
            onClear={() => setInputText('')}
            onLoadSample={(sampleContent) => setInputText(sampleContent)}
          />
          <TextOutputPanel
            originalText={inputText}
            cleanedText={cleanedText}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-teal-500/10 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md py-4 text-center text-xs text-slate-600 dark:text-slate-400">
        <p className="font-medium">Text Sanitizer &bull; Instant AI Response &amp; Text Cleaner</p>
      </footer>

      {/* API Modal */}
      <ApiModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />
    </div>
  );
};
