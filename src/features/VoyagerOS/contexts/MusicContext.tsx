import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      // 100ms update rate for smooth UI without heavy CPU usage
      interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          // Calculate step to match song duration: 100% / duration(s) / (1000ms / 100ms)
          return prev + (100 / SONG_DATA.duration / 10);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(prev => !prev);
  const seekTo = (val: number) => setProgress(Math.max(0, Math.min(100, val)));

  return (
    <MusicContext.Provider value={{ isPlaying, togglePlay, progress, seekTo, songData: SONG_DATA }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within a MusicProvider');
  return context;
};