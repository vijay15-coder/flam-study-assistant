import React, { useState, useEffect } from 'react';
import {
  Brain,
  Lightbulb,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  Sparkles,
  Layers,
  ChevronDown,
  Send,
  BookOpen,
} from 'lucide-react';
import { Deck, FlashcardItem } from '../../types/flashcard';

interface AITutorViewProps {
  currentDeck: Deck;
  allDecks: Deck[];
  onSelectDeck: (deckId: string) => void;
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  currentDeck,
  allDecks,
  onSelectDeck,
}) => {
  const cards = currentDeck.cards;
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [revealedCheck, setRevealedCheck] = useState(false);
  const [showDeckSelector, setShowDeckSelector] = useState(false);

  const [customQuestion, setCustomQuestion] = useState('');
  const [customResponse, setCustomResponse] = useState<string | null>(null);
  const [isAnsweringCustom, setIsAnsweringCustom] = useState(false);

  useEffect(() => {
    setSelectedCardIndex(0);
    setRevealedCheck(false);
    setCustomResponse(null);
  }, [currentDeck.id]);

  const activeCard: FlashcardItem | undefined = cards[selectedCardIndex] || cards[0];

  const handleAskTutor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    setIsAnsweringCustom(true);
    setTimeout(() => {
      setCustomResponse(
        `Great question about ${currentDeck.title}! When thinking about "${customQuestion}", connect it back to the core concept: "${activeCard?.question}". Notice how the underlying mechanism ensures reliable invariants without unnecessary overhead. Try testing yourself on why this trade-off is critical in exam problems!`
      );
      setIsAnsweringCustom(false);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.05)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-100/35 via-teal-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-emerald-700 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-emerald-600" />
              Study helper
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 font-normal">
              Target: {currentDeck.title}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>AI Tutor: {currentDeck.title}</span>
            {currentDeck.icon && <span className="text-2xl">{currentDeck.icon}</span>}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Select a card to review its answer and write a follow-up question.
          </p>
        </div>

                <div className="relative z-10">
          <button
            type="button"
            onClick={() => setShowDeckSelector(!showDeckSelector)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-all duration-200 active:scale-95"
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Switch: {currentDeck.title.substring(0, 16)}...</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showDeckSelector ? 'rotate-180' : ''}`} />
          </button>

          {showDeckSelector && (
            <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl z-30 p-2 space-y-1 animate-fadeIn">
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Select deck
              </span>
              {allDecks.map((d) => (
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
          <div className="glass-card rounded-3xl p-5 border border-slate-200/80 dark:border-neutral-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-neutral-800">
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-neutral-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Curriculum Concepts</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-neutral-500">
                {cards.length} cards
              </span>
            </div>

            <div className="space-y-1.5 max-h-[490px] overflow-y-auto pr-1 custom-scrollbar">
              {cards.map((card, idx) => {
                const isSelected = idx === selectedCardIndex;
                return (
                  <button
                    key={card.id || idx}
                    type="button"
                    onClick={() => {
                      setSelectedCardIndex(idx);
                      setRevealedCheck(false);
                      setCustomResponse(null);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left text-xs transition-all duration-150 flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-700/70 text-emerald-100 font-semibold shadow-xs'
                        : 'bg-white/60 dark:bg-neutral-900/80 border-slate-200/70 dark:border-neutral-800 text-slate-700 dark:text-neutral-200 hover:bg-slate-100/80 dark:hover:bg-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="line-clamp-2 leading-relaxed">{card.question}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

                <div className="lg:col-span-2 space-y-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-neutral-800 shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-neutral-800 pb-4">
              <span className="text-xs font-semibold text-emerald-600 block mb-1">
                Concept {selectedCardIndex + 1} of {cards.length} · {currentDeck.title}
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-neutral-100 tracking-tight">
                {activeCard ? activeCard.question : 'No Concept Selected'}
              </h2>
            </div>

                        <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-emerald-950/25 border border-slate-200/70 dark:border-emerald-900/60 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Brain className="w-4 h-4" />
                <span>1. Core Mechanism & Answer</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-neutral-100 leading-relaxed font-normal">
                {activeCard?.answer}
              </p>
            </div>

                        <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/25 border border-amber-200/70 dark:border-amber-900/60 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" />
                <span>2. Example</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-neutral-100 leading-relaxed">
                Use the answer above to explain "{activeCard?.question}" in your own words and connect it to a real example.
              </p>
            </div>

                        <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/25 border border-rose-200/70 dark:border-rose-900/60 space-y-2">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>3. Common mistake</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-neutral-100 leading-relaxed">
                Check the definitions and boundary conditions before moving on to the next card.
              </p>
            </div>

                        <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/25 border border-blue-200/70 dark:border-blue-900/60 space-y-3">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>4. Active Recall Self-Check</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-neutral-100">
                "Can you articulate the underlying rationale without glancing at the solution?"
              </p>

              {revealedCheck ? (
                <div className="p-4 rounded-xl bg-white dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800 text-xs text-blue-950 dark:text-blue-100 space-y-1 animate-fadeIn shadow-xs">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle className="w-4 h-4" />
                    Verified Target Solution:
                  </span>
                  <p className="leading-relaxed text-slate-800 dark:text-neutral-100">{activeCard?.answer}</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setRevealedCheck(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-all duration-200 active:scale-95"
                >
                  Verify Your Recall
                </button>
              )}
            </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-neutral-800 space-y-3">
              <span className="text-xs font-bold text-slate-700 dark:text-neutral-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ask Socratic Tutor about {currentDeck.title}</span>
              </span>

              <form onSubmit={handleAskTutor} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Ask a follow-up about ${currentDeck.title}...`}
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200/90 dark:border-neutral-800 text-xs text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 bg-white dark:bg-neutral-950"
                />
                <button
                  type="submit"
                  disabled={isAnsweringCustom || !customQuestion.trim()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 disabled:opacity-50 active:scale-95 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </button>
              </form>

              {customResponse && (
                <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed animate-fadeIn shadow-xs">
                  <strong className="block mb-1 font-bold text-emerald-900 dark:text-emerald-200">AI Tutor Analysis:</strong>
                  {customResponse}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
