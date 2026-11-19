import React, { useState } from 'react';
import { X, Key, Check, Info, ShieldCheck, Zap } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [elevenLabsKey, setElevenLabsKey] = useState(settings.elevenLabsApiKey || '');
  const [defaultEngine, setDefaultEngine] = useState<'gemini' | 'elevenlabs'>(settings.defaultEngine);
  const [autoPlay, setAutoPlay] = useState(settings.autoPlayAfterGenerate);
  const [savedMessage, setSavedMessage] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      elevenLabsApiKey: elevenLabsKey.trim(),
      defaultEngine,
      autoPlayAfterGenerate: autoPlay,
    });
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-[#0F1420] p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Voice Studio Settings</h3>
              <p className="text-xs text-slate-400">Configure AI speech synthesis engines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Default Engine */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Primary Voice Engine:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDefaultEngine('gemini')}
                className={`flex flex-col items-start rounded-xl border p-2.5 text-left transition-all ${
                  defaultEngine === 'gemini'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className="font-bold text-xs text-indigo-300">Gemini 3.8 TTS</span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  High-speed, unlimited, zero credit limits, 24kHz WAV
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDefaultEngine('elevenlabs')}
                className={`flex flex-col items-start rounded-xl border p-2.5 text-left transition-all ${
                  defaultEngine === 'elevenlabs'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className="font-bold text-xs text-indigo-300">ElevenLabs v2</span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Multilingual v2 (Requires your personal XI API Key)
                </span>
              </button>
            </div>
          </div>

          {/* ElevenLabs API Key */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Key className="h-3.5 w-3.5 text-indigo-400" />
                ElevenLabs API Key (Optional):
              </label>
              <span className="text-[10px] text-slate-500">Stored locally in browser</span>
            </div>
            <input
              type="password"
              value={elevenLabsKey}
              onChange={(e) => setElevenLabsKey(e.target.value)}
              placeholder="xi-..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Leave blank to use Gemini 3.8 Flash voice engine with zero credit limits.
            </p>
          </div>

          {/* Auto-play toggle */}
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            <div>
              <span className="font-semibold text-slate-200 block text-xs">Auto-Play Audio</span>
              <span className="text-[11px] text-slate-400">
                Automatically start playback when speech finishes rendering
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoPlay}
              onChange={(e) => setAutoPlay(e.target.checked)}
              className="h-4 w-4 rounded accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Privacy Note */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-2.5 flex items-start gap-2 text-[11px] text-emerald-300">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>
              All audio rendering runs securely through the backend. Your keys are never exposed in client bundles.
            </span>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-colors shadow-sm"
            >
              {savedMessage ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Settings</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
