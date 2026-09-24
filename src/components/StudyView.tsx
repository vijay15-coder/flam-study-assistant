import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  FileEdit,
  Trash2,
  Settings2,
  Zap,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  Sliders,
  Check,
  BrainCircuit,
  Command,
} from 'lucide-react';
import { Deck, FlashcardItem } from '../types/flashcard';

interface StudyViewProps {
  currentDeck: Deck;
  onSelectTopicSeed: (topic: string) => void;
  onGenerate: (promptText: string) => void;
  isLoading: boolean;
  onRefineDeck: (instruction: string) => void;
}

export const StudyView: React.FC<StudyViewProps> = ({
  currentDeck,
  onSelectTopicSeed,
  onGenerate,
  isLoading,
  onRefineDeck,
}) => {
  const [sourceNotes, setSourceNotes] = useState<string>(
    'Operating Systems: Virtual Memory, Paging, Page Faults, TLB, Thrashing, and Dirty bit management. Address translation steps and MMU hardware interrupts.'
  );

  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const [masteredMap, setMasteredMap] = useState<Record<string, boolean>>({});

  const [refineText, setRefineText] = useState<string>('');
  const [isRefining, setIsRefining] = useState<boolean>(false);

  const cards = currentDeck.cards || [];
  const currentCard: FlashcardItem | undefined = cards[cardIndex] || cards[0];

  useEffect(() => {
    setCardIndex(0);
    setIsFlipped(false);
  }, [currentDeck.id]);

  const handleNext = () => {
    if (cardIndex < cards.length - 1) {
      setCardIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (cardIndex > 0) {
      setCardIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleMarkMastered = (mastered: boolean) => {
    if (!currentCard) return;
    setMasteredMap((prev) => ({
      ...prev,
      [currentCard.id]: mastered,
    }));
    handleNext();
  };

  const handleRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineText.trim() || isRefining) return;
    setIsRefining(true);
    await onRefineDeck(refineText.trim());
    setRefineText('');
    setIsRefining(false);
  };

  const progressPercent =
    cards.length > 0 ? Math.round(((cardIndex + 1) / cards.length) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-28 pt-2 px-1 animate-fadeIn text-slate-100">
            <div className="bg-[#121824] border border-[#1f2b40] rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#1e1b4b] border border-[#3730a3] flex items-center justify-center text-[#818cf8] flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black text-white tracking-tight">
                Prompt to Structured Deck
              </h2>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Keys secured via serverless proxy
                <br />
                • Response validation
              </p>
            </div>
          </div>

                    <div className="px-3 py-1 rounded-full bg-[#064e3b]/40 border border-[#059669] text-[#34d399] text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(5,150,105,0.2)]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ACTIVE GUARD</span>
          </div>
        </div>
      </div>

            <div className="bg-[#121824] border border-[#1f2b40] rounded-3xl p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-200">
            <FileEdit className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-bold tracking-tight">
              Source Knowledge & Notes
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#1b2436] text-slate-400 font-mono text-[11px] border border-[#26354f]">
            {sourceNotes.length} chars
          </span>
        </div>

                <div className="bg-[#0b0f17] border border-[#1e293b] rounded-2xl p-4 focus-within:border-[#38bdf8]/60 transition-colors">
          <textarea
            rows={4}
            value={sourceNotes}
            onChange={(e) => setSourceNotes(e.target.value)}
            placeholder="Type notes or enter a topic..."
            className="w-full bg-transparent text-slate-200 text-sm placeholder-slate-500 focus:outline-none resize-none leading-relaxed font-sans"
          />
        </div>

                <div className="flex items-center justify-between text-xs pt-0.5">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px]">Structured Markdown or Freeform text</span>
          </div>
          <button
            type="button"
            onClick={() => setSourceNotes('')}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-400 transition text-[11px]"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>

                <div className="pt-2 space-y-2 border-t border-[#1c2638]">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-mono font-bold tracking-wider text-slate-400 uppercase">
              QUICK TOPIC SEEDS
            </span>
            <span className="text-slate-500 text-[10px]">Tap to load</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: 'OS Internals', icon: '⚙', text: 'Operating Systems: Virtual Memory, Paging, Page Faults, TLB, Thrashing, and Dirty bit management. Address translation steps and MMU hardware interrupts.' },
              { label: 'React Fiber', icon: '⤢', text: 'React Fiber: Cooperative multitasking, lane priorities, concurrent rendering, commit phase mutations, and work-in-progress tree reconciliation.' },
              { label: 'CAP Theorem', icon: '🔀', text: 'CAP Theorem & Distributed Systems: Consistency vs Availability tradeoffs under network partition, PACELC theorem, and consensus replication.' },
            ].map((seed) => (
              <button
                key={seed.label}
                type="button"
                onClick={() => {
                  setSourceNotes(seed.text);
                  onSelectTopicSeed(seed.label);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#172030] hover:bg-[#202d44] border border-[#24334d] hover:border-[#38bdf8]/50 text-slate-300 hover:text-white text-xs font-medium transition flex items-center gap-1.5 active:scale-95"
              >
                <span>{seed.icon}</span>
                <span>{seed.label}</span>
              </button>
            ))}
          </div>
        </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="bg-[#172030] border border-[#24334d] rounded-xl px-3 py-2 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <span>🎦</span>
              <span>5 Cards + Quiz</span>
            </span>
            <Settings2 className="w-3.5 h-3.5 text-slate-500" />
          </div>

          <div className="bg-[#172030] border border-[#24334d] rounded-xl px-3 py-2 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="truncate">Gemini 1.5 Flash •...</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          </div>
        </div>

                <button
          type="button"
          onClick={() => onGenerate(sourceNotes)}
          disabled={isLoading || !sourceNotes.trim()}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white font-bold text-sm sm:text-base shadow-[0_0_25px_rgba(99,102,241,0.35)] active:scale-[0.99] disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          <BrainCircuit className="w-5 h-5" />
          <span>{isLoading ? 'Synthesizing Structured Deck...' : 'Generate Structured Deck'}</span>
        </button>

                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Request Guard #4 active • Stale response prevention on</span>
        </div>
      </div>

            <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {currentDeck.title}
            </h1>
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center text-xs">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-[#172030] border border-[#24334d] text-xs font-mono font-bold text-slate-300">
            {cardIndex + 1} <span className="text-slate-500">/ {cards.length}</span>
          </div>
        </div>

        <p className="text-xs font-mono font-bold text-[#10b981] tracking-wide">
          {cards.length} cards loaded
        </p>

                <div className="w-full h-1.5 bg-[#172030] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#10b981] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

            {currentCard && (
        <div
          onClick={handleFlip}
          className="w-full bg-[#121824] border border-[#223048] hover:border-[#38bdf8]/40 rounded-3xl p-6 sm:p-8 shadow-2xl min-h-[280px] flex flex-col justify-between cursor-pointer transition select-none group relative overflow-hidden"
        >
                    <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-[#1a2538] border border-[#293c59] text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <span>⚙</span>
              <span>{currentCard.category || 'OS Memory Hierarchy'}</span>
            </span>

            <span className="px-3 py-1 rounded-full bg-[#78350f]/30 border border-[#b45309]/80 text-[#f59e0b] text-xs font-bold font-mono">
              {currentCard.difficulty || 'Medium'}
            </span>
          </div>

                    <div className="my-auto py-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed text-left">
              {isFlipped ? currentCard.answer : currentCard.question}
            </h3>
          </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#1c273a] text-xs">
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
              {(currentCard.tags || ['#VirtualMemory', '#KernelSpace']).map((tag) => (
                <span key={tag} className="hover:text-slate-200">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-[#38bdf8] transition text-xs font-medium">
              <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
              <span>{isFlipped ? 'Tap to view prompt' : 'Tap to flip'}</span>
            </div>
          </div>
        </div>
      )}

            <div className="space-y-3 pt-1">
                <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={handlePrev}
            disabled={cardIndex === 0}
            className="py-3 px-4 rounded-2xl bg-[#172030] hover:bg-[#202d44] border border-[#24334d] text-slate-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 transition active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <button
            type="button"
            onClick={handleFlip}
            className="py-3 px-4 rounded-2xl bg-[#172030] hover:bg-[#202d44] border border-[#24334d] text-slate-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Flip Card</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={cardIndex === cards.length - 1}
            className="py-3 px-4 rounded-2xl bg-[#172030] hover:bg-[#202d44] border border-[#24334d] text-slate-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 transition active:scale-95"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

                <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleMarkMastered(false)}
            className="py-3.5 px-4 rounded-2xl bg-[#2a131b] hover:bg-[#3b1723] border border-[#881337] text-[#fda4af] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Still Learning</span>
          </button>

          <button
            type="button"
            onClick={() => handleMarkMastered(true)}
            className="py-3.5 px-4 rounded-2xl bg-[#08291d] hover:bg-[#0c3b2a] border border-[#065f46] text-[#6ee7b7] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Got it! (Mastered)</span>
          </button>
        </div>
      </div>

            <div className="bg-[#121824] border border-[#1f2b40] rounded-3xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" />
            <span>Live AI Deck Refinement</span>
          </div>
          <span className="font-mono text-slate-500 text-[10px]">Cmd + K</span>
        </div>

        <form onSubmit={handleRefineSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={refineText}
            onChange={(e) => setRefineText(e.target.value)}
            placeholder="Refine deck (e.g., make it simpler, add edge cases)..."
            className="flex-1 bg-[#0b0f17] border border-[#223048] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#8b5cf6] transition"
          />

          <button
            type="submit"
            disabled={!refineText.trim() || isRefining}
            className="px-5 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition active:scale-95 disabled:opacity-40"
          >
            <span>▷</span>
            <span>{isRefining ? '...' : 'Refine'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
