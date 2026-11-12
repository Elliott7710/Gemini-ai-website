/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Terminal,
  Network,
  Zap,
  Sparkles,
  ArrowRight,
  Cpu,
  RefreshCw,
  Code2,
  Share2,
  Layers,
  Radio,
} from 'lucide-react';
import { sound } from '../utils/audio';

// ---------------------------------------------------------
// CARD 1: NATIVE MULTIMODALITY & LIVE STREAM (Audio Visualizer)
// ---------------------------------------------------------
const MultimodalLiveCard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [streamModality, setStreamModality] = useState<'audio' | 'vision' | 'video'>('audio');
  const [hovered, setHovered] = useState(false);

  // Monitor scroll velocity
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let timeoutId: number;

    const handleScroll = () => {
      const now = performance.now();
      const deltaY = Math.abs(window.scrollY - lastScrollY);
      const dt = Math.max(now - lastTime, 16);
      const speed = (deltaY / dt) * 15;
      setScrollSpeed(Math.min(speed, 8));
      lastScrollY = window.scrollY;
      lastTime = now;

      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => setScrollSpeed(0), 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Multi-frequency harmonic wave render loop representing Gemini Live API stream
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 220);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth * dpr;
      height = canvas.height = canvas.parentElement.clientHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    let phase = 0;
    let animId: number;

    const baseFreqMap = { audio: 0.024, vision: 0.016, video: 0.038 };
    const baseAmpMap = { audio: 26, vision: 32, video: 20 };

    const render = () => {
      const w = width / dpr;
      const h = height / dpr;

      ctx.clearRect(0, 0, w, h);

      const velocityBoost = scrollSpeed * 0.04 + (hovered ? 0.02 : 0);
      phase += 0.025 + velocityBoost;

      const baseFreq = baseFreqMap[streamModality];
      const baseAmp = baseAmpMap[streamModality] + scrollSpeed * 4;

      // 3 Layered Waves representing real-time Gemini Live audio & perceptual tokens
      const harmonics = [
        { freqMult: 1, ampMult: 1, color: 'rgba(56, 189, 248, 0.85)', width: 2.2 },
        { freqMult: 1.6, ampMult: 0.6, color: 'rgba(167, 139, 250, 0.75)', width: 1.6 },
        { freqMult: 2.4, ampMult: 0.35, color: 'rgba(52, 211, 153, 0.65)', width: 1.2 },
      ];

      harmonics.forEach(({ freqMult, ampMult, color, width: strokeW }) => {
        ctx.beginPath();
        ctx.lineWidth = strokeW;
        ctx.strokeStyle = color;

        for (let x = 0; x <= w; x += 3) {
          const y =
            h / 2 +
            Math.sin(x * baseFreq * freqMult + phase * freqMult) * (baseAmp * ampMult) +
            Math.cos(x * 0.007 - phase * 0.5) * 8;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // Ambient glowing central beam
      const grad = ctx.createLinearGradient(0, h / 2 - 40, 0, h / 2 + 40);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      grad.addColorStop(0.5, 'rgba(167, 139, 250, 0.08)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, h / 2 - 40, w, 80);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [scrollSpeed, streamModality, hovered]);

  return (
    <div
      onMouseEnter={() => {
        setHovered(true);
        sound.playChime(528, 'sine', 0.2);
      }}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col justify-between h-full p-6 sm:p-8 rounded-2xl bg-[#0d0d14]/90 border border-white/10 hover:border-cyan-500/40 transition-all duration-500 overflow-hidden group shadow-2xl"
    >
      {/* Background Subtle Gradient Glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl group-hover:bg-cyan-600/20 transition-all duration-700" />

      {/* Header & Metadata */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
          <span className="text-cyan-400">01. Live Perceptual Stream</span>
          <span className="text-violet-400 font-semibold tabular-nums">
            {scrollSpeed > 0 ? `LIVE THROUGHPUT: ${(scrollSpeed * 12).toFixed(0)} FPS` : 'LIVE API: 24kHz STEREO'}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-white tracking-tight font-display group-hover:text-cyan-300 transition-colors">
          Native Multimodal Audio & Vision
        </h3>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-lg">
          Gemini doesn't stitch separate speech models together. It hears pitch, tone, vocal inflections, and video frames directly in the same neural space with sub-40ms latency.
        </p>
      </div>

      {/* Interactive Sine Visualizer Container */}
      <div className="relative my-6 h-40 w-full rounded-xl bg-black/60 border border-white/5 overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ willChange: 'transform' }} />

        {/* Dynamic Modality Overlay Indicator */}
        <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded backdrop-blur border border-white/5">
          Stream: <span className="text-cyan-300 font-semibold">{streamModality.toUpperCase()} (PCM 24kHz)</span>
        </div>

        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500">
          Bidirectional Streaming Socket
        </div>
      </div>

      {/* Modality Stream Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/5 border border-white/5 text-xs font-mono">
          {(['audio', 'vision', 'video'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setStreamModality(mode);
                sound.playChime(mode === 'video' ? 880 : mode === 'vision' ? 660 : 440, 'triangle', 0.2);
              }}
              className={`px-3 py-1 rounded-md capitalize transition-all cursor-pointer ${
                streamModality === mode
                  ? 'bg-cyan-600 text-white font-semibold shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-500 italic">
          Zero transcoding pipeline
        </span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// CARD 2: 2M TOKENS & CODE SYNTHESIS (Mock Terminal)
// ---------------------------------------------------------
interface PromptCodePair {
  prompt: string;
  thought: string;
  codeSnippet: {
    line1: string;
    line2: string;
    line3: string;
    line4: string;
    line5: string;
  };
}

const GEMINI_CODE_PAIRS: PromptCodePair[] = [
  {
    prompt: 'Query the entire 2-million-token codebase for architectural race conditions.',
    thought: 'Scanning 750,000 lines of distributed Rust & TypeScript with 99.8% needle-in-haystack recall...',
    codeSnippet: {
      line1: 'const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });',
      line2: 'const audit = await ai.models.generateContent({',
      line3: '  model: "gemini-4-argon", contents: [fullRepoZip, prompt],',
      line4: '  config: { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } }',
      line5: '}); // Invariant race resolved at mutex lock line 4,120',
    },
  },
  {
    prompt: 'Synthesize real-time audio-reactive shader uniforms from live PCM audio stream.',
    thought: 'Extracting discrete Fourier coefficients and mapping to GLSL fragment uniforms...',
    codeSnippet: {
      line1: 'const session = await ai.live.connect({ model: "gemini-3.8-live" });',
      line2: 'session.sendRealtimeInput({ mediaChunks: [pcm16kChunk] });',
      line3: 'for await (const message of session.receive()) {',
      line4: '  shaderUniforms.harmonicResonance = message.serverContent.audioBand;',
      line5: '} // 24kHz bidirectional WebSocket active',
    },
  },
  {
    prompt: 'Inspect high-resolution MRI scan and cross-reference with PubMed clinical trials.',
    thought: 'Fusing multimodal visual feature maps with grounded scientific literature...',
    codeSnippet: {
      line1: 'const response = await ai.models.generateContent({',
      line2: '  model: "gemini-4-argon", contents: [mriDicomImage, clinicalQuery],',
      line3: '  config: { tools: [{ googleSearch: {} }] }',
      line4: '});',
      line5: '// 100% citation grounding with verified DOI links',
    },
  },
];

const GeminiCodeCard: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isTransmuting, setIsTransmuting] = useState(false);
  const activePair = GEMINI_CODE_PAIRS[index];

  const handleNext = () => {
    setIsTransmuting(true);
    sound.playChime(620, 'triangle', 0.2);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % GEMINI_CODE_PAIRS.length);
      setIsTransmuting(false);
      sound.playChime(880, 'sine', 0.3);
    }, 450);
  };

  return (
    <div
      onMouseEnter={() => sound.playChime(480, 'sine', 0.15)}
      className="relative flex flex-col justify-between h-full p-6 sm:p-8 rounded-2xl bg-[#0d0d14]/90 border border-white/10 hover:border-violet-500/40 transition-all duration-500 overflow-hidden group shadow-2xl"
    >
      {/* Background Accent Glow */}
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl group-hover:bg-violet-600/20 transition-all duration-700" />

      {/* Header */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
          <span className="text-violet-400">02. 2-Million-Token Context</span>
          <span className="text-cyan-400 font-semibold">GEMINI 2.5 / 4</span>
        </div>

        <h3 className="text-2xl font-bold text-white tracking-tight font-display group-hover:text-violet-300 transition-colors">
          Infinite Context & Code
        </h3>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Ingest entire repositories, hours of video, or thousands of research papers in a single prompt with 99.8% precision recall.
        </p>
      </div>

      {/* Mock Terminal Shell */}
      <div className="my-6 rounded-xl bg-black/80 border border-white/10 overflow-hidden shadow-inner font-mono text-xs">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.04] border-b border-white/5 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            <span className="ml-2 text-slate-500">@google/genai // gemini-cli</span>
          </div>
          <span className="text-cyan-400 tabular-nums">2,000,000 tokens</span>
        </div>

        {/* Terminal Body */}
        <div className="p-4 space-y-3 min-h-[160px]">
          {/* Human Prompt Line */}
          <div className="flex items-start gap-2">
            <span className="text-cyan-400 select-none">user &gt;</span>
            <span className="text-slate-200 font-medium">"{activePair.prompt}"</span>
          </div>

          {/* Machine Reasoning Thought */}
          <div className="flex items-center gap-2 text-slate-500 text-[11px] italic">
            <RefreshCw className={`w-3 h-3 text-violet-400 ${isTransmuting ? 'animate-spin' : ''}`} />
            <span>{activePair.thought}</span>
          </div>

          {/* Animated Syntax Highlighted Code Output */}
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="mt-2 pl-3 border-l-2 border-violet-500/40 text-[11px] space-y-1 overflow-x-auto"
            >
              <div>
                <span className="text-fuchsia-400">const</span>{' '}
                <span className="text-slate-200">{activePair.codeSnippet.line1.split(' ')[1]}</span>{' '}
                <span className="text-cyan-300">=</span>{' '}
                <span className="text-emerald-300">{activePair.codeSnippet.line1.split('=').slice(1).join('=')}</span>
              </div>
              <div className="text-slate-300">{activePair.codeSnippet.line2}</div>
              <div className="text-slate-300">{activePair.codeSnippet.line3}</div>
              <div className="text-slate-400">{activePair.codeSnippet.line4}</div>
              <div className="text-cyan-400/90">{activePair.codeSnippet.line5}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Interactive Transmute Button */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <button
          onClick={handleNext}
          disabled={isTransmuting}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-mono transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next Capability</span>
        </button>

        <span className="text-xs font-mono text-slate-500 tabular-nums">
          Feature {index + 1} of {GEMINI_CODE_PAIRS.length}
        </span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// CARD 3: AUTONOMOUS AGENT ORCHESTRATION & GROUNDING
// ---------------------------------------------------------
interface AgentNode {
  id: string;
  label: string;
  role: string;
  x: number;
  y: number;
  color: string;
}

const GEMINI_NODES: AgentNode[] = [
  { id: 'core', label: 'Gemini Reasoning', role: 'Thinking Level: HIGH', x: 50, y: 22, color: '#38bdf8' },
  { id: 'search', label: 'Google Search', role: 'Real-Time Web Grounding', x: 20, y: 72, color: '#a78bfa' },
  { id: 'tools', label: 'Code Interpreter', role: 'Sandboxed Python Exec', x: 80, y: 72, color: '#34d399' },
];

const AgentOrchestrationCard: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string>('core');
  const [packetProgress, setPacketProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPacketProgress((prev) => (prev + 1) % 100);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      onMouseEnter={() => sound.playChime(560, 'sine', 0.2)}
      className="relative flex flex-col justify-between h-full p-6 sm:p-8 rounded-2xl bg-[#0d0d14]/90 border border-white/10 hover:border-emerald-500/40 transition-all duration-500 overflow-hidden group shadow-2xl"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl group-hover:bg-emerald-600/20 transition-all duration-700" />

      {/* Header */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
          <span className="text-emerald-400">03. Grounded Agent Mesh</span>
          <span className="text-cyan-400 font-semibold">SEARCH & CODE TOOLS</span>
        </div>

        <h3 className="text-2xl font-bold text-white tracking-tight font-display group-hover:text-emerald-300 transition-colors">
          Autonomous Deep Reasoning
        </h3>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Gemini can formulate multi-step hypotheses, write and execute code in sandboxes to verify math, and ground answers with Google Search.
        </p>
      </div>

      {/* Living Node Graph Canvas / SVG */}
      <div className="relative my-6 h-52 w-full rounded-xl bg-black/60 border border-white/5 overflow-hidden flex items-center justify-center select-none">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
          {/* Connecting Splines */}
          <line
            x1="50"
            y1="22"
            x2="20"
            y2="72"
            stroke="rgba(56, 189, 248, 0.4)"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
          <line
            x1="50"
            y1="22"
            x2="80"
            y2="72"
            stroke="rgba(52, 211, 153, 0.4)"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
          <line
            x1="20"
            y1="72"
            x2="80"
            y2="72"
            stroke="rgba(167, 139, 250, 0.3)"
            strokeWidth="1"
          />

          {/* Traveling Data Packet: Core to Search Grounding */}
          <circle
            cx={50 + (20 - 50) * (packetProgress / 100)}
            cy={22 + (72 - 22) * (packetProgress / 100)}
            r="2.2"
            fill="#38bdf8"
            className="shadow-[0_0_8px_#38bdf8]"
          />

          {/* Traveling Data Packet: Search to Tools */}
          <circle
            cx={20 + (80 - 20) * ((packetProgress + 40) % 100 / 100)}
            cy={72}
            r="2"
            fill="#a78bfa"
          />

          {/* Traveling Data Packet: Tools to Core */}
          <circle
            cx={80 + (50 - 80) * ((packetProgress + 70) % 100 / 100)}
            cy={72 + (22 - 72) * ((packetProgress + 70) % 100 / 100)}
            r="2"
            fill="#34d399"
          />
        </svg>

        {/* Interactive Node Anchors */}
        {GEMINI_NODES.map((node) => {
          const isSelected = activeNode === node.id;
          return (
            <button
              key={node.id}
              onClick={() => {
                setActiveNode(node.id);
                sound.playChime(isSelected ? 750 : 620, 'sine', 0.25);
              }}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl backdrop-blur-md border transition-all duration-300 cursor-pointer flex flex-col items-center ${
                isSelected
                  ? 'bg-black/90 border-white/60 shadow-[0_0_25px_rgba(56,189,248,0.5)] scale-110 z-20'
                  : 'bg-black/60 border-white/15 hover:border-white/40 scale-100 z-10'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full mb-1 shadow-md"
                style={{ backgroundColor: node.color }}
              />
              <span className="text-[10px] font-mono text-white font-semibold whitespace-nowrap">
                {node.label}
              </span>
              <span className="text-[8px] font-mono text-slate-400 whitespace-nowrap">
                {node.role}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Agent Telemetry Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <Network className="w-3.5 h-3.5 text-emerald-400" />
          <span>Active: <strong className="text-white">{GEMINI_NODES.find((n) => n.id === activeNode)?.label}</strong></span>
        </div>
        <span className="text-slate-500 tabular-nums">Grounding Invariants: 100% Verified</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// CARD 4: ZERO LATENCY & GEMINI FLASH (3D Tilt & Spotlight)
// ---------------------------------------------------------
const GeminiFlashCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);

  const springConfig = { damping: 18, stiffness: 140, mass: 0.4 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-180, 180], [16, -16]);
  const rotateY = useTransform(smoothMouseX, [-220, 220], [-16, 16]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x - rect.width / 2);
    mouseY.set(y - rect.height / 2);

    spotlightX.set(x);
    spotlightY.set(y);
  };

  const handleMouseEnter = () => {
    sound.playChime(680, 'sine', 0.2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative flex flex-col justify-between h-full p-6 sm:p-8 rounded-2xl bg-[#0d0d14]/90 border border-white/10 hover:border-transparent transition-all duration-300 overflow-hidden group shadow-2xl select-none"
      >
        {/* Dynamic Interactive Spotlight Border Effect */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: useTransform(
              [spotlightX, spotlightY],
              ([x, y]) =>
                `radial-gradient(350px circle at ${x}px ${y}px, rgba(56, 189, 248, 0.45), rgba(167, 139, 250, 0.2) 40%, transparent 80%)`
            ),
          }}
        />

        {/* Inner Surface with Spotlight Fill */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: useTransform(
              [spotlightX, spotlightY],
              ([x, y]) =>
                `radial-gradient(400px circle at ${x}px ${y}px, rgba(56, 189, 248, 0.08), transparent 70%)`
            ),
          }}
        />

        {/* Header */}
        <div style={{ transform: 'translateZ(20px)' }}>
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
            <span className="text-cyan-400">04. High-Throughput Speed</span>
            <span className="text-violet-400 font-semibold tabular-nums">LATENCY: &lt; 40ms</span>
          </div>

          <h3 className="text-2xl font-bold text-white tracking-tight font-display group-hover:text-cyan-300 transition-colors">
            Gemini Flash Velocity
          </h3>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Distilled from flagship frontier models for blazing low-latency response times and cost efficiency without sacrificing deep multimodal perception.
          </p>
        </div>

        {/* 3D Levitating Monolith Graphic */}
        <div
          style={{ transform: 'translateZ(35px)' }}
          className="relative my-6 h-48 w-full rounded-xl bg-black/60 border border-white/5 flex items-center justify-center overflow-hidden"
        >
          <motion.div
            animate={{ rotate: 360, rotateY: [0, 180, 360] }}
            transition={{
              rotate: { duration: 24, repeat: Infinity, ease: 'linear' },
              rotateY: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="w-24 h-24 rounded-2xl border-2 border-cyan-400/60 shadow-[0_0_35px_rgba(56,189,248,0.4)] flex items-center justify-center bg-gradient-to-tr from-cyan-600/20 to-violet-500/20 backdrop-blur-md"
          >
            <Zap className="w-10 h-10 text-cyan-300 fill-cyan-400/30" />
          </motion.div>

          <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded border border-white/10">
            Speed: <span className="text-emerald-400 font-semibold">Sub-second Flash</span>
          </div>

          <div className="absolute top-3 right-3 text-[10px] font-mono text-cyan-300 bg-black/60 px-2 py-0.5 rounded border border-white/10">
            Throughput: 1,000,000 Tokens/sec
          </div>
        </div>

        {/* Footer Metrics */}
        <div
          style={{ transform: 'translateZ(15px)' }}
          className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono"
        >
          <span className="text-slate-400">TPU v5e Hardware Cluster</span>
          <span className="text-cyan-300">Flash 3.8 Active</span>
        </div>
      </motion.div>
    </div>
  );
};

// ---------------------------------------------------------
// MAIN MANIFESTO BENTO GRID COMPONENT
// ---------------------------------------------------------
export const ManifestoGrid: React.FC = () => {
  return (
    <section id="architecture" className="relative py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
      {/* Section Header */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs uppercase tracking-[0.25em] text-cyan-400 font-mono">
          Frontier AI Architecture
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-2 font-display">
          Four Pillars of Gemini Intelligence
        </h2>
        <p className="text-slate-400 mt-4 leading-relaxed text-sm md:text-base">
          From native multimodal perception to million-token context windows and autonomous deep reasoning, explore the core engineering breakthroughs powering the Gemini ecosystem.
        </p>
      </div>

      {/* 4-Card Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7">
          <MultimodalLiveCard />
        </div>

        <div className="lg:col-span-5">
          <GeminiCodeCard />
        </div>

        <div className="lg:col-span-5">
          <AgentOrchestrationCard />
        </div>

        <div className="lg:col-span-7">
          <GeminiFlashCard />
        </div>
      </div>
    </section>
  );
};

export default ManifestoGrid;
