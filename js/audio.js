// ==================== RETRO AUDIO ENGINE ====================
let ctx = null;
let masterGain = null;
let muted = false;

function ensureCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.4;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function playTone(freq, duration, type = 'square', vol = 0.3, ramp = true) {
  const c = ensureCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = vol;
  if (ramp) gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + duration);
}

function noise(duration, vol = 0.2) {
  const c = ensureCtx();
  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buffer;
  const gain = c.createGain();
  gain.gain.value = vol;
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  src.connect(gain);
  gain.connect(masterGain);
  src.start(c.currentTime);
}

export const SFX = {
  bark(big = false) {
    if (muted) return;
    const c = ensureCtx();
    if (big) {
      // Sully: deep powerful BOOF - two-tone drop with chest resonance
      const osc1 = c.createOscillator();
      const osc2 = c.createOscillator();
      const gain1 = c.createGain();
      const gain2 = c.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(220, c.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(110, c.currentTime + 0.12);
      gain1.gain.setValueAtTime(0.4, c.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.18);
      osc1.connect(gain1); gain1.connect(masterGain);
      osc1.start(c.currentTime); osc1.stop(c.currentTime + 0.2);
      // Second bark pulse
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(180, c.currentTime + 0.08);
      osc2.frequency.exponentialRampToValueAtTime(90, c.currentTime + 0.22);
      gain2.gain.setValueAtTime(0, c.currentTime);
      gain2.gain.setValueAtTime(0.35, c.currentTime + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.28);
      osc2.connect(gain2); gain2.connect(masterGain);
      osc2.start(c.currentTime); osc2.stop(c.currentTime + 0.3);
      noise(0.05, 0.15); // breath burst
    } else {
      // June: sharp yappy bark - quick pitch rise then drop
      const osc1 = c.createOscillator();
      const osc2 = c.createOscillator();
      const gain1 = c.createGain();
      const gain2 = c.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(350, c.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(500, c.currentTime + 0.04);
      osc1.frequency.exponentialRampToValueAtTime(280, c.currentTime + 0.1);
      gain1.gain.setValueAtTime(0.35, c.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
      osc1.connect(gain1); gain1.connect(masterGain);
      osc1.start(c.currentTime); osc1.stop(c.currentTime + 0.13);
      // Second yap
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(400, c.currentTime + 0.1);
      osc2.frequency.exponentialRampToValueAtTime(550, c.currentTime + 0.14);
      osc2.frequency.exponentialRampToValueAtTime(320, c.currentTime + 0.2);
      gain2.gain.setValueAtTime(0, c.currentTime);
      gain2.gain.setValueAtTime(0.3, c.currentTime + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.22);
      osc2.connect(gain2); gain2.connect(masterGain);
      osc2.start(c.currentTime); osc2.stop(c.currentTime + 0.23);
      noise(0.03, 0.12);
    }
  },

  garyYell() {
    if (muted) return;
    const freqs = [300, 400, 350, 500, 280];
    freqs.forEach((f, i) => {
      setTimeout(() => playTone(f + Math.random() * 80, 0.07, 'sawtooth', 0.25), i * 50);
    });
    setTimeout(() => noise(0.15, 0.1), 200);
  },

  trashThrow() {
    if (muted) return;
    playTone(200, 0.1, 'triangle', 0.3);
    setTimeout(() => noise(0.08, 0.15), 50);
  },

  trashRoll() {
    if (muted) return;
    noise(0.06, 0.08);
    playTone(80 + Math.random() * 40, 0.06, 'triangle', 0.1);
  },

  trashHit() {
    if (muted) return;
    noise(0.2, 0.3);
    playTone(100, 0.15, 'square', 0.25);
    setTimeout(() => playTone(60, 0.2, 'sawtooth', 0.2), 80);
  },

  jump() {
    if (muted) return;
    const c = ensureCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, c.currentTime + 0.15);
    gain.gain.value = 0.2;
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.2);
  },

  collectBone() {
    if (muted) return;
    playTone(600, 0.08, 'square', 0.2);
    setTimeout(() => playTone(800, 0.08, 'square', 0.2), 70);
    setTimeout(() => playTone(1000, 0.12, 'square', 0.25), 140);
  },

  hurt() {
    if (muted) return;
    playTone(200, 0.1, 'sawtooth', 0.3);
    setTimeout(() => playTone(120, 0.15, 'sawtooth', 0.25), 80);
    setTimeout(() => playTone(80, 0.2, 'square', 0.2), 160);
  },

  bite() {
    if (muted) return;
    noise(0.05, 0.3);
    playTone(400, 0.05, 'square', 0.3);
    setTimeout(() => {
      noise(0.08, 0.25);
      playTone(300, 0.08, 'sawtooth', 0.25);
    }, 40);
  },

  levelComplete() {
    if (muted) return;
    const notes = [440, 550, 660, 880];
    notes.forEach((f, i) => {
      setTimeout(() => playTone(f, 0.2, 'square', 0.25), i * 150);
    });
    setTimeout(() => playTone(880, 0.4, 'triangle', 0.3), 600);
  },

  gameOver() {
    if (muted) return;
    const notes = [400, 350, 300, 200];
    notes.forEach((f, i) => {
      setTimeout(() => playTone(f, 0.25, 'sawtooth', 0.2), i * 200);
    });
  },

  menuSelect() {
    if (muted) return;
    playTone(500, 0.06, 'square', 0.15);
  },

  menuConfirm() {
    if (muted) return;
    playTone(400, 0.06, 'square', 0.15);
    setTimeout(() => playTone(600, 0.1, 'square', 0.2), 60);
  },

  step() {
    if (muted) return;
    noise(0.03, 0.04);
  },

  toggleMute() {
    muted = !muted;
    return muted;
  },

  isMuted() { return muted; },

  init() { ensureCtx(); },
};
