/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sliders, Zap, Play, Eye } from 'lucide-react';
import { sound } from '../utils/audio';

interface SwarmControllerProps {
  onTriggerSwarm: (config: {
    text: string;
    particleCount: number;
    delay: number;
  }) => void;
}

export const SwarmController: React.FC<SwarmControllerProps> = ({ onTriggerSwarm }) => {
  const [targetText, setTargetText] = useState('GEMINI AI');
  const [particleCount, setParticleCount] = useState(2200);
  const [delay, setDelay] = useState(1100);

  const presets = ['GEMINI AI', 'MULTIMODAL', 'DEEP THINKING', 'GEMINI 2.5'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playChime(700, 'sine', 0.4);
    onTriggerSwarm({
      text: targetText || 'GEMINI AI',
      particleCount,
      delay,
    });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0d14]/80 p-6 md:p-8 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">Gemini Swarm Assembler</h3>
            <p className="text-xs text-slate-400">Configure real-time WebGL particle convergence physics</p>
          </div>
        </div>
        <div className="text-xs font-mono text-slate-400 hidden sm:block">
          <span className="text-cyan-400 font-semibold tabular-nums">{particleCount.toLocaleString()}</span> Nanites Active
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Preset Quick Selectors */}
        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
            Target Glyph / Model Preset
          </label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setTargetText(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  targetText === p
                    ? 'bg-cyan-600 text-white font-semibold shadow-md shadow-cyan-500/25'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Text Input */}
        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
            Custom Typographic Target
          </label>
          <input
            type="text"
            value={targetText}
            onChange={(e) => setTargetText(e.target.value.toUpperCase())}
            maxLength={18}
            placeholder="TYPE ANY PHRASE..."
            className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-mono tracking-wider focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-slate-400">NANITE PARTICLE DENSITY</span>
              <span className="text-cyan-400 font-semibold tabular-nums">{particleCount}</span>
            </div>
            <input
              type="range"
              min="1500"
              max="2500"
              step="100"
              value={particleCount}
              onChange={(e) => setParticleCount(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>1,500</span>
              <span>2,200 (Optimal)</span>
              <span>2,500</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-slate-400">VORTEX DRIFT DURATION</span>
              <span className="text-violet-400 font-semibold tabular-nums">{(delay / 1000).toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min="600"
              max="2400"
              step="200"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="w-full accent-violet-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>0.6s (Instant)</span>
              <span>1.1s (Standard)</span>
              <span>2.4s (Cinematic)</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Triggers chaotic Perlin Brownian swarm drifting into spring-physics convergence.
          </p>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Launch Convergence</span>
          </button>
        </div>
      </form>
    </div>
  );
};
