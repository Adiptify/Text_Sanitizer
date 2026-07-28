import mongoose, { Schema, Document, Model } from 'mongoose';
import { CustomRule, RuleConfigState } from '../types';

export interface IGuardrailDocument extends Document {
  name: string;
  description?: string;
  rules: RuleConfigState;
  customRules: CustomRule[];
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CustomRuleSchema = new Schema<CustomRule>(
  {
    id: { type: String, required: true },
    name: { type: String, default: '' },
    phrase: { type: String, required: true },
    isRegex: { type: Boolean, default: false },
    caseSensitive: { type: Boolean, default: false },
    useFuzzy: { type: Boolean, default: true },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const RuleConfigSchema = new Schema<RuleConfigState>(
  {
    markdown: { type: Boolean, default: true },
    aiBoilerplate: { type: Boolean, default: true },
    repeatedSentences: { type: Boolean, default: true },
    extraBlankLines: { type: Boolean, default: true },
    unnecessarySpaces: { type: Boolean, default: true },
    emojis: { type: Boolean, default: true },
    customPhrases: { type: Boolean, default: true },
  },
  { _id: false }
);

const GuardrailSchema = new Schema<IGuardrailDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    rules: { type: RuleConfigSchema, required: true },
    customRules: { type: [CustomRuleSchema], default: [] },
    isDefault: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const GuardrailModel: Model<IGuardrailDocument> =
  mongoose.models.Guardrail || mongoose.model<IGuardrailDocument>('Guardrail', GuardrailSchema);
