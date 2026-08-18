import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import { musicService } from '../../music/MusicService';

export const SONG_DATA = {
  albumArt: '/assets/audio/covers/anti-villano.jpg',
  title: 'Anti-Villano',
  artist: 'danielunibe',
  duration: 204, // seconds
};

interface MusicContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  progress: number; // 0-100
  seekTo: (value: number) => void;
  songData: typeof SONG_DATA;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState(() => musicService.getState());

  useEffect(() => musicService.subscribe(setState), []);

  const track = state.playlist[state.currentIndex];
  const duration = track?.durationHint ?? (state.duration > 0 ? state.duration : SONG_DATA.duration);

  const isPlaying = state.status === 'PLAYING';
  const progress = duration > 0 ? Math.min(100, (state.currentTime / duration) * 100) : 0;

  const togglePlay = () => {
    void musicService.toggle();
  };

  const seekTo = (value: number) => {
    const clamped = Math.max(0, Math.min(100, value));
    musicService.seek((clamped / 100) * duration);
  };

  const songData = track
    ? {
        albumArt: track.cover ?? SONG_DATA.albumArt,
        title: track.title,
        artist: track.artist ?? SONG_DATA.artist,
        duration,
      }
    : SONG_DATA;

  return (
    <MusicContext.Provider value={{ isPlaying, togglePlay, progress, seekTo, songData }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within a MusicProvider');
  return context;
};