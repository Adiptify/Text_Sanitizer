export type CleaningRuleId =
  | 'markdown'
  | 'aiBoilerplate'
  | 'repeatedSentences'
  | 'extraBlankLines'
  | 'unnecessarySpaces'
  | 'emojis'
  | 'customPhrases';

export interface CleaningRuleMeta {
  id: CleaningRuleId;
  label: string;
  description: string;
  example: string;
  defaultEnabled: boolean;
}

export interface CustomRule {
  id: string;
  name?: string; // Short readable display name (e.g., "AI Disclaimer")
  phrase: string; // Target phrase or pattern to remove
  isRegex?: boolean;
  caseSensitive?: boolean;
  useFuzzy?: boolean; // Flexible / fuzzy match (handles punctuation, extra spaces, typos)
  fuzzyThreshold?: number; // 0.0 – 1.0, default 0.85. Match is removed when similarity >= threshold
  enabled: boolean;
}

export interface RuleConfigState {
  markdown: boolean;
  aiBoilerplate: boolean;
  repeatedSentences: boolean;
  extraBlankLines: boolean;
  unnecessarySpaces: boolean;
  emojis: boolean;
  customPhrases: boolean;
}

export interface CleaningMetrics {
  originalWordCount: number;
  cleanedWordCount: number;
  originalCharCount: number;
  cleanedCharCount: number;
  wordsRemoved: number;
  charsRemoved: number;
  reductionPercentage: number;
  sentencesRemoved: number;
  processingTimeMs: number;
  timeSavedSeconds: number;
}

export type PresetId = 'all' | 'aiOnly' | 'markdownOnly' | 'minimal';

export interface PresetProfile {
  id: PresetId;
  name: string;
  description: string;
  rules: RuleConfigState;
}
