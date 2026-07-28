'use client';

import React, { useState } from 'react';
import { Copy, Check, Download, Sparkles, Layers, FileCode } from 'lucide-react';

interface TextOutputPanelProps {
  originalText: string;
  cleanedText: string;
}

export const TextOutputPanel: React.FC<TextOutputPanelProps> = ({
  originalText,
  cleanedText,
}) => {
  const [copied, setCopied] = useState(false);
  const [diffMode, setDiffMode] = useState(false);

  const handleCopy = async () => {
    if (!cleanedText) return;
    try {
      await navigator.clipboard.writeText(cleanedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = cleanedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = (format: 'txt' | 'md') => {
    if (!cleanedText) return;
    const blob = new Blob([cleanedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cleaned_text.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const charCount = cleanedText.length;
  const wordCount = cleanedText.trim()
    ? cleanedText.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 border border-teal-500/20 dark:border-emerald-500/20 rounded-2xl flex flex-col h-[520px] shadow-xl shadow-teal-950/5 backdrop-blur-xl overflow-hidden">
      {/* Top Action Bar */}
      <div className="p-3.5 bg-slate-50/60 dark:bg-slate-950/50 border-b border-teal-500/10 dark:border-emerald-500/10 flex items-center justify-between gap-2 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Cleaned Output
          </span>
        </div>

        {/* Output Controls */}
        <div className="flex items-center gap-2">
          {/* Diff Mode Toggle */}
          <button
            onClick={() => setDiffMode(!diffMode)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all backdrop-blur-md ${
              diffMode
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 border-slate-200 dark:border-slate-700'
            }`}
            title="Toggle diff view"
          >
            <Layers className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{diffMode ? 'Diff Mode ON' : 'View Diff'}</span>
          </button>

          {/* Download Buttons */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden text-xs">
            <button
              onClick={() => handleDownload('txt')}
              disabled={!cleanedText}
              className="px-2.5 py-1.5 bg-slate-100/60 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 transition-all font-semibold"
              title="Download .txt file"
            >
              <Download className="h-3 w-3" /> .TXT
            </button>
            <button
              onClick={() => handleDownload('md')}
              disabled={!cleanedText}
              className="px-2.5 py-1.5 bg-slate-100/60 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 flex items-center gap-1 transition-all font-semibold"
              title="Download .md file"
            >
              <FileCode className="h-3 w-3" /> .MD
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            disabled={!cleanedText}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md disabled:opacity-40 ${
              copied
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-teal-500/25 border border-white/20'
            }`}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Output'}</span>
          </button>
        </div>
      </div>

      {/* Main Text Container */}
      <div className="relative flex-1 p-4 overflow-y-auto">
        {diffMode ? (
          <div className="text-xs font-mono space-y-3 leading-relaxed">
            <div className="p-3 bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20 rounded-xl backdrop-blur-md">
              <span className="font-bold block mb-1 uppercase tracking-wider text-[10px]">
                Original Text ({originalText.length} chars)
              </span>
              <pre className="whitespace-pre-wrap font-mono font-normal">
                {originalText || '(empty)'}
              </pre>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 rounded-xl backdrop-blur-md">
              <span className="font-bold block mb-1 uppercase tracking-wider text-[10px]">
                Cleaned Output ({cleanedText.length} chars)
              </span>
              <pre className="whitespace-pre-wrap font-mono font-normal">
                {cleanedText || '(empty)'}
              </pre>
            </div>
          </div>
        ) : (
          <textarea
            readOnly
            value={cleanedText}
            placeholder="Cleaned output will appear here automatically..."
            className="w-full h-full resize-none bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none font-sans leading-relaxed select-text"
          />
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2.5 bg-slate-50/40 dark:bg-slate-950/40 border-t border-teal-500/10 dark:border-emerald-500/10 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-mono text-cyan-500">SANITISED OUTPUT</span>
        <div className="flex items-center gap-3">
          <span>{wordCount.toLocaleString()} words</span>
          <span>{charCount.toLocaleString()} chars</span>
        </div>
      </div>
    </div>
  );
};
