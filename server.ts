/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security: HTTP Security Headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Security: Enforce strict JSON body parsing limits to prevent DoS via payload memory exhaustion
app.use(express.json({ limit: '256kb' }));

// Initialize Google GenAI with recommended server-side settings
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Backend Health Endpoint (Safe: only reports presence boolean, never key value)
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'Gemini AI Backend',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!apiKey,
  });
});

// Gemini Active Models Catalog
const ALLOWED_MODELS = [
  'gemini-4-argon',
  'gemini-3.8-flash',
  'gemini-3.8-live',
  'gemini-3-pro-image',
  'gemini-2.5-flash',
];

app.get('/api/gemini/models', (_req, res) => {
  res.json({
    models: [
      { id: 'gemini-4-argon', name: 'Gemini 4 Argon', category: 'Deep Reasoning & Code', contextWindow: '2,000,000' },
      { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash', category: 'Sub-second Velocity', contextWindow: '1,000,000' },
      { id: 'gemini-3.8-live', name: 'Gemini 3.8 Live', category: 'Bidirectional Voice & Audio', contextWindow: '128,000' },
      { id: 'gemini-3-pro-image', name: 'Gemini Pro Image', category: 'High-Res Multimodal Vision', contextWindow: '1,000,000' },
    ],
  });
});

// Gemini Content Generation Proxy
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt, model = 'gemini-3.8-flash' } = req.body;

    // Security: Input validation & sanitization
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a text string.' });
    }

    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt.length === 0) {
      return res.status(400).json({ error: 'Prompt cannot be empty.' });
    }

    if (trimmedPrompt.length > 8000) {
      return res.status(413).json({ error: 'Prompt exceeds maximum allowed length of 8,000 characters.' });
    }

    // Security: Whitelist model parameter to prevent unauthorized target invocations
    const selectedModel = ALLOWED_MODELS.includes(model) ? model : 'gemini-3.8-flash';

    if (!ai) {
      return res.json({
        text: `[SIMULATION // API KEY NOT CONFIGURED]: Received prompt: "${trimmedPrompt.slice(0, 80)}...". In live production, Gemini ${selectedModel} processes this across its 2-million-token context window with sub-second latency.`,
        model: selectedModel,
        simulated: true,
      });
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: trimmedPrompt,
    });

    return res.json({
      text: response.text || 'No response generated.',
      model: selectedModel,
      simulated: false,
    });
  } catch (error: any) {
    // Security: Log error details server-side only; mask raw internal stack traces from client
    console.error('Gemini API Error:', error?.message || error);
    return res.status(500).json({
      error: 'Failed to generate response. Please check prompt syntax or try again.',
    });
  }
});

// Production static file serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
}

export default app;
