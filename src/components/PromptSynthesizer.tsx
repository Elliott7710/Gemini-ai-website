/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Terminal, Play, Cpu, Zap, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface PresetPrompt {
  label: string;
  model: string;
  prompt: string;
  mode: 'quantum' | 'fibonacci' | 'torus' | 'lattice';
  tokens: string;
}

const GEMINI_PRESETS: PresetPrompt[] = [
  {
    label: 'Deep Reasoning (Argon)',
    model: 'gemini-4-argon',
    prompt: 'Solve complex Navier-Stokes turbulence equations with Thinking Level HIGH',
    mode: 'quantum',
    tokens: '2,000,000 Context',
  },
  {
    label: 'Live Voice Stream (Live)',
    model: 'gemini-3.8-live',
    prompt: 'Process 24kHz bidirectional PCM voice stream with tool calling grounding',
    mode: 'fibonacci',
    tokens: '< 40ms Latency',
  },
  {
    label: 'High-Speed Flash (3.8)',
    model: 'gemini-3.8-flash',
    prompt: 'Synthesize full-stack TypeScript React application from single intent description',
    mode: 'torus',
    tokens: '1M tokens/sec',
  },
  {
    label: 'Multimodal Vision (Pro)',
    model: 'gemini-3-pro-image',
    prompt: 'Deconstruct complex satellite geospatial imagery with millimeter precision overlay',
    mode: 'lattice',
    tokens: 'Native 4K Vision',
  },
];

export const PromptSynthesizer: React.FC = () => {
  const [currentPrompt, setCurrentPrompt] = useState(GEMINI_PRESETS[0].prompt);
  const [activePreset, setActivePreset] = useState<PresetPrompt>(GEMINI_PRESETS[0]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [streamLog, setStreamLog] = useState<string>(
    'Gemini 4 Tensor Engine initialized. 2,000,000 tokens capacity active.'
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleSynthesize = (preset = activePreset, customText = currentPrompt) => {
    sound.playChime(660, 'triangle', 0.3);
    setIsCompiling(true);
    setStreamLog(`Invoking ${preset.model}: "${customText.slice(0, 48)}..."`);

    setTimeout(() => {
      setActivePreset(preset);
      setIsCompiling(false);
      sound.playChime(880, 'sine', 0.5);
      setStreamLog(
        `${preset.model.toUpperCase()} inference complete. ${preset.tokens} verified at 120 FPS.`
      );
    }, 600);
  };

  // Canvas visualizer for tensor attention heads & vector manifold
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', resize);

    let angle = 0;
    let animId: number;

    const render = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.22)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      angle += 0.015;

      ctx.save();
      ctx.translate(cx, cy);

      if (activePreset.mode === 'quantum') {
        // High-entropy Gemini reasoning manifold
        const points = 160;
        for (let i = 0; i < points; i++) {
          const theta = (i / points) * Math.PI * 2 + angle;
          const r = 90 + Math.sin(theta * 6 + angle * 2) * 35;
          const x = Math.cos(theta) * r;
          const y = Math.sin(theta) * r;

          ctx.beginPath();
          ctx.arc(x, y, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#a78bfa';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.fill();
        }
      } else if (activePreset.mode === 'fibonacci') {
        // Golden ratio spiral for Live API acoustic resonance
        const count = 180;
        const phi = (1 + Math.sqrt(5)) / 2;
        for (let i = 0; i < count; i++) {
          const theta = i * phi * Math.PI * 2 + angle * 0.8;
          const r = Math.sqrt(i) * 11;
          const x = Math.cos(theta) * r;
          const y = Math.sin(theta) * r;

          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#a855f7' : '#34d399';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 8;
          ctx.fill();
        }
      } else if (activePreset.mode === 'torus') {
        // High-throughput Flash Toroidal Pipeline
        const rings = 14;
        const ringRadius = 105;
        const tubeRadius = 38;

        for (let r = 0; r < rings; r++) {
          const u = (r / rings) * Math.PI * 2 + angle;
          ctx.beginPath();
          for (let v = 0; v <= Math.PI * 2; v += 0.3) {
            const x = (ringRadius + tubeRadius * Math.cos(v)) * Math.cos(u);
            const y = (ringRadius + tubeRadius * Math.cos(v)) * Math.sin(u) * 0.5 + tubeRadius * Math.sin(v) * 0.8;
            if (v === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(56, 189, 248, 0.45)`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      } else if (activePreset.mode === 'lattice') {
        // Multimodal Attention Matrix
        const cols = 7;
        const rows = 7;
        const spacing = 34;

        ctx.strokeStyle = 'rgba(167, 139, 250, 0.25)';
        ctx.lineWidth = 1;

        for (let x = -cols / 2; x < cols / 2; x++) {
          for (let y = -rows / 2; y < rows / 2; y++) {
            const px = x * spacing + Math.sin(y + angle * 2) * 6;
            const py = y * spacing + Math.cos(x + angle * 2) * 6;

            ctx.beginPath();
            ctx.arc(px, py, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = '#a78bfa';
            ctx.fill();

            if (x < cols / 2 - 1) {
              const nx = (x + 1) * spacing + Math.sin(y + angle * 2) * 6;
              const ny = y * spacing + Math.cos((x + 1) + angle * 2) * 6;
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(nx, ny);
              ctx.stroke();
            }
          }
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [activePreset]);

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#0d0d14]/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
      {/* Top Console Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">Gemini Multimodal Reasoning Lab</h3>
            <p className="text-xs text-slate-400">Direct neural orchestration with Gemini 2.5 &amp; Gemini 4 models</p>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span className="text-slate-500">Model:</span>
          <span className="text-cyan-400 font-semibold">{activePreset.model}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500">Capacity:</span>
          <span className="text-violet-300 font-semibold">{activePreset.tokens}</span>
        </div>
      </div>

      {/* Preset Model Pickers */}
      <div className="mt-5">
        <div className="flex flex-wrap gap-2">
          {GEMINI_PRESETS.map((preset) => (
            <button
              key={preset.model}
              onClick={() => {
                setCurrentPrompt(preset.prompt);
                handleSynthesize(preset, preset.prompt);
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                activePreset.model === preset.model
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/30'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Multimodal Prompt Input */}
      <div className="mt-4 flex flex-col sm:flex-row items-stretch gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Terminal className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={currentPrompt}
            onChange={(e) => setCurrentPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSynthesize();
            }}
            placeholder="Prompt Gemini in any modality (e.g. 'Analyze 4K video frames with ThinkingLevel HIGH')..."
            className="w-full pl-10 pr-4 py-3 bg-black/60 rounded-xl border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono"
          />
        </div>

        <button
          onClick={() => handleSynthesize()}
          disabled={isCompiling}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white text-xs font-semibold uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all duration-200 cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isCompiling ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Inferring...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Execute</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Canvas Display Frame */}
      <div className="mt-5 relative h-64 md:h-72 w-full rounded-xl overflow-hidden border border-white/10 bg-black/80 flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ willChange: 'transform' }} />

        {/* Subtle holographic corner brackets */}
        <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider pointer-events-none">
          TPU v5e Tensor Parallelism // Cross-Attention Matrix
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-2 font-mono text-[10px] text-slate-400 bg-black/50 px-2.5 py-1 rounded backdrop-blur border border-white/5 pointer-events-none">
          <Zap className="w-3 h-3 text-cyan-400" />
          <span>Multimodal Tokens: {activePreset.tokens}</span>
        </div>
      </div>

      {/* Real-time Output Log */}
      <div className="mt-3 flex items-center gap-2 text-xs font-mono text-slate-400 px-1">
        <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="truncate">{streamLog}</span>
      </div>
    </div>
  );
};
