import React from 'react';
import { Play, Check, Sparkles, Shuffle, Target, MessageCircleQuestion, ClipboardCheck } from 'lucide-react';
import { Deck } from '../types/flashcard';

interface StudyModesProps {
  deck: Deck;
  onStartSmartStudy: () => void;
  onStartPractice: () => void;
  onStartQuiz: () => void;
  onStartInterview: () => void;
  onStartExam: () => void;
}

export const StudyModes: React.FC<StudyModesProps> = ({
  deck,
  onStartSmartStudy,
  onStartPractice,
  onStartQuiz,
  onStartInterview,
  onStartExam,
}) => {
  const cardsCount = deck?.cards?.length ?? 0;
  const cardsDue = deck?.cardsDue ?? cardsCount;

  return (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Study Modes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Choose your learning flow for <span className="font-medium text-slate-700 dark:text-slate-200">{deck.title}</span>
          </p>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {cardsCount} flashcards available
        </span>
      </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              <div className="glass-card glass-card-hover rounded-[1.75rem] p-5 sm:p-6 min-h-[370px] flex flex-col justify-between text-left space-y-6 relative overflow-hidden group border border-emerald-100/60 dark:border-emerald-900/40 hover:border-emerald-300/80 dark:hover:border-emerald-700/60">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/40 dark:bg-emerald-900/20 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-200/50 transition-colors" />

          <div className="space-y-4 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60 flex items-center justify-center shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{cardsDue} cards due</span>
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Smart Study
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Review due cards in order and mark the ones you know.
              </p>
            </div>

                        <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pt-2 border-t border-slate-100 dark:border-neutral-800">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Work through the due cards</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Mark cards as known or review</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>See your deck progress</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={onStartSmartStudy}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-sm shadow-emerald-500/20 transition-all duration-200 active:scale-[0.98] relative z-10"
          >
            <Play className="w-4 h-4 fill-white text-white" />
            <span>Launch Smart Study</span>
          </button>
        </div>

                <div className="glass-card glass-card-hover rounded-[1.75rem] p-5 sm:p-6 min-h-[370px] flex flex-col justify-between text-left space-y-6 relative overflow-hidden group border border-indigo-100/60 dark:border-indigo-900/40 hover:border-indigo-300/80 dark:hover:border-indigo-700/60">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/40 dark:bg-indigo-900/20 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-200/50 transition-colors" />

          <div className="space-y-4 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 flex items-center justify-center shadow-xs">
              <Shuffle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-indigo-700 dark:text-indigo-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Full deck · {cardsCount} cards</span>
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Practice Hall
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Free-form, low-pressure review with instant flips and optional miss-only drills.
              </p>
            </div>

                        <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pt-2 border-t border-slate-100 dark:border-neutral-800">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span>All flashcards without queue limits</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span>Instant keyboard shortcut support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span>Targeted wrong-answer filter round</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={onStartPractice}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-sm shadow-indigo-500/20 transition-all duration-200 active:scale-[0.98] relative z-10"
          >
            <Play className="w-4 h-4 fill-white text-white" />
            <span>Enter Practice Hall</span>
          </button>
        </div>

                <div className="glass-card glass-card-hover rounded-[1.75rem] p-5 sm:p-6 min-h-[370px] flex flex-col justify-between text-left space-y-6 relative overflow-hidden group border border-amber-100/60 dark:border-amber-900/40 hover:border-amber-300/80 dark:hover:border-amber-700/60">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/40 dark:bg-amber-900/20 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-200/50 transition-colors" />

          <div className="space-y-4 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/60 flex items-center justify-center shadow-xs">
              <Target className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Exam simulator format</span>
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Quiz Arena
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Test active comprehension under exam conditions with AI-generated distractors.
              </p>
            </div>

                        <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pt-2 border-t border-slate-100 dark:border-neutral-800">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <span>4-option multiple choice evaluation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <span>Instant rationale explanations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <span>See your score at the end</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={onStartQuiz}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-sm shadow-sm shadow-amber-500/20 transition-all duration-200 active:scale-[0.98] relative z-10"
          >
            <Play className="w-4 h-4 fill-white text-white" />
            <span>Launch Quiz Arena</span>
          </button>
        </div>

                <div className="glass-card glass-card-hover rounded-[1.75rem] p-5 sm:p-6 min-h-[370px] flex flex-col justify-between text-left space-y-6 relative overflow-hidden group border border-cyan-100/60 dark:border-cyan-900/40 hover:border-cyan-300/80 dark:hover:border-cyan-700/60">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-100/40 dark:bg-cyan-900/20 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-200/50 transition-colors" />
          <div className="space-y-4 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-800/60 flex items-center justify-center shadow-xs">
              <MessageCircleQuestion className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-cyan-700 dark:text-cyan-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span>{cardsCount} prompts from this deck</span>
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Interview Questions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Practice explaining the concepts clearly, like you would in a technical interview.</p>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pt-2 border-t border-slate-100 dark:border-neutral-800">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" /><span>All interview prompts in one page</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" /><span>Reveal model answers on demand</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" /><span>Review by difficulty and topic</span></li>
            </ul>
          </div>
          <button type="button" onClick={onStartInterview} className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-semibold text-sm shadow-sm shadow-cyan-500/20 transition-all duration-200 active:scale-[0.98] relative z-10">
            <MessageCircleQuestion className="w-4 h-4" />
            <span>Open Interview Bank</span>
          </button>
        </div>

                <div className="glass-card glass-card-hover rounded-[1.75rem] p-5 sm:p-6 min-h-[370px] flex flex-col justify-between text-left space-y-6 relative overflow-hidden group border border-rose-100/60 dark:border-rose-900/40 hover:border-rose-300/80 dark:hover:border-rose-700/60">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/40 dark:bg-rose-900/20 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-200/50 transition-colors" />
          <div className="space-y-4 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800/60 flex items-center justify-center shadow-xs">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-rose-700 dark:text-rose-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>{cardsCount} questions from this deck</span>
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Exam Questions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Work through the complete exam-focused question set and check your reasoning after each response.</p>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pt-2 border-t border-slate-100 dark:border-neutral-800">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0" /><span>Complete exam question coverage</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0" /><span>Answer key for every question</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0" /><span>Difficulty labels for prioritization</span></li>
            </ul>
          </div>
          <button type="button" onClick={onStartExam} className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-semibold text-sm shadow-sm shadow-rose-500/20 transition-all duration-200 active:scale-[0.98] relative z-10">
            <ClipboardCheck className="w-4 h-4" />
            <span>Open Exam Bank</span>
          </button>
        </div>
      </div>
    </div>
  );
};
