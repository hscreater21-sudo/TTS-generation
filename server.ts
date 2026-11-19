import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const portArgIdx = process.argv.indexOf('--port');
const cliPort = portArgIdx !== -1 ? Number(process.argv[portArgIdx + 1]) : undefined;
const PORT = isProd ? (Number(process.env.PORT) || 3000) : (cliPort || 3000);

// Shared GoogleGenAI Client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const app = express();
app.use(express.json({ limit: '50mb' }));

// Helper to create a fallback WAV tone/acoustic buffer if external service unavailable
function createSpeechToneWav(durationSec = 2.5, pitchHz = 180, sampleRate = 24000): Buffer {
  const numSamples = Math.floor(sampleRate * durationSec);
  const samples = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Harmonic formant simulation for vocal-like tone
    const f0 = pitchHz + Math.sin(t * 3.5) * 12;
    const voiceEnvelope = Math.min(1, t * 5) * Math.min(1, (durationSec - t) * 4);
    const wave =
      0.5 * Math.sin(2 * Math.PI * f0 * t) +
      0.3 * Math.sin(2 * Math.PI * f0 * 2 * t) +
      0.15 * Math.sin(2 * Math.PI * f0 * 3 * t) +
      0.08 * (Math.random() * 2 - 1);
    samples[i] = wave * voiceEnvelope * 0.4;
  }

  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = samples.length * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(s < 0 ? s * 0x8000 : s * 0x7fff, offset);
    offset += 2;
  }
  return buffer;
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    hasElevenLabsKey: Boolean(process.env.ELEVENLABS_API_KEY),
    mode: isProd ? 'production' : 'development',
  });
});

// Text to Speech Generation Endpoint
app.post('/api/tts/generate', async (req: Request, res: Response) => {
  try {
    const {
      text,
      voiceName = 'Kore',
      stylePrompt = 'Natural expressive speech with authentic cadence',
      language = 'Urdu',
      dialogueParts,
      model = 'gemini',
      elevenLabsVoiceId,
      elevenLabsApiKey,
    } = req.body;

    if (!text && (!dialogueParts || dialogueParts.length === 0)) {
      return res.status(400).json({ error: 'Text or dialogue parts are required.' });
    }

    // --- OPTION A: ElevenLabs TTS API (if user specified or provided key) ---
    const effectiveElevenLabsKey = elevenLabsApiKey || process.env.ELEVENLABS_API_KEY;
    if (model === 'elevenlabs' && effectiveElevenLabsKey) {
      const voiceIdToUse = elevenLabsVoiceId || '21m00Tcm4TlvDq8ikWAM'; // Rachel fallback or user choice
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceIdToUse}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': effectiveElevenLabsKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.35,
            use_speaker_boost: true,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`ElevenLabs API returned ${response.status}: ${errText}`);
      }

      const audioBuffer = Buffer.from(await response.arrayBuffer());
      const base64Audio = audioBuffer.toString('base64');
      return res.json({
        success: true,
        audioBase64: base64Audio,
        mimeType: 'audio/mpeg',
        provider: 'ElevenLabs',
        model: 'eleven_multilingual_v2',
      });
    }

    // --- OPTION B: Gemini 3.8 Native TTS ---
    if (ai) {
      // Check if multi-speaker dialogue
      if (dialogueParts && Array.isArray(dialogueParts) && dialogueParts.length === 2) {
        const speaker1 = dialogueParts[0];
        const speaker2 = dialogueParts[1];

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${speaker1.speaker}: ${speaker1.text}`,
                  speechMetadata: {
                    speaker: speaker1.speaker,
                    style: speaker1.style || stylePrompt,
                  },
                },
                {
                  text: `${speaker2.speaker}: ${speaker2.text}`,
                  speechMetadata: {
                    speaker: speaker2.speaker,
                    style: speaker2.style || stylePrompt,
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                  {
                    speaker: speaker1.speaker,
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: speaker1.voiceName || 'Puck' },
                    },
                  },
                  {
                    speaker: speaker2.speaker,
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: speaker2.voiceName || 'Kore' },
                    },
                  },
                ],
              },
            },
          },
        });

        const base64Audio =
          response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          return res.json({
            success: true,
            audioBase64: base64Audio,
            mimeType: 'audio/wav',
            provider: 'Gemini',
            model: 'gemini-3.8-flash-tts (Dual-Speaker)',
          });
        }
      }

      // Single Speaker Standard TTS
      const validGeminiVoice = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'].includes(voiceName)
        ? voiceName
        : 'Kore';

      // Ensure style directive guides authentic pronunciation, especially for Pakistani Urdu, Hindi, or Canadian French
      const enrichedStyle = stylePrompt
        ? `${stylePrompt}. Spoken clearly in ${language} with authentic emotional nuance and native pronunciation.`
        : `Clear, professional, and authentic ${language} narrator with storytelling nuance.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text,
                speechMetadata: {
                  style: enrichedStyle,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: validGeminiVoice },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (base64Audio) {
        return res.json({
          success: true,
          audioBase64: base64Audio,
          mimeType: 'audio/wav',
          provider: 'Gemini',
          model: 'gemini-3.8-flash-lite-tts',
          voiceName: validGeminiVoice,
        });
      }
    }

    // Fallback if Gemini key is unset or returned empty
    const fallbackBuffer = createSpeechToneWav(3.0, voiceName === 'Fenrir' || voiceName === 'Charon' ? 120 : 210);
    return res.json({
      success: true,
      audioBase64: fallbackBuffer.toString('base64'),
      mimeType: 'audio/wav',
      provider: 'Studio Synthesizer (Fallback)',
      model: 'synthetic-audio-preview',
      note: 'Using acoustic preview tone. For full neural voices, ensure GEMINI_API_KEY is configured in Secrets.',
    });
  } catch (error: any) {
    console.error('TTS Generation Error:', error);

    // If API error occurred (quota, permission, etc.), provide clear error and fallback audio
    const fallbackBuffer = createSpeechToneWav(2.5, 160);
    return res.status(200).json({
      success: true,
      audioBase64: fallbackBuffer.toString('base64'),
      mimeType: 'audio/wav',
      provider: 'Studio Synthesizer (Fallback)',
      warning: error?.message || 'Gemini speech generation encountered a temporary limit. Acoustic audio generated.',
      clientSpeechFallbackRecommended: true,
    });
  }
});

// Story / Script Generator using Gemini
app.post('/api/story/generate', async (req: Request, res: Response) => {
  try {
    const { topic, language = 'Pakistani Urdu', genre = 'Mystery Dastan', tone = 'Dramatic' } = req.body;

    if (!ai) {
      return res.status(400).json({ error: 'Gemini API is not configured on the server.' });
    }

    const prompt = `You are a master multilingual voice scriptwriter and storyteller specializing in authentic audio narration for ${language}.
Genre: ${genre}
Tone: ${tone}
User topic / theme: ${topic || 'A mysterious night in an ancient city'}

Requirements:
1. Write an engaging, atmospheric story excerpt (approximately 90 to 140 words) perfectly suited for text-to-speech audio performance.
2. If ${language} is 'Pakistani Urdu' or 'Urdu', write in authentic, elegant Urdu script (Nasta'liq phrasing) using rich storytelling idioms (like classic Dastan-goi or novel style), natural pauses, and vivid sensory descriptions.
3. If ${language} is 'Hindi', write in natural Devanagari script.
4. If ${language} is 'Canadian French', write in authentic French with Québécois storytelling flavor.
5. Provide a captivating title.
6. Return only a JSON object with:
   - "title": (string)
   - "script": (string, the narration text ready to be read aloud)
   - "suggestedStyle": (string describing the vocal performance style)
   - "suggestedPacing": (string, e.g. "Slow, suspenseful, raspy dramatic pauses")`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      data: parsed,
    });
  } catch (err: any) {
    console.warn('Story Generation transient issue, providing rich fallback narrative:', err);

    // Provide instant high-quality storytelling script fallback
    const { language = 'Pakistani Urdu', topic } = req.body;
    let fallbackTitle = 'لاہور کی پراسرار داستان';
    let fallbackScript = 'رات کے سناٹے میں جب دور کسی گھڑیال نے بارہ بجائے، پرانی حویلی کے بند جھروکے سے روشنی کی ایک باریک کرن نمودار ہوئی۔ ہوا میں صندل کی مدہم خوشبو تیر رہی تھی، اور دور گلیوں سے گھنگھروؤں کی پراسرار چھنکار سنائی دینے لگی۔';
    let fallbackStyle = 'Deep, suspenseful Pakistani Urdu Dastan-goi with atmospheric resonance';

    if (language.includes('Hindi')) {
      fallbackTitle = 'प्राचीन हिमालयी कथा';
      fallbackScript = 'पर्वतों की चोटियों पर जब शाम का कुहासा उतरता है, तो उस प्राचीन आश्रम से एक दिव्य घंटी की ध्वनि गूंजती है। कहते हैं कि जिसने भी उस ध्वनि को सुना, उसका मन असीम शांति से भर गया।';
      fallbackStyle = 'Resonant and serene Hindi spiritual narrator';
    } else if (language.includes('French')) {
      fallbackTitle = 'Le Mystère du Fleuve Saint-Laurent';
      fallbackScript = 'Par une nuit de brume épaisse sur la Gaspésie, le vieux gardien du phare aperçut une lueur dansante au ras des flots. Ce n’était ni un navire, ni une étoile, mais l’esprit du grand fleuve qui veillait.';
      fallbackStyle = 'Warm and rustic Québécois storyteller with gentle folk cadence';
    } else if (language.includes('English')) {
      fallbackTitle = 'The Whispering Lighthouse';
      fallbackScript = 'On the longest night of winter, when the storm battered the rocky shores of Cape Hope, the watchman heard a soft voice calling from beneath the black waves—a voice he hadn’t heard in forty years.';
      fallbackStyle = 'Deep cinematic movie trailer baritone with gravelly suspense';
    }

    return res.json({
      success: true,
      data: {
        title: fallbackTitle,
        script: fallbackScript,
        suggestedStyle: fallbackStyle,
        suggestedPacing: 'Measured, dramatic pauses and rich emotional cadence',
      },
      fallback: true,
    });
  }
});

// Start dev or production server
async function startServer() {
  if (isProd) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TTS Studio] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
