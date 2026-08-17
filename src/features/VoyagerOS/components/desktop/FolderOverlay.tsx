import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { FolderItem, AppItem } from './types';
import { IconComponent } from './DesktopItem';

interface FolderOverlayProps {
  folder: FolderItem | undefined;
  onClose: () => void;
  onRemoveItem: (itemId: string) => void;
  isEditMode: boolean;
}

export const FolderOverlay: React.FC<FolderOverlayProps> = ({ 
  folder, 
  onClose, 
  onRemoveItem, 
  isEditMode 
}) => {
  if (!folder) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-[250] flex items-center justify-center p-4 bg-black/25"
      onClick={onClose}
      onContextMenu={(e) => {
        // Prevent default click-through triggering desktop background context menu
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <motion.div 
         initial={{ opacity: 0, scale: 0.4, y: 40 }}
         animate={{ opacity: 1, scale: 1, y: 0 }}
         exit={{ opacity: 0, scale: 0.8 }}
         transition={{ type: "spring", damping: 25, stiffness: 350 }}
         className="w-full max-w-[340px] min-h-[340px] bg-neutral-950/85 backdrop-blur-3xl rounded-[36px] p-8 relative flex flex-col"
         style={{
             boxShadow: '0 30px 60px -15px rgba(0,0,0,0.85), inset 0 1px 1.5px rgba(255, 255, 255, 0.15)'
         }}
         onClick={e => e.stopPropagation()}
         onContextMenu={e => {
           e.preventDefault();
           e.stopPropagation();
         }}
      >
        <div className="absolute top-2 left-0 right-0 flex justify-center">
           <div className="w-12 h-1 bg-white/30 rounded-full mt-2" />
        </div>
        
        <div className="text-white text-center font-bold mb-8 text-2xl tracking-tight drop-shadow-md">
          {folder.label}
        </div>
        
        <div className="grid grid-cols-3 gap-y-8 gap-x-2 content-start flex-1 text-center justify-center">
          {folder.items.map((app: AppItem, idx: number) => {
             return (
               <div key={app.id} className="flex flex-col items-center gap-1.5 relative cursor-pointer group">
                 {isEditMode && (
                    <button 
                       onClick={(e) => { 
                         e.stopPropagation(); 
                         onRemoveItem(app.id); 
                       }}
                       className="absolute -top-2 left-2 w-6 h-6 bg-white text-gray-900 rounded-full flex items-center justify-center z-20 shadow-md hover:bg-neutral-100"
                    >
                         <X size={14} strokeWidth={2.5} />
                    </button>
                 )}
                 
                 <motion.div
                     animate={isEditMode ? { 
                          rotate: (idx % 2 === 0) ? [-1.5, 1.5, -1.5] : [1.5, -1.5, 1.5], 
                          transition: { repeat: Infinity, duration: 0.28, ease: 'linear', delay: (idx % 5) * 0.05 } 
                     } : { rotate: 0 }}
                     whileTap={{ scale: 0.9 }}
                     className="w-[64px] h-[64px] flex items-center justify-center bg-transparent group-hover:bg-white/10 rounded-2xl transition-colors"
                 >
                     <IconComponent name={app.icon} size={38} />
                 </motion.div>
                 
                 <span className="text-white text-xs text-center drop-shadow-md truncate w-full px-1">
                   {app.label}
                 </span>
               </div>
             );
          })}
          
          {folder.items.length === 0 && (
             <div className="col-span-3 text-center text-white/50 text-sm mt-10">Folder Vacío</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
