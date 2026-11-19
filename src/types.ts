export interface GeneratedClip {
  id: string;
  title: string;
  text: string;
  voiceId: string;
  voiceName: string;
  language: string;
  audioUrl: string;
  audioBase64: string;
  mimeType: string;
  duration: number; // in seconds
  createdAt: number;
  provider: string;
  model: string;
  stylePrompt?: string;
  speed: number;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  voiceName: string;
  voiceId: string;
  text: string;
  style?: string;
}

export interface AppSettings {
  elevenLabsApiKey: string;
  defaultEngine: 'gemini' | 'elevenlabs';
  autoPlayAfterGenerate: boolean;
  sampleRate: number;
  outputFormat: 'wav' | 'mp3';
}
