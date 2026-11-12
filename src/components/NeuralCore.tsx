/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { sound } from '../utils/audio';

export const NeuralCore: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  // Mouse tilt tracking with spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 120, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-200, 200], [25, -25]);
  const rotateY = useTransform(smoothMouseX, [-200, 200], [-25, 25]);
  const coreScale = useTransform(smoothMouseX, [-200, 200], [0.98, 1.04]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    sound.playChime(784, 'sine', 0.25);
    setPulseKey((prev) => prev + 1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[480px] aspect-square mx-auto flex items-center justify-center select-none cursor-pointer group"
      style={{ perspective: 1200 }}
    >
      {/* 3D Tilting Warp Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale: coreScale,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Ambient Backlight Aura */}
        <div
          className={`absolute inset-10 rounded-full transition-all duration-700 blur-3xl pointer-events-none ${
            isHovered
              ? 'bg-gradient-to-tr from-violet-600/40 via-cyan-500/35 to-fuchsia-500/30 opacity-90 scale-110'
              : 'bg-gradient-to-tr from-violet-600/20 via-cyan-500/15 to-transparent opacity-60 scale-95'
          }`}
        />

        {/* Layer 1: Outer Celestial Coordinate Ring (Slow Clockwise) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[86%] h-[86%] rounded-full border border-dashed border-violet-500/25 pointer-events-none"
        >
          {/* Coordinate Orbit Nodes */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#38bdf8]" />
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-fuchsia-400 shadow-[0_0_10px_#f472b6]" />
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9]" />
        </motion.div>

        {/* Layer 2: Middle Gyroscopic Ring (Tilted Counter-Clockwise) */}
        <motion.div
          animate={{
            rotateZ: -360,
            rotateX: [65, 75, 65],
          }}
          transition={{
            rotateZ: { duration: 24, repeat: Infinity, ease: 'linear' },
            rotateX: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute w-[74%] h-[74%] rounded-full border border-cyan-400/35 shadow-[0_0_20px_rgba(56,189,248,0.2)] pointer-events-none"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 rounded-full border border-white/10" />
        </motion.div>

        {/* Layer 3: Layered Animated SVG Geometric Rings */}
        <svg
          viewBox="0 0 300 300"
          className="absolute w-[78%] h-[78%] overflow-visible pointer-events-none"
        >
          <defs>
            <linearGradient id="coreGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Concentric Dashed Ring */}
          <motion.circle
            cx="150"
            cy="150"
            r="110"
            fill="none"
            stroke="url(#coreGrad1)"
            strokeWidth="1.5"
            strokeDasharray="6 8 18 8"
            animate={{ rotate: 360 }}
            transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '150px 150px' }}
          />

          {/* Hexagonal Synaptic Hull */}
          <motion.polygon
            points="150,55 232,102 232,198 150,245 68,198 68,102"
            fill="none"
            stroke="rgba(167, 139, 250, 0.45)"
            strokeWidth="1.2"
            animate={{ rotate: -360, scale: isHovered ? [1, 1.05, 1] : 1 }}
            transition={{
              rotate: { duration: 45, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{ transformOrigin: '150px 150px' }}
          />

          {/* Octahedral Cross-Links */}
          <g stroke="rgba(56, 189, 248, 0.3)" strokeWidth="0.8">
            <line x1="150" y1="55" x2="150" y2="245" />
            <line x1="68" y1="102" x2="232" y2="198" />
            <line x1="68" y1="198" x2="232" y2="102" />
          </g>
        </svg>

        {/* Layer 4: Central 3D Rotating Polyhedral Wireframe */}
        <motion.div
          animate={{
            rotateY: 360,
            rotateX: [15, -15, 15],
          }}
          transition={{
            rotateY: { duration: 16, repeat: Infinity, ease: 'linear' },
            rotateX: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="relative w-36 h-36 flex items-center justify-center pointer-events-none"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Wireframe Facets (Rhombus facets in 3D) */}
          <div
            className="absolute inset-0 border border-violet-400/50 rounded-xl"
            style={{
              transform: 'rotateX(45deg) rotateY(45deg) translateZ(24px)',
              background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute inset-0 border border-cyan-400/50 rounded-xl"
            style={{
              transform: 'rotateX(-45deg) rotateY(45deg) translateZ(-24px)',
              background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute inset-0 border border-fuchsia-400/40 rounded-xl"
            style={{
              transform: 'rotateX(45deg) rotateY(-45deg) translateZ(12px)',
            }}
          />

          {/* Central Pulsing Synaptic Orb */}
          <motion.div
            key={pulseKey}
            animate={{
              scale: isHovered ? [1, 1.25, 1] : [1, 1.12, 1],
              opacity: [0.85, 1, 0.85],
            }}
            transition={{
              duration: isHovered ? 1.2 : 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-violet-500 via-cyan-400 to-white shadow-[0_0_35px_rgba(56,189,248,0.8),0_0_70px_rgba(139,92,246,0.5)] flex items-center justify-center"
          >
            {/* White-Hot Core Nucleus */}
            <div className="w-5 h-5 rounded-full bg-white shadow-[0_0_15px_#ffffff]" />
          </motion.div>
        </motion.div>

        {/* Orbiting Quantum Sparks */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              rotate: 360,
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              rotate: {
                duration: 8 + i * 4,
                repeat: Infinity,
                ease: 'linear',
              },
              scale: {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.8,
              },
            }}
            className="absolute w-full h-full pointer-events-none"
            style={{ transform: `rotate(${i * 60}deg)` }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#ffffff]"
              style={{
                position: 'absolute',
                top: `${20 + i * 8}%`,
                left: `${20 + i * 8}%`,
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Floating HUD Pill beneath the Core */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#0d0d18]/90 border border-white/10 backdrop-blur-xl shadow-xl text-[11px] font-mono tracking-wider"
      >
        <span className="flex items-center gap-1.5 text-slate-300">
          <span
            className={`w-2 h-2 rounded-full ${
              isHovered ? 'bg-cyan-400 animate-pulse' : 'bg-violet-400'
            }`}
          />
          <span className="text-cyan-300 font-semibold">GEMINI TENSOR CORE</span>
        </span>
        <span className="text-slate-600">·</span>
        <span className="text-violet-400 font-semibold tabular-nums">
          {isHovered ? '2,000,000 TOKENS' : 'MULTIMODAL 120Hz'}
        </span>
      </motion.div>
    </div>
  );
};
