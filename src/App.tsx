import { useState, useRef, useEffect } from 'react';
import { Menu, Sun, Moon, Plus } from 'lucide-react';
import { Deck, ActiveStudyMode, FlashcardItem } from './types/flashcard';
import { DEFAULT_DECKS } from './data/defaultDecks';
import { generateFlashcards } from './lib/api';
import { validateResult } from './lib/validateResult';
import { useTheme } from './context/ThemeContext';
import { Sidebar, CLASS_OPTIONS, ClassOption } from './components/Sidebar';
import { DeckHeader } from './components/DeckHeader';
import { StudyModes } from './components/StudyModes';
import { FlashcardDeck } from './components/FlashcardDeck';
import { QuizView } from './components/QuizView';
import { CreateDeckModal } from './components/CreateDeckModal';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { LandingView } from './components/LandingView';
import { QuestionBankView } from './components/QuestionBankView';

import { OverviewView } from './components/views/OverviewView';
import { QuizzesView } from './components/views/QuizzesView';
import { PodcastView } from './components/views/PodcastView';
import { AITutorView } from './components/views/AITutorView';
import {
  LibraryView,
  ForumView,
  AnalyticsView,
  ChallengesView,
  PomodoroView,
} from './components/views/KnowledgeCenterViews';

export default function App() {
  const { theme, actualTheme, toggleTheme } = useTheme();
  const DECKS_STORAGE_KEY = 'goodoff_decks';

  const [showLanding, setShowLanding] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('decks');
  const [selectedClass, setSelectedClass] = useState<ClassOption>(CLASS_OPTIONS[0]);

  const [decks, setDecks] = useState<Deck[]>(() => {
    try {
      const stored = localStorage.getItem(DECKS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Deck[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      localStorage.removeItem(DECKS_STORAGE_KEY);
    }
    return DEFAULT_DECKS;
  });
  const [selectedDeckId, setSelectedDeckId] = useState<string>(() => {
    try {
      return localStorage.getItem('goodoff_selected_deck') || DEFAULT_DECKS[0].id;
    } catch {
      return DEFAULT_DECKS[0].id;
    }
  });
  const [activeStudyMode, setActiveStudyMode] = useState<ActiveStudyMode>('overview');

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState('');
  const [error, setError] = useState<string | null>(null);

  const activeRequestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const currentDeck = decks.find((d) => d.id === selectedDeckId) || decks[0];

  useEffect(() => {
    localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks));
  }, [decks]);

  useEffect(() => {
    localStorage.setItem('goodoff_selected_deck', selectedDeckId);
  }, [selectedDeckId]);

  const handleSelectClass = (cls: ClassOption) => {
    setSelectedClass(cls);
    if (cls.id === 'class-11-ds') {
      setSelectedDeckId('deck-binary-search');
    } else {
      setSelectedDeckId('deck-computer-networks');
    }
  };

  const handleGenerateDeck = async (
    targetTopic: string,
    simulationMode?: string
  ) => {
    const topicToUse = targetTopic.trim();
    if (!topicToUse) {
      setError('Please provide a study topic or notes.');
      return;
    }

    const requestId = ++activeRequestIdRef.current;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    setActiveTopic(topicToUse);
    setCreateModalOpen(false);

    try {
      const rawData = await generateFlashcards(
        topicToUse,
        controller.signal,
        simulationMode
      );

      if (activeRequestIdRef.current !== requestId) {
        console.warn(
          `[Stale Protection] Dropping obsolete response from request #${requestId} (current is #${activeRequestIdRef.current})`
        );
        return;
      }

      const validation = validateResult(rawData);
      if (!validation.isValid) {
        setError(validation.error);
        return;
      }

      const newDeckId = `deck-${Date.now()}`;
      const newDeck: Deck = {
        id: newDeckId,
        title: topicToUse.length > 36 ? `${topicToUse.substring(0, 36)}...` : topicToUse,
        description: `Active recall study deck generated for "${topicToUse}".`,
        icon: '✨',
        cards: validation.cards,
        cardsDue: validation.cards.length,
        progress: 0,
        bookmarked: false,
      };

      setDecks((prev) => [newDeck, ...prev]);
      setSelectedDeckId(newDeckId);
      setActiveNav('decks');
      setActiveStudyMode('overview');
      setError(null);
    } catch (err: unknown) {
      if (activeRequestIdRef.current !== requestId) return;

      const errorObj = err as Error;
      if (errorObj.name === 'AbortError' || errorObj.message === 'Request was cancelled.') {
        return;
      }

      setError(errorObj.message || 'An unexpected error occurred.');
    } finally {
      if (activeRequestIdRef.current === requestId) {
        setIsLoading(false);
      }
    }
  };

  const handleCancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleOpenWorkspace = (openCreateModal = false) => {
    setShowLanding(false);
    if (openCreateModal) setCreateModalOpen(true);
  };

  const handleToggleBookmark = () => {
    setDecks((prev) =>
      prev.map((d) =>
        d.id === currentDeck.id ? { ...d, bookmarked: !d.bookmarked } : d
      )
    );
  };

  const handleDeleteDeck = () => {
    if (decks.length <= 1) {
      setDecks([DEFAULT_DECKS[0]]);
      setSelectedDeckId(DEFAULT_DECKS[0].id);
      return;
    }
    const remaining = decks.filter((d) => d.id !== currentDeck.id);
    setDecks(remaining);
    setSelectedDeckId(remaining[0].id);
    setActiveStudyMode('overview');
  };

  const handleUpdateProgress = (newCards: FlashcardItem[]) => {
    setDecks((prev) =>
      prev.map((d) => {
        if (d.id === currentDeck.id) {
          const completed = Math.max(0, d.cards.length - newCards.length);
          const percent = Math.min(100, Math.round((completed / d.cards.length) * 100));
          return {
            ...d,
            cardsDue: newCards.length,
            progress: percent,
          };
        }
        return d;
      })
    );
  };

  return (
    showLanding ? (
      <LandingView
        isDark={actualTheme === 'dark'}
        onToggleTheme={toggleTheme}
        onOpenWorkspace={() => handleOpenWorkspace(false)}
        onCreateDeck={() => handleOpenWorkspace(true)}
      />
    ) : (
    <div
      className={`min-h-screen flex flex-col lg:flex-row font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-200 ${
        actualTheme === 'dark' ? 'bg-[#000000] text-neutral-100' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
            <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeNav={activeNav}
        onSelectNav={(nav) => {
          setActiveNav(nav);
          if (nav === 'decks') setActiveStudyMode('overview');
        }}
        onOpenCreateDeck={() => setCreateModalOpen(true)}
        selectedClass={selectedClass}
        onSelectClass={handleSelectClass}
        currentDeck={currentDeck}
        decks={decks}
        onSelectDeck={(deckId) => setSelectedDeckId(deckId)}
      />

            <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen relative overflow-x-hidden transition-colors duration-200 ${
          actualTheme === 'dark' ? 'bg-[#050505]' : 'bg-[#f8fafc]'
        }`}
      >
                {actualTheme === 'dark' ? (
          <>
            <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-gradient-to-bl from-emerald-500/10 via-neutral-900/10 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
            <div className="absolute top-[25%] left-0 w-[450px] h-[450px] bg-gradient-to-tr from-emerald-950/20 via-black to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
          </>
        ) : (
          <>
            <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-gradient-to-bl from-emerald-100/45 via-teal-50/35 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
            <div className="absolute top-[25%] left-0 w-[450px] h-[450px] bg-gradient-to-tr from-sky-100/40 via-indigo-50/20 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
          </>
        )}

                <header
          className={`lg:hidden flex items-center justify-between px-4 sm:px-5 py-3 border-b sticky top-0 z-30 shadow-xs backdrop-blur-xl transition-colors duration-200 ${
            actualTheme === 'dark'
              ? 'bg-[#000000]/90 text-white border-neutral-800/80'
              : 'bg-white/90 text-slate-900 border-slate-200/90'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-all duration-150 active:scale-95 ${
                actualTheme === 'dark'
                  ? 'hover:bg-neutral-800 text-neutral-300 hover:text-white'
                  : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-[0_0_14px_rgba(16,185,129,0.4)]">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    actualTheme === 'dark' ? 'bg-[#000000]' : 'bg-white'
                  }`}
                />
              </div>
              <span className="font-display font-black text-lg tracking-tight">GoodOff</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
                        <button
              type="button"
              onClick={toggleTheme}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border transition-all duration-150 active:scale-95 ${
                actualTheme === 'dark'
                  ? 'bg-[#121212] border-neutral-800 text-amber-300 hover:bg-neutral-800'
                  : 'bg-slate-100/90 border-slate-200 text-slate-700 hover:bg-slate-200/80'
              }`}
              aria-label={`Toggle theme (currently ${actualTheme})`}
              title={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {actualTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

                        <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-semibold shadow-sm shadow-emerald-500/20 transition-all duration-150 active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Deck</span>
            </button>
          </div>
        </header>

                <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-6 relative z-10">
                    {isLoading ? (
            <LoadingState topic={activeTopic} onCancel={handleCancelRequest} />
          ) : error ? (
            <ErrorState
              error={error}
              topic={activeTopic}
              onRetry={() => handleGenerateDeck(activeTopic)}
              onEditPrompt={() => {
                setError(null);
                setCreateModalOpen(true);
              }}
            />
          ) : activeNav === 'overview' ? (
            <OverviewView
              decks={decks}
              onSelectDeck={(deckId) => {
                setSelectedDeckId(deckId);
                setActiveNav('decks');
                setActiveStudyMode('overview');
              }}
              onOpenStudy={(deckId, mode) => {
                setSelectedDeckId(deckId);
                setActiveNav('decks');
                setActiveStudyMode(mode);
              }}
              onOpenCreateDeck={() => setCreateModalOpen(true)}
            />
          ) : activeNav === 'quizzes' ? (
            <QuizzesView
              decks={decks}
              currentDeck={currentDeck}
              onSelectDeck={(deckId) => setSelectedDeckId(deckId)}
            />
          ) : activeNav === 'podcast' ? (
            <PodcastView
              currentDeck={currentDeck}
              allDecks={decks}
              onSelectDeck={(deckId) => setSelectedDeckId(deckId)}
            />
          ) : activeNav === 'ai-tutor' ? (
            <AITutorView
              currentDeck={currentDeck}
              allDecks={decks}
              onSelectDeck={(deckId) => setSelectedDeckId(deckId)}
            />
          ) : activeNav === 'library' ? (
            <LibraryView
              currentDeck={currentDeck}
              allDecks={decks}
              onSelectDeck={(deckId) => setSelectedDeckId(deckId)}
            />
          ) : activeNav === 'forum' ? (
            <ForumView
              currentDeck={currentDeck}
              allDecks={decks}
              onSelectDeck={(deckId) => setSelectedDeckId(deckId)}
            />
          ) : activeNav === 'analytics' ? (
            <AnalyticsView
              currentDeck={currentDeck}
              allDecks={decks}
              onSelectDeck={(deckId) => setSelectedDeckId(deckId)}
            />
          ) : activeNav === 'challenges' ? (
            <ChallengesView
              currentDeck={currentDeck}
              allDecks={decks}
              onSelectDeck={(deckId) => setSelectedDeckId(deckId)}
              onStartStudy={(mode) => {
                setActiveNav('decks');
                setActiveStudyMode(mode);
              }}
              onStartQuiz={() => {
                setActiveNav('quizzes');
              }}
            />
          ) : activeNav === 'pomodoro' ? (
            <PomodoroView
              currentDeck={currentDeck}
              allDecks={decks}
              onSelectDeck={(deckId) => setSelectedDeckId(deckId)}
              onStartFullStudy={() => {
                setActiveNav('decks');
                setActiveStudyMode('smart_study');
              }}
            />
          ) : (
            activeStudyMode === 'smart_study' || activeStudyMode === 'practice' ? (
              <FlashcardDeck
                cards={
                  activeStudyMode === 'practice'
                    ? [...currentDeck.cards].sort(() => Math.random() - 0.5)
                    : currentDeck.cards
                }
                topic={`${currentDeck.title} (${activeStudyMode === 'smart_study' ? 'Smart Study' : 'Practice Hall'})`}
                onResetTopic={() => setActiveStudyMode('overview')}
              />
            ) : activeStudyMode === 'quiz' ? (
              <QuizView
                cards={currentDeck.cards}
                deckTitle={currentDeck.title}
                onBack={() => setActiveStudyMode('overview')}
              />
            ) : activeStudyMode === 'interview' || activeStudyMode === 'exam' ? (
              <QuestionBankView
                deck={currentDeck}
                mode={activeStudyMode}
                onBack={() => setActiveStudyMode('overview')}
              />
            ) : (
              <div className="space-y-6">
                                <DeckHeader
                  deck={currentDeck}
                  onToggleBookmark={handleToggleBookmark}
                  onEdit={() => setCreateModalOpen(true)}
                  onDelete={handleDeleteDeck}
                  onOpenCreateDeck={() => setCreateModalOpen(true)}
                />

                                <StudyModes
                  deck={currentDeck}
                  onStartSmartStudy={() => setActiveStudyMode('smart_study')}
                  onStartPractice={() => setActiveStudyMode('practice')}
                  onStartQuiz={() => setActiveStudyMode('quiz')}
                                  onStartInterview={() => setActiveStudyMode('interview')}
                                  onStartExam={() => setActiveStudyMode('exam')}
                />
              </div>
            )
          )}
        </main>
      </div>

            <CreateDeckModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmitPrompt={(topic) => handleGenerateDeck(topic)}
        isLoading={isLoading}
      />
    </div>
    )
  );
}
