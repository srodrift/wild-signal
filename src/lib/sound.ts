export type SoundCue = "send" | "receive" | "tap" | "report" | "enable";

class WildSound {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambientNodes: AudioNode[] = [];
  private ambientTimer: number | null = null;
  enabled = false;

  async unlock() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.28;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
    this.enabled = true;
  }

  stop() {
    this.enabled = false;
    this.stopAmbient();
    if (this.ctx?.state === "running") {
      void this.ctx.suspend();
    }
  }

  play(cue: SoundCue) {
    if (!this.enabled || !this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    if (cue === "tap") this.blip(t, 620, 0.05, 0.08);
    if (cue === "send") this.whoosh(t);
    if (cue === "receive") this.chime(t, [523.25, 659.25], 0.12);
    if (cue === "report") this.chime(t, [392, 523.25, 659.25], 0.1);
    if (cue === "enable") this.chime(t, [440, 554.37], 0.09);
  }

  startAmbient() {
    if (!this.ctx || !this.master || this.ambientNodes.length) return;
    const ctx = this.ctx;

    const noise = ctx.createBufferSource();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i += 1) {
      last = last * 0.97 + (Math.random() * 2 - 1) * 0.03;
      data[i] = last;
    }
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 280;
    filter.Q.value = 0.7;

    const fog = ctx.createGain();
    fog.gain.value = 0.045;
    noise.connect(filter);
    filter.connect(fog);
    fog.connect(this.master);

    const pad = ctx.createOscillator();
    pad.type = "sine";
    pad.frequency.value = 73.4;
    const padGain = ctx.createGain();
    padGain.gain.value = 0.018;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 8;
    lfo.connect(lfoGain);
    lfoGain.connect(pad.frequency);
    pad.connect(padGain);
    padGain.connect(this.master);

    noise.start();
    pad.start();
    lfo.start();
    this.ambientNodes.push(noise, filter, fog, pad, padGain, lfo, lfoGain);

    this.ambientTimer = window.setInterval(() => {
      if (!this.enabled || !this.ctx) return;
      if (Math.random() > 0.55) this.distantCall(this.ctx.currentTime);
    }, 14000);
  }

  private stopAmbient() {
    if (this.ambientTimer) {
      window.clearInterval(this.ambientTimer);
      this.ambientTimer = null;
    }
    for (const node of this.ambientNodes) {
      if ("stop" in node && typeof node.stop === "function") {
        try {
          node.stop();
        } catch {
          /* already stopped */
        }
      }
      node.disconnect();
    }
    this.ambientNodes = [];
  }

  private blip(time: number, freq: number, attack: number, volume: number) {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(volume, time + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + attack + 0.12);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(time);
    osc.stop(time + 0.2);
  }

  private whoosh(time: number) {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(240, time);
    osc.frequency.exponentialRampToValueAtTime(720, time + 0.14);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.09, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(time);
    osc.stop(time + 0.2);
  }

  private chime(time: number, notes: number[], step: number) {
    notes.forEach((freq, i) => this.blip(time + i * step, freq, 0.02, 0.07));
  }

  private distantCall(time: number) {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, time);
    osc.frequency.exponentialRampToValueAtTime(620, time + 0.28);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.035, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.42);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(time);
    osc.stop(time + 0.45);
  }
}

export const wildSound = new WildSound();
