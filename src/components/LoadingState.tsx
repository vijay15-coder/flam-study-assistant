import React, { useEffect, useState } from 'react';
import { Check, Lightbulb, X } from 'lucide-react';

interface LoadingStateProps {
  topic: string;
  onCancel?: () => void;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ topic, onCancel }) => {
  const [step, setStep] = useState<number>(2);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(2), 1200);
    const timer2 = setTimeout(() => setStep(3), 3200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto py-8 sm:py-14 text-center space-y-8 animate-fadeIn">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-slate-100 dark:border-slate-800" />
        <div className="absolute w-16 h-16 rounded-full border-4 border-transparent border-t-[#6366f1] border-r-[#8b5cf6] animate-spin" />
      </div>

            <div className="space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Generating your study set
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Turning your topic into interactive flashcards...
        </p>
      </div>

            <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm text-left max-w-md mx-auto space-y-4">
                <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[#3b82f6] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Processing your input
          </span>
        </div>

                <div className="flex items-center gap-3">
          {step >= 2 ? (
            <div className="w-6 h-6 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center flex-shrink-0 animate-pulse">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 flex-shrink-0" />
          )}
          <span
            className={`text-sm font-semibold ${
              step >= 2
                ? 'text-[#8b5cf6] dark:text-[#a78bfa]'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            Creating flashcards
          </span>
        </div>

                <div className="flex items-center gap-3">
          {step >= 3 ? (
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-700 flex-shrink-0" />
          )}
          <span
            className={`text-sm font-semibold ${
              step >= 3
                ? 'text-slate-800 dark:text-slate-200'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            Finalizing your study set
          </span>
        </div>
      </div>

            <div className="bg-[#eff6ff] dark:bg-blue-950/40 border border-[#bfdbfe] dark:border-blue-900/60 rounded-2xl px-5 py-3.5 max-w-md mx-auto flex items-center gap-3 text-left">
        <Lightbulb className="w-5 h-5 text-[#3b82f6] flex-shrink-0" />
        <p className="text-xs text-[#1e40af] dark:text-blue-300 font-medium leading-relaxed">
          This may take a few seconds... We're using AI to create a structured study set.
        </p>
      </div>

            {onCancel && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline font-medium"
          >
            Cancel generation
          </button>
        </div>
      )}
    </div>
  );
};
