import React, { useMemo } from 'react';
import { Voice, STORY_PRESETS, StoryPreset } from '../data/voices';
import { estimateSpeechDuration } from '../utils/audio';
import { Sparkles, Trash2, Copy, Check, Clock, BookOpen, Quote } from 'lucide-react';

interface ScriptEditorProps {
  text: string;
  onChangeText: (text: string) => void;
  selectedVoice: Voice;
  speed: number;
  onApplyPreset: (preset: StoryPreset) => void;
  onOpenAiStory: () => void;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  text,
  onChangeText,
  selectedVoice,
  speed,
  onApplyPreset,
  onOpenAiStory,
}) => {
  const [copied, setCopied] = React.useState(false);

  // Auto-detect RTL if Arabic/Urdu characters are present
  const isRtl = useMemo(() => {
    return /[\u0600-\u06FF\u0750-\u077F]/.test(text) || selectedVoice.langCode === 'ur' || selectedVoice.langCode === 'ar';
  }, [text, selectedVoice]);

  const estimatedDuration = useMemo(() => {
    return estimateSpeechDuration(text, speed);
  }, [text, speed]);

  const wordCount = useMemo(() => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }, [text]);

  const insertTag = (tag: string) => {
    onChangeText(text ? `${text} ${tag} ` : `${tag} `);
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter relevant presets for current language
  const relevantPresets = STORY_PRESETS.filter(
    (p) => p.langCode === selectedVoice.langCode || p.language.includes(selectedVoice.language)
  );
  const displayPresets = relevantPresets.length > 0 ? relevantPresets : STORY_PRESETS.slice(0, 4);

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-sm">
      {/* Editor Header & Preset Shortcuts */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Script & Narration Input
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenAiStory}
            className="flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-all"
            title="Generate AI Story for this voice"
          >
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Generate Story</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!text}
            className="rounded-md border border-slate-700 bg-slate-800 p-1.5 text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
            title="Copy script"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => onChangeText('')}
            disabled={!text}
            className="rounded-md border border-slate-700 bg-slate-800 p-1.5 text-slate-400 hover:text-rose-400 disabled:opacity-40 transition-colors"
            title="Clear text"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Story Presets Bar */}
      <div className="mb-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 shrink-0 text-[11px] flex items-center gap-1">
          <Quote className="h-3 w-3 text-indigo-400" /> Presets:
        </span>
        {displayPresets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onApplyPreset(preset)}
            className="whitespace-nowrap rounded-lg border border-slate-800 bg-slate-800/60 px-2.5 py-1 text-xs text-slate-300 hover:border-indigo-500/40 hover:bg-indigo-950/40 hover:text-indigo-200 transition-all"
            title={preset.description}
          >
            <span className={preset.langCode === 'ur' ? 'font-urdu' : ''}>{preset.title}</span>
          </button>
        ))}
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder={
            isRtl
              ? 'یہاں اپنی کہانی، داستان یا متن لکھیں یا اوپر دیئے گئے پری سیٹس میں سے منتخب کریں...'
              : 'Type, paste your narrative script, or select a story preset above...'
          }
          dir={isRtl ? 'rtl' : 'ltr'}
          rows={7}
          className={`w-full resize-none rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm leading-relaxed text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${
            isRtl ? 'font-urdu text-base text-right' : ''
          }`}
        />

        {/* Direction SSML Tags Toolbar */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/50 pt-2 text-xs">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-slate-400 text-[11px] mr-1">Voice Direction Tags:</span>
            {[
              { label: 'Pause 1s', tag: '[pause: 1s]' },
              { label: 'Whisper', tag: '[whisper]' },
              { label: '<breath>', tag: '<breath>' },
              { label: '<gasp>', tag: '<gasp>' },
              { label: '<laugh>', tag: '<laugh>' },
              { label: '|mhm|', tag: '|mhm|' },
              { label: '|yeah|', tag: '|yeah|' },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => insertTag(item.tag)}
                className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] font-mono text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors"
                title={`Insert ${item.tag}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Counts & Time */}
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>{text.length} chars</span>
            <span>•</span>
            <span>{wordCount} words</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-indigo-300">
              <Clock className="h-3 w-3" />
              ~{estimatedDuration}s audio
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
