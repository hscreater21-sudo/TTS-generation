import React from 'react';
import { Voice } from '../data/voices';
import { Sliders, Sparkles, Zap, Flame, Loader2, Play } from 'lucide-react';

interface VoiceControlsProps {
  selectedVoice: Voice;
  stylePrompt: string;
  onChangeStylePrompt: (style: string) => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
  pitch: number;
  onChangePitch: (pitch: number) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  hasText: boolean;
  modelEngine: 'gemini' | 'elevenlabs';
  onChangeModelEngine: (engine: 'gemini' | 'elevenlabs') => void;
  hasElevenLabsKey: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  selectedVoice,
  stylePrompt,
  onChangeStylePrompt,
  speed,
  onChangeSpeed,
  pitch,
  onChangePitch,
  isGenerating,
  onGenerate,
  hasText,
  modelEngine,
  onChangeModelEngine,
  hasElevenLabsKey,
}) => {
  const quickStyles = [
    { label: 'Dastan-goi Mystery', style: 'Authentic Pakistani Urdu Dastan-goi with deep raspy baritone, dramatic suspenseful pauses, and vivid atmospheric mystery.' },
    { label: 'Poetic Novelist', style: 'Graceful, heartwarming literary narrator. Melodic, rich emotional nuance with gentle cadence.' },
    { label: 'Cinematic Baritone', style: 'Deep, cinematic Hollywood movie trailer baritone. Gritty, commanding, and thunderous suspense.' },
    { label: 'Warm Bedtime Story', style: 'Warm, comforting bedtime storyteller. Gentle, soothing cadence with loving presence.' },
    { label: 'News & Documentary', style: 'Authoritative, pristine documentary presenter with crisp diction and steady rhythmic pacing.' },
    { label: 'ASMR Whisper', style: 'Whispering, serene meditation and ASMR guide. Slow, rhythmic breathwork with peaceful presence.' },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-sm">
      {/* Performance & Style Settings */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Vocal Performance & Persona Style
          </label>
          <button
            type="button"
            onClick={() => onChangeStylePrompt(selectedVoice.recommendedStyle)}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Reset to Voice Default
          </button>
        </div>

        <input
          type="text"
          value={stylePrompt}
          onChange={(e) => onChangeStylePrompt(e.target.value)}
          placeholder="e.g. Deep Pakistani Urdu Dastangoi with slow suspenseful pauses and raspy tone..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        {/* Quick Style Chips */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {quickStyles.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onChangeStylePrompt(item.style)}
              className="rounded-full border border-slate-800 bg-slate-800/40 px-2.5 py-0.5 text-[10px] text-slate-400 hover:border-indigo-500/30 hover:bg-indigo-950/30 hover:text-indigo-200 transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Speed Slider */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Sliders className="h-3.5 w-3.5 text-indigo-400" />
              Narration Speed
            </span>
            <span className="font-mono text-xs font-semibold text-indigo-300">{speed.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.75"
            step="0.05"
            value={speed}
            onChange={(e) => onChangeSpeed(parseFloat(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>0.5x (Slow Dastan)</span>
            <span>1.0x (Normal)</span>
            <span>1.75x (Rapid)</span>
          </div>
        </div>

        {/* Pitch Slider */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Flame className="h-3.5 w-3.5 text-violet-400" />
              Vocal Pitch / Depth
            </span>
            <span className="font-mono text-xs font-semibold text-violet-300">
              {pitch > 0 ? `+${pitch}` : pitch}
            </span>
          </div>
          <input
            type="range"
            min="-5"
            max="5"
            step="1"
            value={pitch}
            onChange={(e) => onChangePitch(parseInt(e.target.value, 10))}
            className="w-full accent-violet-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>-5 (Deep Baritone)</span>
            <span>0 (Natural)</span>
            <span>+5 (Higher)</span>
          </div>
        </div>
      </div>

      {/* Engine Selection & Generate CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
        {/* Engine Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Engine:</span>
          <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1">
            <button
              type="button"
              onClick={() => onChangeModelEngine('gemini')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                modelEngine === 'gemini'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="h-3 w-3 text-amber-300" />
              Gemini 3.8 TTS
              <span className="text-[10px] opacity-75 font-normal">(Free & Unlimited)</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeModelEngine('elevenlabs')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                modelEngine === 'elevenlabs'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ElevenLabs
              {hasElevenLabsKey ? (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              ) : (
                <span className="text-[10px] text-amber-400/80">(Key req.)</span>
              )}
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating || !hasText}
          className="relative group w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating Speech...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current transition-transform group-hover:scale-110" />
              <span>Generate Speech</span>
              <kbd className="hidden sm:inline-block rounded bg-indigo-700/50 px-1.5 py-0.5 text-[10px] font-mono opacity-80">
                ⌘ Enter
              </kbd>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
