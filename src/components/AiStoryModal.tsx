import React, { useState } from 'react';
import { X, Sparkles, Loader2, Wand2, ArrowRight } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../data/voices';

interface AiStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseScript: (script: string, suggestedStyle?: string) => void;
  initialLanguage?: string;
}

export const AiStoryModal: React.FC<AiStoryModalProps> = ({
  isOpen,
  onClose,
  onUseScript,
  initialLanguage = 'Pakistani Urdu',
}) => {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState(initialLanguage);
  const [genre, setGenre] = useState('Mystery Dastan & Horror');
  const [tone, setTone] = useState('Dramatic & Suspenseful');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    title: string;
    script: string;
    suggestedStyle: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickTopics = [
    { label: '🏰 Lahore Haveli Mystery', topic: 'An eerie midnight in an old 18th-century haveli inside Lahore walled city where an unlit window glimmers', lang: 'Pakistani Urdu', genre: 'Mystery Dastan' },
    { label: '🌧️ Monsoon Nostalgia', topic: 'The scent of rain in old Anarkali bazaar and warm memories of tea and childhood games', lang: 'Pakistani Urdu', genre: 'Emotional / Nostalgia' },
    { label: '✨ Dadi Bedtime Fairy Tale', topic: 'A gentle bedtime story about a magical blue bird on Mount Qaf protecting the stars', lang: 'Pakistani Urdu', genre: 'Bedtime Fairy Tale' },
    { label: '🏔️ Himalayan Mystic', topic: 'An ancient hermit meditating in a cave near Kedarnath, sharing cosmic wisdom', lang: 'Hindi', genre: 'Mythological Katha' },
    { label: '🌊 Québec Coastal Legend', topic: 'A stormy winter night by the Saint Lawrence river and a legendary white whale', lang: 'Canadian French', genre: 'Folk Legend' },
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/story/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic || 'A mysterious night in an ancient city',
          language,
          genre,
          tone,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to generate script');
      }
      setGeneratedResult(json.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with story generator');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUse = () => {
    if (!generatedResult) return;
    onUseScript(generatedResult.script, generatedResult.suggestedStyle);
    onClose();
  };

  const isUrdu = language.toLowerCase().includes('urdu');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-[#0F1420] p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Scriptwriter & Dastan Generator</h3>
              <p className="text-xs text-slate-400">Craft rich storytelling narration tailored for vocal performance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-3.5 text-xs">
          {/* Quick Idea Chips */}
          <div>
            <span className="text-slate-400 block mb-1 text-[11px]">Instant Prompts:</span>
            <div className="flex flex-wrap gap-1.5">
              {quickTopics.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setTopic(item.topic);
                    setLanguage(item.lang);
                    setGenre(item.genre);
                  }}
                  className="rounded-lg border border-slate-800 bg-slate-900/80 px-2 py-1 text-[11px] text-slate-300 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Story Topic or Concept:</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. A mysterious midnight encounter in an ancient Lahore haveli, or a heartwarming memory of grandfather's folk stories..."
              rows={2}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Language & Genre Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Target Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
              >
                <option value="Pakistani Urdu">Pakistani Urdu (اردو)</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Canadian French">Canadian French (Français Canadien)</option>
                <option value="Arabic">Arabic (العربية)</option>
                <option value="Spanish">Spanish (Español)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Genre & Style:</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
              >
                <option value="Mystery Dastan & Horror">Mystery Dastan & Suspense</option>
                <option value="Literary Urdu Novel">Literary Novel & Romance</option>
                <option value="Bedtime Fairy Tale">Warm Bedtime Fairy Tale</option>
                <option value="Cinematic Thriller Trailer">Cinematic Thriller Trailer</option>
                <option value="Ancient Folk Legend">Ancient Folk Legend</option>
                <option value="Poetic Ghazal Narration">Poetic Narration</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                <span>Crafting Narration with Gemini AI...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                <span>Generate Narration Script</span>
              </>
            )}
          </button>

          {error && <p className="text-xs text-rose-400 text-center">{error}</p>}

          {/* Generated Result Preview */}
          {generatedResult && (
            <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">{generatedResult.title}</span>
                <span className="text-[10px] text-slate-400">Ready to speak</span>
              </div>

              <div
                dir={isUrdu ? 'rtl' : 'ltr'}
                className={`max-h-36 overflow-y-auto rounded-lg bg-slate-950/80 p-2.5 text-xs leading-relaxed text-slate-200 ${
                  isUrdu ? 'font-urdu text-sm text-right' : ''
                }`}
              >
                {generatedResult.script}
              </div>

              {generatedResult.suggestedStyle && (
                <p className="text-[11px] text-slate-400 italic">
                  Suggested Style: {generatedResult.suggestedStyle}
                </p>
              )}

              <button
                type="button"
                onClick={handleUse}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                <span>Insert into Voice Studio</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
