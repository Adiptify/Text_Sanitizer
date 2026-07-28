import { CleaningMetrics, CustomRule, RuleConfigState } from '../types';
import {
  removeAiBoilerplate,
  removeCustomPhrases,
  removeEmojis,
  removeExtraBlankLines,
  removeMarkdown,
  removeRepeatedSentences,
  removeUnnecessarySpaces,
} from './rules';

export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function cleanText(
  inputText: string,
  rules: RuleConfigState,
  customRules: CustomRule[] = []
): { cleanedText: string; metrics: CleaningMetrics } {
  const startTime = performance.now();

  const originalWordCount = countWords(inputText);
  const originalCharCount = inputText.length;

  let currentText = inputText;
  let sentencesRemovedCount = 0;

  // ── PASS 1: Custom phrases on raw input ─────────────────────────────────
  // Catches phrases before any other rule can alter the surrounding text.
  if (rules.customPhrases && customRules.length > 0) {
    currentText = removeCustomPhrases(currentText, customRules);
  }

  // ── Core cleaning pipeline ───────────────────────────────────────────────
  if (rules.aiBoilerplate) {
    currentText = removeAiBoilerplate(currentText);
  }

  if (rules.markdown) {
    currentText = removeMarkdown(currentText);
  }

  if (rules.repeatedSentences) {
    const res = removeRepeatedSentences(currentText);
    currentText = res.cleanedText;
    sentencesRemovedCount = res.removedCount;
  }

  if (rules.emojis) {
    currentText = removeEmojis(currentText);
  }

  if (rules.unnecessarySpaces) {
    currentText = removeUnnecessarySpaces(currentText);
  }

  if (rules.extraBlankLines) {
    currentText = removeExtraBlankLines(currentText);
  }

  // ── PASS 2: Custom phrases on fully-cleaned text ─────────────────────────
  // Catches any phrases that were hidden inside markdown/boilerplate/emoji
  // wrappers and only became plain text after the rules above stripped them.
  if (rules.customPhrases && customRules.length > 0) {
    currentText = removeCustomPhrases(currentText, customRules);
  }

  const endTime = performance.now();
  const processingTimeMs = Math.max(0.1, Number((endTime - startTime).toFixed(2)));

  const cleanedWordCount = countWords(currentText);
  const cleanedCharCount = currentText.length;

  const wordsRemoved = Math.max(0, originalWordCount - cleanedWordCount);
  const charsRemoved = Math.max(0, originalCharCount - cleanedCharCount);

  const reductionPercentage =
    originalCharCount > 0
      ? Number(((charsRemoved / originalCharCount) * 100).toFixed(1))
      : 0;

  // Average reading speed: 200 words per minute -> ~3.33 words per second
  const timeSavedSeconds = Math.round((wordsRemoved / 200) * 60);

  return {
    cleanedText: currentText,
    metrics: {
      originalWordCount,
      cleanedWordCount,
      originalCharCount,
      cleanedCharCount,
      wordsRemoved,
      charsRemoved,
      reductionPercentage,
      sentencesRemoved: sentencesRemovedCount,
      processingTimeMs,
      timeSavedSeconds,
    },
  };
}
