/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowUpRight, Compass, Layers, Cpu, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface Artifact {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: string;
  category: string;
  imageSrc: string;
}

const GEMINI_MODELS: Artifact[] = [
  {
    id: 'gemini-pro-argon',
    number: '01',
    title: 'Gemini 4 Argon & 2.5 Pro',
    subtitle: 'Frontier Reasoning & 2-Million Token Memory',
    description:
      'Engineered for maximum cognitive depth. Solves advanced STEM mathematics, analyzes whole software repositories in a single prompt, and executes autonomous deep research workflows.',
    metrics: '2,000,000 Tokens Context',
    category: 'Flagship Intelligence',
    imageSrc: '/src/assets/images/hero_flow_state_1794141435876.jpg',
  },
  {
    id: 'gemini-live-flash',
    number: '02',
    title: 'Gemini 3.8 Live & Flash',
    subtitle: 'Real-Time Voice, Vision & Sub-second Speed',
    description:
      'Bidirectional conversational audio streaming with sub-40ms response latency. Perceives raw audio tones, video streams, and executes function calls without conversational stall.',
    metrics: '< 40ms Live Audio Latency',
    category: 'High-Throughput Perception',
    imageSrc: '/src/assets/images/artifact_spatial_matrix_1794141438094.jpg',
  },
  {
    id: 'gemini-multimodal-grounding',
    number: '03',
    title: 'Multimodal Grounding & Nano',
    subtitle: 'Search Verification & Spatial Image Synthesis',
    description:
      'Connects generative intelligence to real-world knowledge through real-time Google Search and Maps citations, paired with high-fidelity visual generation and on-device private inference.',
    metrics: '100% Fact-Checked Citations',
    category: 'Multimodal Integration',
    imageSrc: '/src/assets/images/artifact_fluid_intelligence_1794141437108.jpg',
  },
];

export const ArtifactGallery: React.FC = () => {
  const [activeModel, setActiveModel] = useState<string | null>(null);

  return (
    <section id="models" className="relative py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-cyan-400 font-mono">
            Model Portfolio
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-2 font-display">
            The Gemini Model Family
          </h2>
        </div>
        <p className="max-w-md text-sm text-slate-400 leading-relaxed">
          From massive-context reasoning engines to lightning-fast real-time voice streaming, Gemini models are purpose-built for every frontier workload.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        {GEMINI_MODELS.map((item, idx) => {
          const isLarge = idx === 0;
          return (
            <div
              key={item.id}
              className={`group relative rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d14] transition-all duration-500 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 ${
                isLarge ? 'md:col-span-12 lg:col-span-7' : 'md:col-span-6 lg:col-span-5'
              }`}
              onMouseEnter={() => {
                setActiveModel(item.id);
                sound.playChime(440 + idx * 80, 'sine', 0.2);
              }}
              onMouseLeave={() => setActiveModel(null)}
            >
              {/* Image Frame with Measured Contrast Scrim */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black/60">
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-[#0d0d14]/40 to-transparent" />
                
                {/* Clean Editorial Numbering */}
                <div className="absolute top-5 left-5 font-mono text-sm tracking-widest text-white/80 bg-black/40 px-3 py-1 rounded-md backdrop-blur-md border border-white/10">
                  {item.number}
                </div>

                <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-cyan-600 transition-all">
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              {/* Text Body & Metadata */}
              <div className="p-6 md:p-8">
                {/* Unboxed Zero-Pill Metadata */}
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-3">
                  <span className="text-cyan-400">{item.category}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-violet-300 tabular-nums">{item.metrics}</span>
                </div>

                <h3 className="text-2xl font-bold text-white tracking-tight font-display group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <h4 className="text-sm font-medium text-slate-300 mt-1">
                  {item.subtitle}
                </h4>

                <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
