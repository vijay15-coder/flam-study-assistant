import React, { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronDown, ClipboardCheck, MessageCircleQuestion } from 'lucide-react';
import { ActiveStudyMode, Deck } from '../types/flashcard';

interface QuestionBankViewProps {
  deck: Deck;
  mode: Extract<ActiveStudyMode, 'interview' | 'exam'>;
  onBack: () => void;
}

interface BankQuestion {
  id: string;
  question: string;
  answer: string;
  category?: string;
  difficulty?: string;
  explanation?: string;
}

const INTERVIEW_PROMPTS = [
  (question: string) => `Explain this concept clearly to an interviewer: ${question}`,
  (question: string) => `What is the core principle behind this question: ${question}`,
  (question: string) => `How would you implement or apply the idea in this question: ${question}`,
  (question: string) => `What trade-off should you discuss when answering: ${question}`,
  (question: string) => `Give a practical example related to this question: ${question}`,
  (question: string) => `What common mistake do candidates make with: ${question}`,
  (question: string) => `How would you debug a failure related to: ${question}`,
  (question: string) => `How does this concept connect to neighboring systems: ${question}`,
  (question: string) => `What follow-up question could an interviewer ask after: ${question}`,
  (question: string) => `Summarize the answer to this technical question in two minutes: ${question}`,
];

const EXAM_PROMPTS = [
  (question: string) => `Define and explain: ${question}`,
  (question: string) => `Which principle best answers the following exam question: ${question}`,
  (question: string) => `Describe the mechanism involved in: ${question}`,
  (question: string) => `Compare the main alternatives related to: ${question}`,
  (question: string) => `What is the most likely outcome in this scenario: ${question}`,
  (question: string) => `State one advantage and one limitation related to: ${question}`,
  (question: string) => `List the key steps needed to answer: ${question}`,
  (question: string) => `Explain why the answer to this question matters: ${question}`,
  (question: string) => `Identify a common exam misconception about: ${question}`,
  (question: string) => `Write a concise revision answer for: ${question}`,
];

const buildQuestionBank = (deck: Deck, mode: QuestionBankViewProps['mode']): BankQuestion[] => {
  if (deck.cards.length === 0) return [];
  const prompts = mode === 'interview' ? INTERVIEW_PROMPTS : EXAM_PROMPTS;
  const totalQuestions = Math.min(100, Math.max(50, deck.cards.length * prompts.length));

  return Array.from({ length: totalQuestions }, (_, index) => {
    const card = deck.cards[index % deck.cards.length];
    const prompt = prompts[index % prompts.length];
    return {
      id: `${mode}-${card.id}-${index}`,
      question: prompt(card.question),
      answer: card.answer,
      category: card.category,
      difficulty: card.difficulty,
      explanation: card.explanation,
    };
  });
};

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({ deck, mode, onBack }) => {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const isInterview = mode === 'interview';
  const Icon = isInterview ? MessageCircleQuestion : ClipboardCheck;
  const label = isInterview ? 'Interview Questions' : 'Exam Questions';
  const styles = isInterview
    ? {
        border: 'border-cyan-200/70 dark:border-cyan-900/50',
        glow: 'bg-cyan-400/10',
        label: 'text-cyan-600 dark:text-cyan-400',
        badge: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/60 text-cyan-600 dark:text-cyan-400',
        number: 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300',
        difficulty: 'text-cyan-600 dark:text-cyan-400',
      }
    : {
        border: 'border-rose-200/70 dark:border-rose-900/50',
        glow: 'bg-rose-400/10',
        label: 'text-rose-600 dark:text-rose-400',
        badge: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-400',
        number: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300',
        difficulty: 'text-rose-600 dark:text-rose-400',
      };
  const bankQuestions = useMemo(() => buildQuestionBank(deck, mode), [deck, mode]);

  const toggleAnswer = (id: string) => {
    setRevealedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className={`glass-card rounded-[2rem] p-5 sm:p-7 border ${styles.border} relative overflow-hidden`}>
        <div className={`absolute -right-20 -top-24 h-72 w-72 rounded-full ${styles.glow} blur-3xl pointer-events-none`} />
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition">
              <ArrowLeft className="w-4 h-4" /> Back to study modes
            </button>
            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] ${styles.label}`}>
              <Icon className="w-4 h-4" /> Question bank
            </div>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{label}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-neutral-300">Review every question from <strong className="text-slate-900 dark:text-white">{deck.title}</strong>. Try answering aloud before revealing the model response.</p>
          </div>
          <div className={`shrink-0 rounded-2xl border px-4 py-3 text-center ${styles.badge}`}>
            <span className="block font-display text-2xl font-black">{bankQuestions.length}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">Total questions</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {bankQuestions.map((card, index) => {
          const isRevealed = revealedIds.has(card.id);
          return (
            <article key={card.id} className="glass-card rounded-2xl border border-slate-200/80 dark:border-neutral-800 overflow-hidden">
              <button type="button" onClick={() => toggleAnswer(card.id)} className="w-full p-4 sm:p-5 text-left flex items-start gap-4 group">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${styles.number}`}>{index + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                    <span>{card.category || (isInterview ? 'Technical interview' : 'Exam preparation')}</span>
                    {card.difficulty && <span className={styles.difficulty}>{card.difficulty}</span>}
                  </span>
                  <span className="mt-1 block text-sm sm:text-base font-bold leading-relaxed text-slate-900 dark:text-neutral-100">{card.question}</span>
                </span>
                <ChevronDown className={`mt-1 h-5 w-5 shrink-0 text-slate-400 transition-transform ${isRevealed ? 'rotate-180' : ''}`} />
              </button>
              {isRevealed && (
                <div className="mx-4 mb-4 ml-16 rounded-xl border border-emerald-200/70 dark:border-emerald-900/70 bg-emerald-50/70 dark:bg-emerald-950/25 p-4 animate-fadeIn">
                  <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4" /> Model answer</div>
                  <p className="text-sm leading-6 text-slate-700 dark:text-neutral-200">{card.answer}</p>
                  {card.explanation && <p className="mt-3 border-t border-emerald-200/70 dark:border-emerald-900/70 pt-3 text-xs leading-5 text-slate-600 dark:text-neutral-400">{card.explanation}</p>}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};