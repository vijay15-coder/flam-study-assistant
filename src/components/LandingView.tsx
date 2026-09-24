import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Moon,
  Network,
  Play,
  ShieldCheck,
  Sparkles,
  Sun,
} from 'lucide-react';

interface LandingViewProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenWorkspace: () => void;
  onCreateDeck: () => void;
}

const BENEFITS = [
  {
    icon: BookOpen,
    title: 'Start with a topic',
    text: 'Enter notes or a chapter name and create a deck.',
  },
  {
    icon: ShieldCheck,
    title: 'Review one card at a time',
    text: 'Flip cards, mark misses, and repeat the hard ones.',
  },
  {
    icon: BookOpen,
    title: 'Keep your decks together',
    text: 'Switch between saved topics from the workspace.',
  },
];

export const LandingView: React.FC<LandingViewProps> = ({
  isDark,
  onToggleTheme,
  onOpenWorkspace,
  onCreateDeck,
}) => {
  const surface = isDark ? 'bg-[#0b110f] text-white' : 'bg-[#f7fbf8] text-slate-950';
  const muted = isDark ? 'text-emerald-100/60' : 'text-slate-600';
  const border = isDark ? 'border-white/10' : 'border-slate-200/80';

  return (
    <div className={`min-h-[100dvh] w-full overflow-hidden ${surface}`}>
      <div className="landing-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="landing-glow landing-glow-one pointer-events-none" />
      <div className="landing-glow landing-glow-two pointer-events-none" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <button type="button" onClick={onOpenWorkspace} className="flex items-center gap-3 text-left">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-[#06130d] shadow-lg shadow-emerald-500/20">
            <Sparkles className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-display text-lg font-black tracking-tight">GoodOff</span>
            <span className={`block text-[10px] font-semibold uppercase tracking-[0.2em] ${muted}`}>
              study workspace
            </span>
          </span>
        </button>

        <nav className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={onOpenWorkspace}
            className={`hidden rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-emerald-500/10 sm:block ${muted}`}
          >
            Open workspace
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            className={`flex h-10 w-10 items-center justify-center rounded-full border ${border} transition hover:border-emerald-400 hover:text-emerald-400`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onCreateDeck}
            className="hidden rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-[#06130d] shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-400 sm:block"
          >
            New deck
          </button>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-8 sm:pt-20 lg:px-12 lg:pb-20 lg:pt-24">
        <section className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:gap-20">
          <div className="max-w-2xl animate-fadeIn">
            <div className={`mb-6 inline-flex items-center gap-2 rounded-full border ${border} px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-500`}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
              Study workspace
            </div>
            <h1 className="max-w-xl font-display text-5xl font-black leading-[0.98] tracking-[-0.045em] sm:text-7xl">
              Turn notes into a study deck.
            </h1>
            <p className={`mt-7 max-w-lg text-base leading-7 sm:text-lg ${muted}`}>
              Create flashcards from a topic or your own notes, then review them at your pace.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onCreateDeck}
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-500 px-6 py-4 text-sm font-black text-[#06130d] shadow-xl shadow-emerald-500/20 transition hover:-translate-y-1 hover:bg-emerald-400"
              >
                Create a deck
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={onOpenWorkspace}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl border ${border} px-6 py-4 text-sm font-bold transition hover:border-emerald-400 hover:text-emerald-400`}
              >
                <Play className="h-4 w-4 fill-current" />
                View sample decks
              </button>
            </div>
            <div className={`mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold ${muted}`}>
              {['Topic or notes', 'Question and answer cards', 'Review what you miss'].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl animate-fadeIn [animation-delay:120ms]" style={{ animationFillMode: 'both' }}>
            <div className={`relative overflow-hidden rounded-[2rem] border ${border} ${isDark ? 'bg-[#101b16]/90' : 'bg-white/90'} p-3 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl`}>
              <div className={`flex items-center justify-between rounded-[1.5rem] border ${border} px-5 py-4`}>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500"><Network className="h-4 w-4" /></span>
                  <div><p className="text-xs font-bold">Sample deck</p><p className={`text-[10px] ${muted}`}>Computer Networks</p></div>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-500">6 cards</span>
              </div>
              <div className="grid gap-3 p-3 sm:grid-cols-[1.1fr_0.9fr]">
                <div className="landing-card-preview flex min-h-[245px] flex-col justify-between rounded-[1.5rem] bg-[#10251b] p-6 text-white shadow-inner">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-300/70"><span>Example card</span><span>Question</span></div>
                  <p className="font-display text-2xl font-bold leading-tight">What problem does TCP solve for an application?</p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Active recall mode</div>
                </div>
                <div className="space-y-3">
                  <div className={`rounded-[1.5rem] border ${border} p-5`}><p className={`text-[10px] font-bold uppercase tracking-[0.15em] ${muted}`}>Deck contents</p><p className="mt-3 font-display text-3xl font-black">Q<span className={`text-sm font-semibold ${muted}`}> &amp; A</span></p><p className={`mt-4 text-xs ${muted}`}>Questions with short answers.</p></div>
                  <div className="rounded-[1.5rem] bg-emerald-500 p-5 text-[#06130d]"><p className="text-[10px] font-black uppercase tracking-[0.15em] opacity-60">Next step</p><p className="mt-2 text-sm font-black">Open the deck</p><ArrowRight className="mt-5 h-4 w-4" /></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`mt-24 grid gap-3 border-t ${border} pt-8 md:grid-cols-3`}>
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 rounded-2xl p-4 transition hover:bg-emerald-500/5">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              <div><h2 className="text-sm font-black">{title}</h2><p className={`mt-1 text-xs leading-5 ${muted}`}>{text}</p></div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};