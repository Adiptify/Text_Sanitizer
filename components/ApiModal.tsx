'use client';

import React, { useState } from 'react';
import { X, Code2, Copy, Check } from 'lucide-react';

interface ApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiModal: React.FC<ApiModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const curlCode = `curl -X POST http://localhost:3000/api/clean \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "As an AI language model, ### Hello World! 🚀",
    "rules": {
      "markdown": true,
      "aiBoilerplate": true,
      "emojis": true
    }
  }'`;

  const copyCurl = () => {
    navigator.clipboard.writeText(curlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900/90 border border-teal-500/30 rounded-3xl w-full max-w-xl shadow-2xl shadow-teal-950/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 backdrop-blur-2xl">
        <div className="p-4 border-b border-teal-500/20 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Code2 className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Headless Cleaning API (<code className="text-emerald-400 text-xs">/api/clean</code>)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Integrate the text sanitization engine programmatically into your scripts, web apps, or backend pipelines using our JSON REST API endpoint.
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>cURL Request Example</span>
              <button
                onClick={copyCurl}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="bg-slate-950/90 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800">
              {curlCode}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300">
              Response Format:
            </h4>
            <pre className="bg-slate-950/90 text-cyan-400 p-3.5 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800">
{`{
  "success": true,
  "cleanedText": "Hello World!",
  "metrics": {
    "originalWordCount": 8,
    "cleanedWordCount": 2,
    "reductionPercentage": 72.5,
    "processingTimeMs": 0.4
  }
}`}
            </pre>
          </div>
        </div>

        <div className="p-4 bg-slate-950/50 border-t border-teal-500/20 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-500/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
