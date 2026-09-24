import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Play,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { Deck } from '../../types/flashcard';

interface OverviewViewProps {
  decks: Deck[];
  onSelectDeck: (deckId: string) => void;
  onOpenStudy: (deckId: string, mode: 'smart_study' | 'practice' | 'quiz') => void;
  onOpenCreateDeck: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  decks,
  onSelectDeck,
  onOpenStudy,
  onOpenCreateDeck,
}) => {
  const primaryDeck = decks[0];
  const totalCards = decks.reduce((acc, d) => acc + d.cards.length, 0);
  const totalDue = decks.reduce((acc, d) => acc + (d.cardsDue ?? d.cards.length), 0);
  const masteredCards = Math.max(0, totalCards - totalDue);

  return (
    <div className="space-y-6 animate-fadeIn">
            <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-slate-200/80 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.05)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-100/40 via-teal-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Study overview
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500 font-normal">{decks.length} saved decks</span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">
              {totalDue} cards are currently due for review. Open a deck to start a session.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCreateDeck}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all duration-200 active:scale-95 flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate New Deck</span>
          </button>
        </div>
      </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 flex items-center justify-between border border-slate-200/80 dark:border-neutral-800">
          <div>
            <span className="text-xs text-slate-400 dark:text-neutral-500 font-semibold block">Saved decks</span>
            <span className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5 block tabular-nums">{decks.length}</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400 border border-orange-100 dark:border-orange-900/40 flex items-center justify-center shadow-xs">
            <Layers className="w-5 h-5 text-orange-500" />
          </div>
        </div>

        <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 flex items-center justify-between border border-slate-200/80 dark:border-neutral-800">
          <div>
            <span className="text-xs text-slate-400 dark:text-neutral-500 font-semibold block">Total cards</span>
            <span className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5 block tabular-nums">{totalCards}</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/40 flex items-center justify-center shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 flex items-center justify-between border border-slate-200/80 dark:border-neutral-800">
          <div>
            <span className="text-xs text-slate-400 dark:text-neutral-500 font-semibold block">Cards due</span>
            <span className="font-display text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block tabular-nums">{totalDue}</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 flex items-center justify-between border border-slate-200/80 dark:border-neutral-800">
          <div>
            <span className="text-xs text-slate-400 dark:text-neutral-500 font-semibold block">Reviewed</span>
            <span className="font-display text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-0.5 block tabular-nums">{masteredCards}</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

            {primaryDeck && (
        <div className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-100/80 dark:border-emerald-900/40 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
              {primaryDeck.icon || '🌐'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Current deck
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-neutral-600">·</span>
                <span className="text-slate-500 dark:text-neutral-400">{primaryDeck.cards.length} cards</span>
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">{primaryDeck.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 line-clamp-1 max-w-xl">
                {primaryDeck.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              type="button"
              onClick={() => onOpenStudy(primaryDeck.id, 'smart_study')}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all duration-200 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Session</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectDeck(primaryDeck.id)}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-200 font-medium text-xs sm:text-sm transition-all duration-200 shadow-xs active:scale-95"
            >
              <span>View Cards</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

            <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-black text-slate-900 dark:text-white tracking-tight">Your Decks</h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400">Available study sets for this curriculum</p>
          </div>
          <span className="text-xs text-slate-400 dark:text-neutral-500 font-medium">{decks.length} Decks</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-200/80 dark:border-neutral-800 flex flex-col justify-between space-y-4 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100/80 dark:bg-neutral-800/80 border border-slate-200/70 dark:border-neutral-700 flex items-center justify-center text-xl flex-shrink-0">
                    {deck.icon || '📚'}
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">{deck.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5 line-clamp-2 leading-relaxed">{deck.description}</p>
                  </div>
                </div>

                {deck.bookmarked && (
                  <span className="text-amber-500 text-sm" title="Bookmarked">
                    ★
                  </span>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500 dark:text-neutral-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    {deck.cards.length} cards
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {deck.cardsDue ?? deck.cards.length} due
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {deck.progress ?? 0}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenStudy(deck.id, 'quiz')}
                    className="px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-medium transition active:scale-95"
                  >
                    Quiz
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectDeck(deck.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white font-semibold transition shadow-xs active:scale-95"
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
