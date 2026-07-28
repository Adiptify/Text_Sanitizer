import { NextRequest, NextResponse } from 'next/server';
import { cleanText } from '../../../lib/cleaner';
import { CustomRule, RuleConfigState } from '../../../types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, rules, customRules } = body as {
      text?: string;
      rules?: Partial<RuleConfigState>;
      customRules?: CustomRule[];
    };

    if (typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid payload: "text" field must be a string.' },
        { status: 400 }
      );
    }

    const defaultRules: RuleConfigState = {
      markdown: true,
      aiBoilerplate: true,
      repeatedSentences: true,
      extraBlankLines: true,
      unnecessarySpaces: true,
      emojis: false,
      customPhrases: true,
    };

    const activeRules: RuleConfigState = {
      ...defaultRules,
      ...(rules || {}),
    };

    const result = cleanText(text, activeRules, customRules || []);

    return NextResponse.json({
      success: true,
      cleanedText: result.cleanedText,
      metrics: result.metrics,
    });
  } catch (error) {
    console.error('API /clean error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the text.' },
      { status: 500 }
    );
  }
}
