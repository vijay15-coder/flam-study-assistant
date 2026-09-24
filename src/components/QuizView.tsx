import React, { useState, useMemo } from 'react';
import { ChevronLeft, CheckCircle2, XCircle, Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import { FlashcardItem } from '../types/flashcard';

interface QuizViewProps {
  cards: FlashcardItem[];
  deckTitle: string;
  onBack: () => void;
}

interface QuestionData {
  id: string;
  question: string;
  correctAnswer: string;
  options: string[];
}

export const QuizView: React.FC<QuizViewProps> = ({ cards, deckTitle, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = useMemo<QuestionData[]>(() => {
    return cards.map((card, index) => {
      const otherAnswers = cards
        .filter((_, i) => i !== index)
        .map((c) => c.answer);

      const shuffledOthers = [...otherAnswers].sort(() => Math.random() - 0.5);
      const distractors = shuffledOthers.slice(0, 3);

      const fallbackOptions = [
        'None of the above',
        'Applies only in specific non-standard topologies',
        'Deprecated in modern protocols',
      ];
      while (distractors.length < 3) {
        const fb = fallbackOptions[distractors.length] || `Option ${distractors.length + 1}`;
        distractors.push(fb);
      }

      const options = [card.answer, ...distractors].sort(() => Math.random() - 0.5);

      return {
        id: card.id,
        question: card.question,
        correctAnswer: card.answer,
        options,
      };
    });
  }, [cards]);

  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="w-full glass-card rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 sm:p-10 max-w-xl mx-auto text-center space-y-6 animate-fadeIn relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-sm relative z-10">
          <Trophy className="w-8 h-8 text-amber-500" />
        </div>

        <div className="space-y-1.5 relative z-10">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Quiz Arena Completed!</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 font-medium">
            {deckTitle}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50/80 dark:bg-black/60 border border-slate-200/80 dark:border-neutral-800 max-w-xs mx-auto relative z-10">
          <span className="font-display text-4xl font-black text-slate-900 dark:text-white tabular-nums">{score} / {questions.length}</span>
          <span className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            Score: {percentage}% Accuracy
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
          <button
            type="button"
            onClick={handleRestart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all duration-200 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-[#1a1a1a] text-slate-700 dark:text-neutral-200 text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs active:scale-95"
          >
            <span>Back to Arena</span>
          </button>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn">
            <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-neutral-800 text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-all duration-150 shadow-xs active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Exit Quiz</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-neutral-400">
          <span>Question <strong className="text-slate-900 dark:text-white">{currentQuestionIndex + 1}</strong> of {questions.length}</span>
        </div>
      </div>

            <div className="glass-card rounded-3xl border border-slate-200/80 dark:border-neutral-800 shadow-sm p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase block mb-2">
            Multiple Choice Challenge
          </span>
          <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
            {currentQ.question}
          </h3>
        </div>

                <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === currentQ.correctAnswer;

            let buttonStyle = 'border-slate-200/80 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 bg-white dark:bg-[#121212] hover:bg-slate-50/70 dark:hover:bg-[#181818] text-slate-800 dark:text-neutral-200';
            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = 'border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-300 font-semibold shadow-xs';
              } else if (isSelected) {
                buttonStyle = 'border-rose-500 bg-rose-50/90 dark:bg-rose-950/50 text-rose-950 dark:text-rose-300';
              } else {
                buttonStyle = 'border-slate-200/60 dark:border-neutral-800 opacity-50 bg-slate-50/50 dark:bg-neutral-900/50 text-slate-400 dark:text-neutral-500';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelectOption(option)}
                className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all duration-150 flex items-start justify-between gap-3 active:scale-[0.99] ${buttonStyle}`}
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-neutral-300 flex-shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed mt-0.5">{option}</span>
                </div>

                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

                {isAnswered && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all duration-200 active:scale-95"
            >
              <span>{currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
