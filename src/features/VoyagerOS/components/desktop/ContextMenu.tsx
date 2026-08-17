import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderPlus, 
  FilePlus, 
  Grid, 
  Image as ImageIcon, 
  Trash2, 
  Edit2, 
  Trash, 
  ExternalLink, 
  Info 
} from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  targetId: string | null;
  targetType: string | null;
  onClose: () => void;
  onNewFolder: (x: number, y: number) => void;
  onNewFile: (x: number, y: number) => void;
  onOrganize: () => void;
  onShuffleWallpaper: () => void;
  onDeleteTarget: (id: string) => void;
  onOpenTarget: (id: string) => void;
  onRenameTarget: (id: string) => void;
  onShowProperties: (id: string) => void;
  onToggleEditMode: () => void;
  isEditMode: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ 
  x, y, targetId, targetType, onClose, onNewFolder, onNewFile, onOrganize, onShuffleWallpaper,
  onDeleteTarget, onOpenTarget, onRenameTarget, onShowProperties, onToggleEditMode, isEditMode
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    const handleContextMenu = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [onClose]);

  // Adjust coordinates so the menu remains fully visible in the viewport
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - 320);

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.92, y: -4, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
      transition={{ type: "spring", stiffness: 450, damping: 26 }}
      className="absolute z-[300] w-[210px] rounded-2xl bg-neutral-950/85 backdrop-blur-3xl p-1.5 flex flex-col gap-0.5 select-none"
      style={{ 
        left: adjustedX, 
        top: adjustedY,
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.85), inset 0 1px 1.5px rgba(255, 255, 255, 0.15)'
      }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => {
        // Prevent default browser context menu on right clicks directly inside the custom context menu
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {targetId ? (
        /* Item Context Menu Option */
        <>
          <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
            Opciones de Elemento
          </div>
          <button 
            onClick={() => { onOpenTarget(targetId); onClose(); }}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white/90 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-150 text-left cursor-pointer group"
          >
            <ExternalLink size={15} className="text-sky-400 group-hover:scale-110 transition-transform" />
            <span>Abrir elemento</span>
          </button>
          <button 
            onClick={() => { onRenameTarget(targetId); onClose(); }}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white/90 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-150 text-left cursor-pointer group"
          >
            <Edit2 size={15} className="text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Renombrar</span>
          </button>
          <button 
            onClick={() => { onShowProperties(targetId); onClose(); }}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white/90 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-150 text-left cursor-pointer group"
          >
            <Info size={15} className="text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>Propiedades</span>
          </button>
          <div className="h-px bg-white/5 my-1 mx-2" />
          <button 
            onClick={() => { onDeleteTarget(targetId); onClose(); }}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-rose-400 hover:text-rose-300 rounded-xl hover:bg-rose-500/10 transition-all duration-150 text-left cursor-pointer group"
          >
            <Trash size={15} className="text-rose-400 group-hover:scale-110 transition-transform" />
            <span>Eliminar del Escritorio</span>
          </button>
        </>
      ) : (
        /* Desktop Background Context Menu Options */
        <>
          <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
            Escritorio Windows 12
          </div>
          <button 
            onClick={() => { onNewFolder(x, y); onClose(); }}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white/90 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-150 text-left cursor-pointer group"
          >
            <FolderPlus size={15} className="text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Nueva Carpeta</span>
          </button>
          <button 
            onClick={() => { onNewFile(x, y); onClose(); }}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white/90 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-150 text-left cursor-pointer group"
          >
            <FilePlus size={15} className="text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Nueva Imagen</span>
          </button>
          <button 
            onClick={() => { onOrganize(); onClose(); }}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white/90 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-150 text-left cursor-pointer group"
          >
            <Grid size={15} className="text-sky-400 group-hover:scale-110 transition-transform" />
            <span>Alinear Cuadrícula</span>
          </button>
          <button 
            onClick={() => { onToggleEditMode(); onClose(); }}
            className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-xl transition-all duration-150 text-left cursor-pointer group ${
              isEditMode ? 'bg-white/10 text-amber-300' : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            <Trash2 size={15} className="text-yellow-400 group-hover:scale-110 transition-transform" />
            <span>{isEditMode ? 'Salir Modo Edición' : 'Modo Edición (Mover)'}</span>
          </button>
          <div className="h-px bg-white/5 my-1 mx-2" />
          <button 
            onClick={() => { onShuffleWallpaper(); onClose(); }}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-pink-400 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-150 text-left cursor-pointer group"
          >
            <ImageIcon size={15} className="text-pink-400 group-hover:scale-110 transition-transform" />
            <span>Cambiar Fondo</span>
          </button>
        </>
      )}
    </motion.div>
  );
};
