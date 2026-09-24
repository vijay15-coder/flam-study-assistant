import React, { useState } from 'react';
import { Sparkles, BookOpen, AlertCircle } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (customInput?: string) => void;
  isLoading: boolean;
}

const EXAMPLE_TOPICS = [
  'Teach me binary search',
  'JavaScript Closures and Scope',
  'Photosynthesis light & dark reactions',
  'HTTP Status Codes and REST APIs',
];

export const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setValidationError('Please enter a study topic, concept, or paste lecture notes.');
      return;
    }
    setValidationError(null);
    onSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSelectExample = (topic: string) => {
    onChange(topic);
    setValidationError(null);
    onSubmit(topic);
  };

  return (
    <div className="w-full glass-card rounded-2xl border border-slate-200/80 dark:border-neutral-800 shadow-xs p-5 md:p-6 transition-all">
      <div className="flex items-center justify-between mb-3">
        <label htmlFor="topic-input" className="text-xs sm:text-sm font-bold text-slate-800 dark:text-neutral-200 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>What curriculum topic would you like to master?</span>
        </label>
        <span className="text-[11px] text-slate-400 dark:text-neutral-500 font-medium">Ctrl + Enter to generate</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="relative">
          <textarea
            id="topic-input"
            rows={3}
            value={value}
            disabled={isLoading}
            onChange={(e) => {
              onChange(e.target.value);
              if (validationError) setValidationError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Graph Traversal algorithms (BFS vs DFS), or paste key notes from your class lecture..."
            className={`w-full p-4 text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 text-xs sm:text-sm bg-white dark:bg-[#121212] border rounded-2xl focus:outline-none focus:ring-2 transition-all resize-y min-h-[96px] ${
              validationError
                ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20 dark:bg-rose-950/20'
                : 'border-slate-200 dark:border-neutral-800 focus:border-emerald-500 focus:ring-emerald-200/50 dark:focus:ring-emerald-900/40'
            } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
        </div>

        {validationError && (
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 dark:text-neutral-500 mr-1 hidden lg:inline">Suggestions:</span>
            {EXAMPLE_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                disabled={isLoading}
                onClick={() => handleSelectExample(topic)}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-300 dark:hover:text-emerald-400 transition-all border border-slate-200/60 hover:border-emerald-200 dark:border-neutral-800 dark:hover:border-neutral-700 disabled:opacity-50 disabled:pointer-events-none text-left active:scale-95"
              >
                {topic}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-sm transition-all duration-200 flex-shrink-0 ${
              isLoading
                ? 'bg-emerald-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 shadow-emerald-200'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Synthesizing...' : 'Generate Flashcards'}
          </button>
        </div>
      </form>
    </div>
  );
};
