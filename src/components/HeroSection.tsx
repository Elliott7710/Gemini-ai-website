/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, Terminal, ArrowRight, Play, Cpu, Zap, Activity, Layers } from 'lucide-react';
import { NeuralCore } from './NeuralCore';
import { MagneticButton } from './MagneticButton';
import { sound } from '../utils/audio';

interface HeroSectionProps {
  onReplaySwarm: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onReplaySwarm }) => {
  const heroRef = useRef<HTMLDivElement | null>(null);

  // 1. Subtle glowing cursor-follow gradient physics
  const mouseX = useMotionValue(400);
  const mouseY = useMotionValue(300);

  const springConfig = { damping: 25, stiffness: 120, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Parallax shifts for floating interactive wireframe vectors
  const vectorShiftX = useTransform(smoothMouseX, [0, 1200], [-18, 18]);
  const vectorShiftY = useTransform(smoothMouseY, [0, 800], [-18, 18]);
  const vectorShiftAltX = useTransform(smoothMouseX, [0, 1200], [24, -24]);
  const vectorShiftAltY = useTransform(smoothMouseY, [0, 800], [24, -24]);

  // Staggered text animation configuration
  const phrase1 = 'Think in Any Modality.';
  const phrase2 = 'Built for Universal Flow.';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.15,
      },
    },
  };

  const charVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      rotateX: 45,
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring' as const,
        damping: 15,
        stiffness: 110,
      },
    },
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleHeroMouseMove}
      className="relative min-h-[92vh] flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto pt-10 pb-20 overflow-hidden select-none"
    >
      {/* 1. Animated Interactive Background: Glowing Cursor-Follow Gradient */}
      <motion.div
        className="pointer-events-none absolute -inset-20 opacity-70 transition-opacity duration-500"
        style={{
          background: useTransform(
            [smoothMouseX, smoothMouseY],
            ([x, y]) =>
              `radial-gradient(750px circle at ${x}px ${y}px, rgba(56, 189, 248, 0.16), rgba(139, 92, 246, 0.10) 35%, transparent 70%)`
          ),
        }}
      />

      {/* Floating Interactive Wireframe Vectors */}
      <motion.div
        style={{ x: vectorShiftX, y: vectorShiftY }}
        animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-16 right-[18%] w-40 h-40 opacity-25"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-cyan-400 fill-none" strokeWidth="0.8">
          <polygon points="50,10 90,35 90,80 50,95 10,80 10,35" strokeDasharray="3 3" />
          <line x1="50" y1="10" x2="50" y2="95" />
          <line x1="10" y1="35" x2="90" y2="80" />
          <line x1="90" y1="35" x2="10" y2="80" />
          <circle cx="50" cy="50" r="14" stroke="rgba(167,139,250,0.6)" />
        </svg>
      </motion.div>

      <motion.div
        style={{ x: vectorShiftAltX, y: vectorShiftAltY }}
        animate={{ y: [0, 16, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute bottom-24 left-[8%] w-32 h-32 opacity-20"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-violet-400 fill-none" strokeWidth="0.8">
          <rect x="20" y="20" width="60" height="60" rx="6" strokeDasharray="4 4" />
          <circle cx="50" cy="50" r="28" stroke="rgba(56,189,248,0.5)" />
          <line x1="20" y1="20" x2="80" y2="80" />
          <line x1="20" y1="80" x2="80" y2="20" />
        </svg>
      </motion.div>

      {/* Main Grid: Content & Kinetic Graphic */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Badge, Staggered Headline, Prose, CTAs */}
        <div className="lg:col-span-7 space-y-7">
          
          {/* 2. Badge: Pill badge that pulses with a green ping: 'STATE: GEMINI 2.5 ACTIVE' */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs tracking-wider uppercase backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.18)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-semibold">STATE: GEMINI 2.5 MULTIMODAL ACTIVE</span>
          </motion.div>

          {/* 3. Headline: Staggered reveal text animation */}
          <div className="space-y-1">
            {/* Phrase 1: "Think in Any Modality." */}
            <motion.h1
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display leading-[1.05] text-white flex flex-wrap"
              style={{ perspective: 800 }}
            >
              {phrase1.split(' ').map((word, wIdx) => (
                <span key={wIdx} className="inline-block whitespace-nowrap mr-3 sm:mr-4">
                  {word.split('').map((char, cIdx) => (
                    <motion.span
                      key={cIdx}
                      variants={charVariants}
                      className="inline-block transition-colors duration-200 hover:text-cyan-300"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.h1>

            {/* Phrase 2: "Built for Universal Flow." with Chromatic Gradient */}
            <motion.h1
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display leading-[1.05] flex flex-wrap"
              style={{ perspective: 800 }}
            >
              {phrase2.split(' ').map((word, wIdx) => (
                <span key={wIdx} className="inline-block whitespace-nowrap mr-3 sm:mr-4">
                  {word.split('').map((char, cIdx) => (
                    <motion.span
                      key={cIdx}
                      variants={charVariants}
                      className="inline-block bg-gradient-to-r from-cyan-300 via-indigo-300 to-violet-400 bg-clip-text text-transparent hover:brightness-125 transition-all"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.h1>
          </div>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
            className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed"
          >
            Engineered natively multimodal from the ground up by Google DeepMind. Gemini seamlessly weaves text, raw audio streams, high-resolution imagery, hour-long video, and complex code across a groundbreaking 2-million-token context window.
          </motion.p>

          {/* 5. CTAs: Magnetic buttons with glassmorphism, glowing borders on hover, and sound triggers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease: 'easeOut' }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            {/* Primary Magnetic CTA */}
            <MagneticButton
              variant="primary"
              href="#lab"
              soundFreq={660}
              soundType="triangle"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Launch Multimodal Lab</span>
            </MagneticButton>

            {/* Secondary Magnetic CTA */}
            <MagneticButton
              variant="secondary"
              onClick={() => onReplaySwarm()}
              soundFreq={740}
              soundType="sine"
            >
              <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              <span>Assemble Gemini Swarm</span>
            </MagneticButton>

            {/* Ghost Magnetic CTA */}
            <MagneticButton
              variant="ghost"
              href="#models"
              soundFreq={490}
              soundType="sine"
            >
              <span>Explore Model Family</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </MagneticButton>
          </motion.div>

          {/* Micro Telemetry Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex items-center gap-6 pt-4 text-xs font-mono text-slate-500"
          >
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">Context:</span>
              <span className="text-cyan-300 font-semibold tabular-nums">2,000,000 Tokens</span>
            </div>
            <span className="text-slate-700">·</span>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-slate-400">Live API:</span>
              <span className="text-violet-300 font-semibold tabular-nums">&lt;40ms</span>
            </div>
            <span className="text-slate-700">·</span>
            <div className="flex items-center gap-1.5 hidden sm:flex">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Modality:</span>
              <span className="text-emerald-300 font-semibold">Native Audio/Vision/Code</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Floating Kinetic Graphic ("Gemini Multimodal Tensor Core") */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex justify-center"
          >
            <NeuralCore />
          </motion.div>
        </div>

      </div>

      {/* Hero Bottom Quantitative Proof Strip */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10"
      >
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-display tabular-nums">
            2M Tokens
          </div>
          <div className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
            Context Window Depth
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-display tabular-nums">
            100%
          </div>
          <div className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
            Native Multimodality
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-violet-400 font-display tabular-nums">
            &lt; 40ms
          </div>
          <div className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
            Live Voice Latency
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-display tabular-nums">
            120 FPS
          </div>
          <div className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
            Interactive Reasoning
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
