/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface NavigationProps {
  onReplaySwarm: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onReplaySwarm }) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#08080c]/80 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 md:px-12 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="text-lg md:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-display hover:text-cyan-300 transition-colors flex items-center gap-2"
        >
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
            GEMINI AI
          </span>
        </a>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a
            href="#architecture"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Architecture
          </a>
          <a
            href="#lab"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Multimodal Lab
          </a>
          <a
            href="#models"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Models
          </a>
          <a
            href="#foundations"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Foundations
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleToggleSound}
            title={isMuted ? 'Enable Ambient Neural Soundscape' : 'Mute Soundscape'}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/5"
            aria-label="Toggle ambient soundscape"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <button
            onClick={() => {
              sound.playChime(587.33, 'triangle', 0.3);
              onReplaySwarm();
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 rounded-lg hover:from-cyan-400 hover:to-violet-500 transition-all shadow-md shadow-cyan-500/20 whitespace-nowrap shrink-0 cursor-pointer border border-cyan-400/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Replay Swarm</span>
          </button>
        </div>
      </div>
    </header>
  );
};
