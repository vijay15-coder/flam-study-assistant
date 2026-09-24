import React from 'react';
import { Layers, HelpCircle, Terminal, Info } from 'lucide-react';

export type NavTabType = 'study' | 'quiz' | 'resilience' | 'docs';

interface BottomNavProps {
  activeTab: NavTabType;
  onSelectTab: (tab: NavTabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'study' as NavTabType, label: 'Study', icon: Layers },
    { id: 'quiz' as NavTabType, label: 'Quiz', icon: HelpCircle },
    { id: 'resilience' as NavTabType, label: 'Resilience', icon: Terminal },
    { id: 'docs' as NavTabType, label: 'Docs / Info', icon: Info },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-[#0d121c]/95 backdrop-blur-lg border-t border-[#1d2638] z-50 py-2 px-4 shadow-[0_-8px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center justify-center transition-all group py-1 px-3 relative"
            >
              {isActive ? (
                <div className="px-5 py-1.5 rounded-full bg-gradient-to-r from-[#1e293b] via-[#1e3a5f] to-[#1e293b] border border-[#38bdf8]/50 shadow-[0_0_15px_rgba(56,189,248,0.3)] flex flex-col items-center justify-center">
                  <Icon className="w-4 h-4 text-[#38bdf8] mb-0.5" />
                  <span className="text-[11px] font-mono font-black text-[#38bdf8] tracking-wider uppercase">
                    {tab.label}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
                  <Icon className="w-5 h-5 text-slate-400 group-hover:text-slate-200 mb-0.5" />
                  <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-200">
                    {tab.label}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
