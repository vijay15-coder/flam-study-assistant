import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { PromptInput } from './PromptInput';

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPrompt: (topic: string) => void;
  isLoading: boolean;
}

export const CreateDeckModal: React.FC<CreateDeckModalProps> = ({
  isOpen,
  onClose,
  onSubmitPrompt,
  isLoading,
}) => {
  const [topic, setTopic] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (customTopic?: string) => {
    const finalTopic = (customTopic || topic).trim();
    if (!finalTopic) return;
    onSubmitPrompt(finalTopic);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-card rounded-3xl max-w-xl w-full border border-slate-200/90 dark:border-neutral-800 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 relative">
                <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-100/40 dark:bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white tracking-tight">Generate Flashcard Deck</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400">AI-synthesized active recall curriculum set</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition disabled:opacity-50 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-300 leading-relaxed relative z-10">
          Enter a topic, chapter title, or paste your notes. The server will turn them into question and answer cards.
        </p>

                <div className="relative z-10">
          <PromptInput
            value={topic}
            onChange={setTopic}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
