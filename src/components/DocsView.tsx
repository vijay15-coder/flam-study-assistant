import React from 'react';
import { Info, BookOpen, KeyRound, Cpu, Layers } from 'lucide-react';

export const DocsView: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 pb-28 pt-2 px-1 animate-fadeIn text-slate-100">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#1e293b] border border-[#334155] flex items-center justify-center text-[#38bdf8]">
            <Info className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            How this app works
          </h1>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Notes on the client, server, and card flow
        </p>
      </div>

      <div className="space-y-3">
                <div className="bg-[#121824] border border-[#1f2b40] rounded-3xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Cpu className="w-4 h-4 text-[#38bdf8]" />
            <span>Request flow</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The browser sends a topic to the Express server at <code className="text-[#38bdf8] font-mono">POST /api/generate</code>. The server calls Gemini, parses the response, and returns card data to the client.
          </p>
        </div>

                <div className="bg-[#121824] border border-[#1f2b40] rounded-3xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <KeyRound className="w-4 h-4 text-[#10b981]" />
            <span>API key handling</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Gemini key is loaded by the server from the environment. It is not placed in the Vite client bundle.
          </p>
        </div>

                <div className="bg-[#121824] border border-[#1f2b40] rounded-3xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <BookOpen className="w-4 h-4 text-[#c084fc]" />
            <span>Review flow</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Mark a card as known or needing review. The study view can then focus on the cards you missed.
          </p>
        </div>
      </div>
    </div>
  );
};
