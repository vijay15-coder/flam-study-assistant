import React, { useState } from 'react';
import { AlertTriangle, RotateCw, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onEditPrompt?: () => void;
  topic?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  onEditPrompt,
  topic,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const isValidationError =
    error.includes('JSON') ||
    error.includes('cards') ||
    error.includes('question') ||
    error.includes('answer') ||
    error.includes('shape');
  const isCardCountError = error.includes('fewer than') || error.includes('minimum') || error.includes('flashcard collection');
  const isNetworkError = error.includes('Network') || error.includes('connection');

  return (
    <div className="w-full bg-white rounded-2xl border border-rose-200 shadow-sm p-6 sm:p-8 space-y-5 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 flex-shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="text-lg font-bold text-slate-900">Flashcard Generation Failed</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
              {isCardCountError ? 'Card Count Issue' : isValidationError ? 'Data Validation Error' : isNetworkError ? 'Network Issue' : 'Request Failed'}
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            {isCardCountError
              ? 'The AI returned fewer cards than expected, so the deck could not be completed safely. Please retry the request.'
              : isValidationError
              ? 'The AI response did not pass our strict data validation checks. Malformed data was blocked to prevent the application from rendering incorrect flashcards.'
              : isNetworkError
              ? 'Could not connect to the backend server. Please make sure the service is running.'
              : 'An unexpected error occurred while processing your flashcards.'}
          </p>

          {topic && (
            <p className="text-xs text-slate-500 pt-1">
              Attempted topic: <span className="font-semibold text-slate-700">"{topic}"</span>
            </p>
          )}
        </div>
      </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-left">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-800"
        >
          <span>Error Details</span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showDetails && (
          <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-rose-700 font-mono break-words bg-white p-2.5 rounded-lg border border-rose-100">
            {error}
          </div>
        )}
      </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        {onEditPrompt && (
          <button
            type="button"
            onClick={onEditPrompt}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-300 hover:bg-slate-50 text-slate-700 transition"
          >
            <Edit3 className="w-4 h-4" />
            Edit Topic
          </button>
        )}

        <button
          type="button"
          onClick={onRetry}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition active:scale-[0.98]"
        >
          <RotateCw className="w-4 h-4" />
          Retry Request
        </button>
      </div>
    </div>
  );
};
