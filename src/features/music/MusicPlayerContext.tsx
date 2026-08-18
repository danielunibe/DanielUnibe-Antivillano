import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { musicService, type MusicState, type Track } from './MusicService';

export type { Track };

type PlayerStatus = 'STOPPED' | 'PLAYING' | 'PAUSED';

export type MusicPlayerState = {
  status: PlayerStatus;
  currentIndex: number;
  playlist: Track[];
  volume: number; // 0..1
  loopPlaylist: boolean;
  currentTime: number;
  duration: number;
  isReady: boolean;
  error?: string;
};

export type MusicPlayerApi = {
  loadPlaylist: () => Promise<void>;
  setPlaylist: (tracks: Track[]) => void;
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  toggle: () => Promise<void>;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  seek: (timeSeconds: number) => void;
  setVolume: (v: number) => void;
  setLoopPlaylist: (value: boolean) => void;
  setCurrentIndex: (index: number, opts?: { autoplay?: boolean }) => Promise<void>;
};

type MusicPlayerContextValue = { state: MusicPlayerState; api: MusicPlayerApi };

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

const toPublicState = (s: MusicState): MusicPlayerState => ({
  status: s.status,
  currentIndex: s.currentIndex,
  playlist: s.playlist,
  volume: s.volume,
  loopPlaylist: s.repeatMode !== 0,
  currentTime: s.currentTime,
  duration: s.duration,
  isReady: s.isReady,
  error: s.error,
});

export const MusicPlayerProvider: React.FC<{ enabled: boolean; ducked?: boolean; muted?: boolean; children: React.ReactNode }> = ({ enabled, ducked = false, muted = false, children }) => {
  const [state, setState] = useState<MusicPlayerState>(() => toPublicState(musicService.getState()));

  useEffect(() => musicService.subscribe((s) => setState(toPublicState(s))), []);

  useEffect(() => {
    if (enabled && !state.isReady) void musicService.loadPlaylist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    musicService.setDucked(ducked);
  }, [ducked]);

  useEffect(() => {
    musicService.setMuted(muted);
  }, [muted]);

  const api = useMemo<MusicPlayerApi>(
    () => ({
      loadPlaylist: () => musicService.loadPlaylist(),
      setPlaylist: (tracks) => musicService.setPlaylist(tracks),
      play: () => musicService.play(),
      pause: () => musicService.pause(),
      stop: () => musicService.stop(),
      toggle: () => musicService.toggle(),
      next: () => musicService.next(),
      prev: () => musicService.prev(),
      seek: (timeSeconds) => musicService.seek(timeSeconds),
      setVolume: (v) => musicService.setVolume(v),
      setLoopPlaylist: (value) => musicService.setRepeatMode(value ? 1 : 0),
      setCurrentIndex: (index, opts) => musicService.setCurrentIndex(index, opts),
    }),
    []
  );

  const value = useMemo<MusicPlayerContextValue>(() => ({ state, api }), [api, state]);

  return <MusicPlayerContext.Provider value={value}>{children}</MusicPlayerContext.Provider>;
};

export const useMusicPlayer = () => {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
  return ctx;
};