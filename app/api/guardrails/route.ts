import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { GuardrailModel } from '../../../models/Guardrail';

const DEFAULT_GUARDRAILS = [
  {
    _id: 'default-all-clean',
    name: 'Strict Guardrail (All Active)',
    description: 'Enforces complete sanitization of markdown, AI disclaimers, duplicate sentences, emojis, and custom phrases.',
    rules: {
      markdown: true,
      aiBoilerplate: true,
      repeatedSentences: true,
      extraBlankLines: true,
      unnecessarySpaces: true,
      emojis: true,
      customPhrases: true,
    },
    customRules: [
      {
        id: '1',
        phrase: 'As an AI language model',
        isRegex: false,
        caseSensitive: false,
        enabled: true,
      },
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'default-ai-only',
    name: 'AI Disclaimer Guardrail',
    description: 'Focuses strictly on removing AI intro disclaimers and concluding policy boilerplate while leaving formatting intact.',
    rules: {
      markdown: false,
      aiBoilerplate: true,
      repeatedSentences: true,
      extraBlankLines: true,
      unnecessarySpaces: true,
      emojis: false,
      customPhrases: true,
    },
    customRules: [],
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      // MongoDB offline fallback
      return NextResponse.json({
        success: true,
        source: 'memory_fallback',
        guardrails: DEFAULT_GUARDRAILS,
      });
    }

    const guardrails = await GuardrailModel.find({}).sort({ createdAt: -1 });

    if (guardrails.length === 0) {
      // Seed default guardrails if DB is empty
      await GuardrailModel.insertMany(
        DEFAULT_GUARDRAILS.map((g) => ({
          name: g.name,
          description: g.description,
          rules: g.rules,
          customRules: g.customRules,
          isDefault: true,
        }))
      );
      const seeded = await GuardrailModel.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, source: 'mongodb', guardrails: seeded });
    }

    return NextResponse.json({ success: true, source: 'mongodb', guardrails });
  } catch (error) {
    console.error('Error fetching guardrails:', error);
    return NextResponse.json({ success: true, source: 'memory_fallback', guardrails: DEFAULT_GUARDRAILS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, rules, customRules } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Guardrail "name" is required.' }, { status: 400 });
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        {
          success: true,
          source: 'memory',
          message: 'Guardrail created in temporary memory mode (MongoDB offline).',
          guardrail: {
            _id: `mem-${Date.now()}`,
            name,
            description: description || '',
            rules,
            customRules: customRules || [],
            createdAt: new Date().toISOString(),
          },
        },
        { status: 201 }
      );
    }

    const newGuardrail = await GuardrailModel.create({
      name,
      description: description || '',
      rules,
      customRules: customRules || [],
      isDefault: false,
    });

    return NextResponse.json({ success: true, source: 'mongodb', guardrail: newGuardrail }, { status: 201 });
  } catch (error) {
    console.error('Error saving guardrail:', error);
    return NextResponse.json({ error: 'Failed to save guardrail configuration.' }, { status: 500 });
  }
}
