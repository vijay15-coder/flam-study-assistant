import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Radio,
  Clock,
  Sparkles,
  BookOpen,
  Headphones,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { Deck, FlashcardItem } from '../../types/flashcard';

interface PodcastViewProps {
  currentDeck: Deck;
  allDecks: Deck[];
  onSelectDeck: (deckId: string) => void;
}

export const PodcastView: React.FC<PodcastViewProps> = ({
  currentDeck,
  allDecks,
  onSelectDeck,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isSpeakingAnswer, setIsSpeakingAnswer] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showDeckSelector, setShowDeckSelector] = useState(false);

  const cards = currentDeck.cards;
  const currentCard: FlashcardItem | undefined = cards[activeCardIndex] || cards[0];

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentDeck.id]);

  const speakCurrentCard = (cardIdx: number, speakAnswer = false) => {
    if (!('speechSynthesis' in window) || isMuted) {
      return;
    }

    window.speechSynthesis.cancel();

    const targetCard = cards[cardIdx];
    if (!targetCard) {
      setIsPlaying(false);
      return;
    }

    const textToSpeak = speakAnswer
      ? `Answer: ${targetCard.answer}`
      : `Card ${cardIdx + 1}: ${targetCard.question}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (!isPlaying) return;

      if (!speakAnswer) {
        setIsSpeakingAnswer(true);
        timeoutRef.current = window.setTimeout(() => {
          speakCurrentCard(cardIdx, true);
        }, 1500 / playbackSpeed);
      } else {
        setIsSpeakingAnswer(false);
        if (cardIdx < cards.length - 1) {
          timeoutRef.current = window.setTimeout(() => {
            setActiveCardIndex(cardIdx + 1);
            speakCurrentCard(cardIdx + 1, false);
          }, 2000 / playbackSpeed);
        } else {
          setIsPlaying(false);
        }
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const togglePlay = () => {
    if (isPlaying) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakCurrentCard(activeCardIndex, isSpeakingAnswer);
    }
  };

  const handleSelectCard = (index: number) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveCardIndex(index);
    setIsSpeakingAnswer(false);
    if (isPlaying) {
      speakCurrentCard(index, false);
    }
  };

  const handleRestart = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveCardIndex(0);
    setIsSpeakingAnswer(false);
    if (isPlaying) {
      speakCurrentCard(0, false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.05)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-100/35 via-emerald-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-purple-700 flex items-center gap-1.5">
              <Headphones className="w-4 h-4 text-purple-600" />
              Audio Study Companion
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 font-normal">
              Active Topic: {currentDeck.title}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Study Podcast: {currentDeck.title} {currentDeck.icon}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Hands-free audio revision generated automatically from your current{' '}
            <strong className="text-slate-800 font-semibold">{currentDeck.title}</strong>{' '}
            deck cards. Listen while walking, resting your eyes, or commuting.
          </p>
        </div>

                <div className="relative z-10">
          <button
            type="button"
            onClick={() => setShowDeckSelector(!showDeckSelector)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-all duration-200 active:scale-95"
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Switch: {currentDeck.title.substring(0, 16)}...</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showDeckSelector ? 'rotate-180' : ''}`} />
          </button>

          {showDeckSelector && (
            <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl z-30 p-2 space-y-1 animate-fadeIn">
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Select Deck to Listen to
              </span>
              {allDecks.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    onSelectDeck(d.id);
                    setShowDeckSelector(false);
                    setIsPlaying(false);
                    setActiveCardIndex(0);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                    d.id === currentDeck.id
                      ? 'bg-purple-50 text-purple-900 font-bold border border-purple-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{d.title}</span>
                  <span className="text-[10px] text-slate-400">{d.cards.length} cards</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-purple-600 tracking-wider uppercase flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse text-purple-500" />
              Now Playing · Track {activeCardIndex + 1} of {cards.length}
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentCard ? currentCard.question : 'No cards available'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Curriculum: <span className="font-semibold text-slate-700">{currentDeck.title}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPlaybackSpeed((s) => (s === 1 ? 1.25 : s === 1.25 ? 1.5 : 1))}
              className="px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs active:scale-95"
            >
              {playbackSpeed}x Speed
            </button>
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl border border-slate-200/90 bg-white text-slate-600 hover:bg-slate-50 transition shadow-2xs active:scale-95"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

                <div className="flex items-center justify-center gap-1.5 h-16 bg-black rounded-2xl px-6 py-2 shadow-inner border border-neutral-800">
          {[40, 75, 50, 90, 60, 30, 85, 95, 45, 70, 80, 55, 65, 90, 40, 80, 60, 95, 50, 70, 65, 85, 40, 90].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-300 ${
                isPlaying ? 'bg-gradient-to-t from-emerald-500 to-teal-300 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-700'
              }`}
              style={{
                height: isPlaying ? `${Math.max(15, (h * ((i % 4) + 1)) % 100)}%` : '18%',
              }}
            />
          ))}
        </div>

                <div className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-1 text-center sm:text-left shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            {isSpeakingAnswer ? '🔊 Speaking Solution & Detail:' : '❓ Current Question:'}
          </span>
          <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
            {isSpeakingAnswer
              ? currentCard?.answer
              : currentCard?.question}
          </p>
        </div>

                <div className="flex items-center justify-center gap-5 pt-1">
          <button
            type="button"
            onClick={() => handleSelectCard(Math.max(0, activeCardIndex - 1))}
            disabled={activeCardIndex === 0}
            className="p-3 rounded-2xl text-slate-600 hover:bg-slate-100/80 transition disabled:opacity-30 active:scale-95"
            title="Previous Track"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="w-16 h-16 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-white" />
            ) : (
              <Play className="w-7 h-7 fill-white ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSelectCard(Math.min(cards.length - 1, activeCardIndex + 1))}
            disabled={activeCardIndex === cards.length - 1}
            className="px-4 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-100/80 transition disabled:opacity-30 active:scale-95 text-xs font-bold"
            title="Next Track"
          >
            Next ▷
          </button>
        </div>

                <div className="pt-4 border-t border-slate-100 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-neutral-400">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-neutral-200">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Deck Tracklist ({cards.length} Concepts from {currentDeck.title})</span>
            </span>
            <span className="text-slate-400 dark:text-neutral-500 text-[11px] font-normal">
              Click any card to play
            </span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {cards.map((card, idx) => {
              const isCurrent = idx === activeCardIndex;
              return (
                <div
                  key={card.id || idx}
                  onClick={() => handleSelectCard(idx)}
                  className={`p-3.5 rounded-2xl border text-xs transition-all duration-150 cursor-pointer flex items-start justify-between gap-3 ${
                    isCurrent
                      ? 'bg-purple-950/40 border-purple-700/70 text-purple-100 font-semibold shadow-xs'
                      : 'bg-white/60 dark:bg-neutral-900/80 border-slate-200/70 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-[10px] flex-shrink-0 mt-0.5 ${
                        isCurrent
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-900 dark:text-neutral-100">{card.question}</p>
                      <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-1">{card.answer}</p>
                    </div>
                  </div>

                  {isCurrent && isPlaying && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1 flex-shrink-0">
                      <Radio className="w-3 h-3 animate-pulse" />
                      Playing
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
