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

app.use(express.json());

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

// Backend Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Gemini AI Backend',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!apiKey,
  });
});

// Gemini Active Models Catalog
app.get('/api/gemini/models', (req, res) => {
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
  const { prompt, model = 'gemini-3.8-flash' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  if (!ai) {
    return res.json({
      text: `[SIMULATION // API KEY NOT CONFIGURED]: Received prompt: "${prompt}". In live deployment, Gemini ${model} processes this across its 2-million-token context window.`,
      model,
      simulated: true,
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    res.json({
      text: response.text,
      model,
      simulated: false,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate content from Gemini API.',
    });
  }
});

// Production static file serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
}

export default app;
