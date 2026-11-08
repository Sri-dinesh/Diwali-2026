/**
 * Zero-dependency Procedural Web Audio Synthesizer for Diwali 2026.
 * Generates authentic temple bells, sacred shankh (conch), war drums,
 * fire arrow whoosh, fireworks bursts, and ambient drone entirely in code.
 * Guaranteed 100% reliable with zero external 404 dependencies!
 */

class SoundSynth {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      } catch {
        // Audio not available — stay muted
        return;
      }
    }
    try {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch {
      // Resume blocked — stay muted
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      this.initContext();
      this.startAmbient();
      this.playTempleBell(); // welcoming chime on unmute
    } else {
      this.stopAmbient();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // 1. Sacred Shankh (Conch Shell) Blast
  public playShankh() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    // Characteristic rising pitch of a conch blast (around 220Hz up to 330Hz, then sustained)
    osc1.frequency.setValueAtTime(180, t);
    osc1.frequency.exponentialRampToValueAtTime(329.63, t + 0.6); // E4
    osc1.frequency.setValueAtTime(329.63, t + 2.2);
    osc1.frequency.exponentialRampToValueAtTime(160, t + 3.0);

    osc2.frequency.setValueAtTime(182, t);
    osc2.frequency.exponentialRampToValueAtTime(332, t + 0.6);
    osc2.frequency.setValueAtTime(332, t + 2.2);
    osc2.frequency.exponentialRampToValueAtTime(162, t + 3.0);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.linearRampToValueAtTime(1200, t + 0.6);
    filter.frequency.exponentialRampToValueAtTime(300, t + 3.0);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.5);
    gain.gain.setValueAtTime(0.35, t + 2.0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.0);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 3.0);
    osc2.stop(t + 3.0);
  }

  // 2. Temple Bell (Ghanta) with Pure Harmonics
  public playTempleBell(frequency: number = 587.33) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const harmonics = [1.0, 2.0, 3.01, 4.18, 5.43];
    const amplitudes = [0.4, 0.25, 0.15, 0.08, 0.05];

    harmonics.forEach((h, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency * h, t);

      gain.gain.setValueAtTime(amplitudes[idx], t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.5 - idx * 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 2.5);
    });
  }

  // 3. War Drum (Nagada / Dhol) for Rama vs Ravana
  public playWarDrum() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.18);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.5);
  }

  // 4. Fire Bow String Draw & Agni Astra Release
  public playBowDraw() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(480, t + 0.8);

    gain.gain.setValueAtTime(0.05, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.85);
  }

  // 5. Agni Astra Release Roar & Strike Shockwave
  public playArrowRelease() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Whoosh
    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.exponentialRampToValueAtTime(2400, t + 0.6);
    filter.frequency.exponentialRampToValueAtTime(200, t + 1.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 1.4);
  }

  // 6. Fireworks Burst (Pop + Sparkle Crackle)
  public playFirework() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Low boom
    const osc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.4);

    boomGain.gain.setValueAtTime(0.5, t);
    boomGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(boomGain);
    boomGain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.4);

    // Sparkle crackle
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.25));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1500;

    const crackleGain = this.ctx.createGain();
    crackleGain.gain.setValueAtTime(0.2, t + 0.05);
    crackleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    noise.connect(filter);
    filter.connect(crackleGain);
    crackleGain.connect(this.ctx.destination);
    noise.start(t + 0.05);
    noise.stop(t + 0.8);
  }

  // 7. Ambient Meditative Tambura Drone
  private startAmbient() {
    if (this.isAmbientPlaying || !this.ctx) return;
    this.isAmbientPlaying = true;

    const t = this.ctx.currentTime;
    const baseFreq = 146.83; // D3 note (traditional Indian classical tonic)
    const harmonics = [1, 1.5, 2, 2.67]; // Sa, Pa, Sa', Ma'

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, t);
    this.ambientGain.gain.linearRampToValueAtTime(0.09, t + 3.0);
    this.ambientGain.connect(this.ctx.destination);

    harmonics.forEach((h, i) => {
      if (!this.ctx || !this.ambientGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(baseFreq * h, t);

      // subtle vibrato LFO
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.2 + i * 0.1, t);
      lfoGain.gain.setValueAtTime(1.5, t);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(t);

      gain.gain.value = 0.25 / harmonics.length;
      osc.connect(gain);
      gain.connect(this.ambientGain);
      osc.start(t);
    });
  }

  private stopAmbient() {
    if (!this.ambientGain || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.ambientGain.gain.linearRampToValueAtTime(0.0001, t + 1.0);
    setTimeout(() => {
      this.isAmbientPlaying = false;
      this.ambientGain = null;
    }, 1100);
  }
}

export const sound = new SoundSynth();
