import React from 'react';
import { RotateCw, HelpCircle, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { FlashcardItem, CardStudyStatus } from '../types/flashcard';

interface FlashcardProps {
  card: FlashcardItem;
  isFlipped: boolean;
  onFlip: () => void;
  status: CardStudyStatus;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  card,
  isFlipped,
  onFlip,
  status,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onFlip();
    }
  };

  return (
    <div className="w-full select-none" style={{ perspective: '1400px' }}>
      <div
        role="button"
        tabIndex={0}
        onClick={onFlip}
        onKeyDown={handleKeyDown}
        aria-label={`Flashcard: ${isFlipped ? 'Answer' : 'Question'}. Press space or enter to flip.`}
        className="relative w-full min-h-[290px] sm:min-h-[330px] md:min-h-[360px] cursor-pointer rounded-3xl transition-transform duration-500 ease-out transform-style-3d group focus:outline-none focus:ring-4 focus:ring-emerald-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.1)]"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
                <div
          className={`absolute inset-0 w-full h-full rounded-3xl p-7 sm:p-9 flex flex-col justify-between backface-hidden border transition-all duration-300 shadow-md ${
            isFlipped ? 'pointer-events-none' : ''
          } ${
            status === 'known'
              ? 'bg-gradient-to-b from-white to-emerald-50/60 dark:from-[#0d1612] dark:to-[#08100c] border-emerald-300 dark:border-emerald-600/60 ring-2 ring-emerald-200/50 dark:ring-emerald-900/40'
              : status === 'wrong'
              ? 'bg-gradient-to-b from-white to-rose-50/60 dark:from-[#180c0e] dark:to-[#100709] border-rose-300 dark:border-rose-600/60 ring-2 ring-rose-200/50 dark:ring-rose-900/40'
              : 'bg-white/95 dark:bg-[#111111] border-slate-200/90 dark:border-neutral-800 hover:border-emerald-300/80 dark:hover:border-emerald-500/50'
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-neutral-400">
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                Prompt & Recall
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-neutral-600">·</span>
              <span className="text-slate-400 dark:text-neutral-500 font-normal">Active Memory Test</span>
            </div>

                        {status === 'known' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Recalled
              </span>
            )}
            {status === 'wrong' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <XCircle className="w-4 h-4 text-rose-500" />
                Flagged for Review
              </span>
            )}
          </div>

                    <div className="my-auto py-6 px-2">
            <p className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-relaxed text-center max-w-2xl mx-auto">
              {card.question}
            </p>
          </div>

                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors pt-2 border-t border-slate-100/80 dark:border-neutral-800">
            <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
            <span className="font-medium">Click card or press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-[10px] font-mono text-slate-600 dark:text-neutral-300">Space</kbd> to reveal answer</span>
          </div>
        </div>

                <div
          className={`absolute inset-0 w-full h-full rounded-3xl p-7 sm:p-9 flex flex-col justify-between backface-hidden border transition-all duration-300 shadow-md ${
            !isFlipped ? 'pointer-events-none' : ''
          } ${
            status === 'known'
              ? 'bg-gradient-to-b from-white to-emerald-50/70 dark:from-[#0d1612] dark:to-[#08100c] border-emerald-300 dark:border-emerald-600/60 ring-2 ring-emerald-200/50 dark:ring-emerald-900/40'
              : status === 'wrong'
              ? 'bg-gradient-to-b from-white to-rose-50/70 dark:from-[#180c0e] dark:to-[#100709] border-rose-300 dark:border-rose-600/60 ring-2 ring-rose-200/50 dark:ring-rose-900/40'
              : 'bg-gradient-to-b from-white to-slate-50/80 dark:from-[#111111] dark:to-[#0d0d0d] border-slate-200/90 dark:border-neutral-800'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-neutral-400">
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                Target Answer & Model Solution
              </span>
            </div>

            {status === 'known' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Correct
              </span>
            )}
            {status === 'wrong' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <XCircle className="w-4 h-4 text-rose-500" />
                Needs Review
              </span>
            )}
          </div>

                    <div className="my-auto py-6 px-2 overflow-y-auto max-h-[220px]">
            <p className="text-base sm:text-lg md:text-xl text-slate-800 dark:text-neutral-100 leading-relaxed text-center font-normal max-w-2xl mx-auto">
              {card.answer}
            </p>
          </div>

                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors pt-2 border-t border-slate-100/80 dark:border-neutral-800">
            <RotateCw className="w-3.5 h-3.5 group-hover:-rotate-180 transition-transform duration-500" />
            <span className="font-medium">Click card to flip back to question</span>
          </div>
        </div>
      </div>
    </div>
  );
};
