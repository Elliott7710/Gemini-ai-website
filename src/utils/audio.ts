/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API ambient drone and interaction sonification

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch {
      // Audio not supported
    }
  }

  public toggleMute(): boolean {
    this.init();
    if (!this.ctx || !this.masterGain) return true;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopDrone();
    } else {
      this.startDrone();
      this.playChime(528, 'sine', 0.2); // Solfeggio 528Hz transformation tone
    }

    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private startDrone() {
    if (!this.ctx || !this.masterGain) return;
    if (this.droneOsc1) return;

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.droneGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 3);
    this.droneGain.connect(this.masterGain);

    // Warm binaural flow state drone (108Hz + 114Hz delta wave)
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(108, this.ctx.currentTime);

    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(114, this.ctx.currentTime);

    // Low pass filter to make it velvet smooth
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    this.droneOsc1.connect(filter);
    this.droneOsc2.connect(filter);
    filter.connect(this.droneGain);

    this.droneOsc1.start();
    this.droneOsc2.start();
  }

  private stopDrone() {
    if (!this.ctx || !this.droneGain) return;
    try {
      this.droneGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.8);
      setTimeout(() => {
        this.droneOsc1?.stop();
        this.droneOsc2?.stop();
        this.droneOsc1?.disconnect();
        this.droneOsc2?.disconnect();
        this.droneOsc1 = null;
        this.droneOsc2 = null;
      }, 900);
    } catch {
      // Ignored
    }
  }

  public playChime(freq = 440, type: OscillatorType = 'sine', duration = 0.4) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio play error safety
    }
  }

  public playConvergenceBurst() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25]; // C major pentatonic shimmer
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playChime(freq, 'sine', 0.6 + idx * 0.1);
        }, idx * 70);
      });
    } catch {
      // Safety
    }
  }
}

export const sound = new SoundEngine();
