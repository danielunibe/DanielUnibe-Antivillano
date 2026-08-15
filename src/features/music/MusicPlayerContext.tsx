import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type Track = {
  id: string;
  title: string;
  artist?: string;
  src: string; // public path, e.g. /assets/audio/antivillano.mp3
  cover?: string; // optional public path to cover art, e.g. /assets/audio/covers/antivillano.png
  durationHint?: number; // seconds (optional)
};

type PlayerStatus = 'STOPPED' | 'PLAYING' | 'PAUSED';

type MusicPlayerState = {
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

type MusicPlayerApi = {
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

const MusicPlayerContext = createContext<{ state: MusicPlayerState; api: MusicPlayerApi } | null>(null);

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const MusicPlayerProvider: React.FC<{ enabled: boolean; ducked?: boolean; muted?: boolean; children: React.ReactNode }> = ({ enabled, ducked = false, muted = false, children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // UI state for playback time can be expensive to update at native `timeupdate` frequency.
  // Keep refs in sync with the audio element and publish to React state at a throttled rate.
  const timeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const lastUiEmitAtRef = useRef<number>(0);
  const rafPendingRef = useRef<boolean>(false);
  const preDuckVolumeRef = useRef<number | null>(null);
  const prevDuckedRef = useRef<boolean>(false);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [status, setStatus] = useState<PlayerStatus>('STOPPED');
  const [currentIndex, setCurrentIndexState] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.65);
  const [loopPlaylist, setLoopPlaylistState] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // Create a single audio element for stable playback.
  useEffect(() => {
    const el = new Audio();
    el.preload = 'metadata';
    el.loop = false; // we control looping at track/playlist level
    el.volume = volume;
    audioRef.current = el;

    const onPlay = () => setStatus('PLAYING');
    const onPause = () => setStatus((prev) => (prev === 'STOPPED' ? 'STOPPED' : 'PAUSED'));
    const publishUiTime = () => {
      rafPendingRef.current = false;
      const now = performance.now();
      // ~8 fps is plenty for a HUD progress bar and prevents re-render storms.
      if (now - lastUiEmitAtRef.current < 125) return;
      lastUiEmitAtRef.current = now;
      setCurrentTime(timeRef.current);
      setDuration(durationRef.current);
    };
    const scheduleUiPublish = () => {
      if (rafPendingRef.current) return;
      rafPendingRef.current = true;
      requestAnimationFrame(publishUiTime);
    };

    const onTime = () => {
      timeRef.current = el.currentTime || 0;
      scheduleUiPublish();
    };
    const onLoaded = () => {
      durationRef.current = Number.isFinite(el.duration) ? el.duration : 0;
      scheduleUiPublish();
    };
    const onError = () => setError('AUDIO_LOAD_FAILED');
    const onEnded = () => {
      // Loop policy: playlist loop by default.
      if (!playlist.length) {
        setStatus('STOPPED');
        return;
      }
      if (loopPlaylist) {
        void apiRef.current?.next();
      } else {
        setStatus('STOPPED');
      }
    };

    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onLoaded);
    el.addEventListener('error', onError);
    el.addEventListener('ended', onEnded);

    return () => {
      el.pause();
      el.src = '';
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onLoaded);
      el.removeEventListener('error', onError);
      el.removeEventListener('ended', onEnded);
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = muted;
  }, [muted]);

  // Keep a ref to the API so event handlers can call next/prev safely.
  const apiRef = useRef<MusicPlayerApi | null>(null);

  const applyTrackToAudio = useCallback(
    (index: number, sourcePlaylist = playlist) => {
      const el = audioRef.current;
      if (!el) return;
      const track = sourcePlaylist[index];
      if (!track) {
        el.src = '';
        durationRef.current = 0;
        timeRef.current = 0;
        setDuration(0);
        setCurrentTime(0);
        return;
      }
      setError(undefined);
      el.src = track.src;
      el.currentTime = 0;
      timeRef.current = 0;
      setCurrentTime(0);
      // duration will be set by loadedmetadata; hint as fallback.
      durationRef.current = track.durationHint ?? 0;
      setDuration(durationRef.current);
    },
    [playlist]
  );

  const setCurrentIndex = useCallback(
    async (index: number, opts?: { autoplay?: boolean }) => {
      const safeIndex = Math.max(0, Math.min(index, Math.max(0, playlist.length - 1)));
      setCurrentIndexState(safeIndex);
      applyTrackToAudio(safeIndex);
      if (opts?.autoplay) {
        await apiRef.current?.play();
      }
    },
    [applyTrackToAudio, playlist.length]
  );

  const play = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return;
    if (!playlist.length) return;
    if (!el.src) applyTrackToAudio(currentIndex);
    try {
      await el.play();
    } catch {
      // Autoplay restrictions or unsupported source.
      setStatus('PAUSED');
    }
  }, [applyTrackToAudio, currentIndex, playlist.length]);

  const pause = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
  }, []);

  const stop = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setStatus('STOPPED');
    setCurrentTime(0);
  }, []);

  const toggle = useCallback(async () => {
    if (status === 'PLAYING') {
      pause();
    } else {
      await play();
    }
  }, [pause, play, status]);

  const next = useCallback(async () => {
    if (!playlist.length) return;
    const nextIndex = currentIndex + 1 >= playlist.length ? 0 : currentIndex + 1;
    await setCurrentIndex(nextIndex, { autoplay: status === 'PLAYING' });
  }, [currentIndex, playlist.length, setCurrentIndex, status]);

  const prev = useCallback(async () => {
    if (!playlist.length) return;
    const prevIndex = currentIndex - 1 < 0 ? playlist.length - 1 : currentIndex - 1;
    await setCurrentIndex(prevIndex, { autoplay: status === 'PLAYING' });
  }, [currentIndex, playlist.length, setCurrentIndex, status]);

  const seek = useCallback((timeSeconds: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = Math.max(0, timeSeconds);
    setCurrentTime(el.currentTime || 0);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(clamp01(v));
  }, []);

  const setLoopPlaylist = useCallback((value: boolean) => {
    setLoopPlaylistState(value);
  }, []);

  const loadPlaylist = useCallback(async () => {
    setError(undefined);
    try {
      const resp = await fetch('/playlist.json', { cache: 'no-store' });
      if (!resp.ok) throw new Error('PLAYLIST_FETCH_FAILED');
      const data = (await resp.json()) as { tracks?: Track[] };
      const tracks = Array.isArray(data.tracks) ? data.tracks : [];
      const randomIndex = tracks.length ? Math.floor(Math.random() * tracks.length) : 0;
      setPlaylist(tracks);
      setCurrentIndexState(randomIndex);
      applyTrackToAudio(randomIndex, tracks);
      setIsReady(true);
    } catch {
      setPlaylist([]);
      setIsReady(true);
      setError('PLAYLIST_LOAD_FAILED');
    }
  }, [applyTrackToAudio, enabled]);

  // Auto-load playlist after the user has started (enabled === true).
  useEffect(() => {
    if (!enabled) return;
    if (isReady) return;
    void loadPlaylist();
  }, [enabled, isReady, loadPlaylist]);

  useEffect(() => {
    if (ducked === prevDuckedRef.current) return;
    prevDuckedRef.current = ducked;

    if (ducked) {
      preDuckVolumeRef.current = volume;
      setVolumeState(clamp01(volume * 0.8));
      return;
    }

    if (preDuckVolumeRef.current !== null) {
      setVolumeState(preDuckVolumeRef.current);
      preDuckVolumeRef.current = null;
    }
  }, [ducked, volume]);

  const state = useMemo<MusicPlayerState>(
    () => ({
      status,
      currentIndex,
      playlist,
      volume,
      loopPlaylist,
      currentTime,
      duration,
      isReady,
      error,
    }),
    [currentIndex, currentTime, duration, error, isReady, loopPlaylist, playlist, status, volume]
  );

  const api = useMemo<MusicPlayerApi>(
    () => ({
      loadPlaylist,
      setPlaylist: (tracks) => {
        setPlaylist(tracks);
        setCurrentIndexState(0);
        applyTrackToAudio(0);
        setIsReady(true);
      },
      play,
      pause,
      stop,
      toggle,
      next,
      prev,
      seek,
      setVolume,
      setLoopPlaylist,
      setCurrentIndex,
    }),
    [applyTrackToAudio, loadPlaylist, next, pause, play, prev, seek, setCurrentIndex, setLoopPlaylist, setVolume, stop, toggle]
  );

  useEffect(() => {
    apiRef.current = api;
  }, [api]);

  return <MusicPlayerContext.Provider value={{ state, api }}>{children}</MusicPlayerContext.Provider>;
};

export const useMusicPlayer = () => {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
  return ctx;
};
