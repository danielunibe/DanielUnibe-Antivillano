export type Track = {
  id: string;
  title: string;
  artist?: string;
  src: string;
  cover?: string;
  durationHint?: number;
};

export type PlayerStatus = 'STOPPED' | 'PLAYING' | 'PAUSED';
export type RepeatMode = 0 | 1 | 2;

export interface MusicState {
  status: PlayerStatus;
  currentIndex: number;
  playlist: Track[];
  volume: number;
  muted: boolean;
  ducked: boolean;
  repeatMode: RepeatMode;
  shuffle: boolean;
  currentTime: number;
  duration: number;
  isReady: boolean;
  error?: string;
}

const STORAGE_VOLUME = 'rk-volume';
const STORAGE_INDEX = 'rk-last-track';
const DUCK_SCALE = 0.8;
const TIME_EMIT_INTERVAL = 125;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const KNOWN_DURATION_HINTS: Record<string, number> = {
  'anti-villano': 204,
  'anti-villano-x': 178,
  'anti-villano-x2': 221,
  'not-the-role-they-gave': 192,
  'not-the-role-they-gave-alt': 185,
  'nucleo-del-exilio': 167,
  'patio-de-chatarra': 198,
};

type Listener = (state: MusicState) => void;

const initialVolume = (): number => {
  const saved = Number(localStorage.getItem(STORAGE_VOLUME));
  return Number.isFinite(saved) && saved >= 0 && saved <= 1 ? saved : 0.65;
};

const initialState = (): MusicState => ({
  status: 'STOPPED',
  currentIndex: 0,
  playlist: [],
  volume: initialVolume(),
  muted: false,
  ducked: false,
  repeatMode: 1,
  shuffle: false,
  currentTime: 0,
  duration: 0,
  isReady: false,
});

/**
 * Unico motor de audio del portafolio (HTMLAudioElement + /playlist.json).
 * Framework-agnostic: los contextos de React (MusicPlayerContext, VoyagerOS,
 * RadioKairosPlayer) se suscriben a este singleton y delegan sus acciones aqui.
 */
class MusicService {
  private audio: HTMLAudioElement | null = null;
  private listeners = new Set<Listener>();
  private state: MusicState = initialState();
  private playlistLoad: Promise<void> | null = null;
  private rafPending = false;
  private lastTimeEmit = 0;

  getState = (): MusicState => ({ ...this.state });

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private setState(patch: Partial<MusicState>) {
    this.state = { ...this.state, ...patch };
    this.emit();
  }

  private emit() {
    const snapshot = { ...this.state };
    this.listeners.forEach((listener) => listener(snapshot));
  }

  private scheduleTimeEmit() {
    if (this.rafPending) return;
    this.rafPending = true;
    requestAnimationFrame(() => {
      this.rafPending = false;
      const now = performance.now();
      if (now - this.lastTimeEmit < TIME_EMIT_INTERVAL) return;
      this.lastTimeEmit = now;
      this.emit();
    });
  }

  private ensureAudio(): HTMLAudioElement | null {
    if (this.audio) return this.audio;
    if (typeof Audio === 'undefined') return null;
    const el = new Audio();
    el.preload = 'metadata';
    el.loop = false;
    this.audio = el;

    el.addEventListener('play', () => this.setState({ status: 'PLAYING' }));
    el.addEventListener('pause', () => {
      if (this.state.status !== 'STOPPED') this.setState({ status: 'PAUSED' });
    });
    el.addEventListener('timeupdate', () => {
      this.state.currentTime = el.currentTime || 0;
      this.scheduleTimeEmit();
    });
    el.addEventListener('loadedmetadata', () => {
      const d = Number.isFinite(el.duration) ? el.duration : 0;
      if (this.state.duration !== d) {
        this.state.duration = d;
        this.scheduleTimeEmit();
      }
    });
    el.addEventListener('error', () => this.setState({ error: 'AUDIO_LOAD_FAILED' }));
    el.addEventListener('ended', () => void this.handleEnded());

    this.applyVolume();
    return el;
  }

  private handleEnded() {
    const { repeatMode, playlist, currentIndex } = this.state;
    if (!playlist.length) {
      this.setState({ status: 'STOPPED', currentTime: 0 });
      return;
    }
    if (repeatMode === 2) {
      if (this.audio) {
        this.audio.currentTime = 0;
        void this.audio.play().catch(() => undefined);
      }
      return;
    }
    if (repeatMode === 1 || currentIndex + 1 < playlist.length) {
      void this.next();
    } else {
      this.setState({ status: 'STOPPED', currentTime: 0 });
    }
  }

  private applyVolume() {
    if (!this.audio) return;
    const { volume, muted, ducked } = this.state;
    this.audio.volume = clamp01(volume * (muted ? 0 : 1) * (ducked ? DUCK_SCALE : 1));
  }

  loadPlaylist = (): Promise<void> => {
    if (this.playlistLoad) return this.playlistLoad;
    this.playlistLoad = (async () => {
      try {
        const resp = await fetch('/playlist.json', { cache: 'no-store' });
        if (!resp.ok) throw new Error('PLAYLIST_FETCH_FAILED');
        const data = (await resp.json()) as { tracks?: Track[] };
        const tracks = Array.isArray(data.tracks)
          ? data.tracks.map((t) => ({ ...t, durationHint: t.durationHint ?? KNOWN_DURATION_HINTS[t.id] }))
          : [];
        if (!tracks.length) throw new Error('EMPTY_PLAYLIST');
        const saved = Number(localStorage.getItem(STORAGE_INDEX));
        const idx =
          Number.isInteger(saved) && saved >= 0 && saved < tracks.length
            ? saved
            : Math.floor(Math.random() * tracks.length);
        const track = tracks[idx];
        const el = this.ensureAudio();
        this.state.playlist = tracks;
        this.state.currentIndex = idx;
        this.state.isReady = true;
        this.state.error = undefined;
        if (el && track) {
          el.src = track.src;
          el.currentTime = 0;
          this.state.duration = track.durationHint ?? 0;
        }
        this.emit();
      } catch {
        this.state.isReady = true;
        this.state.error = 'PLAYLIST_LOAD_FAILED';
        this.emit();
      }
    })();
    return this.playlistLoad;
  };

  setPlaylist = (tracks: Track[]) => {
    const merged = tracks.map((t) => ({ ...t, durationHint: t.durationHint ?? KNOWN_DURATION_HINTS[t.id] }));
    const el = this.ensureAudio();
    this.state.playlist = merged;
    this.state.currentIndex = 0;
    this.state.isReady = true;
    this.state.error = undefined;
    if (el) {
      const track = merged[0];
      if (track) {
        el.src = track.src;
        el.currentTime = 0;
      }
      this.state.duration = track?.durationHint ?? 0;
    }
    this.emit();
  };

  setCurrentIndex = async (index: number, opts?: { autoplay?: boolean }) => {
    const { playlist } = this.state;
    if (!playlist.length) return;
    const safe = Math.max(0, Math.min(index, playlist.length - 1));
    const track = playlist[safe];
    if (!track) return;
    localStorage.setItem(STORAGE_INDEX, String(safe));
    const el = this.ensureAudio();
    if (!el) return;
    this.setState({ currentIndex: safe, currentTime: 0, duration: track.durationHint ?? 0, error: undefined });
    el.src = track.src;
    el.currentTime = 0;
    if (opts?.autoplay) await this.play();
  };

  play = async () => {
    const el = this.ensureAudio();
    const { playlist, currentIndex } = this.state;
    if (!el || !playlist.length) return;
    const track = playlist[currentIndex];
    if (!track) return;
    if (!el.src || !el.src.endsWith(track.src)) el.src = track.src;
    try {
      await el.play();
      this.setState({ status: 'PLAYING' });
    } catch {
      this.setState({ status: 'PAUSED' });
    }
  };

  pause = () => {
    if (!this.audio) return;
    this.audio.pause();
  };

  stop = () => {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.setState({ status: 'STOPPED', currentTime: 0 });
  };

  toggle = async () => {
    if (this.state.status === 'PLAYING') {
      this.pause();
    } else {
      await this.play();
    }
  };

  next = async () => {
    const { playlist, currentIndex, shuffle, status } = this.state;
    if (!playlist.length) return;
    let idx: number;
    if (shuffle && playlist.length > 1) {
      do {
        idx = Math.floor(Math.random() * playlist.length);
      } while (idx === currentIndex);
    } else {
      idx = (currentIndex + 1) % playlist.length;
    }
    await this.setCurrentIndex(idx, { autoplay: status === 'PLAYING' });
  };

  prev = async () => {
    const { playlist, currentIndex, status, currentTime } = this.state;
    if (!playlist.length) return;
    if (currentTime > 3) {
      this.seek(0);
      return;
    }
    const idx = (currentIndex - 1 + playlist.length) % playlist.length;
    await this.setCurrentIndex(idx, { autoplay: status === 'PLAYING' });
  };

  seek = (timeSeconds: number) => {
    if (!this.audio) return;
    this.audio.currentTime = Math.max(0, timeSeconds);
    this.state.currentTime = this.audio.currentTime || 0;
    this.emit();
  };

  setVolume = (v: number) => {
    const vol = clamp01(v);
    localStorage.setItem(STORAGE_VOLUME, String(vol));
    this.setState({ volume: vol });
    this.applyVolume();
  };

  setMuted = (muted: boolean) => {
    this.setState({ muted });
    this.applyVolume();
  };

  setDucked = (ducked: boolean) => {
    this.setState({ ducked });
    this.applyVolume();
  };

  setRepeatMode = (repeatMode: RepeatMode) => {
    this.setState({ repeatMode });
  };

  setShuffle = (shuffle: boolean) => {
    this.setState({ shuffle });
  };
}

export const musicService = new MusicService();