import './index.css';
import { Composition } from 'remotion';
import { UnibeLands } from './unibelands4/UnibeLands';
import { FPS, TOTAL_FRAMES } from './unibelands4/timing';
import type { UnibeLandsProps } from './unibelands4/types';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="UnibeLands"
      component={UnibeLands as unknown as React.FC<Record<string, unknown>>}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{
        lang: 'es',
        muted: false,
        reducedMotion: false,
      } satisfies UnibeLandsProps}
    />
  );
};
