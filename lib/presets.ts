import { PresetProfile } from '../types';

export const PRESET_PROFILES: PresetProfile[] = [
  {
    id: 'all',
    name: 'Full Clean (Recommended)',
    description: 'Enables all cleaning rules to produce pristine, plain text without disclaimers or markdown.',
    rules: {
      markdown: true,
      aiBoilerplate: true,
      repeatedSentences: true,
      extraBlankLines: true,
      unnecessarySpaces: true,
      emojis: true,
      customPhrases: true,
    },
  },
  {
    id: 'aiOnly',
    name: 'Scrub AI Boilerplate',
    description: 'Removes "As an AI language model..." and repetitive closing disclaimers while keeping formatting.',
    rules: {
      markdown: false,
      aiBoilerplate: true,
      repeatedSentences: true,
      extraBlankLines: true,
      unnecessarySpaces: true,
      emojis: false,
      customPhrases: true,
    },
  },
  {
    id: 'markdownOnly',
    name: 'Strip Markdown Only',
    description: 'Converts Markdown headers, bold, links, and code blocks into readable plain text.',
    rules: {
      markdown: true,
      aiBoilerplate: false,
      repeatedSentences: false,
      extraBlankLines: true,
      unnecessarySpaces: true,
      emojis: false,
      customPhrases: false,
    },
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Only cleans up extra blank lines and unnecessary spaces.',
    rules: {
      markdown: false,
      aiBoilerplate: false,
      repeatedSentences: false,
      extraBlankLines: true,
      unnecessarySpaces: true,
      emojis: false,
      customPhrases: false,
    },
  },
];
