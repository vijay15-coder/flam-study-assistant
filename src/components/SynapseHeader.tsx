import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';

interface SynapseHeaderProps {
  version?: string;
}

export const SynapseHeader: React.FC<SynapseHeaderProps> = ({ version = 'GoodOff' }) => {
  return (
    <header className="w-full bg-[#0b0f17]/90 backdrop-blur-md border-b border-[#1f293d]/80 sticky top-0 z-40 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#6366f1]/20 via-[#3b82f6]/20 to-[#06b6d4]/30 border border-[#3b82f6]/40 flex items-center justify-center text-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <Cpu className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight">
                Synapse AI
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1e1b4b] text-[#a5b4fc] border border-[#3730a3]">
                {version}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_6px_#10b981]" />
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#10b981] uppercase">
                BACKEND PROXY PROTECTED
              </span>
            </div>
          </div>
        </div>

                <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full ring-2 ring-[#3b82f6]/50 p-0.5 overflow-hidden bg-gradient-to-br from-[#6366f1] to-[#06b6d4]">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
              alt="User profile"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
