'use client';

import React from 'react';
import { Sparkles, Moon, Sun, ShieldCheck, Terminal } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenApiModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenApiModal,
}) => {
  return (
    <header className="w-full border-b border-teal-500/20 dark:border-emerald-500/20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl sticky top-0 z-30 transition-colors duration-300 shadow-lg shadow-teal-950/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/30 ring-1 ring-white/30">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent tracking-tight">
                Text Sanitizer
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 dark:border-emerald-400/30 backdrop-blur-md">
                <ShieldCheck className="h-3 w-3 text-emerald-500" /> Active Guardrails
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 hidden sm:block font-medium">
              Strip disclaimers, boilerplate, & formatting with green-blue precision
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* API Modal Button */}
          <button
            onClick={onOpenApiModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 transition-all border border-teal-500/30 backdrop-blur-md shadow-xs"
            title="View API Docs"
          >
            <Terminal className="h-3.5 w-3.5 text-teal-500 dark:text-teal-400" />
            <span className="hidden md:inline">API Access</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-teal-500/10 dark:hover:bg-emerald-500/20 transition-all border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-md"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
