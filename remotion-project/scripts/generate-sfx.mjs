import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'audio');
mkdirSync(OUT, { recursive: true });

const SR = 44100;
const MASTER = 0.4;

function writeWav(name, samples) {
  const numSamples = samples.length;
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(SR, 24);
  buffer.writeUInt32LE(SR * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  // data
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < numSamples; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  writeFileSync(join(OUT, name), buffer);
  console.log(`  ✓ ${name} (${(numSamples / SR * 1000).toFixed(0)}ms, ${numSamples} samples)`);
}

function generateHum() {
  const dur = 2;
  const n = SR * dur;
  const amp = MASTER * 0.025;
  const freq = 55;
  const samples = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    samples[i] = amp * Math.sin(2 * Math.PI * freq * t);
  }
  // Verify seamless loop: 55Hz * 2s = 110 cycles → integer → seamless
  writeWav('echo-hum.wav', samples);
}

function generateBeep(name, freq, dur, type, vol) {
  const amp = MASTER * vol;
  const tailDur = 0.02;
  const totalDur = dur + tailDur;
  const n = Math.ceil(SR * totalDur);
  const samples = new Float64Array(n);
  const decayTarget = 0.0001;

  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let wave = 0;

    if (type === 'square') {
      wave = Math.sin(2 * Math.PI * freq * t) >= 0 ? 1 : -1;
    } else if (type === 'sawtooth') {
      const period = 1 / freq;
      const phase = (t % period) / period;
      wave = 2 * phase - 1;
    } else if (type === 'sine') {
      wave = Math.sin(2 * Math.PI * freq * t);
    }

    // Exponential ramp: amp * (decayTarget/amp)^(t/dur)
    let envelope = 0;
    if (t < dur) {
      envelope = amp * Math.pow(decayTarget / amp, t / dur);
    }
    samples[i] = wave * envelope;
  }
  writeWav(name, samples);
}

console.log('Generating SFX WAVs...\n');
generateHum();
generateBeep('gate-beep.wav', 700, 0.05, 'square', 0.15);
generateBeep('term-beep-0.wav', 560, 0.045, 'square', 0.15);
generateBeep('term-beep-1.wav', 630, 0.045, 'square', 0.15);
generateBeep('term-beep-2.wav', 700, 0.045, 'square', 0.15);
generateBeep('term-beep-3.wav', 770, 0.045, 'square', 0.15);
generateBeep('term-beep-4.wav', 840, 0.045, 'square', 0.15);
generateBeep('iris-beep.wav', 200, 0.16, 'sawtooth', 0.18);
generateBeep('cont-beep.wav', 440, 0.08, 'square', 0.15);
generateBeep('restart-beep.wav', 520, 0.05, 'square', 0.15);
generateBeep('lang-beep.wav', 660, 0.05, 'square', 0.15);
generateBeep('vol-beep.wav', 880, 0.06, 'square', 0.15);
console.log('\nDone!');
