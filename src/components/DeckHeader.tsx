import React from 'react';
import {
  ChevronLeft,
  Bookmark,
  Edit2,
  Trash2,
  FileText,
  Clock,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Deck } from '../types/flashcard';

interface DeckHeaderProps {
  deck: Deck;
  onBack?: () => void;
  onToggleBookmark: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpenCreateDeck: () => void;
}

export const DeckHeader: React.FC<DeckHeaderProps> = ({
  deck,
  onBack,
  onToggleBookmark,
  onEdit,
  onDelete,
  onOpenCreateDeck,
}) => {
  const cardsCount = deck?.cards?.length ?? 0;
  const cardsDue = deck?.cardsDue ?? cardsCount;
  const cardsMastered = Math.max(0, cardsCount - cardsDue);
  const progressPercent = deck?.progress ?? Math.round((cardsMastered / Math.max(1, cardsCount)) * 100);

  return (
    <div className="space-y-5 animate-fadeIn">
        <div className="glass-card rounded-[2rem] p-5 sm:p-8 relative overflow-hidden border border-slate-200/80 dark:border-neutral-800 shadow-[0_12px_40px_-20px_rgba(16,185,129,0.45)]">
          <div className="absolute -right-16 -top-24 h-80 w-80 rounded-full bg-gradient-to-bl from-emerald-200/30 via-teal-100/10 to-transparent blur-2xl pointer-events-none dark:from-emerald-500/15 dark:via-teal-500/5" />
          <div className="absolute bottom-0 left-0 h-px w-2/3 bg-gradient-to-r from-emerald-500/70 to-transparent" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-7 relative z-10">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="mt-1 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition flex-shrink-0"
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active Study Deck
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{cardsCount} Flashcards</span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                <span>Spaced Repetition Active</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                <span className="truncate">{deck.title}</span>
                {deck.icon && <span className="text-2xl flex-shrink-0">{deck.icon}</span>}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {deck.description}
              </p>
            </div>
          </div>

                    <div className="flex flex-wrap items-center gap-2 self-start md:self-auto flex-shrink-0 md:justify-end">
                        <button
              type="button"
              onClick={onToggleBookmark}
              className={`p-2.5 rounded-xl border text-sm font-medium transition-all duration-200 active:scale-95 ${
                deck.bookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800/60 shadow-xs'
                  : 'bg-white dark:bg-[#121212] hover:bg-slate-50 dark:hover:bg-[#1c1c1c] text-slate-700 dark:text-neutral-200 border-slate-200/90 dark:border-neutral-800 shadow-xs'
              }`}
              title="Bookmark deck"
            >
              <Bookmark className={`w-4 h-4 ${deck.bookmarked ? 'fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400' : ''}`} />
            </button>

                        <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200/90 dark:border-neutral-800 bg-white dark:bg-[#121212] hover:bg-slate-50 dark:hover:bg-[#1c1c1c] text-slate-700 dark:text-neutral-200 text-xs sm:text-sm font-medium transition shadow-xs active:scale-95"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400" />
              <span>Edit</span>
            </button>

                        <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-rose-950/20 hover:bg-rose-50/70 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-medium transition shadow-xs active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

                        <button
              type="button"
              onClick={onOpenCreateDeck}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm shadow-emerald-500/20 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>+ New Deck</span>
            </button>
          </div>
        </div>
      </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 flex items-center justify-between border-t-2 border-t-sky-400/70">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400 block mb-1">
              Total Cards
            </span>
            <span className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums block">
              {cardsCount}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mt-0.5">In current study set</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-800/50 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

                <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 flex items-center justify-between border-t-2 border-t-amber-400/70">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400 block mb-1">
              Cards Due Today
            </span>
            <span className="font-display text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 tabular-nums block">
              {cardsDue}
            </span>
            <span className="text-[11px] text-amber-600/90 dark:text-amber-400/90 font-medium block mt-0.5">Spaced repetition queue</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/50 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

                <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 flex items-center justify-between border-t-2 border-t-emerald-400/70">
          <div className="flex-1 pr-3">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400 block">
                Mastery Rate
              </span>
              <span className="font-display text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums block">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
