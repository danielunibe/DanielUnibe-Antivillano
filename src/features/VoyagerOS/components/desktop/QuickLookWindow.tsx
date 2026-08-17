import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { DesktopItemObj, AppItem } from './types';
import { IconComponent } from './DesktopItem';

interface QuickLookWindowProps {
  item: DesktopItemObj | undefined;
  onClose: () => void;
}

export const QuickLookWindow: React.FC<QuickLookWindowProps> = ({ item, onClose }) => {
  if (!item) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24 }}
      className="absolute inset-0 z-[250] flex items-center justify-center pointer-events-none"
    >
      <motion.div 
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/55 pointer-events-auto cursor-pointer" 
        onClick={onClose} 
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.3, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.3, y: 40 }}
        transition={{ 
          type: "spring", 
          stiffness: 320, 
          damping: 26, 
          mass: 0.95 
        }}
        className="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col items-center justify-center p-8 pointer-events-auto"
      >
        {item.type === 'image' ? (
           <div className="relative flex flex-col items-center select-none">
              <motion.img 
                 src={item.url} 
                 alt={item.label} 
                 className="max-w-[90vw] max-h-[70vh] object-contain rounded-3xl block" 
                 style={{
                     boxShadow: '0 30px 60px -15px rgba(0,0,0,0.85), inset 0 1.5px 1.5px rgba(255, 255, 255, 0.2)'
                 }}
              />
              <button 
                onClick={onClose} 
                className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 hover:scale-105 active:scale-95 backdrop-blur-md transition-all z-20 cursor-pointer shadow-lg"
              >
                <X size={18} />
              </button>
           </div>
        ) : (
          <div 
            className="relative w-full max-w-lg flex flex-col items-center justify-center py-16 px-10 rounded-[36px] bg-neutral-900/80 backdrop-blur-3xl"
            style={{
                boxShadow: '0 40px 80px -20px rgba(0,0,0,0.9), inset 0 1px 1.5px rgba(255, 255, 255, 0.15)'
            }}
          >
            <button 
              onClick={onClose} 
              className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
            >
              <X size={18} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.05, type: 'spring', stiffness: 200, damping: 20 }}
              className="w-44 h-44 bg-gradient-to-b from-white/10 to-white/5 rounded-[32px] flex items-center justify-center shadow-2xl relative"
            >
               <div className="absolute inset-0 rounded-[32px] bg-sky-500/10 blur-xl opacity-50" />
               <div className="scale-[1.8] flex items-center justify-center relative z-10">
                 <IconComponent name={(item as AppItem).icon || 'Folder'} size={48} />
               </div>
            </motion.div>
          </div>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.2 }}
          className="mt-6 text-white text-2xl font-semibold tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-center max-w-lg truncate"
        >
          {item.label}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
