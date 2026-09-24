import React, { useState } from 'react';
import { AlertTriangle, FileText, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

interface ErrorStatesViewProps {
  onRetry: () => void;
  onGoHome: () => void;
  technicalError?: string;
}

export const ErrorStatesView: React.FC<ErrorStatesViewProps> = ({
  onRetry,
  onGoHome,
  technicalError = 'Invalid response format: Missing required question/answer array schema',
}) => {
  const [showTechDetails, setShowTechDetails] = useState<boolean>(false);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 space-y-6 animate-fadeIn">
            <div>
        <button
          type="button"
          onClick={onGoHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to generator</span>
        </button>
      </div>

            <div className="text-center sm:text-left space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Error States
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Graceful fallback handling for AI response parsing and empty inputs.
        </p>
      </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between text-center space-y-5">
          <div className="space-y-3 pt-2">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900 flex items-center justify-center text-rose-500 shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Something went wrong
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
              We couldn't generate a valid study set from the AI response. Your topic is still here, so you can try again.
            </p>
          </div>

          <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={onRetry}
                className="px-5 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#5457e5] text-white font-semibold text-xs sm:text-sm shadow-sm transition active:scale-95"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={onGoHome}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                Back to home
              </button>
            </div>

                        <div className="pt-2 text-left border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowTechDetails(!showTechDetails)}
                className="w-full flex items-center justify-between text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <span>Technical details</span>
                {showTechDetails ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {showTechDetails && (
                <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-rose-600 dark:text-rose-400 break-all">
                  {technicalError}
                </div>
              )}
            </div>
          </div>
        </div>

                <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between text-center space-y-5">
          <div className="space-y-3 pt-2">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-xs">
              <FileText className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No flashcards generated
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
              We couldn't create any flashcards from your input. Try adding more detail to your topic or notes.
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={onRetry}
              className="px-6 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#5457e5] text-white font-semibold text-xs sm:text-sm shadow-sm transition active:scale-95"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
