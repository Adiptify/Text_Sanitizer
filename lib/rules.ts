import { CustomRule } from '../types';

/**
 * Rule 1: Remove Markdown formatting while keeping readable text.
 */
export function removeMarkdown(text: string): string {
  let result = text;

  // 1. Remove Fenced Code Block syntax (keep inner code content)
  result = result.replace(/```[a-zA-Z0-9_-]*\n([\s\S]*?)```/g, '$1');
  result = result.replace(/```([\s\S]*?)```/g, '$1');

  // 2. Remove Inline Code ticks
  result = result.replace(/`([^`]+)`/g, '$1');

  // 3. Remove Images: ![alt](url) -> alt
  result = result.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');

  // 4. Remove Hyperlinks: [anchor](url) -> anchor
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 5. Remove Headers: # Header, ## Header
  result = result.replace(/^#{1,6}\s+(.*)$/gm, '$1');

  // 6. Remove Bold, Italics, Strikethrough
  result = result.replace(/\*\*\*(.*?)\*\*\*/g, '$1');
  result = result.replace(/\*\*(.*?)\*\*/g, '$1');
  result = result.replace(/\*(.*?)\*/g, '$1');
  result = result.replace(/___(.*?)___/g, '$1');
  result = result.replace(/__(.*?)__/g, '$1');
  result = result.replace(/_(.*?)_/g, '$1');
  result = result.replace(/~~(.*?)~~/g, '$1');

  // 7. Remove Blockquotes prefix (> quote)
  result = result.replace(/^\s*>\s?(.*)$/gm, '$1');

  // 8. Remove Unordered List Markers (*, -, +)
  result = result.replace(/^\s*[\*\-\+]\s+/gm, '');

  // 9. Remove Ordered List Markers (1., 2., etc)
  result = result.replace(/^\s*\d+\.\s+/gm, '');

  // 10. Remove Horizontal Rules (---, ***, ___)
  result = result.replace(/^\s*[\*\-\_]{3,}\s*$/gm, '');

  // 11. Remove HTML tags
  result = result.replace(/<[^>]*>/g, '');

  return result;
}

/**
 * Rule 2: Remove AI Boilerplate & Disclaimers.
 */
export function removeAiBoilerplate(text: string): string {
  let result = text;

  const introPatterns = [
    /^\s*As an AI (language model|assistant|model|system)[,\.!]?\s*/gim,
    /^\s*As of my (last |)knowledge (cutoff|update)[,\.!]?\s*/gim,
    /^\s*(Certainly|Sure|Of course)[!,\.]\s+(Here is|Here are|I can help|I would be happy to|below is)[^\n]*\n?/gim,
    /^\s*Sure[!\.,]\s+(I'd be happy to help|here's the information|here is what you requested)[^\n]*\n?/gim,
    /^\s*Here is (a|the) (breakdown|summary|overview|list|response)[^\n]*:\s*/gim,
  ];

  const phrasePatterns = [
    /\bAs an AI (language model|assistant|model|system)[,\.!]?\s*/gi,
    /\bAs of my (last |)knowledge (cutoff|update)[,\.!]?\s*/gi,
    /\bI don't have access to real-time (data|information)[,\.!]?\s*/gi,
    /\bI do not have personal opinions, beliefs, or feelings[,\.!]?\s*/gi,
    /\bPlease note that I am an AI[,\.!]?\s*/gi,
    /\bDisclaimer:\s*[^\n]*/gi,
  ];

  const outroPatterns = [
    /\n?\s*I hope this (helps|information is helpful|was useful)[!\.]\s*$/gim,
    /\n?\s*Let me know if you (have any (other |further |)questions|need (any |further |)assistance|need anything else)[!\.]\s*$/gim,
    /\n?\s*Feel free to (ask|reach out) if you need any further (help|clarification)[!\.]\s*$/gim,
    /\n?\s*Thank you for reading[!\.]\s*$/gim,
    /\n?\s*Hope that helps[!\.]\s*$/gim,
  ];

  for (const pattern of introPatterns) result = result.replace(pattern, '');
  for (const pattern of phrasePatterns) result = result.replace(pattern, '');
  for (const pattern of outroPatterns)  result = result.replace(pattern, '');

  return result;
}

/**
 * Rule 3: Remove Repeated Sentences within paragraphs or overall document.
 */
export function removeRepeatedSentences(text: string): { cleanedText: string; removedCount: number } {
  let removedCount = 0;
  const paragraphs = text.split(/\n+/);
  const seenSentences = new Set<string>();

  const cleanedParagraphs = paragraphs.map((paragraph) => {
    const sentenceMatches = paragraph.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g);
    if (!sentenceMatches) return paragraph;

    const uniqueSentences: string[] = [];
    for (const rawSentence of sentenceMatches) {
      const normalized = rawSentence.trim().toLowerCase().replace(/\s+/g, ' ');
      if (normalized.length < 3) {
        uniqueSentences.push(rawSentence);
        continue;
      }
      if (seenSentences.has(normalized)) {
        removedCount++;
      } else {
        seenSentences.add(normalized);
        uniqueSentences.push(rawSentence);
      }
    }
    return uniqueSentences.join('');
  });

  return { cleanedText: cleanedParagraphs.join('\n'), removedCount };
}

/**
 * Rule 4: Remove Extra Blank Lines (collapse 3+ newlines to 2).
 */
export function removeExtraBlankLines(text: string): string {
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Rule 5: Remove Unnecessary Spaces (trim line ends, collapse multiple spaces).
 */
export function removeUnnecessarySpaces(text: string): string {
  return text
    .split('\n')
    .map((line) => line.replace(/[ \t]{2,}/g, ' ').trimEnd())
    .join('\n');
}

/**
 * Rule 6: Remove Emojis.
 */
export function removeEmojis(text: string): string {
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}]/gu;
  return text.replace(emojiRegex, '');
}

// =============================================================================
// Rule 7 – Custom Phrase Removal Engine
// =============================================================================

/**
 * Normalise a string for comparison only (never used for output):
 *  - lower-case
 *  - map Unicode punctuation variants → ASCII equivalents
 *  - strip remaining punctuation / symbols
 *  - collapse whitespace to a single space
 *
 * Applied to BOTH the saved rule phrase AND every candidate window in the
 * text, so "Thank you for reading!" reliably matches "THANK YOU FOR READING."
 */
function normaliseForMatch(str: string): string {
  return str
    .toLowerCase()
    // curly / smart quotes → straight
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
    // various dashes → hyphen
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g, '-')
    // ellipsis
    .replace(/\u2026/g, '...')
    // strip anything that is not a word char or whitespace
    .replace(/[^\w\s]/g, ' ')
    // collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// Custom Phrase Remover
// ---------------------------------------------------------------------------

/**
 * Converts a plain text phrase into a robust regular expression that matches
 * the sequence of words regardless of case, punctuation, newlines, or extra spaces.
 */
function createPhraseRegex(phrase: string): RegExp | null {
  const words = phrase.match(/\w+/g);
  if (!words || words.length === 0) return null;
  
  // Escape each word (just in case, though \w+ shouldn't have regex chars)
  const escapedWords = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  
  // [\W_]+ matches any non-word character (spaces, punctuation, hyphens, newlines, etc.)
  const pattern = escapedWords.join('[\\W_]+');
  
  return new RegExp(pattern, 'gi');
}

/**
 * Rule 7: Remove User Custom Phrases.
 *
 * Two modes:
 *
 * ① Smart Word Sequence (default — all plain phrases)
 *    Converts the phrase into a regex that matches the exact sequence of words.
 *    - Case differences are ignored ("THANK YOU" -> removed)
 *    - Punctuation/spacing is ignored ("Thank... you!" -> removed)
 *    - Newlines/markdown artifacts in between words are ignored.
 *
 * ② Raw Regex (isRegex=true)
 *    Raw JS RegExp for power users.
 */
export function removeCustomPhrases(text: string, customRules: CustomRule[]): string {
  let result = text;

  for (const rule of customRules) {
    if (!rule.enabled || !rule.phrase.trim()) continue;

    try {
      let rx: RegExp;
      if (rule.isRegex) {
        const flags = rule.caseSensitive ? 'g' : 'gi';
        rx = new RegExp(rule.phrase, flags);
      } else {
        const generatedRx = createPhraseRegex(rule.phrase);
        if (!generatedRx) continue;
        rx = generatedRx;
      }

      result = result
        .replace(rx, ' ')
        // Tidy up spaces and newlines left behind
        .split('\n')
        .map(l => l.replace(/[ \t]{2,}/g, ' ').trim())
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    } catch {
      // Ignore invalid regexes
    }
  }

  return result;
}
