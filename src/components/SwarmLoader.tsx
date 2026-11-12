/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sound } from '../utils/audio';

export interface SwarmLoaderProps {
  onComplete?: () => void;
  text?: string;
  particleCount?: number;
  autoStartConvergenceDelay?: number; // default 1100ms
  interactive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  origX: number;
  origY: number;
  radius: number;
  baseRadius: number;
  hue: number;
  locked: boolean;
  lockProgress: number; // 0 to 1
  angleOffset: number;
  orbitRadius: number;
  orbitSpeed: number;
  prevX: number;
  prevY: number;
  trail: { x: number; y: number }[];
}

export const SwarmLoader: React.FC<SwarmLoaderProps> = ({
  onComplete,
  text = 'GEMINI AI',
  particleCount = 2200,
  autoStartConvergenceDelay = 1100,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<'swarm' | 'rebuilding' | 'locked' | 'warp' | 'done'>('swarm');
  const [coherence, setCoherence] = useState(0);
  const [statusMessage, setStatusMessage] = useState('CHAOTIC FLOCKING FIELD DEPLOYED');
  const [canSkip, setCanSkip] = useState(false);

  const mouseRef = useRef({ x: -2000, y: -2000, isDown: false });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const skipTimer = setTimeout(() => setCanSkip(true), 300);
    return () => clearTimeout(skipTimer);
  }, []);

  const handleSkip = useCallback(() => {
    if (phase === 'done' || phase === 'warp') return;
    setPhase('warp');
    setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 500);
  }, [phase, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    // 1. Precise Typographic Target Coordinate Sampler with Generous Tracking & Poisson Minimum Distance
    const sampleTargetCoordinates = (targetCount: number): { x: number; y: number }[] => {
      const offCanvas = document.createElement('canvas');
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return [];

      offCanvas.width = width;
      offCanvas.height = height;
      offCtx.fillStyle = '#000000';
      offCtx.fillRect(0, 0, width, height);

      const isMobile = width < 768;
      // Calibrated size to ensure negative space inside counters
      const fontSize = isMobile ? Math.floor(width * 0.12) : Math.min(Math.floor(width * 0.075), 108);

      // Use font weight 700 for distinct stems & open counters (B, O, D)
      offCtx.font = `700 ${fontSize}px 'Syne', 'Plus Jakarta Sans', sans-serif`;
      offCtx.fillStyle = '#ffffff';
      offCtx.textBaseline = 'middle';

      // Draw with generous letter-spacing so characters never weld together
      const drawSpacedText = (str: string, yPos: number, letterSpacing: number) => {
        const letters = str.split('');
        const totalWidth = letters.reduce(
          (acc, char, i) => acc + offCtx.measureText(char).width + (i < letters.length - 1 ? letterSpacing : 0),
          0
        );
        let curX = width / 2 - totalWidth / 2;

        letters.forEach((char, i) => {
          offCtx.fillText(char, curX, yPos);
          curX += offCtx.measureText(char).width + letterSpacing;
        });
      };

      const tracking = isMobile ? 8 : Math.max(14, fontSize * 0.18);

      if (isMobile) {
        const words = text.split(' ');
        if (words.length >= 2) {
          drawSpacedText(words[0], height / 2 - fontSize * 0.58, tracking);
          drawSpacedText(words.slice(1).join(' '), height / 2 + fontSize * 0.58, tracking);
        } else {
          drawSpacedText(text, height / 2, tracking);
        }
      } else {
        // Desktop single-line with distinct word gap
        const words = text.split(' ');
        if (words.length === 2) {
          const w1 = words[0];
          const w2 = words[1];
          const spaceWidth = fontSize * 0.65;
          const w1Letters = w1.split('');
          const w2Letters = w2.split('');
          
          const w1Width = w1Letters.reduce((a, c, i) => a + offCtx.measureText(c).width + (i < w1Letters.length - 1 ? tracking : 0), 0);
          const w2Width = w2Letters.reduce((a, c, i) => a + offCtx.measureText(c).width + (i < w2Letters.length - 1 ? tracking : 0), 0);
          const fullWidth = w1Width + spaceWidth + w2Width;
          
          let curX = width / 2 - fullWidth / 2;
          w1Letters.forEach((char, i) => {
            offCtx.fillText(char, curX, height / 2);
            curX += offCtx.measureText(char).width + tracking;
          });
          curX += spaceWidth - tracking;
          w2Letters.forEach((char, i) => {
            offCtx.fillText(char, curX, height / 2);
            curX += offCtx.measureText(char).width + tracking;
          });
        } else {
          drawSpacedText(text, height / 2, tracking);
        }
      }

      // Read image data and extract white pixel targets
      const imgData = offCtx.getImageData(0, 0, width, height);
      const pixels = imgData.data;
      const rawWhitePixels: { x: number; y: number }[] = [];
      const step = 2; // high-resolution scan

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const idx = (y * width + x) * 4;
          if (pixels[idx] > 150) {
            rawWhitePixels.push({ x, y });
          }
        }
      }

      // Shuffle pixels
      for (let i = rawWhitePixels.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rawWhitePixels[i], rawWhitePixels[j]] = [rawWhitePixels[j], rawWhitePixels[i]];
      }

      // Minimum-distance Poisson filter to prevent clumped/overlapping blobs
      const minDist = isMobile ? 3.2 : 3.8;
      const minDistSq = minDist * minDist;
      const spacedTargets: { x: number; y: number }[] = [];

      for (let i = 0; i < rawWhitePixels.length; i++) {
        const candidate = rawWhitePixels[i];
        let isTooClose = false;

        // Compare against nearby sampled points
        const checkWindow = Math.max(0, spacedTargets.length - 140);
        for (let k = spacedTargets.length - 1; k >= checkWindow; k--) {
          const existing = spacedTargets[k];
          const dx = candidate.x - existing.x;
          const dy = candidate.y - existing.y;
          if (dx * dx + dy * dy < minDistSq) {
            isTooClose = true;
            break;
          }
        }

        if (!isTooClose) {
          spacedTargets.push(candidate);
          if (spacedTargets.length >= targetCount) break;
        }
      }

      // If we need additional targets to reach targetCount, jitter slightly around spaced targets
      const finalTargets: { x: number; y: number }[] = [...spacedTargets];
      let fillerIdx = 0;
      while (finalTargets.length < targetCount && spacedTargets.length > 0) {
        const base = spacedTargets[fillerIdx % spacedTargets.length];
        const angle = Math.random() * Math.PI * 2;
        const r = 0.8 + Math.random() * 1.2;
        finalTargets.push({
          x: base.x + Math.cos(angle) * r,
          y: base.y + Math.sin(angle) * r,
        });
        fillerIdx++;
      }

      return finalTargets;
    };

    let targetPoints: { x: number; y: number }[] = [];

    // Initialize Particles with Orbital Vortex Variables
    const particles: Particle[] = [];
    const center = { x: width / 2, y: height / 2 };

    const initParticles = () => {
      targetPoints = sampleTargetCoordinates(particleCount);
      particles.length = 0;

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * Math.max(width, height) * 0.65;
        const initX = center.x + Math.cos(angle) * distance;
        const initY = center.y + Math.sin(angle) * distance;
        const baseR = Math.random() * 0.4 + 0.85; // Crisp fine radius: 0.85 to 1.25px

        particles.push({
          x: initX,
          y: initY,
          prevX: initX,
          prevY: initY,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          targetX: targetPoints[i]?.x ?? center.x,
          targetY: targetPoints[i]?.y ?? center.y,
          origX: initX,
          origY: initY,
          radius: baseR,
          baseRadius: baseR,
          hue: 185 + Math.random() * 85, // Cyan (185) to Violet (270)
          locked: false,
          lockProgress: 0,
          angleOffset: angle,
          orbitRadius: distance,
          orbitSpeed: (0.012 + Math.random() * 0.018) * (Math.random() > 0.5 ? 1 : -1),
          trail: [],
        });
      }
    };

    if (document.fonts) {
      document.fonts.ready.then(() => {
        initParticles();
      });
    } else {
      initParticles();
    }

    let state: 'swarm' | 'rebuilding' | 'locked' | 'warp' | 'done' = 'swarm';
    let lockSoundTriggered = false;
    let warpStartTime = 0;

    // Trigger Rebuild Convergence Sequence after delay
    const rebuildTimer = setTimeout(() => {
      state = 'rebuilding';
      setPhase('rebuilding');
      setStatusMessage('REBUILDING ATOMIC LATTICE — CONVERGING SWARM');
      sound.playChime(380, 'triangle', 0.4);
    }, autoStartConvergenceDelay);

    // Curl noise helper for organic nanite swarming
    const curl = (x: number, y: number, t: number) => {
      const s = 0.0025;
      return (
        Math.sin(x * s + t * 0.0012) * Math.cos(y * s - t * 0.0009) * 3 +
        Math.cos(y * s * 1.5 + t * 0.0008) * 2
      );
    };

    const render = (now: number) => {
      // Clean background fill: Solid and clean in locked mode so zero residue or bleed-through occurs
      if (state === 'locked') {
        ctx.fillStyle = '#08080c';
        ctx.fillRect(0, 0, width, height);

        // Subtle ambient radial glow behind letters
        const ambientGrad = ctx.createRadialGradient(center.x, center.y, 40, center.x, center.y, width * 0.5);
        ambientGrad.addColorStop(0, 'rgba(25, 22, 55, 0.45)');
        ambientGrad.addColorStop(0.5, 'rgba(12, 11, 24, 0.25)');
        ambientGrad.addColorStop(1, 'rgba(8, 8, 12, 1)');
        ctx.fillStyle = ambientGrad;
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = state === 'warp' ? 'rgba(8, 8, 12, 0.3)' : 'rgba(8, 8, 12, 0.4)';
        ctx.fillRect(0, 0, width, height);
      }

      // Additive blending for electric plasma luminescence
      ctx.globalCompositeOperation = 'lighter';

      const mouse = mouseRef.current;
      let lockedCount = 0;
      const t = now * 0.001;

      // Update & Draw Nanite Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.prevX = p.x;
        p.prevY = p.y;

        // Record short trail history for motion graphics ribbons
        if (i % 3 === 0 && (state === 'swarm' || state === 'rebuilding')) {
          p.trail.unshift({ x: p.x, y: p.y });
          if (p.trail.length > 3) p.trail.pop();
        }

        if (state === 'swarm') {
          // PHASE 1: Chaotic Turbulent Orbital Swarm
          p.angleOffset += p.orbitSpeed;
          p.orbitRadius += Math.sin(t * 2 + i) * 0.8;

          const vortexX = center.x + Math.cos(p.angleOffset) * p.orbitRadius;
          const vortexY = center.y + Math.sin(p.angleOffset) * p.orbitRadius;

          const nAngle = curl(p.x, p.y, now);
          p.vx += Math.cos(nAngle) * 0.45 + (vortexX - p.x) * 0.008;
          p.vy += Math.sin(nAngle) * 0.45 + (vortexY - p.y) * 0.008;
          p.vx *= 0.94;
          p.vy *= 0.94;

          p.x += p.vx;
          p.y += p.vy;
        } else if (state === 'rebuilding') {
          // PHASE 2: Kinetic Funnel Convergence into Typographic Target
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 3.5) {
            p.locked = true;
            p.lockProgress = Math.min(1, p.lockProgress + 0.1);
            p.x += (p.targetX - p.x) * 0.45;
            p.y += (p.targetY - p.y) * 0.45;
            p.vx = 0;
            p.vy = 0;
            lockedCount++;
          } else {
            p.locked = false;
            const spiralForce = Math.min(dist * 0.003, 1.6);
            const perpX = -dy / dist;
            const perpY = dx / dist;

            const pullStrength = 0.055;
            p.vx += (dx * pullStrength) + perpX * spiralForce * 2.0;
            p.vy += (dy * pullStrength) + perpY * spiralForce * 2.0;
            p.vx *= 0.86;
            p.vy *= 0.86;

            if (mouse.x > 0 && mouse.y > 0) {
              const mdx = p.x - mouse.x;
              const mdy = p.y - mouse.y;
              const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
              if (mDist < 90) {
                const rep = (1 - mDist / 90) * 10;
                p.vx += (mdx / mDist) * rep;
                p.vy += (mdy / mDist) * rep;
              }
            }

            p.x += p.vx;
            p.y += p.vy;
          }
        } else if (state === 'locked') {
          // PHASE 3: Rebuilt Holographic Typographic Structure (Razor-Sharp Starlight)
          lockedCount = particles.length;

          // Microscopic, serene breathing (0.12px max jitter to preserve crisp letter contours)
          const jitterX = Math.sin(t * 3 + i * 0.15) * 0.12;
          const jitterY = Math.cos(t * 3 + i * 0.15) * 0.12;
          const targetWithJitterX = p.targetX + jitterX;
          const targetWithJitterY = p.targetY + jitterY;

          // Interactive liquid mercury displacement on hover
          if (mouse.x > 0 && mouse.y > 0) {
            const mdx = p.x - mouse.x;
            const mdy = p.y - mouse.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mDist < 100 && mDist > 0) {
              const force = (1 - mDist / 100) * 16;
              p.x += (mdx / mDist) * force;
              p.y += (mdy / mDist) * force;
            }
          }

          p.x += (targetWithJitterX - p.x) * 0.25;
          p.y += (targetWithJitterY - p.y) * 0.25;
        } else if (state === 'warp') {
          // PHASE 4: Hyper-speed camera forward dive
          const warpAge = (now - warpStartTime) * 0.001;
          const dx = p.x - center.x;
          const dy = p.y - center.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          p.x += (dx / dist) * (warpAge * 65 + 3);
          p.y += (dy / dist) * (warpAge * 65 + 3);
          p.radius = p.baseRadius * (1 + warpAge * 4.5);
        }

        // Draw Motion Trails during Swarm & Convergence
        if (p.trail.length > 1 && (state === 'swarm' || state === 'rebuilding')) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let ti = 1; ti < p.trail.length; ti++) {
            ctx.lineTo(p.trail[ti].x, p.trail[ti].y);
          }
          ctx.strokeStyle = `hsla(${p.hue}, 90%, 65%, 0.18)`;
          ctx.lineWidth = p.radius * 0.6;
          ctx.stroke();
        }

        // Render Nanite Particles with Precision Specular Radii
        const currentRadius = p.locked ? 0.95 : p.radius;

        if (p.locked) {
          // Tight, crisp aura (not bloated)
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius * 1.9, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, 0.22)`;
          ctx.fill();

          // Diamond Specular Pinpoint Core
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        } else {
          // Swarm state particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 95%, 60%, 0.3)`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, 0.85)`;
          ctx.fill();
        }
      }

      // Draw Fine Synaptic Constellation Filaments between close locked nodes
      if (state === 'locked') {
        const sampleStep = 10;
        ctx.lineWidth = 0.45;
        for (let i = 0; i < particles.length; i += sampleStep) {
          const pi = particles[i];
          if (!pi.locked) continue;
          for (let j = i + sampleStep; j < Math.min(i + 24, particles.length); j += sampleStep) {
            const pj = particles[j];
            if (!pj.locked) continue;
            const ddx = pi.x - pj.x;
            const ddy = pi.y - pj.y;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dist < 12) {
              ctx.strokeStyle = `rgba(56, 189, 248, ${0.35 * (1 - dist / 12)})`;
              ctx.beginPath();
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(pj.x, pj.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw Laser-Thin Cybernetic Alignment Brackets (Vector Rendered, Never Clumped Particles)
      if (state === 'rebuilding' || state === 'locked') {
        const isMobile = width < 768;
        const fontSize = isMobile ? Math.floor(width * 0.12) : Math.min(Math.floor(width * 0.075), 108);
        const bracketW = isMobile ? width * 0.42 : Math.min(width * 0.38, 410);
        const bracketH = fontSize * 1.15;
        const cornerLen = 18;
        const alpha = state === 'locked' ? 0.65 : 0.3;

        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.lineWidth = 1;

        // Top-Left Corner
        ctx.beginPath();
        ctx.moveTo(center.x - bracketW, center.y - bracketH + cornerLen);
        ctx.lineTo(center.x - bracketW, center.y - bracketH);
        ctx.lineTo(center.x - bracketW + cornerLen, center.y - bracketH);
        ctx.stroke();

        // Top-Right Corner
        ctx.beginPath();
        ctx.moveTo(center.x + bracketW - cornerLen, center.y - bracketH);
        ctx.lineTo(center.x + bracketW, center.y - bracketH);
        ctx.lineTo(center.x + bracketW, center.y - bracketH + cornerLen);
        ctx.stroke();

        // Bottom-Left Corner
        ctx.beginPath();
        ctx.moveTo(center.x - bracketW, center.y + bracketH - cornerLen);
        ctx.lineTo(center.x - bracketW, center.y + bracketH);
        ctx.lineTo(center.x - bracketW + cornerLen, center.y + bracketH);
        ctx.stroke();

        // Bottom-Right Corner
        ctx.beginPath();
        ctx.moveTo(center.x + bracketW - cornerLen, center.y + bracketH);
        ctx.lineTo(center.x + bracketW, center.y + bracketH);
        ctx.lineTo(center.x + bracketW, center.y + bracketH - cornerLen);
        ctx.stroke();

        // Corner Crosshair Accents
        const drawCross = (cx: number, cy: number) => {
          ctx.beginPath();
          ctx.moveTo(cx - 3, cy);
          ctx.lineTo(cx + 3, cy);
          ctx.moveTo(cx, cy - 3);
          ctx.lineTo(cx, cy + 3);
          ctx.stroke();
        };
        drawCross(center.x - bracketW, center.y - bracketH);
        drawCross(center.x + bracketW, center.y - bracketH);
        drawCross(center.x - bracketW, center.y + bracketH);
        drawCross(center.x + bracketW, center.y + bracketH);
      }

      // Calculate and update Coherence Percentage
      const currentCoherence = Math.min(100, Math.round((lockedCount / (particles.length || 1)) * 100));
      setCoherence(currentCoherence);

      // Transition Rebuilding -> Locked state
      if (state === 'rebuilding' && currentCoherence >= 88) {
        state = 'locked';
        setPhase('locked');
        setStatusMessage('SWARM REBUILD COMPLETE — LATTICE INTEGRITY 100%');

        if (!lockSoundTriggered) {
          lockSoundTriggered = true;
          sound.playConvergenceBurst();
        }

        // Hold rebuilt typography for 1.4s before forward warp dive
        setTimeout(() => {
          if (state !== 'done') {
            state = 'warp';
            setPhase('warp');
            warpStartTime = performance.now();
            sound.playChime(780, 'sine', 0.6);

            setTimeout(() => {
              state = 'done';
              setPhase('done');
              onComplete?.();
            }, 650);
          }
        }, 1400);
      }

      ctx.globalCompositeOperation = 'source-over';

      if (state !== 'done') {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -2000;
      mouseRef.current.y = -2000;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(rebuildTimer);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [particleCount, autoStartConvergenceDelay, text, interactive, onComplete]);

  if (phase === 'done') {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center bg-[#08080c] select-none transition-all duration-700 ease-out ${
        phase === 'warp' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{ willChange: 'transform, opacity' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full cursor-crosshair"
      />

      {/* High-Tech Telemetry HUD Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-5 py-2.5 rounded-full bg-black/75 backdrop-blur-xl border border-white/10 text-xs font-mono tracking-wider text-slate-300 z-10 shadow-2xl">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              phase === 'locked' ? 'bg-cyan-400 animate-pulse' : 'bg-violet-400'
            }`}
          />
          <span className="text-violet-300 font-semibold uppercase">{statusMessage}</span>
        </div>

        <span className="text-slate-600">|</span>

        <div className="flex items-center gap-1.5 tabular-nums">
          <span className="text-slate-400">COHERENCE:</span>
          <span className="text-cyan-400 font-bold">{coherence}%</span>
        </div>

        {canSkip && (
          <>
            <span className="text-slate-600">|</span>
            <button
              onClick={handleSkip}
              className="text-white hover:text-cyan-300 transition-colors uppercase font-medium underline underline-offset-4 cursor-pointer"
            >
              Skip
            </button>
          </>
        )}
      </div>

      <div className="absolute top-6 right-6 hidden md:block text-[10px] font-mono text-slate-500 uppercase tracking-widest z-10">
        [NANOTECH ATOMIC REBUILD PROTOCOL // 120 FPS]
      </div>
    </div>
  );
};

export default SwarmLoader;
