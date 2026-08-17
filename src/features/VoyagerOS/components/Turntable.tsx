import React from 'react';
import { useMusic } from '../contexts/MusicContext';

interface TurntableProps {
  isPlaying: boolean;
  onClick?: () => void;
  scale?: number;
  className?: string;
  progress?: number;
}

export const Turntable: React.FC<TurntableProps> = ({ isPlaying, onClick, scale = 1, className = '', progress }) => {
  const context = tryUseMusic();
  const effectiveProgress = progress ?? context?.progress ?? 0;
  const artUrl = context?.songData.albumArt || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000";

  // Physics: Arm angle interpolation
  const ARM_REST = 0;
  const ARM_START = 15;
  const ARM_END = 35;
  
  const armRotation = isPlaying 
    ? ARM_START + (effectiveProgress / 100) * (ARM_END - ARM_START)
    : ARM_REST;

  return (
    <div 
        onClick={onClick}
        className={`relative group flex-shrink-0 ${className}`}
        style={{ 
            width: 288, 
            height: 288,
            transform: `scale(${scale})`,
            transformOrigin: 'center center'
        }}
    >
      <style>{`
        .tt-shadow { box-shadow: inset 0 8px 20px #ffffff40, inset 0 15px 40px #ffffff0d, inset 0 -10px 30px #000c; }
        .tt-grooves { background: repeating-radial-gradient(transparent, transparent, #ffffff 2px, #71717a 3px, #71717a 4px); }
        
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin-slow { animation: spin 4s linear infinite; }
        
        .paused { animation-play-state: paused; }
        .running { animation-play-state: running; }
      `}</style>
      
      {/* Base Chassis */}
      <div className="relative w-full h-full rounded-[4.5rem] flex items-center justify-center cursor-pointer z-10 tt-shadow bg-[#1c1c1e] transition-transform active:scale-[0.99] overflow-hidden">
        
        {/* Surface Texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#27272a] via-[#18181b] to-[#09090b]" />
        
        {/* Tone Arm Base Area */}
        <div className="absolute right-5 top-5 bottom-5 w-20 rounded-3xl bg-[#27272a] shadow-inner border border-black/50" />

        {/* Platter & Vinyl */}
        <div className="absolute w-[17rem] h-[17rem] rounded-full bg-[#18181b] shadow-xl flex items-center justify-center">
           {/* Rotating Record */}
           <div className={`w-[16rem] h-[16rem] rounded-full flex items-center justify-center relative overflow-hidden shadow-lg bg-[#18181b] spin-slow ${isPlaying ? 'running' : 'paused'}`}>
             <img src={artUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-90" />
             <div className="absolute inset-0 rounded-full opacity-60 tt-grooves mix-blend-multiply" />
             <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
             
             {/* Center Label */}
             <div className="relative w-16 h-16 rounded-full border-2 border-[#52525b] bg-[#18181b] flex items-center justify-center z-10 shadow-lg">
                <div className="w-2 h-2 bg-[#71717a] rounded-full" />
             </div>
           </div>
        </div>

        {/* Tonearm */}
        <div className="absolute top-6 right-[1.5rem] w-14 h-64 pointer-events-none z-20">
          <div 
            className="w-full h-full flex flex-col items-center origin-[28px_24px] transition-transform duration-1000 ease-out"
            style={{ transform: `rotate(${armRotation}deg)` }}
          >
            {/* Pivot */}
            <div className="absolute top-0 w-14 h-14 rounded-full z-30 flex items-center justify-center bg-[#27272a] shadow-lg border border-black/50">
               <div className="w-6 h-6 rounded-full bg-[#18181b] flex items-center justify-center">
                  <div className="w-3 h-0.5 bg-[#52525b]" />
               </div>
            </div>
            
            {/* Arm Tube */}
            <div className="relative mt-7 w-2 h-48 bg-gradient-to-r from-[#52525b] via-[#a1a1aa] to-[#52525b] rounded-full shadow-md" />
            
            {/* Cartridge */}
            <div className="w-6 h-10 bg-[#18181b] rounded-sm -mt-1 shadow-xl border-t border-[#52525b] -skew-x-3" />
          </div>
        </div>

        {/* Status LED */}
        <div className="absolute bottom-8 right-8 z-10">
           <div className="w-3 h-3 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center">
              <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isPlaying ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-[#3f3f46]'}`} />
           </div>
        </div>
        
      </div>
    </div>
  );
};

function tryUseMusic() {
    try { return useMusic(); } catch { return undefined; }
}