import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { FlashcardItem, CardStudyStatus, CardStateRecord } from '../types/flashcard';
import { Flashcard } from './Flashcard';

interface FlashcardDeckProps {
  cards: FlashcardItem[];
  topic: string;
  onResetTopic: () => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  cards,
  topic,
  onResetTopic,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const [cardStatuses, setCardStatuses] = useState<CardStateRecord>({});
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const wrongCards = cards.filter((c) => cardStatuses[c.id] === 'wrong');
  const activeDeck: FlashcardItem[] = isReviewMode ? wrongCards : cards;

  useEffect(() => {
    if (currentIndex >= activeDeck.length && activeDeck.length > 0) {
      setCurrentIndex(activeDeck.length - 1);
    }
    setIsFlipped(false);
  }, [activeDeck.length, currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === ' ' && !showSummary) {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, activeDeck.length, showSummary]);

  const currentCard = activeDeck[currentIndex];
  const currentCardStatus: CardStudyStatus = currentCard
    ? cardStatuses[currentCard.id] || 'unanswered'
    : 'unanswered';

  const knownCount = cards.filter((c) => cardStatuses[c.id] === 'known').length;
  const wrongCount = cards.filter((c) => cardStatuses[c.id] === 'wrong').length;
  const answeredCount = knownCount + wrongCount;
  const progressPercent = activeDeck.length > 0 ? Math.round(((currentIndex + 1) / activeDeck.length) * 100) : 0;

  const handleNext = () => {
    if (currentIndex < activeDeck.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const markCard = (status: 'known' | 'wrong') => {
    if (!currentCard) return;

    setCardStatuses((prev) => ({
      ...prev,
      [currentCard.id]: status,
    }));

    setTimeout(() => {
      if (currentIndex < activeDeck.length - 1) {
        setIsFlipped(false);
        setCurrentIndex((prev) => prev + 1);
      } else {
        setShowSummary(true);
      }
    }, 250);
  };

  const startReviewWrongAnswers = () => {
    setIsReviewMode(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowSummary(false);
  };

  const exitReviewMode = () => {
    setIsReviewMode(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowSummary(false);
  };

  const restartDeck = () => {
    setCardStatuses({});
    setIsReviewMode(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowSummary(false);
  };

  if (isReviewMode && wrongCards.length === 0 && !showSummary) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No Incorrect Cards Left!</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          You have successfully answered all previously missed cards. Fantastic recall work!
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={exitReviewMode}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition"
          >
            Return to Full Deck
          </button>
        </div>
      </div>
    );
  }

  if (showSummary) {
    const accuracy = cards.length > 0 ? Math.round((knownCount / cards.length) * 100) : 0;

    return (
      <div className="w-full glass-card rounded-3xl p-8 sm:p-10 space-y-7 animate-fadeIn border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3 relative z-10">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-200/70 flex items-center justify-center text-amber-600 shadow-sm">
            <Trophy className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isReviewMode ? 'Review Round Complete!' : 'Deck Mastery Complete!'}
          </h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Active recall session logged for <span className="font-semibold text-slate-800">"{topic}"</span>.
          </p>
        </div>

                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto py-1 relative z-10">
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-center">
            <span className="block font-display text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">{cards.length}</span>
            <span className="text-xs font-semibold text-slate-500">Total Cards</span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-center">
            <span className="block font-display text-2xl sm:text-3xl font-black text-emerald-600 tabular-nums">{knownCount}</span>
            <span className="text-xs font-semibold text-emerald-700">Recalled</span>
          </div>
          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 text-center">
            <span className="block font-display text-2xl sm:text-3xl font-black text-rose-600 tabular-nums">{wrongCount}</span>
            <span className="text-xs font-semibold text-rose-700">Needs Review</span>
          </div>
        </div>

                <div className="max-w-md mx-auto space-y-2 relative z-10">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Session accuracy</span>
            <span className="text-slate-900 font-bold tabular-nums">{accuracy}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex p-0.5">
            <div
              style={{ width: `${(knownCount / cards.length) * 100}%` }}
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            />
            <div
              style={{ width: `${(wrongCount / cards.length) * 100}%` }}
              className="h-full bg-rose-400 rounded-full transition-all duration-500"
            />
          </div>
        </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto relative z-10">
          {wrongCount > 0 && (
            <button
              onClick={startReviewWrongAnswers}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-all duration-200 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Review Wrong ({wrongCount})
            </button>
          )}

          <button
            onClick={restartDeck}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all duration-200 shadow-xs active:scale-95"
          >
            <RotateCw className="w-4 h-4" />
            Restart Deck
          </button>

          <button
            onClick={onResetTopic}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-200 shadow-sm active:scale-95"
          >
            Back to Overview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5 animate-fadeIn">
            {isReviewMode && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Targeted drill: reviewing {wrongCards.length} missed card{wrongCards.length > 1 ? 's' : ''}</span>
          </div>
          <button
            onClick={exitReviewMode}
            className="underline hover:text-amber-950 text-xs font-semibold"
          >
            Exit Review Mode
          </button>
        </div>
      )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-card p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onResetTopic}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1 text-xs font-semibold"
            title="Back to Deck Overview"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </button>

          <div className="min-w-0">
            <span className="text-[10px] font-bold text-emerald-600 block">
              Active Recall Session
            </span>
            <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 truncate" title={topic}>
              {topic}
            </h3>
          </div>
        </div>

                <div className="flex items-center gap-2 text-xs flex-shrink-0">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {knownCount} Mastered
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            {wrongCount} Review
          </span>
          {wrongCount > 0 && !isReviewMode && (
            <button
              onClick={startReviewWrongAnswers}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition font-medium text-xs active:scale-95"
              title="Filter to only incorrect cards"
            >
              <RotateCcw className="w-3 h-3" />
              Filter Missed
            </button>
          )}
        </div>
      </div>

            <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>
            Card <span className="text-slate-900 font-bold">{currentIndex + 1}</span> of{' '}
            <span className="text-slate-900 font-bold">{activeDeck.length}</span>
          </span>
          <span className="text-slate-700">{progressPercent}% complete</span>
        </div>
        <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

            {currentCard && (
        <Flashcard
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          status={currentCardStatus}
        />
      )}

            <div className="space-y-4 pt-1">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => markCard('wrong')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 shadow-sm active:scale-[0.98] ${
              currentCardStatus === 'wrong'
                ? 'bg-rose-600 border-rose-600 text-white shadow-rose-200'
                : 'bg-white hover:bg-rose-50 border-rose-200/90 text-rose-700'
            }`}
          >
            <XCircle className="w-4 h-4" />
            <span>Needs Review</span>
          </button>

          <button
            type="button"
            onClick={() => markCard('known')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 shadow-sm active:scale-[0.98] ${
              currentCardStatus === 'known'
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-200'
                : 'bg-white hover:bg-emerald-50 border-emerald-200/90 text-emerald-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>I Knew It</span>
          </button>
        </div>

                <div className="flex items-center justify-between max-w-md mx-auto pt-1">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            type="button"
            onClick={handleFlip}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100/70 transition shadow-xs active:scale-95"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Flip Card</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-xs active:scale-95"
          >
            {currentIndex === activeDeck.length - 1 ? (
              <>
                <span>Complete</span>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </>
            ) : (
              <>
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
