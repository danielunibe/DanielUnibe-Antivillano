import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import { C } from './config';
import { t } from './copy';
import type { UnibeLandsProps, Phase } from './types';
import {
  FPS,
  GATE_END,
  VIDEO_START,
  VIDEO_DURATION,
  BOOT_START,
  IRIS_START,
  FLASH_FRAME,
  MAIN_START,
  EXIT_START,
  NEXT_START,
  TIP_CYCLE_FRAMES,
} from './timing';
import { deterministicRandom } from './utils/deterministic';
import { TEKO_FAMILY, SPACE_MONO_FAMILY } from './fonts';
import { AudioLayer } from './AudioLayer';
import { VideoPhase } from './VideoPhase';
import {
  SpeakerIcon,
  GlobeIcon,
  ArrowRightIcon,
  HeadphonesIcon,
} from './Icons';

/* ─── EASINGS (from canvas) ─── */
function backOut(t: number): number {
  const c = 1.70158;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
}
function inOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function outCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
function prog(el: number, d: number, du: number): number {
  return clamp((el - d) / du, 0, 1);
}

/* ─── MAIN COMPONENT ─── */
export const UnibeLands: React.FC<UnibeLandsProps> = ({
  lang,
  muted,
  reducedMotion,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = t(lang);
  const T = frame / fps;

  const phase: Phase = React.useMemo(() => {
    if (frame >= NEXT_START) return 'next';
    if (frame >= EXIT_START) return 'exit';
    if (frame >= MAIN_START) return 'main';
    if (frame >= IRIS_START) return 'iris';
    if (frame >= BOOT_START) return 'boot';
    if (frame >= VIDEO_START) return 'video';
    return 'gate';
  }, [frame]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.void, overflow: 'hidden' }}>
      <AudioLayer muted={muted} />

      {phase === 'gate' && (
        <GatePhase frame={frame} T={T} d={d} reducedMotion={reducedMotion} />
      )}
      {phase === 'video' && (
        <VideoPhase durationInFrames={VIDEO_DURATION} />
      )}
      {phase === 'boot' && (
        <BootPhase frame={frame} T={T} d={d} reducedMotion={reducedMotion} />
      )}
      {(phase === 'iris' || phase === 'main' || phase === 'exit') && (
        <MainPhase T={T} d={d} muted={muted} reducedMotion={reducedMotion} phase={phase} />
      )}
      {phase === 'next' && (
        <NextPhase T={T} d={d} />
      )}

      <HUDCorners />
    </AbsoluteFill>
  );
};

/* ─── BACKGROUND LAYERS (drawBG + drawAtmo) ─── */
const BackgroundLayers: React.FC<{ T: number }> = ({
  T,
}) => {
  const noiseOffset = deterministicRandom(Math.floor(T * 10) * 7) * 160;
  const filterId = `noise-${Math.floor(T * 10)}`;

  return (
    <>
      {/* Radial gradients */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 20% 15%, ${C.rust}0f, transparent 40%),
                       radial-gradient(circle at 80% 85%, ${C.cyan}0d, transparent 45%)`,
        }}
      />
      {/* Noise grain (SVG feTurbulence) */}
      <AbsoluteFill style={{ opacity: 0.07, pointerEvents: 'none' }}>
        <svg width="100%" height="100%">
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter={`url(#${filterId})`}
            style={{ transform: `translate(${noiseOffset % 160}px, ${noiseOffset % 160}px)` }}
          />
        </svg>
      </AbsoluteFill>
      {/* Scanlines */}
      <AbsoluteFill style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="scanlines" width="100%" height="4" patternUnits="userSpaceOnUse">
              <rect width="100%" height="2" fill="transparent" />
              <rect y="2" width="100%" height="2" fill="rgba(0,0,0,0.55)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#scanlines)" />
        </svg>
      </AbsoluteFill>
      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle, ${C.cyan}08 0%, ${C.void}f0 80%)`,
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

/* ─── PARTICLES (drawMotes) ─── */
const MOTES = Array.from({ length: 16 }, (_, i) => ({
  x: deterministicRandom(i * 7 + 1),
  s: 2 + deterministicRandom(i * 3 + 2) * 3,
  c: [C.yellow, C.cyan, C.rust][i % 3],
  drift: deterministicRandom(i * 5 + 3) * 40 - 20,
  dur: 9 + deterministicRandom(i * 11 + 4) * 8,
  delay: deterministicRandom(i * 13 + 5) * 8,
}));

const Particles: React.FC<{ T: number; reducedMotion: boolean }> = ({
  T,
  reducedMotion,
}) => {
  if (reducedMotion) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {MOTES.map((m, i) => {
        const p = ((T + m.delay) % m.dur) / m.dur;
        const y = 110 - p * 120;
        const x = m.x * 100 + m.drift * p * 0.1;
        let a = 0.45;
        if (p < 0.08) a = (p / 0.08) * 0.55;
        else if (p > 0.92) a = ((1 - p) / 0.08) * 0.25;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: m.s,
              height: m.s,
              borderRadius: '50%',
              backgroundColor: m.c,
              opacity: clamp(a, 0, 0.6),
              transform: `translateX(${m.drift * p}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ─── HUD CORNERS ─── */
const HUDCorners: React.FC = () => {
  const cornerStyle = (
    top: string | undefined,
    right: string | undefined,
    bottom: string | undefined,
    left: string | undefined,
    borderProps: React.CSSProperties
  ): React.CSSProperties => ({
    position: 'absolute',
    top,
    right,
    bottom,
    left,
    width: 46,
    height: 46,
    zIndex: 30,
    pointerEvents: 'none',
    opacity: 0.55,
    ...borderProps,
  });

  return (
    <>
      <div style={cornerStyle('14px', undefined, undefined, '14px', { borderTop: `2px solid ${C.cyan}`, borderLeft: `2px solid ${C.cyan}` })} />
      <div style={cornerStyle('14px', '14px', undefined, undefined, { borderTop: `2px solid ${C.cyan}`, borderRight: `2px solid ${C.cyan}` })} />
      <div style={cornerStyle(undefined, undefined, '14px', '14px', { borderBottom: `2px solid ${C.cyan}`, borderLeft: `2px solid ${C.cyan}` })} />
      <div style={cornerStyle(undefined, '14px', '14px', undefined, { borderBottom: `2px solid ${C.cyan}`, borderRight: `2px solid ${C.cyan}` })} />
    </>
  );
};

/* ─── CINTILLAS (drawCintilla) ─── */
const Cintilla: React.FC<{
  position: 'top' | 'bottom';
  progress: number;
  T: number;
}> = ({ position, progress, T }) => {
  if (progress <= 0) return null;
  const yOff = (1 - backOut(progress)) * (position === 'top' ? -40 : 40);
  const scrollOffset = (T * 38) % 56;
  const patternId = `cintilla-${position}`;

  return (
    <div
      style={{
        position: 'absolute',
        [position]: 0,
        left: 0,
        right: 0,
        height: 26,
        zIndex: 15,
        opacity: progress,
        transform: `translateY(${yOff}px)`,
        overflow: 'hidden',
      }}
    >
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern
            id={patternId}
            width="56"
            height="56"
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${position === 'top' ? -scrollOffset : scrollOffset}, 0)`}
          >
            <polygon points="0,56 28,56 54,0 26,0" fill={C.yellow} />
            <polygon points="-2,56 28,56 54,0 24,0" fill="#000" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#000" />
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      {/* Black borders */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: '#000' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, backgroundColor: '#000' }} />
    </div>
  );
};

/* ─── GATE PHASE (drawGate) ─── */
const GatePhase: React.FC<{
  frame: number;
  T: number;
  d: ReturnType<typeof t>;
  reducedMotion: boolean;
}> = ({ frame, T, d, reducedMotion }) => {
  const pulse = reducedMotion ? 0.9 : 0.7 + 0.3 * Math.sin(T * 3.9);
  const exitOpacity = interpolate(frame, [GATE_END - 8, GATE_END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitScale = interpolate(frame, [GATE_END - 8, GATE_END], [1, 1.04], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity, transform: `scale(${exitScale})`, zIndex: 55 }}>
      <BackgroundLayers T={T} />
      <Particles T={T} reducedMotion={reducedMotion} />

      {/* Diamond */}
      <div
        style={{
          position: 'absolute',
          top: '38%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(45deg)',
          width: 64,
          height: 64,
          border: `3px solid ${C.cyan}`,
          boxShadow: `0 0 ${6 + pulse * 16}px ${C.cyan}cc`,
          opacity: pulse,
        }}
      />

      {/* Eyebrow */}
      <div
        style={{
          position: 'absolute',
          top: '52%',
          width: '100%',
          textAlign: 'center',
          fontFamily: SPACE_MONO_FAMILY,
          fontSize: 13,
          letterSpacing: '0.3em',
          color: C.cyan,
          textTransform: 'uppercase',
        }}
      >
        {d.gateEyebrow}
      </div>

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: '60%',
          width: '100%',
          textAlign: 'center',
          fontFamily: TEKO_FAMILY,
          fontWeight: 700,
          fontSize: 'clamp(30px, 6vw, 64px)',
          color: C.bone,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {d.gateTitle}
      </div>

      {/* Hint */}
      <div
        style={{
          position: 'absolute',
          top: '68%',
          width: '100%',
          textAlign: 'center',
          fontFamily: SPACE_MONO_FAMILY,
          fontSize: 13,
          color: `${C.bone}b3`,
        }}
      >
        {d.gateHint}
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          width: '100%',
          textAlign: 'center',
          fontFamily: SPACE_MONO_FAMILY,
          fontSize: 10,
          color: `${C.bone}59`,
          letterSpacing: '0.3em',
        }}
      >
        UNIBELANDS 04 · ECHO-NET · CANVAS MODE
      </div>
    </AbsoluteFill>
  );
};

/* ─── BOOT PHASE (drawBoot) ─── */
const BootPhase: React.FC<{
  frame: number;
  T: number;
  d: ReturnType<typeof t>;
  reducedMotion: boolean;
}> = ({ frame, T, d, reducedMotion }) => {
  const bootElapsed = (frame - BOOT_START) / FPS;
  const lines = d.bootLines;
  const interval = reducedMotion ? 0.05 : 0.4;
  const shown = Math.min(lines.length, Math.floor(bootElapsed / interval) + 1);

  // Cursor blink: visible every other 0.4s tick
  const cursorVisible = Math.floor(T * 2.4) % 2 === 0;

  const fs = clamp(17, 12, 20);

  return (
    <AbsoluteFill style={{ zIndex: 50 }}>
      <BackgroundLayers T={T} />

      {/* Terminal lines */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: SPACE_MONO_FAMILY,
          fontSize: fs,
          color: C.cyan,
          lineHeight: 2.2,
          textShadow: `0 0 8px rgba(0,240,255,0.6)`,
          whiteSpace: 'nowrap',
        }}
      >
        {lines.slice(0, shown).map((line, i) => (
          <div key={i} style={{ opacity: 1 }}>
            <span style={{ color: C.yellow }}>» </span>
            {line}
          </div>
        ))}
        {/* Blinking cursor */}
        <div style={{ opacity: cursorVisible ? 1 : 0 }}>
          <span style={{ color: C.yellow }}>» </span>
          <span style={{ color: C.cyan }}>█</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── FLASH OVERLAY ─── */
const FlashOverlay: React.FC<{ T: number; flashStart: number }> = ({
  T,
  flashStart,
}) => {
  const e = T - flashStart;
  if (e < 0 || e > 0.22) return null;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bone,
        opacity: 0.55 * Math.pow(1 - e / 0.22, 1.6),
        zIndex: 60,
        pointerEvents: 'none',
      }}
    />
  );
};

/* ─── MAIN PHASE (drawMain: iris → main → exit) ─── */
const MainPhase: React.FC<{
  T: number;
  d: ReturnType<typeof t>;
  muted: boolean;
  reducedMotion: boolean;
  phase: 'iris' | 'main' | 'exit';
}> = ({ T, d, muted, reducedMotion, phase }) => {
  const mainElapsed = (T - MAIN_START / FPS);
  const el = mainElapsed;
  const irisElapsed = (T - IRIS_START / FPS);

  // Iris progress
  const irisDur = reducedMotion ? 0.3 : 0.95;
  const irisProgress = clamp(irisElapsed / irisDur, 0, 1);
  const irisClosed = phase !== 'iris' || irisProgress >= 1;

  // Exit animation
  const isExit = phase === 'exit';
  const exitElapsed = (T - EXIT_START / FPS);
  const exitProgress = clamp(exitElapsed / 0.45, 0, 1);
  const heroAlpha = isExit ? 1 - exitProgress : 1;
  const heroScale = isExit ? 1 - 0.06 * exitProgress : 1;
  const heroTy = isExit ? -12 * exitProgress : 0;

  // Cintilla reveal
  const cintillaProgress = prog(el, 0.1, 0.6);

  // Header
  const headerE = backOut(prog(el, 0.5, 0.6));

  // Panel
  const panelP = reducedMotion ? prog(el, 0.2, 0.3) : prog(el, 0.2, 0.5);
  const panelSkew = !reducedMotion && panelP < 1 ? (1 - panelP) * 0.12 * Math.sin(T * 55) : 0;
  const panelBlur = !reducedMotion && panelP < 1 ? (1 - panelP) * 2 : 0;

  // Headphones
  const headphonesP = reducedMotion ? prog(el, 0.3, 0.3) : backOut(prog(el, 0.3, 0.6));
  const headphonesScale = (reducedMotion ? 1 : 1 + 0.05 * Math.sin(T * 3)) * Math.min(headphonesP, 1.15);

  // Title
  const titleA = prog(el, 0.4, 0.5);
  // Subtitle
  const subA = prog(el, 0.4, 0.5);
  // Continue button
  const continueP = backOut(prog(el, 0.5, 0.6));
  // ECHO-ID
  const echoA = prog(el, 0.55, 0.4);
  // Tips
  const tipA = prog(el, 0.5, 0.5);
  const tipIndex = Math.floor(el / (TIP_CYCLE_FRAMES / FPS)) % d.tips.length;
  const tipTime = el % (TIP_CYCLE_FRAMES / FPS);
  let tipFade = 1;
  if (tipTime < 0.3) tipFade = tipTime / 0.3;
  else if (tipTime > TIP_CYCLE_FRAMES / FPS - 0.3)
    tipFade = (TIP_CYCLE_FRAMES / FPS - tipTime) / 0.3;

  // Parallax auto-drift
  const px = reducedMotion ? 0 : Math.sin(el * 0.3) * 4;
  const py = reducedMotion ? 0 : Math.sin(el * 0.25) * 3;
  const rot = reducedMotion ? 0 : Math.sin(el * 0.4) * 0.3;

  // Shockwave (iris → main transition)
  const shockwaveP = prog(mainElapsed, 0, 0.5);
  const shockwaveScale = shockwaveP * 3;
  const shockwaveAlpha = shockwaveP < 1 ? (1 - shockwaveP) * 0.4 : 0;

  // Screen shake (iris entrance)
  const shakeX =
    !reducedMotion && mainElapsed < 0.3
      ? Math.sin(mainElapsed * 80) * 4 * (1 - mainElapsed / 0.3)
      : 0;
  const shakeY =
    !reducedMotion && mainElapsed < 0.3
      ? Math.cos(mainElapsed * 60) * 3 * (1 - mainElapsed / 0.3)
      : 0;

  // Exit hit-stop flash
  const hitStopFlash =
    isExit && exitElapsed < 0.07
      ? 0.15 * (1 - exitElapsed / 0.07)
      : 0;

  return (
    <AbsoluteFill
      style={{
        zIndex: 20,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <BackgroundLayers T={T} />
      <Particles T={T} reducedMotion={reducedMotion} />

      {/* Cintillas */}
      <Cintilla position="top" progress={cintillaProgress} T={T} />
      <Cintilla position="bottom" progress={cintillaProgress} T={T} />

      {/* Main content container (parallax + exit transform) */}
      <AbsoluteFill
        style={{
          transform: isExit
            ? `translate(${px}px, ${py + heroTy}px) rotate(${rot}deg) scale(${heroScale})`
            : `translate(${px}px, ${py}px) rotate(${rot}deg)`,
          opacity: heroAlpha,
        }}
      >
        {/* Header */}
        <Header el={el} T={T} headerE={headerE} d={d} muted={muted} />

        {/* Hero Panel */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) skewX(${panelSkew}deg)`,
            opacity: panelP,
            width: '100%',
            maxWidth: 880,
            padding: '0 16px',
            zIndex: 20,
            filter: panelBlur > 0.1 ? `blur(${panelBlur}px)` : undefined,
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)',
              clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)',
              filter: `drop-shadow(8px 8px 0px ${C.stroke}) drop-shadow(-3px -3px 0px ${C.stroke}) drop-shadow(3px -3px 0px ${C.stroke}) drop-shadow(-3px 3px 0px ${C.stroke}) drop-shadow(3px 3px 0px ${C.stroke})`,
              padding: 'clamp(32px, 5vw, 56px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              border: '4px solid transparent',
            }}
          >
            {/* Shockwave ring on entrance */}
            {shockwaveAlpha > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) scale(${shockwaveScale})`,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  border: `3px solid ${C.cyan}`,
                  opacity: shockwaveAlpha,
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* Eyebrow */}
            {titleA > 0 && (
              <div
                style={{
                  fontFamily: SPACE_MONO_FAMILY,
                  fontSize: 'clamp(10px, 1.2vw, 14px)',
                  letterSpacing: '0.3em',
                  color: C.rust,
                  textTransform: 'uppercase',
                  marginBottom: 16,
                  opacity: titleA,
                  transform: `translateY(${(1 - titleA) * 24}px)`,
                }}
              >
                {d.eyebrow}
              </div>
            )}

            {/* Headphones icon */}
            {headphonesP > 0 && (
              <div
                style={{
                  marginBottom: 24,
                  transform: `scale(${headphonesScale})`,
                  filter: `drop-shadow(0 0 ${10 + Math.sin(T * 3) * 15}px ${C.cyan}99)`,
                  opacity: clamp(headphonesP, 0, 1),
                }}
              >
                <HeadphonesIcon size={Math.round(80)} color={C.cyan} />
              </div>
            )}

            {/* Title */}
            {titleA > 0 && (
              <h1
                style={{
                  fontSize: 'clamp(30px, 5vw, 70px)',
                  fontWeight: 700,
                  color: C.bone,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  lineHeight: 1,
                  marginBottom: 16,
                  margin: '0 0 16px 0',
                  fontFamily: TEKO_FAMILY,
                  opacity: titleA,
                }}
              >
                {d.titleParts.map((pt, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: pt.k === 'ban' ? TEKO_FAMILY : TEKO_FAMILY,
                      fontWeight: pt.k === 'ban' ? 700 : 700,
                      color: pt.k === 'ban' ? C.yellow : C.bone,
                      textTransform: pt.k === 'ban' ? 'none' : undefined,
                      letterSpacing: pt.k === 'ban' ? '0.02em' : undefined,
                      textShadow: pt.k === 'ban' ? `0 0 16px rgba(255,180,0,0.35)` : undefined,
                    }}
                  >
                    {pt.t}
                  </span>
                ))}
              </h1>
            )}

            {/* Subtitle */}
            {subA > 0 && (
              <p
                style={{
                  fontFamily: TEKO_FAMILY,
                  fontSize: 'clamp(15px, 3vw, 30px)',
                  color: '#d1d5db',
                  maxWidth: 640,
                  lineHeight: 1.25,
                  textTransform: 'uppercase',
                  margin: '0 0 24px 0',
                  opacity: subA,
                  transform: `translateY(${(1 - outCubic(subA)) * 20}px)`,
                }}
              >
                {d.subSegs.map((sg, i) => (
                  <span
                    key={i}
                    style={
                      sg.hl
                        ? {
                            color: C.cyan,
                            fontWeight: 700,
                            textShadow: `0 0 14px rgba(0,240,255,0.8)`,
                          }
                        : undefined
                    }
                  >
                    {sg.t}
                  </span>
                ))}
              </p>
            )}

            {/* Continue button */}
            {continueP > 0 && !isExit && (
              <div
                style={{
                  backgroundColor: C.cyan,
                  color: '#000',
                  fontFamily: TEKO_FAMILY,
                  fontSize: 'clamp(20px, 3vw, 32px)',
                  fontWeight: 700,
                  padding: '8px 40px',
                  border: `3px solid ${C.stroke}`,
                  boxShadow: `6px 6px 0px ${C.stroke}`,
                  letterSpacing: '0.15em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginTop: 16,
                  opacity: prog(el, 0.5, 0.25),
                  transform: `scale(${Math.max(0.001, clamp(continueP, 0, 1.15))})`,
                }}
              >
                <span>{d.continueBtn}</span>
                <ArrowRightIcon size={24} color="#000" />
              </div>
            )}

            {/* ECHO-ID */}
            {echoA > 0 && (
              <p
                style={{
                  fontFamily: SPACE_MONO_FAMILY,
                  fontSize: 11,
                  color: `${C.bone}80`,
                  letterSpacing: '0.15em',
                  marginTop: 24,
                  margin: '24px 0 0 0',
                  opacity: echoA * 0.5,
                }}
              >
                {d.echoId}
              </p>
            )}
          </div>
        </div>

        {/* Tips ticker */}
        {tipA > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: 30,
              width: '100%',
              textAlign: 'center',
              padding: '0 24px',
              zIndex: 20,
              opacity: tipA * tipFade * 0.75,
            }}
          >
            <p
              style={{
                fontFamily: SPACE_MONO_FAMILY,
                fontSize: 'clamp(9px, 1.1vw, 13px)',
                color: `${C.cyan}bf`,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              {d.tips[tipIndex]}
            </p>
          </div>
        )}
      </AbsoluteFill>

      {/* Iris diamond overlay */}
      {!irisClosed && (
        <AbsoluteFill style={{ zIndex: 45, pointerEvents: 'none' }}>
          <IrisDiamond progress={irisProgress} />
        </AbsoluteFill>
      )}

      {/* Flash */}
      <FlashOverlay T={T} flashStart={FLASH_FRAME / FPS} />

      {/* Exit hit-stop flash */}
      {hitStopFlash > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: C.bone,
            opacity: hitStopFlash,
            zIndex: 55,
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/* ─── IRIS DIAMOND (drawIris — canvas evenodd) ─── */
const IrisDiamond: React.FC<{ progress: number }> = ({ progress }) => {
  const p = inOut(progress);
  const W = 1920;
  const H = 1080;
  const r0 = Math.hypot(W, H) * 0.75;
  const r = r0 * (1 - p);
  if (r < 0.5) return null;

  const cx = W / 2;
  const cy = H / 2;
  const d = `M0,0 L${W},0 L${W},${H} L0,${H} Z
             M${cx},${cy - r} L${cx + r},${cy} L${cx},${cy + r} L${cx - r},${cy} Z`;

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
    >
      <path d={d} fill={C.void} fillRule="evenodd" />
    </svg>
  );
};

/* ─── HEADER (drawHeader) ─── */
const Header: React.FC<{
  el: number;
  T: number;
  headerE: number;
  d: ReturnType<typeof t>;
  muted: boolean;
}> = ({ el, T, headerE, d, muted }) => {
  if (headerE <= 0) return null;
  const yOff = (1 - headerE) * -80;

  // Signal bars animation
  const barOpacities = [0, 1, 2, 3].map(
    (i) => 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(T * 3.5 - i * 0.9))
  );

  // Clock (deterministic from frame, not real time)
  const clockSeconds = Math.floor(el);
  const hours = Math.floor(clockSeconds / 3600) % 24;
  const minutes = Math.floor(clockSeconds / 60) % 60;
  const seconds = clockSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  const clockStr = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return (
    <div
      style={{
        position: 'absolute',
        top: 44,
        left: 0,
        right: 0,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '0 24px',
        zIndex: 25,
        transform: `translateY(${yOff}px)`,
        opacity: headerE,
      }}
    >
      {/* Vol button */}
      <div
        style={{
          justifySelf: 'start',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          backgroundColor: muted ? C.alert : '#e6e6e6',
          color: muted ? '#fff' : '#000',
          padding: '4px 16px',
          fontFamily: TEKO_FAMILY,
          fontSize: 24,
          fontWeight: 600,
          border: `3px solid ${C.stroke}`,
          boxShadow: `6px 6px 0px ${C.stroke}`,
        }}
      >
        <SpeakerIcon size={20} color={muted ? '#fff' : '#000'} muted={muted} />
        <span>{muted ? d.volOff : d.volOn}</span>
      </div>

      {/* Signal bars + Clock */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 16 }}>
          {[5, 9, 13, 16].map((h, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: h,
                backgroundColor: C.cyan,
                opacity: barOpacities[i],
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontFamily: SPACE_MONO_FAMILY,
            fontSize: 12,
            color: C.cyan,
            letterSpacing: '0.1em',
          }}
        >
          {clockStr}
        </span>
      </div>

      {/* Lang button */}
      <div
        style={{
          justifySelf: 'end',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          backgroundColor: C.void,
          color: C.yellow,
          padding: '4px 16px',
          fontFamily: TEKO_FAMILY,
          fontSize: 24,
          fontWeight: 600,
          border: `3px solid ${C.yellow}`,
          boxShadow: `6px 6px 0px ${C.stroke}`,
        }}
      >
        <GlobeIcon size={20} color={C.yellow} />
        <span>{d.langLabel}</span>
      </div>
    </div>
  );
};

/* ─── NEXT PHASE (drawNext) ─── */
const NextPhase: React.FC<{
  T: number;
  d: ReturnType<typeof t>;
}> = ({ T, d }) => {
  const el = (T - NEXT_START / FPS);
  const e1 = prog(el, 0.05, 0.5);
  const e2 = prog(el, 0.15, 0.5);
  const e3 = prog(el, 0.25, 0.5);
  const restartP = backOut(prog(el, 0.35, 0.6));

  return (
    <AbsoluteFill>
      <BackgroundLayers T={T} />
      <Particles T={T} reducedMotion={false} />
      <Cintilla position="top" progress={1} T={T} />
      <Cintilla position="bottom" progress={1} T={T} />

      {/* Next content */}
      <div
        style={{
          position: 'absolute',
          top: '33%',
          width: '100%',
          textAlign: 'center',
          opacity: e1,
        }}
      >
        <div
          style={{
            fontFamily: SPACE_MONO_FAMILY,
            fontSize: 13,
            letterSpacing: '0.3em',
            color: C.rust,
            textTransform: 'uppercase',
          }}
        >
          {d.nextEyebrow}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '42%',
          width: '100%',
          textAlign: 'center',
          opacity: e2,
        }}
      >
        <h2
          style={{
            fontFamily: TEKO_FAMILY,
            fontSize: 'clamp(28px, 5vw, 60px)',
            color: C.bone,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 700,
            margin: 0,
          }}
        >
          {d.nextTitle}
        </h2>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '51%',
          width: '100%',
          textAlign: 'center',
          padding: '0 7%',
          opacity: e3 * 0.7,
        }}
      >
        <p
          style={{
            fontFamily: SPACE_MONO_FAMILY,
            fontSize: 13,
            color: `${C.bone}b3`,
            maxWidth: 480,
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          {d.nextSub}
        </p>
      </div>

      {/* Restart button */}
      {restartP > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '66%',
            left: '50%',
            transform: `translateX(-50%) scale(${Math.max(0.001, clamp(restartP, 0, 1.15))})`,
          }}
        >
          <div
            style={{
              backgroundColor: C.yellow,
              color: '#000',
              fontFamily: TEKO_FAMILY,
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 32px',
              border: `3px solid ${C.stroke}`,
              boxShadow: `6px 6px 0px ${C.stroke}`,
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
            }}
          >
            {d.restart}
          </div>
        </div>
      )}

      <HUDCorners />
    </AbsoluteFill>
  );
};
