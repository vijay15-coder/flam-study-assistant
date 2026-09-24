import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutGrid,
  Layers,
  FileQuestion,
  Headphones,
  Sparkles,
  Library,
  MessageSquare,
  BarChart2,
  Trophy,
  Timer,
  ChevronDown,
  X,
  Check,
  Plus,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';

import { Deck } from '../types/flashcard';
import { useTheme } from '../context/ThemeContext';

export interface ClassOption {
  id: string;
  name: string;
  displayName: string;
  subject: string;
}

export const CLASS_OPTIONS: ClassOption[] = [
  {
    id: 'class-11-cn',
    name: 'CLASS_11_COMPUTER_NE...',
    displayName: 'Class 11 Computer Networks',
    subject: 'Computer Science',
  },
  {
    id: 'class-11-ds',
    name: 'CLASS_11_DATA_STRUCT...',
    displayName: 'Class 11 Data Structures',
    subject: 'Computer Science',
  },
  {
    id: 'class-12-algo',
    name: 'CLASS_12_ADV_ALGO...',
    displayName: 'Class 12 Algorithms',
    subject: 'Computer Science',
  },
  {
    id: 'web-dev',
    name: 'WEB_DEV_FULL_STACK...',
    displayName: 'Web Dev & Full-Stack',
    subject: 'Engineering',
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeNav: string;
  onSelectNav: (nav: string) => void;
  onOpenCreateDeck: () => void;
  selectedClass: ClassOption;
  onSelectClass: (cls: ClassOption) => void;
  currentDeck: Deck;
  decks: Deck[];
  onSelectDeck: (deckId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeNav,
  onSelectNav,
  onOpenCreateDeck,
  selectedClass,
  onSelectClass,
  currentDeck,
  decks,
  onSelectDeck,
}) => {
  const { theme, actualTheme, setTheme } = useTheme();
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [deckSwitcherOpen, setDeckSwitcherOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const topicDropdownRef = useRef<HTMLDivElement>(null);

  const mainNavItems = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'decks', label: 'Decks', icon: Layers },
    { id: 'quizzes', label: 'Quizzes', icon: FileQuestion },
    { id: 'podcast', label: 'Podcast', icon: Headphones },
    { id: 'ai-tutor', label: 'AI Tutor', icon: Sparkles },
  ];

  const knowledgeCenterItems = [
    { id: 'library', label: 'Library', icon: Library },
    { id: 'forum', label: 'Forum', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setClassDropdownOpen(false);
      }
      if (topicDropdownRef.current && !topicDropdownRef.current.contains(event.target as Node)) {
        setDeckSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
            {isOpen && (
        <div
          className="fixed inset-0 bg-black/65 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 flex flex-col justify-between shadow-2xl transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          actualTheme === 'dark'
            ? 'bg-[#000000] backdrop-blur-2xl text-neutral-300 border-r border-neutral-800/80'
            : 'bg-white/95 backdrop-blur-xl text-slate-700 border-r border-slate-200/90'
        }`}
      >
                <div className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                    <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                onSelectNav('overview');
                if (window.innerWidth < 1024) onClose();
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    actualTheme === 'dark' ? 'bg-[#000000]' : 'bg-white'
                  }`}
                />
              </div>
              <div>
                <span
                  className={`font-display font-black text-lg tracking-tight block leading-none ${
                    actualTheme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  GoodOff
                </span>
                <span className="text-[10px] text-emerald-500 font-medium tracking-wide">
                  Study workspace
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={onClose}
              className={`lg:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl transition ${
                actualTheme === 'dark'
                  ? 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

                    <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setClassDropdownOpen(!classDropdownOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs transition-all duration-150 group active:scale-[0.99] ${
                actualTheme === 'dark'
                  ? 'bg-[#121212] hover:bg-[#1a1a1a] border-neutral-800 hover:border-neutral-700 text-neutral-200'
                  : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 text-left">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                <span
                  className={`truncate font-medium transition ${
                    actualTheme === 'dark'
                      ? 'text-neutral-300 group-hover:text-white'
                      : 'text-slate-700 group-hover:text-slate-900'
                  }`}
                >
                  {selectedClass.displayName}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                  classDropdownOpen ? 'rotate-180 text-emerald-400' : ''
                }`}
              />
            </button>

                        {classDropdownOpen && (
              <div
                className={`absolute top-full left-0 right-0 mt-1.5 border rounded-2xl shadow-2xl z-50 p-1.5 space-y-1 animate-fadeIn backdrop-blur-xl ${
                  actualTheme === 'dark'
                    ? 'bg-[#141414] border-neutral-800 text-white'
                    : 'bg-white/95 border-slate-200 text-slate-900'
                }`}
              >
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Select Course Track
                </span>
                {CLASS_OPTIONS.map((cls) => {
                  const isCurrent = cls.id === selectedClass.id;
                  return (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => {
                        onSelectClass(cls);
                        setClassDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs transition flex items-center justify-between ${
                        isCurrent
                          ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30'
                          : actualTheme === 'dark'
                          ? 'text-neutral-300 hover:bg-neutral-800/80 hover:text-white'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="block truncate font-medium">{cls.displayName}</span>
                        <span className="text-[10px] text-slate-400 block">{cls.subject}</span>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

                    <div className="relative" ref={topicDropdownRef}>
            <div
              onClick={() => setDeckSwitcherOpen(!deckSwitcherOpen)}
              className={`p-3 rounded-xl border cursor-pointer transition-all duration-150 space-y-1.5 group shadow-xs active:scale-[0.99] ${
                actualTheme === 'dark'
                  ? 'bg-gradient-to-b from-[#141414] to-[#0c0c0c] hover:from-[#1a1a1a] hover:to-[#121212] border-neutral-800 hover:border-neutral-700 text-neutral-200'
                  : 'bg-gradient-to-b from-white to-slate-50 hover:from-slate-50 hover:to-slate-100 border-slate-200 hover:border-slate-300 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Deck
                </span>
                <span className="text-slate-400 font-normal">
                  {currentDeck.cards.length} cards
                </span>
              </div>

              <div className="flex items-center justify-between gap-1.5 text-xs font-semibold">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-sm">{currentDeck.icon}</span>
                  <span
                    className={`truncate transition ${
                      actualTheme === 'dark'
                        ? 'text-neutral-200 group-hover:text-white'
                        : 'text-slate-800 group-hover:text-slate-950'
                    }`}
                  >
                    {currentDeck.title}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                    deckSwitcherOpen ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </div>
            </div>

                        {deckSwitcherOpen && (
              <div
                className={`absolute top-full left-0 right-0 mt-1.5 border rounded-2xl shadow-2xl z-50 p-1.5 space-y-1 animate-fadeIn backdrop-blur-xl ${
                  actualTheme === 'dark'
                    ? 'bg-[#141414] border-neutral-800 text-white'
                    : 'bg-white/95 border-slate-200 text-slate-900'
                }`}
              >
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Switch Active Deck
                </span>
                {decks.map((d) => {
                  const isCurrent = d.id === currentDeck.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        onSelectDeck(d.id);
                        setDeckSwitcherOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs transition flex items-center justify-between ${
                        isCurrent
                          ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30'
                          : actualTheme === 'dark'
                          ? 'text-neutral-300 hover:bg-neutral-800/80 hover:text-white'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="block truncate font-medium">
                          {d.icon} {d.title}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{d.cards.length} flashcards</span>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

                    <nav className="space-y-1 pt-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Core Study
            </span>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectNav(item.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? actualTheme === 'dark'
                        ? 'bg-emerald-500/15 text-emerald-300 font-semibold border-l-2 border-emerald-400 pl-2.5'
                        : 'bg-emerald-50 text-emerald-800 font-semibold border-l-2 border-emerald-500 pl-2.5 shadow-2xs'
                      : actualTheme === 'dark'
                      ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? actualTheme === 'dark'
                          ? 'text-emerald-400'
                          : 'text-emerald-600'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

                    <div className="pt-2 space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Knowledge Center
            </span>
            <nav className="space-y-0.5">
              {knowledgeCenterItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectNav(item.id);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? actualTheme === 'dark'
                          ? 'bg-emerald-500/15 text-emerald-300 font-semibold border-l-2 border-emerald-400 pl-2.5'
                          : 'bg-emerald-50 text-emerald-800 font-semibold border-l-2 border-emerald-500 pl-2.5 shadow-2xs'
                        : actualTheme === 'dark'
                        ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? actualTheme === 'dark'
                            ? 'text-emerald-400'
                            : 'text-emerald-600'
                          : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

                <div
          className={`p-3.5 border-t space-y-3 transition-colors ${
            actualTheme === 'dark'
              ? 'border-neutral-800/80 bg-[#000000]'
              : 'border-slate-200/80 bg-slate-50/80'
          }`}
        >
                    <div className="space-y-1.5">
            <div className="flex items-center justify-between px-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>Theme</span>
              <span className="text-emerald-500 font-semibold capitalize">
                {theme === 'system' ? `Auto (${actualTheme})` : `${theme}`}
              </span>
            </div>

            <div
              className={`grid grid-cols-3 p-1 rounded-xl border transition-colors ${
                actualTheme === 'dark'
                  ? 'bg-[#121212] border-neutral-800 text-neutral-400'
                  : 'bg-white border-slate-200 text-slate-600 shadow-2xs'
              }`}
            >
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95 ${
                  theme === 'light'
                    ? actualTheme === 'light'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-white text-slate-900 shadow-xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Switch to Light theme"
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="text-[11px]">Light</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95 ${
                  theme === 'dark'
                    ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/25'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Switch to Dark theme"
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="text-[11px]">Dark</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95 ${
                  theme === 'system'
                    ? 'bg-neutral-700 text-white shadow-xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Follow system appearance"
              >
                <Laptop className="w-3.5 h-3.5" />
                <span className="text-[11px]">Auto</span>
              </button>
            </div>
          </div>

                    <button
            type="button"
            onClick={() => {
              onOpenCreateDeck();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold text-xs transition-all duration-200 shadow-sm shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Flashcards</span>
          </button>
        </div>
      </aside>
    </>
  );
};

