import React, { useState } from 'react';
import { Target, Play, Trophy, Sparkles, Award, Layers, ChevronDown } from 'lucide-react';
import { Deck } from '../../types/flashcard';
import { QuizView } from '../QuizView';

interface QuizzesViewProps {
  decks: Deck[];
  currentDeck: Deck;
  onSelectDeck: (deckId: string) => void;
}

export const QuizzesView: React.FC<QuizzesViewProps> = ({
  decks,
  currentDeck,
  onSelectDeck,
}) => {
  const [activeQuizDeck, setActiveQuizDeck] = useState<Deck | null>(null);
  const [showDeckSelector, setShowDeckSelector] = useState(false);

  if (activeQuizDeck) {
    return (
      <div className="space-y-4 animate-fadeIn">
        <QuizView
          cards={activeQuizDeck.cards}
          deckTitle={activeQuizDeck.title}
          onBack={() => setActiveQuizDeck(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.05)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-blue-100/35 via-teal-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-blue-600 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Multiple-choice quiz
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 font-normal">
              Active Focus: {currentDeck.title}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Quiz Arena</h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Answer questions from a deck and see your score when you finish.
          </p>
        </div>

                <div className="relative z-10">
          <button
            type="button"
            onClick={() => setShowDeckSelector(!showDeckSelector)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-all duration-200 active:scale-95"
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Target: {currentDeck.title.substring(0, 16)}...</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showDeckSelector ? 'rotate-180' : ''}`} />
          </button>

          {showDeckSelector && (
            <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl z-30 p-2 space-y-1 animate-fadeIn">
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Select Active Topic
              </span>
              {decks.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    onSelectDeck(d.id);
                    setShowDeckSelector(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                    d.id === currentDeck.id
                      ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{d.title}</span>
                  <span className="text-[10px] text-slate-400">{d.cards.length} cards</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

            <div className="rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span>Current deck</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-black tracking-tight">
            Ready to test {currentDeck.title}? {currentDeck.icon}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-lg leading-relaxed">
            {currentDeck.cards.length} questions from this deck.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveQuizDeck(currentDeck)}
          className="px-6 py-3 rounded-xl bg-white text-emerald-900 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2 flex-shrink-0 relative z-10"
        >
          <Play className="w-4 h-4 fill-emerald-900" />
          <span>Launch {currentDeck.title.substring(0, 16)} Quiz</span>
        </button>
      </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {decks.map((deck) => (
          <div
            key={deck.id}
            className={`glass-card glass-card-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-all duration-200 ${
              deck.id === currentDeck.id ? 'border-emerald-300 ring-2 ring-emerald-500/20' : 'border-slate-200/80'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-xl shadow-xs">
                  {deck.icon || <Target className="w-5 h-5" />}
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
                  {deck.cards.length} Questions
                </span>
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">{deck.title} Quiz</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{deck.description}</p>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Multiple Choice
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Trophy className="w-3.5 h-3.5 text-emerald-500" />
                  {deck.cards.length} questions
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveQuizDeck(deck)}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all duration-200 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start {deck.title} Quiz</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
