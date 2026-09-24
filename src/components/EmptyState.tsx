import React from 'react';
import { Layers, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  onSelectTopic: (topic: string) => void;
}

const STARTER_PACKS = [
  {
    title: 'Computer Science',
    topic: 'Teach me binary search',
    description: 'Time complexity, edge cases, mid pointers, and termination conditions.',
  },
  {
    title: 'Frontend Engineering',
    topic: 'React Hooks: useEffect vs useLayoutEffect',
    description: 'DOM mutations, browser paint timing, asynchronous scheduling, and use cases.',
  },
  {
    title: 'Web Protocols',
    topic: 'HTTP Status Codes and REST APIs',
    description: '200, 201, 301, 400, 401, 403, 404, 500, 502, idempotent methods.',
  },
  {
    title: 'Biology & Science',
    topic: 'Photosynthesis Light and Dark Reactions',
    description: 'Chloroplasts, thylakoids, ATP/NADPH synthesis, and the Calvin Cycle.',
  },
];

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectTopic }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8 animate-fadeIn">
            <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Start with a topic
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Enter a topic or paste notes above to create your first study deck.
        </p>
      </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-left space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            Checked card data
          </div>
          <p className="text-xs text-slate-600">
            Cards are checked before they are added to the workspace.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-left space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Review misses
          </div>
          <p className="text-xs text-slate-600">
            Mark cards as known or needing review, then return to the ones you missed.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-left space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Simple format
          </div>
          <p className="text-xs text-slate-600">
            Each card has a question and an answer, ready for a study session.
          </p>
        </div>
      </div>

            <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Try a sample topic:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STARTER_PACKS.map((item) => (
            <button
              key={item.topic}
              type="button"
              onClick={() => onSelectTopic(item.topic)}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-indigo-50/30 text-left transition group flex flex-col justify-between space-y-2 shadow-sm"
            >
              <div>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  {item.title}
                </span>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition mt-0.5">
                  "{item.topic}"
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-medium text-indigo-600 pt-1 group-hover:translate-x-0.5 transition-transform">
                <span>Generate this deck</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
