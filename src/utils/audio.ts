/**
 * Audio helpers for Text-to-Speech Studio
 */

export function estimateSpeechDuration(text: string, speed = 1.0): number {
  if (!text) return 0;
  // Estimate average words per minute (approx 135 wpm for natural storytelling)
  const words = text.trim().split(/\s+/).length;
  const minutes = words / (135 * Math.max(0.5, speed));
  return Math.max(1, Math.round(minutes * 60));
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function downloadAudio(dataUrlOrBlobUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrlOrBlobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Fallback Web Speech synthesis to vocalize text if API key quota is hit
 */
export function playWebSpeechFallback(
  text: string,
  langCode: string,
  speed = 1.0,
  pitch = 1.0,
  onEnd?: () => void
): SpeechSynthesisUtterance | null {
  if (!('speechSynthesis' in window)) return null;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = speed;
  utterance.pitch = pitch;

  // Attempt to find voice matching language
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(
    (v) => v.lang.toLowerCase().startsWith(langCode.toLowerCase()) || v.lang.includes(langCode)
  );
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}
