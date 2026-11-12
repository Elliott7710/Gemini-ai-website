/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [hoverType, setHoverType] = useState<'none' | 'button' | 'card' | 'input'>('none');
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on desktop pointer fine devices
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPos({ x: targetX, y: targetY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        // Detect interactive targets with granular states
        if (target.closest('button, a, [role="button"]')) {
          setHoverType('button');
        } else if (target.closest('input, textarea')) {
          setHoverType('input');
        } else if (target.closest('.group, [data-interactive="true"], .cursor-pointer')) {
          setHoverType('card');
        } else {
          setHoverType('none');
        }
      } else {
        setHoverType('none');
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mouseleave', onMouseLeave);
    document.body.addEventListener('mouseenter', onMouseEnter);

    // Spring damping interpolation loop (60-120 FPS compositor optimized)
    const loop = () => {
      const ease = 0.16;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      setFollowerPos({ x: currentX, y: currentY });
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.body.removeEventListener('mouseenter', onMouseEnter);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const isExpanded = hoverType !== 'none';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden select-none"
    >
      {/* 1. Core Center Pinpoint Dot */}
      <div
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-opacity duration-150"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          width: hoverType === 'input' ? '2px' : isExpanded ? '4px' : '6px',
          height: hoverType === 'input' ? '18px' : isExpanded ? '4px' : '6px',
          borderRadius: hoverType === 'input' ? '1px' : '9999px',
          willChange: 'transform',
        }}
      />

      {/* 2. Outer Smooth-Damped Magnetic Follower Ring */}
      <div
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out flex items-center justify-center"
        style={{
          transform: `translate3d(${followerPos.x}px, ${followerPos.y}px, 0) scale(${
            isClicking
              ? 0.72
              : hoverType === 'button'
              ? 2.1
              : hoverType === 'card'
              ? 2.4
              : hoverType === 'input'
              ? 0.6
              : 1
          })`,
          width: '38px',
          height: '38px',
          borderWidth: '1px',
          borderColor:
            hoverType === 'button'
              ? 'rgba(56, 189, 248, 0.9)'
              : hoverType === 'card'
              ? 'rgba(167, 139, 250, 0.75)'
              : 'rgba(255, 255, 255, 0.35)',
          backgroundColor:
            hoverType === 'button'
              ? 'rgba(56, 189, 248, 0.08)'
              : hoverType === 'card'
              ? 'rgba(167, 139, 250, 0.05)'
              : 'rgba(255, 255, 255, 0.02)',
          backdropFilter: isExpanded ? 'blur(2px)' : 'none',
          boxShadow: isExpanded
            ? '0 0 25px rgba(139, 92, 246, 0.35), inset 0 0 10px rgba(56, 189, 248, 0.2)'
            : 'none',
          willChange: 'transform',
        }}
      >
        {/* Subtle Chromatic Aberration Rings on Hover */}
        {isExpanded && (
          <div
            className="absolute inset-0 rounded-full border border-fuchsia-400/30 -translate-x-0.5 pointer-events-none"
            style={{ willChange: 'transform' }}
          />
        )}
      </div>
    </div>
  );
};
