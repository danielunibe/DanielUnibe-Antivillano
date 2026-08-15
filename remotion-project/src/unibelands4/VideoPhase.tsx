import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { Video } from '@remotion/media';
import { C } from './config';
import { TEKO_FAMILY, SPACE_MONO_FAMILY } from './fonts';
import { VideoBox } from './VideoBox';
import { VIDEO_BOX_START } from './timing';

export const VIDEO_SRC = 'videocomponents/intro_1.mp4';
export const VIDEO_FADE_IN = 15;
export const VIDEO_FADE_OUT = 15;

export const VideoPhase: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, VIDEO_FADE_IN], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - VIDEO_FADE_OUT, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Video
        src={staticFile(VIDEO_SRC)}
        objectFit="cover"
        style={{
          width: '100%',
          height: '100%',
          opacity: fadeIn * fadeOut,
        }}
      />

      {frame >= VIDEO_BOX_START && <VideoBox startFrame={VIDEO_BOX_START} />}

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          opacity: fadeIn * fadeOut,
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: -1,
          }}
        >
          <div
            style={{
              fontFamily: TEKO_FAMILY,
              fontSize: 28,
              color: C.cyan,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            }}
          >
            [ VIDEO PLACEHOLDER ]
          </div>
          <div
            style={{
              fontFamily: SPACE_MONO_FAMILY,
              fontSize: 12,
              color: `${C.bone}80`,
              marginTop: 8,
            }}
          >
            Coloca tu MP4 en public/videocomponents/intro_1.mp4
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};