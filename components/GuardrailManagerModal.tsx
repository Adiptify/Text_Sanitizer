'use client';

import React, { useEffect, useState } from 'react';
import { CustomRule, RuleConfigState } from '../types';
import { Database, X, Plus, Trash2, Download, Upload, Check, Copy, RefreshCw, FileJson } from 'lucide-react';

export interface GuardrailItem {
  _id: string;
  name: string;
  description?: string;
  rules: RuleConfigState;
  customRules: CustomRule[];
  isDefault?: boolean;
  createdAt?: string;
}

interface GuardrailManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRules: RuleConfigState;
  currentCustomRules: CustomRule[];
  onApplyGuardrail: (rules: RuleConfigState, customRules: CustomRule[]) => void;
}

export const GuardrailManagerModal: React.FC<GuardrailManagerModalProps> = ({
  isOpen,
  onClose,
  currentRules,
  currentCustomRules,
  onApplyGuardrail,
}) => {
  const [guardrails, setGuardrails] = useState<GuardrailItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dbSource, setDbSource] = useState<string>('mongodb');
  const [newGuardrailName, setNewGuardrailName] = useState('');
  const [newGuardrailDesc, setNewGuardrailDesc] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'json'>('list');

  // Fetch guardrails from MongoDB API
  const fetchGuardrails = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/guardrails');
      const data = await res.json();
      if (data.guardrails) {
        setGuardrails(data.guardrails);
        setDbSource(data.source || 'mongodb');
      }
    } catch (err) {
      console.error('Failed to fetch guardrails:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGuardrails();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Save new Guardrail to MongoDB
  const handleSaveGuardrail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuardrailName.trim()) return;

    const payload = {
      name: newGuardrailName.trim(),
      description: newGuardrailDesc.trim(),
      rules: currentRules,
      customRules: currentCustomRules,
    };

    try {
      const res = await fetch('/api/guardrails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.guardrail) {
        setGuardrails((prev) => [data.guardrail, ...prev]);
        setNewGuardrailName('');
        setNewGuardrailDesc('');
        setActiveTab('list');
      }
    } catch (err) {
      console.error('Error saving guardrail:', err);
    }
  };

  // Delete Guardrail
  const handleDeleteGuardrail = async (id: string) => {
    try {
      await fetch(`/api/guardrails/${id}`, { method: 'DELETE' });
      setGuardrails((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      console.error('Error deleting guardrail:', err);
    }
  };

  // Export JSON file
  const handleExportJson = (guardrail: GuardrailItem) => {
    const jsonStr = JSON.stringify(guardrail, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guardrail-${guardrail.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON file
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.rules) {
          const payload = {
            name: parsed.name || 'Imported Guardrail',
            description: parsed.description || 'Imported from JSON file',
            rules: parsed.rules,
            customRules: parsed.customRules || [],
          };
          const res = await fetch('/api/guardrails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          if (data.guardrail) {
            setGuardrails((prev) => [data.guardrail, ...prev]);
          }
        }
      } catch (err) {
        alert('Invalid JSON Guardrail file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const copyGuardrailJson = (guardrail: GuardrailItem) => {
    navigator.clipboard.writeText(JSON.stringify(guardrail, null, 2));
    setCopiedId(guardrail._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  MongoDB Guardrails Vault
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {dbSource === 'mongodb' ? '🍃 MongoDB Linked' : '💾 In-Memory Fallback'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Save, load, import & export JSON guardrail configurations from database
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'list'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileJson className="h-3.5 w-3.5" /> Saved Guardrails ({guardrails.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`py-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'create'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Plus className="h-3.5 w-3.5" /> Save Current as Guardrail
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {activeTab === 'list' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Select a JSON guardrail profile to apply to your editor</span>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                    <Upload className="h-3 w-3" /> Import JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJson}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={fetchGuardrails}
                    className="p-1 hover:text-slate-900 dark:hover:text-white"
                    title="Refresh from DB"
                  >
                    <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {guardrails.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No guardrails saved in MongoDB yet. Click &quot;Save Current as Guardrail&quot; to create one!
                </div>
              ) : (
                <div className="space-y-3">
                  {guardrails.map((g) => (
                    <div
                      key={g._id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-500/50 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {g.name}
                            </h4>
                            {g.isDefault && (
                              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-medium">
                                Preset
                              </span>
                            )}
                          </div>
                          {g.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {g.description}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              onApplyGuardrail(g.rules, g.customRules);
                              onClose();
                            }}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                          >
                            Apply Rules
                          </button>
                          <button
                            onClick={() => copyGuardrailJson(g)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            title="Copy JSON"
                          >
                            {copiedId === g._id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            onClick={() => handleExportJson(g)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            title="Download JSON file"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                          {!g.isDefault && (
                            <button
                              onClick={() => handleDeleteGuardrail(g._id)}
                              className="p-1.5 text-slate-400 hover:text-red-500"
                              title="Delete from DB"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* JSON Rules Preview badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {Object.entries(g.rules || {}).map(([key, val]) => (
                          <span
                            key={key}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                              val
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 line-through'
                            }`}
                          >
                            {key}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <form onSubmit={handleSaveGuardrail} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Guardrail Name
                </label>
                <input
                  type="text"
                  required
                  value={newGuardrailName}
                  onChange={(e) => setNewGuardrailName(e.target.value)}
                  placeholder="e.g. Executive Summary Guardrail"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <input
                  type="text"
                  value={newGuardrailDesc}
                  onChange={(e) => setNewGuardrailDesc(e.target.value)}
                  placeholder="e.g. Removes boilerplate disclaimers and company signatures"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Target JSON Guardrail Payload to Save:
                </span>
                <pre className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg text-[11px] font-mono overflow-x-auto max-h-36">
                  {JSON.stringify(
                    { rules: currentRules, customRules: currentCustomRules },
                    null,
                    2
                  )}
                </pre>
              </div>

              <button
                type="submit"
                disabled={!newGuardrailName.trim()}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
              >
                Save Guardrail to MongoDB
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
