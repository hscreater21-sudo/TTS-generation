import React from 'react';
import { Volume2, Sparkles, History, Settings, Wand2, Radio, Layers, Mic } from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'storytelling' | 'dialogue' | 'library';
  setActiveTab: (tab: 'studio' | 'storytelling' | 'dialogue' | 'library') => void;
  historyCount: number;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenAiStory: () => void;
  serverStatus?: { hasGeminiKey: boolean; hasElevenLabsKey: boolean };
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  historyCount,
  onOpenHistory,
  onOpenSettings,
  onOpenAiStory,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0B0F17]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/25">
            <Volume2 className="h-5 w-5 text-white animate-pulse" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white sm:text-lg">
                TEXT TO SPEECH GENERATOR
              </h1>
              <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Multilingual AI Voice Studio • Pakistani Urdu Dastangoi, Hindi, Canadian French & 40+ Languages
            </p>
          </div>
        </div>

        {/* Mode Navigation Tabs */}
        <nav className="hidden md:flex items-center rounded-xl border border-slate-800 bg-slate-900/60 p-1">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'studio'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Mic className="h-3.5 w-3.5" />
            Voice Studio
          </button>

          <button
            onClick={() => setActiveTab('storytelling')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'storytelling'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Wand2 className="h-3.5 w-3.5 text-amber-400" />
            Dastangoi & Stories
          </button>

          <button
            onClick={() => setActiveTab('dialogue')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'dialogue'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Radio className="h-3.5 w-3.5 text-emerald-400" />
            Dual Dialogue
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'library'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Voice Library
          </button>
        </nav>

        {/* Right Tools & Status */}
        <div className="flex items-center gap-2">
          {/* AI Scriptwriter Button */}
          <button
            onClick={onOpenAiStory}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-amber-600/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:border-amber-400 hover:bg-amber-500/20 transition-all shadow-sm shadow-amber-500/10"
            title="Generate AI Story Script"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin-slow" />
            <span className="hidden sm:inline">AI Scriptwriter</span>
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition-all"
            title="Audio History"
          >
            <History className="h-4 w-4 text-slate-400" />
            {historyCount > 0 && (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                {historyCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="rounded-lg border border-slate-700 bg-slate-800/80 p-1.5 text-slate-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white transition-all"
            title="Voice & Engine Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="flex md:hidden border-t border-slate-800/60 bg-slate-950/80 px-2 py-1 justify-around">
        <button
          onClick={() => setActiveTab('studio')}
          className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium ${
            activeTab === 'studio' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          <Mic className="h-3 w-3" /> Studio
        </button>
        <button
          onClick={() => setActiveTab('storytelling')}
          className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium ${
            activeTab === 'storytelling' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          <Wand2 className="h-3 w-3 text-amber-400" /> Dastan
        </button>
        <button
          onClick={() => setActiveTab('dialogue')}
          className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium ${
            activeTab === 'dialogue' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          <Radio className="h-3 w-3 text-emerald-400" /> Dialogue
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium ${
            activeTab === 'library' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          <Layers className="h-3 w-3" /> Voices
        </button>
      </div>
    </header>
  );
};
