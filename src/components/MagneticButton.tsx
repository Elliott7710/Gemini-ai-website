/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { sound } from '../utils/audio';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  soundFreq?: number;
  soundType?: OscillatorType;
  href?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  soundFreq = 580,
  soundType = 'sine',
  href,
}) => {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

  // Spring physics for magnetic pull
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 14, stiffness: 160, mass: 0.2 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const pullStrength = 0.38;
    const deltaX = (e.clientX - centerX) * pullStrength;
    const deltaY = (e.clientY - centerY) * pullStrength;

    x.set(deltaX);
    y.set(deltaY);

    setGlowPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setHovered(true);
    sound.playChime(soundFreq * 0.9, 'triangle', 0.15);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    sound.playChime(soundFreq, soundType, 0.35);
    onClick?.(e);
  };

  const baseStyles =
    'relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-medium text-xs uppercase tracking-wider transition-all duration-300 select-none overflow-hidden cursor-pointer whitespace-nowrap shrink-0';

  const variants = {
    primary:
      'text-white bg-gradient-to-r from-violet-600/90 via-indigo-600/90 to-cyan-600/90 hover:from-violet-500 hover:to-cyan-400 shadow-[0_0_25px_rgba(99,102,241,0.35)] border border-white/20 hover:border-cyan-300/60',
    secondary:
      'text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-xl border border-white/10 hover:border-violet-400/50 shadow-[0_0_20px_rgba(139,92,246,0.15)]',
    ghost:
      'text-slate-400 hover:text-cyan-300 bg-transparent hover:bg-white/[0.03] border border-transparent hover:border-cyan-500/30',
  };

  const buttonContent = (
    <>
      {/* Dynamic Cursor-Follow Glow inside the button */}
      {hovered && (
        <span
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full w-28 h-28 bg-white/20 blur-xl transition-opacity duration-200"
          style={{
            left: `${glowPos.x}px`,
            top: `${glowPos.y}px`,
          }}
        />
      )}

      {/* Subtle border shimmer line */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        style={{ x: smoothX, y: smoothY }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`${baseStyles} ${variants[variant]} ${className}`}
      >
        {buttonContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      style={{ x: smoothX, y: smoothY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {buttonContent}
    </motion.button>
  );
};
