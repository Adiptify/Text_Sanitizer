'use client';

import React, { useRef, useState } from 'react';
import { DEFAULT_SAMPLES } from '../lib/defaultSamples';
import { Upload, Trash2, FileText, Sparkles } from 'lucide-react';

interface TextInputPanelProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  onLoadSample: (sampleContent: string) => void;
}

export const TextInputPanel: React.FC<TextInputPanelProps> = ({
  value,
  onChange,
  onClear,
  onLoadSample,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onChange(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md'))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          onChange(content);
        }
      };
      reader.readAsText(file);
    }
  };

  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bg-white/60 dark:bg-slate-900/60 border rounded-2xl flex flex-col h-[520px] transition-all shadow-xl shadow-teal-950/5 backdrop-blur-xl overflow-hidden ${
        isDragging
          ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-500/10'
          : 'border-teal-500/20 dark:border-emerald-500/20'
      }`}
    >
      {/* Top Action Bar */}
      <div className="p-3.5 bg-slate-50/60 dark:bg-slate-950/50 border-b border-teal-500/10 dark:border-emerald-500/10 flex items-center justify-between gap-2 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-cyan-500/10 text-cyan-500">
            <FileText className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Raw Input Text
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Load Sample Button Dropdown */}
          <div className="relative group">
            <button className="px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 rounded-xl border border-teal-500/30 flex items-center gap-1.5 transition-all shadow-xs backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-teal-500" /> Load Sample
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-white/90 dark:bg-slate-900/90 border border-teal-500/20 dark:border-emerald-500/20 rounded-2xl shadow-2xl p-1.5 z-20 backdrop-blur-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200">
              {DEFAULT_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onLoadSample(sample.content)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 transition-all group/item"
                >
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400">
                    {sample.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {sample.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.md,text/plain"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all"
            title="Upload .txt or .md file"
          >
            <Upload className="h-3.5 w-3.5" /> Upload
          </button>

          {/* Clear Button */}
          {value && (
            <button
              onClick={onClear}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              title="Clear input"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Textarea Area */}
      <div className="relative flex-1 p-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste AI response, document, email, or web text here..."
          className="w-full h-full resize-none bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none font-sans leading-relaxed"
        />

        {/* Drag & Drop Overlay hint */}
        {!value && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 pointer-events-none text-center">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 mb-3">
              <Upload className="h-7 w-7 text-emerald-500" />
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Paste your text above or drag & drop a <code className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 px-1.5 py-0.5 rounded text-[11px]">.txt</code> / <code className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 px-1.5 py-0.5 rounded text-[11px]">.md</code> file
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2.5 bg-slate-50/40 dark:bg-slate-950/40 border-t border-teal-500/10 dark:border-emerald-500/10 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-mono text-emerald-500">INPUT READY</span>
        <div className="flex items-center gap-3">
          <span>{wordCount.toLocaleString()} words</span>
          <span>{charCount.toLocaleString()} chars</span>
        </div>
      </div>
    </div>
  );
};
