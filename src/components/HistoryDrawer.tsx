import React from 'react';
import { X, BookOpen, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { Deck } from '../types/flashcard';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  decks: Deck[];
  currentDeckId: string;
  onSelectDeck: (deckId: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  decks,
  currentDeckId,
  onSelectDeck,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
            <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

            <div className="relative w-full max-w-sm bg-white dark:bg-[#131b2e] border-l border-slate-200 dark:border-slate-800 shadow-2xl h-full p-6 flex flex-col justify-between z-10 overflow-y-auto">
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Recent Study Sets
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            {decks.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  onSelectDeck(d.id);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between group ${
                  d.id === currentDeckId
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
                    : 'bg-white dark:bg-[#161f36] border-slate-200/80 dark:border-slate-800 hover:border-indigo-200 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="space-y-1 pr-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{d.icon || '📖'}</span>
                    <span className="font-bold text-sm truncate">{d.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{d.description}</p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {d.cards.length} flashcards
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition" />
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Decks are available for this session.
          </p>
        </div>
      </div>
    </div>
  );
};
