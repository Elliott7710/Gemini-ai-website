/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { ArrowDown, Sparkles, Terminal, Cpu, Zap, Radio, CheckCircle, Send, Layers } from 'lucide-react';
import { SwarmLoader } from './components/SwarmLoader';
import { CustomCursor } from './components/CustomCursor';
import { FilmicNoiseOverlay } from './components/FilmicNoiseOverlay';
import { InteractiveField } from './components/InteractiveField';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { ManifestoGrid } from './components/ManifestoGrid';
import { PromptSynthesizer } from './components/PromptSynthesizer';
import { ArtifactGallery } from './components/ArtifactGallery';
import { SwarmController } from './components/SwarmController';
import { sound } from './utils/audio';

export default function App() {
  // Loader state
  const [showLoader, setShowLoader] = useState(true);
  const [loaderConfig, setLoaderConfig] = useState({
    text: 'GEMINI AI',
    particleCount: 2200,
    delay: 1100,
  });

  // Newsletter form state
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Lenis momentum smooth scroll initialization (Creative Technologist tuning)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.6,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleReplaySwarm = (config?: { text: string; particleCount: number; delay: number }) => {
    if (config) {
      setLoaderConfig(config);
    }
    setShowLoader(true);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setEmailSubmitted(true);
    sound.playChime(660, 'sine', 0.5);
  };

  return (
    <div className="relative min-h-screen bg-[#08080c] text-[#f2f2f6] selection:bg-cyan-500/30 selection:text-white grain-overlay">
      {/* Standalone Swarm Loader with onComplete callback */}
      {showLoader && (
        <SwarmLoader
          text={loaderConfig.text}
          particleCount={loaderConfig.particleCount}
          autoStartConvergenceDelay={loaderConfig.delay}
          onComplete={() => setShowLoader(false)}
        />
      )}

      {/* Custom Magnetic Follower Cursor */}
      <CustomCursor />

      {/* Subtle Filmic SVG Noise / Grain Overlay (mix-blend-mode: overlay) */}
      <FilmicNoiseOverlay />

      {/* Ambient Interactive Particle Field Background */}
      <InteractiveField />

      {/* Top Bar Contract (3 Zones) */}
      <Navigation onReplaySwarm={() => handleReplaySwarm()} />

      <main className="relative z-10">
        {/* HERO SECTION WITH MOTION GRAPHICS */}
        <HeroSection onReplaySwarm={() => handleReplaySwarm()} />

        {/* SECTION 01: GEMINI ARCHITECTURAL PILLARS */}
        <ManifestoGrid />

        {/* SECTION 02: MULTIMODAL REASONING LAB */}
        <section id="lab" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-cyan-400 font-mono">
              Live Neural Sandbox
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-2 font-display">
              Multimodal Reasoning Lab
            </h2>
            <p className="text-slate-400 mt-3 text-sm">
              Experience Gemini 4 Argon, Gemini 3.8 Live, and Flash processing cross-attention tensors in real time.
            </p>
          </div>

          <PromptSynthesizer />
        </section>

        {/* SECTION 03: GEMINI MODEL PORTFOLIO */}
        <ArtifactGallery />

        {/* SECTION 04: KINETIC SWARM ASSEMBLER */}
        <section id="foundations" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-cyan-400 font-mono">
                Atomic Particle Engine
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-display">
                The Gemini Swarm Assembler
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Visualizing high-dimensional tensor weights. Over 2,200 luminescent nanites in chaotic Brownian curl drift converge through gravitational vortex spring-physics into the typographic crystal lattice of <code className="text-cyan-300 font-mono">"GEMINI AI"</code>.
              </p>

              <div className="space-y-3 font-mono text-xs text-slate-300 border-l border-cyan-500/40 pl-4 py-1">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-semibold">01.</span>
                  <span>Turbulent Flocking Field (0 to 1.1s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-semibold">02.</span>
                  <span>Poisson Minimum-Distance Kerning</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-semibold">03.</span>
                  <span>Synaptic Micro-Filament Lattice</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-semibold">04.</span>
                  <span>Forward Camera Warp Transition</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <SwarmController onTriggerSwarm={handleReplaySwarm} />
            </div>
          </div>
        </section>

        {/* SECTION 05: DEVELOPER ECOSYSTEM */}
        <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto text-center border-t border-white/10">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#10101c] to-[#08080c] p-8 md:p-14 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <span className="text-xs uppercase tracking-[0.25em] text-cyan-400 font-mono">
              Frontier Developer Network
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 font-display">
              Join the Gemini AI Ecosystem
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto mt-3">
              Receive architectural whitepapers, Live API WebSocket client code, and multi-agent system blueprints.
            </p>

            {emailSubmitted ? (
              <div className="mt-8 flex items-center justify-center gap-3 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-sm max-w-md mx-auto">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>You are registered in the Gemini Developer registry.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="mt-8 max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your developer email..."
                    className="flex-1 px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black hover:bg-slate-200 font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Connect</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                {emailError && (
                  <p className="text-xs text-red-400 mt-2 font-mono text-left">{emailError}</p>
                )}
              </form>
            )}
          </div>
        </section>
      </main>

      {/* QUIET FOOTER */}
      <footer className="border-t border-white/10 bg-[#060609] py-12 px-6 md:px-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-white text-sm tracking-tight bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              GEMINI AI
            </span>
            <span aria-hidden="true">·</span>
            <span>Universal Multimodal Intelligence</span>
          </div>

          <div className="flex items-center gap-6 font-mono">
            <a href="#architecture" className="hover:text-slate-300 transition-colors">
              Architecture
            </a>
            <a href="#lab" className="hover:text-slate-300 transition-colors">
              Lab
            </a>
            <a href="#models" className="hover:text-slate-300 transition-colors">
              Models
            </a>
            <a href="#foundations" className="hover:text-slate-300 transition-colors">
              Foundations
            </a>
          </div>

          <div className="text-slate-600 font-mono tabular-nums">
            Powered by Google DeepMind // 2M Tokens
          </div>
        </div>
      </footer>
    </div>
  );
}
