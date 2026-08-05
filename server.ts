import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI Client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || 'dummy_key_if_missing',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health Check Endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // API Endpoint 1: Auto Captions Generator
  app.post('/api/gemini/auto-captions', async (req, res) => {
    try {
      const { transcript, videoTopic, duration = 10, preset = 'viral' } = req.body;

      const prompt = `You are a professional video editor specializing in viral social media auto-captions.
Target video topic: "${videoTopic || 'General content'}"
Video total duration: ${duration} seconds.
${transcript ? `Raw Transcript / Text: "${transcript}"` : 'Generate an engaging, punchy, high-retention video transcript script.'}

Generate a JSON array of timestamped caption clips for a video track.
Each object in the array must have:
- text: string (Short, punchy caption segment, 3-7 words max per line)
- start: number (start timestamp in seconds)
- end: number (end timestamp in seconds, strictly after start, fitting within total ${duration} seconds)
- isHighlighted: boolean (whether key words should pop in yellow/magenta)

Output JSON schema strictly matching an array of caption items.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                start: { type: Type.NUMBER },
                end: { type: Type.NUMBER },
                isHighlighted: { type: Type.BOOLEAN },
              },
              required: ['text', 'start', 'end'],
            },
          },
        },
      });

      const jsonText = response.text || '[]';
      const captions = JSON.parse(jsonText);
      res.json({ success: true, captions });
    } catch (err: any) {
      console.error('Error generating auto-captions with Gemini:', err);
      // Graceful fallback if API key missing or error
      res.status(500).json({
        success: false,
        error: err.message || 'Failed to generate captions',
        fallbackCaptions: [
          { text: 'WELCOME TO MULTI-LAYER EDITING! 🎬', start: 0, end: 3, isHighlighted: true },
          { text: 'CHROMA KEY, KEYFRAMES & AI CAPTIONS', start: 3, end: 7, isHighlighted: true },
          { text: 'EXPORT HIGH-QUALITY VIDEO INSTANTLY 🔥', start: 7, end: 10, isHighlighted: false },
        ],
      });
    }
  });

  // API Endpoint 2: AI Video Script & Keyframe Suggester
  app.post('/api/gemini/generate-script', async (req, res) => {
    try {
      const { topic, style } = req.body;
      const prompt = `Generate a creative video editing breakdown for topic "${topic}" in "${style || 'dynamic'}" video style.
Include suggested captions, camera movement keyframes (e.g. slow zoom in, pan right, punch zoom), and filter effect recommendations.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hookText: { type: Type.STRING },
              effectRecommendation: { type: Type.STRING },
              keyframeInstructions: { type: Type.STRING },
              suggestedCaptions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
          },
        },
      });

      res.json({ success: true, result: JSON.parse(response.text || '{}') });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message,
        fallback: {
          hookText: 'Stop scrolling! Check out this AI video editor.',
          effectRecommendation: 'vhs',
          keyframeInstructions: 'Zoom from 1.0x to 1.3x over first 3 seconds.',
          suggestedCaptions: ['UNBELIEVABLE FEATURES!', 'MULTI-TRACK TIMELINE', 'EXPORT IN 1080p'],
        },
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Video Editor Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
