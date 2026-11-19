import React, { useRef, useState, useEffect, useMemo } from 'react';
import { GeneratedClip } from '../types';
import { formatTime, downloadAudio } from '../utils/audio';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Check,
  Sparkles,
} from 'lucide-react';

interface AudioPlayerProps {
  clip: GeneratedClip | null;
  onSelectClip?: (clip: GeneratedClip) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ clip }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Simulated waveform bar heights generated deterministically from clip ID
  const waveformBars = useMemo(() => {
    if (!clip) return [];
    const seed = clip.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const bars: number[] = [];
    for (let i = 0; i < 70; i++) {
      const val = Math.abs(Math.sin((i + seed) * 0.35) * 0.7 + Math.cos((i * 2 + seed) * 0.2) * 0.3);
      bars.push(Math.max(0.15, Math.min(1.0, val)));
    }
    return bars;
  }, [clip?.id]);

  useEffect(() => {
    if (audioRef.current && clip) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [playbackRate, volume, isMuted, clip]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || clip?.duration || 0);
    }
  };

  const handleSeek = (percentage: number) => {
    if (audioRef.current && duration > 0) {
      const newTime = percentage * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleShare = () => {
    if (!clip) return;
    navigator.clipboard.writeText(clip.audioUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!clip) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 p-8 text-center text-slate-500">
        <Sparkles className="mb-2 h-7 w-7 text-slate-600" />
        <p className="text-sm font-medium text-slate-400">Audio Preview & Waveform Player</p>
        <p className="text-xs text-slate-600 mt-0.5">
          Generate speech from your script above to listen, scrub waveform, and download studio audio.
        </p>
      </div>
    );
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950 p-4 shadow-xl shadow-indigo-950/20 backdrop-blur-md">
      <audio
        ref={audioRef}
        src={clip.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        autoPlay
      />

      {/* Header Info */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-white line-clamp-1">{clip.title}</span>
          <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300">
            {clip.voiceName}
          </span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
            {clip.language}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:text-white transition-colors"
            title="Copy Audio Link"
          >
            {copiedLink ? <Check className="h-3 w-3 text-emerald-400" /> : <Share2 className="h-3 w-3" />}
            <span className="text-[11px]">Copy Audio</span>
          </button>

          <button
            type="button"
            onClick={() => downloadAudio(clip.audioUrl, `${clip.title.replace(/\s+/g, '_')}.wav`)}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            <Download className="h-3 w-3" />
            <span>Download .WAV</span>
          </button>
        </div>
      </div>

      {/* Interactive Waveform Bar Visualizer */}
      <div
        className="relative my-3 flex h-16 w-full cursor-pointer items-center justify-between gap-[2px] rounded-xl bg-slate-950/80 px-3 py-2 select-none"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          handleSeek(clickX / rect.width);
        }}
      >
        {/* Scrubber Line */}
        <div
          className="absolute top-0 bottom-0 z-10 w-[2px] bg-indigo-400 pointer-events-none transition-all shadow-sm shadow-indigo-400"
          style={{ left: `${progressPercentage}%` }}
        />

        {waveformBars.map((heightMultiplier, idx) => {
          const barProgress = (idx / waveformBars.length) * 100;
          const isPassed = barProgress <= progressPercentage;

          return (
            <div
              key={idx}
              className={`w-full rounded-full transition-colors ${
                isPassed ? 'bg-indigo-400' : 'bg-slate-700 hover:bg-slate-500'
              }`}
              style={{
                height: `${Math.max(12, heightMultiplier * 48)}px`,
              }}
            />
          );
        })}
      </div>

      {/* Time and Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        {/* Playback Transport */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSkip(-5)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Rewind 5s"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-105 transition-all"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSkip(5)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Forward 5s"
          >
            <RotateCw className="h-4 w-4" />
          </button>

          <div className="font-mono text-xs font-medium text-slate-300">
            <span>{formatTime(currentTime)}</span>
            <span className="text-slate-500"> / </span>
            <span className="text-slate-400">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Speed Multipier & Volume */}
        <div className="flex items-center gap-3">
          {/* Speed Chips */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-[11px]">
            {[0.75, 1.0, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => handleSpeedChange(rate)}
                className={`rounded px-1.5 py-0.5 font-medium transition-colors ${
                  playbackRate === rate ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="rounded-lg p-1 text-slate-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4 text-rose-400" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-16 accent-indigo-500 cursor-pointer h-1.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
