import React, { useState } from 'react';
import { Voice, SUPPORTED_LANGUAGES, VOICES } from '../data/voices';
import { Play, Square, Check, ChevronDown, Sparkles, Filter, Volume2, Globe } from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoice: Voice;
  onSelectVoice: (voice: Voice) => void;
  selectedLanguage: string;
  onSelectLanguage: (langCode: string) => void;
  onPreviewVoice: (voice: Voice) => void;
  previewingVoiceId: string | null;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onSelectVoice,
  selectedLanguage,
  onSelectLanguage,
  onPreviewVoice,
  previewingVoiceId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');

  const filteredVoices = VOICES.filter((voice) => {
    const matchesLang = selectedLanguage === 'all' || voice.langCode === selectedLanguage;
    const matchesCategory = categoryFilter === 'all' || voice.category === categoryFilter;
    const matchesGender = genderFilter === 'all' || voice.gender === genderFilter;
    return matchesLang && matchesCategory && matchesGender;
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-sm">
      {/* Top Language Ribbon */}
      <div className="mb-4 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5">
          <Globe className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Language:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => onSelectLanguage('all')}
            className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              selectedLanguage === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            All (40+)
          </button>

          {SUPPORTED_LANGUAGES.slice(0, 6).map((lang) => (
            <button
              key={lang.code}
              onClick={() => onSelectLanguage(lang.code)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                selectedLanguage === lang.code
                  ? 'border border-indigo-500/40 bg-indigo-600/30 text-indigo-200 shadow-sm'
                  : 'border border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span>{lang.flag}</span>
              <span className={lang.isRtl ? 'font-urdu' : ''}>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Selected Voice Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 p-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-700 text-lg font-bold text-white shadow-md">
            {selectedVoice.name.charAt(0)}
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950 border border-slate-700 text-[10px]">
              {selectedVoice.gender === 'male' ? '♂' : '♀'}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white sm:text-base">
                {selectedVoice.name}
              </span>
              {selectedVoice.nativeName && (
                <span
                  className={`text-sm text-indigo-300 font-semibold ${
                    selectedVoice.langCode === 'ur' ? 'font-urdu' : ''
                  }`}
                >
                  ({selectedVoice.nativeName})
                </span>
              )}
              {selectedVoice.featured && (
                <span className="flex items-center gap-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                  <Sparkles className="h-2.5 w-2.5" /> Featured
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-400">
              <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[11px] text-slate-300">
                {selectedVoice.accent}
              </span>
              <span>•</span>
              <span className="capitalize text-indigo-400 font-medium">{selectedVoice.category}</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline text-slate-500">Gemini: {selectedVoice.geminiVoice}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Preview Button */}
          <button
            onClick={() => onPreviewVoice(selectedVoice)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              previewingVoiceId === selectedVoice.id
                ? 'bg-rose-600 text-white animate-pulse'
                : 'border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20'
            }`}
          >
            {previewingVoiceId === selectedVoice.id ? (
              <>
                <Square className="h-3.5 w-3.5 fill-current" /> Stop
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" /> Preview Voice
              </>
            )}
          </button>

          {/* Change Voice Dropdown Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-700 transition-all"
          >
            <span>Change Voice</span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expandable Voice Selection Grid */}
      {isOpen && (
        <div className="mt-4 border-t border-slate-800 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Quick Filters */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-400">Tone:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Tones</option>
                <option value="storytelling">Storytelling & Dastan</option>
                <option value="dramatic">Dramatic & Cinematic</option>
                <option value="conversational">Conversational & RJ</option>
                <option value="poetic">Poetic & Classical</option>
                <option value="news">Documentary & News</option>
                <option value="kids">Bedtime & Folk Tales</option>
                <option value="asmr">ASMR & Meditation</option>
              </select>

              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Genders</option>
                <option value="male">Male (♂)</option>
                <option value="female">Female (♀)</option>
              </select>
            </div>

            <span className="text-slate-500 text-xs">{filteredVoices.length} voice personas available</span>
          </div>

          {/* Voice Cards Grid */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 max-h-80 overflow-y-auto pr-1">
            {filteredVoices.map((voice) => {
              const isSelected = voice.id === selectedVoice.id;
              const isPreviewing = previewingVoiceId === voice.id;

              return (
                <div
                  key={voice.id}
                  onClick={() => {
                    onSelectVoice(voice);
                    setIsOpen(false);
                  }}
                  className={`group relative flex cursor-pointer items-start justify-between rounded-xl border p-3 transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/30 shadow-md shadow-indigo-500/10'
                      : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold text-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {voice.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-100">{voice.name}</span>
                        {voice.nativeName && (
                          <span
                            className={`text-[11px] text-slate-400 ${
                              voice.langCode === 'ur' ? 'font-urdu' : ''
                            }`}
                          >
                            {voice.nativeName}
                          </span>
                        )}
                        {isSelected && <Check className="h-3.5 w-3.5 text-indigo-400" />}
                      </div>

                      <p className="line-clamp-2 text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {voice.description}
                      </p>

                      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span className="rounded bg-slate-800/80 px-1 py-0.5">{voice.accent}</span>
                        <span className="capitalize text-indigo-300">{voice.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick sample preview */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewVoice(voice);
                    }}
                    className={`ml-2 rounded-md p-1.5 transition-colors ${
                      isPreviewing
                        ? 'bg-rose-500 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-indigo-300'
                    }`}
                    title="Listen to sample"
                  >
                    {isPreviewing ? (
                      <Square className="h-3 w-3 fill-current" />
                    ) : (
                      <Volume2 className="h-3 w-3" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
