import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Heart, Shuffle, ListMusic, Volume2 } from 'lucide-react';
import { useMusic } from '../contexts/MusicContext';

interface MusicPanelProps {
  style?: React.CSSProperties;
}

const panelContainerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" },
    visible: { 
        opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
        transition: { type: 'spring' as const, stiffness: 400, damping: 30 } 
    },
    exit: { opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)", transition: { duration: 0.2 } }
};

export const MusicPanel = forwardRef<HTMLDivElement, MusicPanelProps>(({ style }, ref) => {
  const { isPlaying, togglePlay, progress, seekTo, songData } = useMusic();

  const formatTime = (percent: number) => {
    const currentSeconds = Math.floor((percent / 100) * songData.duration);
    const mins = Math.floor(currentSeconds / 60);
    const secs = currentSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const newProgress = Math.max(0, Math.min(100, (x / width) * 100));
    seekTo(newProgress);
  };

  return (
    <motion.div
      ref={ref}
      style={style}
      tabIndex={-1}
      className="absolute bottom-[calc(100%+24px)] outline-none z-50 origin-bottom"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={panelContainerVariants}
    >
        <div 
            className="relative w-[320px] rounded-[32px] overflow-hidden bg-[#161618]/95 backdrop-blur-3xl flex flex-col"
            style={{
                boxShadow: '0 30px 60px -15px rgba(0,0,0,0.85), inset 0 1px 1.5px rgba(255, 255, 255, 0.15)'
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-2 text-white/50 z-10">
                <Volume2 size={16} />
                <span className="text-xs font-medium tracking-widest uppercase">Now Playing</span>
                <ListMusic size={16} className="cursor-pointer hover:text-white transition-colors" />
            </div>

            {/* Album Art (Vinyl Style Animation) */}
            <div className="flex justify-center py-4 z-10">
                <motion.div 
                    className="w-56 h-56 rounded-full shadow-2xl relative overflow-hidden bg-black ring-4 ring-black/20"
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                >
                     <img src={songData.albumArt} alt="Album Art" className="w-full h-full object-cover opacity-90"/>
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none rounded-full" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#1c1c1e] rounded-full z-20" />
                </motion.div>
            </div>

            {/* Details */}
            <div className="flex flex-col items-center px-6 z-10 gap-1">
                <h2 className="text-xl font-bold text-white tracking-wide text-center truncate w-full">{songData.title}</h2>
                <p className="text-[#a1a1aa] text-sm font-medium text-center">{songData.artist}</p>
            </div>

            {/* Progress */}
            <div className="w-full px-8 mt-6 mb-2 z-10 group cursor-pointer" onClick={handleSeek}>
                <div className="h-1 w-full bg-[#3f3f46] rounded-full overflow-hidden relative group-hover:h-1.5 transition-all">
                    <motion.div 
                        className="absolute top-0 left-0 h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-white/30 font-bold mt-2 font-mono">
                    <span>{formatTime(progress)}</span>
                    <span>-{formatTime(100 - progress)}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 pb-8 z-10">
                 <button className="text-white/30 hover:text-white p-2 transition-colors"><Heart size={20} /></button>
                <button className="text-white hover:text-white/80 active:scale-95 transition-transform"><SkipBack size={28} fill="currentColor" /></button>
                
                <motion.button 
                    onClick={togglePlay}
                    className="flex items-center justify-center w-16 h-16 rounded-full bg-white text-black shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                    whileTap={{ scale: 0.9 }}
                >
                    {isPlaying ? <Pause size={28} fill="currentColor" strokeWidth={0} /> : <Play size={28} fill="currentColor" strokeWidth={0} className="ml-1" />}
                </motion.button>

                <button className="text-white hover:text-white/80 active:scale-95 transition-transform"><SkipForward size={28} fill="currentColor" /></button>
                 <button className="text-white/30 hover:text-white p-2 transition-colors"><Shuffle size={20} /></button>
            </div>
        </div>
    </motion.div>
  );
});

MusicPanel.displayName = 'MusicPanel';