import React, { useState } from 'react';
import { Voice, VOICES, SUPPORTED_LANGUAGES } from '../data/voices';
import { X, Search, Play, Square, Sparkles, Plus, Check, Mic, User } from 'lucide-react';

interface VoiceLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVoice: (voice: Voice) => void;
  onPreviewVoice: (voice: Voice) => void;
  previewingVoiceId: string | null;
  selectedVoiceId: string;
}

export const VoiceLibraryModal: React.FC<VoiceLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectVoice,
  onPreviewVoice,
  previewingVoiceId,
  selectedVoiceId,
}) => {
  const [search, setSearch] = useState('');
  const [selectedLang, setSelectedLang] = useState('all');
  const [activeTab, setActiveTab] = useState<'browse' | 'designer'>('browse');

  // Custom Voice Designer State
  const [customName, setCustomName] = useState('');
  const [customLanguage, setCustomLanguage] = useState('Pakistani Urdu');
  const [customCategory, setCustomCategory] = useState<'storytelling' | 'dramatic' | 'poetic' | 'conversational'>('storytelling');
  const [customStyle, setCustomStyle] = useState('Slow, gravelly dastan storyteller with intense emotional pauses');
  const [customGeminiVoice, setCustomGeminiVoice] = useState<'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr'>('Fenrir');
  const [customVoices, setCustomVoices] = useState<Voice[]>([]);

  if (!isOpen) return null;

  const allVoices = [...customVoices, ...VOICES];
  const filteredVoices = allVoices.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.language.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase()) ||
      (v.nativeName && v.nativeName.includes(search));
    const matchesLang = selectedLang === 'all' || v.langCode === selectedLang;
    return matchesSearch && matchesLang;
  });

  const handleCreateCustomVoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newVoice: Voice = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      language: customLanguage,
      langCode: customLanguage.includes('Urdu') ? 'ur' : customLanguage.includes('Hindi') ? 'hi' : 'en-US',
      gender: customGeminiVoice === 'Kore' || customGeminiVoice === 'Zephyr' ? 'female' : 'male',
      category: customCategory,
      accent: `${customLanguage} (Custom Designed)`,
      description: `User-crafted voice persona: ${customStyle}`,
      geminiVoice: customGeminiVoice,
      recommendedStyle: customStyle,
      avatarSeed: `custom-${customName}`,
      samplePrompt: 'This is a custom-designed voice persona ready to narrate your stories with personalized cadence.',
    };

    setCustomVoices([newVoice, ...customVoices]);
    onSelectVoice(newVoice);
    setActiveTab('browse');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-slate-800 bg-[#0F1420] shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
              <Mic className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Voice Library & Persona Studio</h3>
              <p className="text-xs text-slate-400">
                Explore 40+ multilingual storytelling personas or design your own custom voice
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-1">
              <button
                onClick={() => setActiveTab('browse')}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                  activeTab === 'browse' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Browse Library
              </button>
              <button
                onClick={() => setActiveTab('designer')}
                className={`flex items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                  activeTab === 'designer' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Plus className="h-3 w-3" /> Design Persona
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {activeTab === 'browse' ? (
          <>
            {/* Search and Language Filters */}
            <div className="border-b border-slate-800/80 p-4 space-y-3 bg-slate-950/40">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by voice name, language (Urdu, Hindi, French...), or style..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="all">All Languages (40+)</option>
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name} ({l.nativeName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Voices List Grid */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredVoices.map((voice) => {
                const isSelected = voice.id === selectedVoiceId;
                const isPreviewing = previewingVoiceId === voice.id;

                return (
                  <div
                    key={voice.id}
                    className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/25 shadow-lg shadow-indigo-500/10'
                        : 'border-slate-800/80 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 font-bold text-white text-sm shadow">
                            {voice.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-white">{voice.name}</h4>
                              {voice.nativeName && (
                                <span
                                  className={`text-[11px] text-indigo-300 font-semibold ${
                                    voice.langCode === 'ur' ? 'font-urdu' : ''
                                  }`}
                                >
                                  {voice.nativeName}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400">{voice.language}</span>
                          </div>
                        </div>

                        {voice.featured && (
                          <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                            Featured
                          </span>
                        )}
                      </div>

                      <p className="line-clamp-2 text-xs text-slate-400 mb-3 leading-relaxed">
                        {voice.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-400 mb-4">
                        <span className="rounded bg-slate-800 px-1.5 py-0.5">{voice.accent}</span>
                        <span className="rounded bg-indigo-950/60 text-indigo-300 px-1.5 py-0.5 capitalize">
                          {voice.category}
                        </span>
                        <span className="rounded bg-slate-800 px-1.5 py-0.5">Gemini: {voice.geminiVoice}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 border-t border-slate-800/60 pt-3">
                      <button
                        type="button"
                        onClick={() => onPreviewVoice(voice)}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-colors ${
                          isPreviewing
                            ? 'bg-rose-600 text-white'
                            : 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        {isPreviewing ? (
                          <>
                            <Square className="h-3 w-3 fill-current" /> Stop
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 fill-current" /> Sample
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectVoice(voice);
                          onClose();
                        }}
                        className={`flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 text-white hover:bg-indigo-500'
                        }`}
                      >
                        {isSelected ? <Check className="h-3.5 w-3.5" /> : 'Use'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Custom Voice Designer Tab */
          <div className="flex-1 overflow-y-auto p-6 max-w-xl mx-auto w-full">
            <form onSubmit={handleCreateCustomVoice} className="space-y-4 text-xs">
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-3.5 flex items-start gap-2.5 text-indigo-300 text-xs">
                <Sparkles className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
                <span>
                  Design a unique voice persona with custom cadence, emotional depth, and storytelling characteristics.
                </span>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Persona Name:</label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Sultan Ali (سلطان علی) or Madame Claire"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Language:</label>
                  <select
                    value={customLanguage}
                    onChange={(e) => setCustomLanguage(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Pakistani Urdu">Pakistani Urdu (اردو)</option>
                    <option value="Hindi">Hindi (हिन्दी)</option>
                    <option value="English (US)">English (US)</option>
                    <option value="English (UK)">English (UK)</option>
                    <option value="Canadian French">Canadian French (Québécois)</option>
                    <option value="Arabic">Arabic (العربية)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Vocal Archetype:</label>
                  <select
                    value={customCategory}
                    onChange={(e: any) => setCustomCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="storytelling">Storytelling & Dastan</option>
                    <option value="dramatic">Dramatic & Cinematic</option>
                    <option value="poetic">Poetic & Resonant</option>
                    <option value="conversational">Conversational</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Base Acoustic Engine Voice:</label>
                <select
                  value={customGeminiVoice}
                  onChange={(e: any) => setCustomGeminiVoice(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Fenrir">Fenrir (Deep, commanding, raspy baritone)</option>
                  <option value="Charon">Charon (Resonant, wise, theatrical bass)</option>
                  <option value="Kore">Kore (Warm, gentle, melodic female)</option>
                  <option value="Puck">Puck (Youthful, energetic, charismatic male)</option>
                  <option value="Zephyr">Zephyr (Crisp, articulate, breathy female)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Vocal Style & Persona Prompt:
                </label>
                <textarea
                  value={customStyle}
                  onChange={(e) => setCustomStyle(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="Describe the cadence, age, pauses, and emotional weight of this persona..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:from-indigo-500 hover:to-violet-500 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Save & Activate Custom Voice Persona</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
