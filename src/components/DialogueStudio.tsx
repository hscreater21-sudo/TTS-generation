import React, { useState } from 'react';
import { Voice, VOICES } from '../data/voices';
import { DialogueLine } from '../types';
import { Users, Plus, Trash2, Play, Loader2, Sparkles, Wand2 } from 'lucide-react';

interface DialogueStudioProps {
  onGenerateDialogue: (speaker1: { name: string; voiceName: string }, speaker2: { name: string; voiceName: string }, lines: DialogueLine[]) => void;
  isGenerating: boolean;
}

export const DialogueStudio: React.FC<DialogueStudioProps> = ({ onGenerateDialogue, isGenerating }) => {
  const [speaker1Voice, setSpeaker1Voice] = useState<Voice>(
    VOICES.find((v) => v.id === 'tariq-urdu') || VOICES[0]
  );
  const [speaker2Voice, setSpeaker2Voice] = useState<Voice>(
    VOICES.find((v) => v.id === 'zainab-urdu') || VOICES[1]
  );

  const [lines, setLines] = useState<DialogueLine[]>([
    {
      id: '1',
      speaker: 'Tariq',
      voiceName: speaker1Voice.geminiVoice,
      voiceId: speaker1Voice.id,
      text: 'زینب! کیا تم نے بھی اس حویلی کی چھت سے وہ پراسرار سرگوشی سنی تھی؟',
      style: 'Dramatic suspenseful whisper',
    },
    {
      id: '2',
      speaker: 'Zainab',
      voiceName: speaker2Voice.geminiVoice,
      voiceId: speaker2Voice.id,
      text: 'ہاں طارق... |mhm| ہوا میں کچھ ایسا تھا جو برسوں پرانا تھا۔ چلو دروازہ بند کرتے ہیں۔',
      style: 'Nervous, emotional Urdu novelist',
    },
  ]);

  const addLine = (speakerNum: 1 | 2) => {
    const isFirst = speakerNum === 1;
    const newLine: DialogueLine = {
      id: Math.random().toString(36).substring(7),
      speaker: isFirst ? 'Tariq' : 'Zainab',
      voiceName: isFirst ? speaker1Voice.geminiVoice : speaker2Voice.geminiVoice,
      voiceId: isFirst ? speaker1Voice.id : speaker2Voice.id,
      text: '',
    };
    setLines([...lines, newLine]);
  };

  const updateLineText = (id: string, text: string) => {
    setLines(lines.map((l) => (l.id === id ? { ...l, text } : l)));
  };

  const removeLine = (id: string) => {
    if (lines.length <= 2) return;
    setLines(lines.filter((l) => l.id !== id));
  };

  const loadSampleDialogue = () => {
    setLines([
      {
        id: '1',
        speaker: 'Tariq',
        voiceName: speaker1Voice.geminiVoice,
        voiceId: speaker1Voice.id,
        text: 'رات کے اندھیرے میں شاہی قلعے کے دروازے بند ہو چکے ہیں۔ اب صرف ہوا کی سرسراہٹ باقی ہے۔',
        style: 'Deep suspenseful dastan narrator',
      },
      {
        id: '2',
        speaker: 'Zainab',
        voiceName: speaker2Voice.geminiVoice,
        voiceId: speaker2Voice.id,
        text: 'اور وہ چراغ جو جھروکے پر روشن ہے... کیا وہ واقعی کسی کا انتظار کر رہا ہے؟',
        style: 'Gentle, curious, poetic',
      },
      {
        id: '3',
        speaker: 'Tariq',
        voiceName: speaker1Voice.geminiVoice,
        voiceId: speaker1Voice.id,
        text: 'ہاں... اور شاید آج کی رات وہ انتظار ختم ہونے والا ہے۔',
        style: 'Gravelly, thrilling conclusion',
      },
    ]);
  };

  const handleGenerate = () => {
    onGenerateDialogue(
      { name: 'Tariq', voiceName: speaker1Voice.geminiVoice },
      { name: 'Zainab', voiceName: speaker2Voice.geminiVoice },
      lines
    );
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-sm">
      {/* Studio Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-400" />
          <div>
            <h2 className="text-sm font-bold text-white">Dual Dialogue & Screenplay Studio</h2>
            <p className="text-xs text-slate-400">
              Cast two distinct AI voice actors and generate multi-character conversation powered by Gemini 3.8 Flash TTS
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadSampleDialogue}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white transition-colors"
        >
          <Wand2 className="h-3.5 w-3.5 text-amber-400" />
          <span>Load Screenplay Preset</span>
        </button>
      </div>

      {/* Voice Casting Section */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Speaker 1 */}
        <div className="rounded-xl border border-indigo-500/30 bg-slate-950/60 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300">Speaker 1 (Character A)</span>
            <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] text-indigo-300 font-mono">
              Voice: {speaker1Voice.geminiVoice}
            </span>
          </div>

          <select
            value={speaker1Voice.id}
            onChange={(e) => {
              const v = VOICES.find((voice) => voice.id === e.target.value);
              if (v) setSpeaker1Voice(v);
            }}
            className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            {VOICES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.language} - {v.category})
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-slate-500">{speaker1Voice.description}</p>
        </div>

        {/* Speaker 2 */}
        <div className="rounded-xl border border-violet-500/30 bg-slate-950/60 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-violet-300">Speaker 2 (Character B)</span>
            <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-[10px] text-violet-300 font-mono">
              Voice: {speaker2Voice.geminiVoice}
            </span>
          </div>

          <select
            value={speaker2Voice.id}
            onChange={(e) => {
              const v = VOICES.find((voice) => voice.id === e.target.value);
              if (v) setSpeaker2Voice(v);
            }}
            className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-violet-500 focus:outline-none"
          >
            {VOICES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.language} - {v.category})
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-slate-500">{speaker2Voice.description}</p>
        </div>
      </div>

      {/* Screenplay Turn List */}
      <div className="space-y-3 mb-4">
        {lines.map((line, idx) => {
          const isSpeaker1 = line.speaker === 'Tariq';
          const currentVoice = isSpeaker1 ? speaker1Voice : speaker2Voice;
          const isUrdu = currentVoice.langCode === 'ur';

          return (
            <div
              key={line.id}
              className={`flex items-start gap-3 rounded-xl border p-3 transition-all ${
                isSpeaker1
                  ? 'border-indigo-500/20 bg-indigo-950/10'
                  : 'border-violet-500/20 bg-violet-950/10'
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${
                  isSpeaker1 ? 'bg-indigo-600' : 'bg-violet-600'
                }`}
              >
                {line.speaker.charAt(0)}
              </div>

              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className={`font-semibold ${isSpeaker1 ? 'text-indigo-300' : 'text-violet-300'}`}>
                    {line.speaker} ({currentVoice.name})
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">#{idx + 1}</span>
                    {lines.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        className="text-slate-500 hover:text-rose-400"
                        title="Delete line"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                <textarea
                  value={line.text}
                  onChange={(e) => updateLineText(line.id, e.target.value)}
                  placeholder="Enter dialogue script..."
                  rows={2}
                  dir={isUrdu ? 'rtl' : 'ltr'}
                  className={`w-full resize-none rounded-lg border border-slate-800 bg-slate-950/80 p-2 text-xs leading-relaxed text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none ${
                    isUrdu ? 'font-urdu text-sm text-right' : ''
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Lines & Generate CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => addLine(1)}
            className="flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20"
          >
            <Plus className="h-3 w-3" /> Add {speaker1Voice.name}
          </button>
          <button
            type="button"
            onClick={() => addLine(2)}
            className="flex items-center gap-1 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300 hover:bg-violet-500/20"
          >
            <Plus className="h-3 w-3" /> Add {speaker2Voice.name}
          </button>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || lines.some((l) => !l.text.trim())}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Rendering Dual Dialogue...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              <span>Generate Dual Screenplay Audio</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
