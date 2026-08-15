import React from 'react';
import { Sequence, staticFile } from 'remotion';
import { Audio } from '@remotion/media';
import {
  GATE_START,
  BOOT_START,
  BOOT_LINE_INTERVAL,
  IRIS_START,
  MAIN_START,
  EXIT_START,
  NEXT_START,
  TOTAL_FRAMES,
} from './timing';

export const AudioLayer: React.FC<{ muted: boolean }> = ({ muted }) => {
  return (
    <>
      {/* Ambient hum — loop throughout */}
      <Sequence durationInFrames={TOTAL_FRAMES}>
        <Audio
          src={staticFile('audio/echo-hum.wav')}
          loop
          muted={muted}
        />
      </Sequence>

      {/* Gate power-on click */}
      <Sequence from={GATE_START} durationInFrames={20}>
        <Audio src={staticFile('audio/gate-beep.wav')} muted={muted} />
      </Sequence>

      {/* Terminal line beeps (5 lines, interval 12 frames) */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Sequence key={`term-${i}`} from={BOOT_START + i * BOOT_LINE_INTERVAL} durationInFrames={30}>
          <Audio
            src={staticFile(`audio/term-beep-${i}.wav`)}
            muted={muted}
          />
        </Sequence>
      ))}

      {/* Iris transition sawtooth beep */}
      <Sequence from={IRIS_START} durationInFrames={30}>
        <Audio src={staticFile('audio/iris-beep.wav')} muted={muted} />
      </Sequence>

      {/* Main entrance — UI blips (vol + lang) */}
      <Sequence from={MAIN_START} durationInFrames={15}>
        <Audio src={staticFile('audio/vol-beep.wav')} muted={muted} />
      </Sequence>
      <Sequence from={MAIN_START + 6} durationInFrames={15}>
        <Audio src={staticFile('audio/lang-beep.wav')} muted={muted} />
      </Sequence>

      {/* Continue button → exit */}
      <Sequence from={EXIT_START} durationInFrames={20}>
        <Audio src={staticFile('audio/cont-beep.wav')} muted={muted} />
      </Sequence>

      {/* Restart button → next screen */}
      <Sequence from={NEXT_START + 15} durationInFrames={15}>
        <Audio src={staticFile('audio/restart-beep.wav')} muted={muted} />
      </Sequence>
    </>
  );
};
