import React, { useState, useEffect, useRef } from 'react';
import { VOICES, Voice, StoryPreset, STORY_PRESETS } from './data/voices';
import { GeneratedClip, AppSettings, DialogueLine } from './types';
import { Header } from './components/Header';
import { VoiceSelector } from './components/VoiceSelector';
import { ScriptEditor } from './components/ScriptEditor';
import { VoiceControls } from './components/VoiceControls';
import { AudioPlayer } from './components/AudioPlayer';
import { DialogueStudio } from './components/DialogueStudio';
import { AiStoryModal } from './components/AiStoryModal';
import { SettingsModal } from './components/SettingsModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { VoiceLibraryModal } from './components/VoiceLibraryModal';
import { estimateSpeechDuration } from './utils/audio';
import {
  Sparkles,
  Zap,
  Volume2,
  Wand2,
  BookOpen,
  Radio,
  Sliders,
  CheckCircle2,
  Shield,
  Clock,
  Layers,
} from 'lucide-react';

const STORAGE_KEY_HISTORY = 'voxflow_audio_history_v1';
const STORAGE_KEY_SETTINGS = 'voxflow_app_settings_v1';

export default function App() {
  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<'studio' | 'storytelling' | 'dialogue' | 'library'>('studio');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAiStoryOpen, setIsAiStoryOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isVoiceLibraryOpen, setIsVoiceLibraryOpen] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      elevenLabsApiKey: '',
      defaultEngine: 'gemini',
      autoPlayAfterGenerate: true,
      sampleRate: 24000,
      outputFormat: 'wav',
    };
  });

  // Voice & Language Selection (Default to Tariq Mahmood for realistic Pakistani Urdu storytelling)
  const defaultVoice = VOICES.find((v) => v.id === 'tariq-urdu') || VOICES[0];
  const [selectedVoice, setSelectedVoice] = useState<Voice>(defaultVoice);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ur');

  // Script & Vocal Performance
  const defaultPreset = STORY_PRESETS[0];
  const [text, setText] = useState<string>(defaultPreset.text);
  const [stylePrompt, setStylePrompt] = useState<string>(defaultVoice.recommendedStyle);
  const [speed, setSpeed] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(0);
  const [modelEngine, setModelEngine] = useState<'gemini' | 'elevenlabs'>(settings.defaultEngine);

  // Audio Generation & Playback
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeClip, setActiveClip] = useState<GeneratedClip | null>(null);
  const [history, setHistory] = useState<GeneratedClip[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Voice Preview State
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Server Status
  const [serverStatus, setServerStatus] = useState<{
    hasGeminiKey: boolean;
    hasElevenLabsKey: boolean;
  }>({ hasGeminiKey: true, hasElevenLabsKey: false });

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(0, 30)));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  // Save settings to localStorage
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    setModelEngine(newSettings.defaultEngine);
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
  };

  // Check health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setServerStatus({
          hasGeminiKey: data.hasGeminiKey,
          hasElevenLabsKey: data.hasElevenLabsKey,
        });
      })
      .catch((err) => console.log('Health check note:', err));
  }, []);

  // Update voice style when voice changes
  const handleSelectVoice = (voice: Voice) => {
    setSelectedVoice(voice);
    setStylePrompt(voice.recommendedStyle);
  };

  // Apply a story preset
  const handleApplyPreset = (preset: StoryPreset) => {
    setText(preset.text);
    const matchedVoice = VOICES.find((v) => v.id === preset.voiceId);
    if (matchedVoice) {
      setSelectedVoice(matchedVoice);
      setStylePrompt(matchedVoice.recommendedStyle);
      setSelectedLanguage(matchedVoice.langCode);
    }
  };

  // Preview Voice Sample
  const handlePreviewVoice = async (voice: Voice) => {
    if (previewingVoiceId === voice.id) {
      // Stop preview
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
      setPreviewingVoiceId(null);
      return;
    }

    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }

    setPreviewingVoiceId(voice.id);

    try {
      const sampleText = voice.samplePrompt.substring(0, 160);
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sampleText,
          voiceName: voice.geminiVoice,
          stylePrompt: voice.recommendedStyle,
          language: voice.language,
          model: 'gemini',
        }),
      });

      const data = await res.json();
      if (data.audioBase64) {
        const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
        const audio = new Audio(audioSrc);
        previewAudioRef.current = audio;
        audio.onended = () => setPreviewingVoiceId(null);
        audio.onerror = () => setPreviewingVoiceId(null);
        await audio.play();
      } else {
        setPreviewingVoiceId(null);
      }
    } catch (err) {
      console.error('Preview error:', err);
      setPreviewingVoiceId(null);
    }
  };

  // Main Speech Generation
  const handleGenerateSpeech = async () => {
    if (!text.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const payload: any = {
        text: text.trim(),
        voiceName: selectedVoice.geminiVoice,
        stylePrompt: stylePrompt || selectedVoice.recommendedStyle,
        language: selectedVoice.language,
        speed,
        pitch,
        model: modelEngine,
        elevenLabsApiKey: settings.elevenLabsApiKey || undefined,
      };

      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok && !data.audioBase64) {
        throw new Error(data.error || 'Failed to generate audio');
      }

      const mimeType = data.mimeType || 'audio/wav';
      const audioUrl = `data:${mimeType};base64,${data.audioBase64}`;
      const estimatedSec = estimateSpeechDuration(text, speed);

      // Create new clip
      const newClip: GeneratedClip = {
        id: `clip-${Date.now()}`,
        title: text.slice(0, 32).trim() + (text.length > 32 ? '...' : ''),
        text: text.trim(),
        voiceId: selectedVoice.id,
        voiceName: selectedVoice.name,
        language: selectedVoice.language,
        audioUrl,
        audioBase64: data.audioBase64,
        mimeType,
        duration: estimatedSec,
        createdAt: Date.now(),
        provider: data.provider || 'Gemini 3.8 Flash TTS',
        model: data.model || 'gemini-3.8-flash-lite-tts',
        stylePrompt,
        speed,
      };

      setActiveClip(newClip);
      setHistory((prev) => [newClip, ...prev]);
    } catch (err: any) {
      console.error('Generation Error:', err);
      alert(`Speech generation error: ${err.message || 'Please try again'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Dual-Speaker Dialogue Generation
  const handleGenerateDialogue = async (
    speaker1: { name: string; voiceName: string },
    speaker2: { name: string; voiceName: string },
    dialogueLines: DialogueLine[]
  ) => {
    setIsGenerating(true);
    try {
      const parts = dialogueLines.map((l) => ({
        speaker: l.speaker,
        text: l.text,
        voiceName: l.voiceName,
        style: l.style,
      }));

      // Full text preview
      const fullDialogueText = dialogueLines.map((l) => `${l.speaker}: ${l.text}`).join('\n');

      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dialogueParts: parts.slice(0, 2), // Gemini 3.8 multiSpeakerVoiceConfig requires exactly 2 speaker configs
          text: fullDialogueText,
          language: selectedVoice.language,
          model: 'gemini',
        }),
      });

      const data = await res.json();
      if (!res.ok && !data.audioBase64) {
        throw new Error(data.error || 'Failed to render dialogue');
      }

      const mimeType = data.mimeType || 'audio/wav';
      const audioUrl = `data:${mimeType};base64,${data.audioBase64}`;

      const newClip: GeneratedClip = {
        id: `dialogue-${Date.now()}`,
        title: `Dialogue: ${speaker1.name} & ${speaker2.name}`,
        text: fullDialogueText,
        voiceId: 'dual-speaker',
        voiceName: `${speaker1.name} & ${speaker2.name}`,
        language: selectedVoice.language,
        audioUrl,
        audioBase64: data.audioBase64,
        mimeType,
        duration: estimateSpeechDuration(fullDialogueText, 1.0),
        createdAt: Date.now(),
        provider: 'Gemini 3.8 Multi-Speaker',
        model: 'gemini-3.8-flash-tts',
        speed: 1.0,
      };

      setActiveClip(newClip);
      setHistory((prev) => [newClip, ...prev]);
      setActiveTab('studio');
    } catch (err: any) {
      console.error('Dialogue Error:', err);
      alert(`Screenplay error: ${err.message || 'Could not render dialogue'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Keyboard shortcut Ctrl+Enter or Cmd+Enter to generate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleGenerateSpeech();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [text, selectedVoice, stylePrompt, speed, pitch, modelEngine, isGenerating]);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col antialiased">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'library') {
            setIsVoiceLibraryOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAiStory={() => setIsAiStoryOpen(true)}
        serverStatus={serverStatus}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 space-y-5">
        {/* Storytelling & Dastan-goi Mode Banner if selected */}
        {activeTab === 'storytelling' && (
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 p-4 shadow-lg backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 shadow-md">
                  <Wand2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white sm:text-base flex items-center gap-2">
                    Dastangoi, Folklore & Storytelling Studio
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300 font-normal border border-amber-500/30">
                      Classic Pakistani Urdu & World Lore
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Authentic Pakistani Urdu mystery dastans (داستان گوئی), Hindi kathas, bedtime folk tales & Québécois legends with specialized pacing.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAiStoryOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Generate New Story with AI</span>
                </button>
              </div>
            </div>

            {/* Featured Story Cards */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {STORY_PRESETS.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleApplyPreset(p)}
                  className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-3 hover:border-amber-500/40 hover:bg-slate-800/50 transition-all"
                >
                  <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold mb-1">
                    <span>{p.category}</span>
                    <span className="text-slate-500">{p.language}</span>
                  </div>
                  <h3 className={`text-xs font-bold text-slate-200 line-clamp-1 ${p.langCode === 'ur' ? 'font-urdu' : ''}`}>
                    {p.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 1 & Tab 2: Studio / Storytelling UI */}
        {(activeTab === 'studio' || activeTab === 'storytelling') && (
          <div className="space-y-4">
            {/* Voice Selector */}
            <VoiceSelector
              selectedVoice={selectedVoice}
              onSelectVoice={handleSelectVoice}
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
              onPreviewVoice={handlePreviewVoice}
              previewingVoiceId={previewingVoiceId}
            />

            {/* Script Text Input */}
            <ScriptEditor
              text={text}
              onChangeText={setText}
              selectedVoice={selectedVoice}
              speed={speed}
              onApplyPreset={handleApplyPreset}
              onOpenAiStory={() => setIsAiStoryOpen(true)}
            />

            {/* Voice Controls: Style, Speed, Pitch, Generate */}
            <VoiceControls
              selectedVoice={selectedVoice}
              stylePrompt={stylePrompt}
              onChangeStylePrompt={setStylePrompt}
              speed={speed}
              onChangeSpeed={setSpeed}
              pitch={pitch}
              onChangePitch={setPitch}
              isGenerating={isGenerating}
              onGenerate={handleGenerateSpeech}
              hasText={Boolean(text.trim())}
              modelEngine={modelEngine}
              onChangeModelEngine={setModelEngine}
              hasElevenLabsKey={Boolean(settings.elevenLabsApiKey || serverStatus.hasElevenLabsKey)}
            />

            {/* Interactive Audio Waveform Player */}
            <AudioPlayer clip={activeClip} />
          </div>
        )}

        {/* Tab 3: Dual Dialogue Studio */}
        {activeTab === 'dialogue' && (
          <div className="space-y-4">
            <DialogueStudio
              onGenerateDialogue={handleGenerateDialogue}
              isGenerating={isGenerating}
            />
            {activeClip && <AudioPlayer clip={activeClip} />}
          </div>
        )}

        {/* Bottom Feature Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-slate-800/80 pt-5 text-xs text-slate-400">
          <div className="flex items-center gap-2 rounded-xl bg-slate-900/30 p-2.5 border border-slate-800/50">
            <Zap className="h-4 w-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-semibold text-slate-200 block">Unlimited Generations</span>
              <span className="text-[10px] text-slate-500">No tokens, no credit limit</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-900/30 p-2.5 border border-slate-800/50">
            <Volume2 className="h-4 w-4 text-indigo-400 shrink-0" />
            <div>
              <span className="font-semibold text-slate-200 block">Pakistani Urdu Dastan</span>
              <span className="text-[10px] text-slate-500">Authentic Nasta'liq diction</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-900/30 p-2.5 border border-slate-800/50">
            <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold text-slate-200 block">Studio Quality .WAV</span>
              <span className="text-[10px] text-slate-500">24kHz 16-bit uncompressed</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-900/30 p-2.5 border border-slate-800/50">
            <Radio className="h-4 w-4 text-violet-400 shrink-0" />
            <div>
              <span className="font-semibold text-slate-200 block">40+ Global Languages</span>
              <span className="text-[10px] text-slate-500">Hindi, Québécois, Arabic & more</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0B0F17] py-4 text-center text-xs text-slate-500">
        <p>
          TEXT TO SPEECH GENERATOR • Powered by Gemini 3.8 Flash Neural Speech Architecture & ElevenLabs Multilingual Integration
        </p>
      </footer>

      {/* Modals & Drawers */}
      <AiStoryModal
        isOpen={isAiStoryOpen}
        onClose={() => setIsAiStoryOpen(false)}
        initialLanguage={selectedVoice.language}
        onUseScript={(script, suggestedStyle) => {
          setText(script);
          if (suggestedStyle) setStylePrompt(suggestedStyle);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        clips={history}
        activeClipId={activeClip?.id}
        onPlayClip={(clip) => {
          setActiveClip(clip);
          setIsHistoryOpen(false);
        }}
        onDeleteClip={(id) => setHistory((prev) => prev.filter((c) => c.id !== id))}
        onClearAll={() => setHistory([])}
      />

      <VoiceLibraryModal
        isOpen={isVoiceLibraryOpen}
        onClose={() => setIsVoiceLibraryOpen(false)}
        onSelectVoice={(voice) => {
          handleSelectVoice(voice);
          setSelectedLanguage(voice.langCode);
        }}
        onPreviewVoice={handlePreviewVoice}
        previewingVoiceId={previewingVoiceId}
        selectedVoiceId={selectedVoice.id}
      />
    </div>
  );
}
