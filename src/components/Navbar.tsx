import React from 'react';
import {
  GraduationCap,
  Sun,
  Moon,
  Clock,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { Deck } from '../types/flashcard';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenHistory: () => void;
  onGoHome: () => void;
  isStudyView?: boolean;
  onResetStudy?: () => void;
  decks: Deck[];
  currentDeck: Deck;
  onSelectDeck: (deckId: string) => void;
  currentScreenView: string;
  onSetScreenView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDark,
  onToggleTheme,
  onOpenHistory,
  onGoHome,
  isStudyView,
  onResetStudy,
  currentScreenView,
  onSetScreenView,
}) => {
  return (
    <header className="w-full bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <div
          onClick={onGoHome}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white block leading-tight">
              StudyFlow
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 block -mt-0.5 font-medium">
              Study workspace
            </span>
          </div>
        </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="relative group">
            <button
              type="button"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Preview any of the 9 required screens"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span className="capitalize">
                {currentScreenView === 'home'
                  ? 'Screen 1: Landing'
                  : currentScreenView === 'loading'
                  ? 'Screen 2: Loading'
                  : currentScreenView === 'study-question'
                  ? 'Screen 3: Question'
                  : currentScreenView === 'study-answer'
                  ? 'Screen 4: Answer'
                  : currentScreenView === 'complete'
                  ? 'Screen 5: Complete'
                  : currentScreenView === 'review-missed'
                  ? 'Screen 6: Review'
                  : currentScreenView === 'error-states'
                  ? 'Screen 7: Error States'
                  : 'Screens'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

                        <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-1.5 hidden group-hover:block z-50 animate-fadeIn">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Switch UI Screen View
              </div>
              {[
                { id: 'home', label: '1. Landing / Input Dashboard' },
                { id: 'loading', label: '2. Generation Loading State' },
                { id: 'study-question', label: '3. Flashcard (Question Side)' },
                { id: 'study-answer', label: '4. Flashcard (Answer Side)' },
                { id: 'complete', label: '5. Study Complete Screen' },
                { id: 'review-missed', label: '6. Review Missed Cards' },
                { id: 'error-states', label: '7. Error States Page' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSetScreenView(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                    currentScreenView === item.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

                    {isStudyView && onResetStudy && (
            <button
              type="button"
              onClick={onResetStudy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Reset study session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

                    <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle dark mode"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode (Screen 8)'}
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

                    <button
            type="button"
            onClick={onOpenHistory}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Study History & Saved Decks"
            title="Recent study sets & topics"
          >
            <Clock className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
