import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  Lock,
  FileCode2,
  Activity,
} from 'lucide-react';
import { generateFlashcards } from '../lib/api';
import { validateResult } from '../lib/validateResult';

export const ResilienceView: React.FC = () => {
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runTest = async (simulationMode: string, label: string) => {
    setIsRunning(true);
    setTestStatus(`Executing resilience test: ${label}...`);
    setTestResult(null);

    try {
      const raw = await generateFlashcards('Virtual Memory test', undefined, simulationMode);
      const val = validateResult(raw);
      if (!val.isValid) {
        setTestResult(`DEFENSIVE SHIELD INTERCEPTED: ${val.error}`);
      } else {
        setTestResult(`SUCCESS: Validated ${val.cards.length} cards conforming strictly to schema.`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setTestResult(`NETWORK/PROXY SHIELD BLOCKED: ${msg}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 pb-28 pt-2 px-1 animate-fadeIn text-slate-100">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#064e3b]/50 border border-[#059669] flex items-center justify-center text-[#34d399]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Request checks
          </h1>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Small tests for malformed responses, server errors, and request handling.
        </p>
      </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-[#121824] border border-[#1f2b40] rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <Lock className="w-4 h-4" />
            <span>Server-side key</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The API key is read by the Node server and is not sent to the browser.
          </p>
          <span className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
            SERVER ONLY
          </span>
        </div>

        <div className="bg-[#121824] border border-[#1f2b40] rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-[#38bdf8] font-bold text-xs">
            <FileCode2 className="w-4 h-4" />
            <span>Response validation</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The client checks that a response contains non-empty question and answer strings.
          </p>
          <span className="inline-block text-[10px] font-mono text-[#38bdf8] bg-sky-950/40 px-2 py-0.5 rounded border border-sky-800">
            RUNTIME CHECKS
          </span>
        </div>
      </div>

            <div className="bg-[#121824] border border-[#1f2b40] rounded-3xl p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-[#1c273a] pb-3">
          <div className="flex items-center gap-2 font-bold text-xs text-white">
            <Activity className="w-4 h-4 text-[#c084fc]" />
            <span>Test responses</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            RUN TEST CASES
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={isRunning}
            onClick={() => runTest('invalid_json', 'Malformed JSON Recovery')}
            className="p-3 rounded-xl bg-[#172030] hover:bg-[#202d44] border border-[#24334d] text-left text-xs text-slate-300 hover:text-white transition flex items-center justify-between"
          >
            <span>1. Malformed JSON Test</span>
            <Play className="w-3 h-3 text-[#38bdf8]" />
          </button>

          <button
            type="button"
            disabled={isRunning}
            onClick={() => runTest('wrong_shape', 'Schema Shape Mismatch')}
            className="p-3 rounded-xl bg-[#172030] hover:bg-[#202d44] border border-[#24334d] text-left text-xs text-slate-300 hover:text-white transition flex items-center justify-between"
          >
            <span>2. Missing Schema Array</span>
            <Play className="w-3 h-3 text-[#38bdf8]" />
          </button>

          <button
            type="button"
            disabled={isRunning}
            onClick={() => runTest('missing_answer', 'Empty Answer Rejection')}
            className="p-3 rounded-xl bg-[#172030] hover:bg-[#202d44] border border-[#24334d] text-left text-xs text-slate-300 hover:text-white transition flex items-center justify-between"
          >
            <span>3. Blank Attribute Trap</span>
            <Play className="w-3 h-3 text-[#38bdf8]" />
          </button>

          <button
            type="button"
            disabled={isRunning}
            onClick={() => runTest('server_error', 'HTTP 500 Recovery')}
            className="p-3 rounded-xl bg-[#172030] hover:bg-[#202d44] border border-[#24334d] text-left text-xs text-slate-300 hover:text-white transition flex items-center justify-between"
          >
            <span>4. HTTP 500 Fault Recovery</span>
            <Play className="w-3 h-3 text-[#38bdf8]" />
          </button>
        </div>

                {testStatus && (
          <div className="p-3 rounded-xl bg-[#0b0f17] border border-[#1e293b] font-mono text-xs space-y-1">
            <div className="text-slate-400">{testStatus}</div>
            {testResult && (
              <div
                className={`font-bold ${
                  testResult.includes('INTERCEPTED') || testResult.includes('BLOCKED')
                    ? 'text-[#f59e0b]'
                    : 'text-[#10b981]'
                }`}
              >
                {testResult}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
