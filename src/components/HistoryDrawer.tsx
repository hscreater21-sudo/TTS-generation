import React from 'react';
import { GeneratedClip } from '../types';
import { formatTime, downloadAudio } from '../utils/audio';
import { X, Play, Trash2, Download, History, Sparkles, Clock } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  clips: GeneratedClip[];
  onPlayClip: (clip: GeneratedClip) => void;
  onDeleteClip: (id: string) => void;
  onClearAll: () => void;
  activeClipId?: string;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  clips,
  onPlayClip,
  onDeleteClip,
  onClearAll,
  activeClipId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-slate-800 bg-[#0B0F17] p-5 shadow-2xl animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Audio History ({clips.length})</h3>
          </div>
          <div className="flex items-center gap-2">
            {clips.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* List of Clips */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {clips.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
              <Sparkles className="h-8 w-8 text-slate-600 mb-2" />
              <p className="text-xs font-semibold text-slate-400">No Generated Clips Yet</p>
              <p className="text-[11px] text-slate-600 max-w-xs mt-1">
                Your generated stories, narrations, and dialogue clips will appear here for easy playback and download.
              </p>
            </div>
          ) : (
            clips.map((clip) => {
              const isActive = clip.id === activeClipId;
              const dateStr = new Date(clip.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={clip.id}
                  className={`rounded-xl border p-3.5 transition-all ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-950/30'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs font-bold text-white line-clamp-1">{clip.title}</span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {dateStr}
                    </span>
                  </div>

                  <p className="mb-2 line-clamp-2 text-[11px] text-slate-400 leading-snug">
                    {clip.text}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-800/60 pt-2 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                        {clip.voiceName}
                      </span>
                      <span className="text-slate-400">
                        {formatTime(clip.duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onPlayClip(clip)}
                        className="flex items-center gap-1 rounded bg-indigo-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-indigo-500 transition-colors"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>Play</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadAudio(clip.audioUrl, `${clip.title}.wav`)}
                        className="rounded p-1 text-slate-400 hover:text-white transition-colors"
                        title="Download WAV"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteClip(clip.id)}
                        className="rounded p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete from history"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
