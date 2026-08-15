import React from 'react';
import { staticFile, useCurrentFrame } from 'remotion';
import { Video } from '@remotion/media';
import { C } from './config';
import { SPACE_MONO_FAMILY } from './fonts';

export const VIDEO_SRC_INTRO2 = 'videocomponents/intro_2.mp4';

const BOX_W = 500;
const BOX_H = 890;

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export const VideoBox: React.FC<{
  startFrame: number;
}> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  const el = (frame - startFrame) / 30;
  const entranceOpacity = clamp(el / 0.4, 0, 1);

  return (
    <div
      style={{
        position: 'absolute',
        right: 48,
        top: '50%',
        transform: 'translateY(-50%)',
        opacity: entranceOpacity,
        zIndex: 30,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: BOX_W,
          height: BOX_H,
          backgroundColor: '#0d0b08',
          clipPath:
            'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)',
          filter: `drop-shadow(6px 6px 0px ${C.stroke}) drop-shadow(0 0 8px rgba(0,240,255,0.3))`,
          border: `3px solid ${C.stroke}`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: C.cyan,
            zIndex: 3,
          }}
        />

        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <Video
            src={staticFile(VIDEO_SRC_INTRO2)}
            objectFit="cover"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 3,
            background: 'rgba(0,0,0,0.7)',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: SPACE_MONO_FAMILY,
              fontSize: 9,
              color: C.cyan,
              letterSpacing: '0.2em',
            }}
          >
            INTRO_2
          </span>
          <span
            style={{
              fontFamily: SPACE_MONO_FAMILY,
              fontSize: 9,
              color: C.yellow,
              letterSpacing: '0.2em',
            }}
          >
            ▶ ECHO-CLIP
          </span>
        </div>
      </div>
    </div>
  );
};
