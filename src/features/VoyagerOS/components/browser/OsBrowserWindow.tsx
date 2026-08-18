import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  RotateCw, 
  Minus, 
  Square, 
  Maximize2, 
  X,
  Minimize2
} from 'lucide-react';
import type { Project } from '../../../ProjectsScreen/types';
import { ProjectLiveViewer } from './ProjectLiveViewer';

interface OsBrowserWindowProps {
  project: Project;
  isOpen: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
  historyLength: number;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onNavigateBack?: () => void;
  onReload: () => void;
  reloadKey: number;
  onImmersiveChange?: (isImmersive: boolean) => void;
}

export const OsBrowserWindow: React.FC<OsBrowserWindowProps> = ({
  project,
  isOpen,
  isMaximized,
  isMinimized,
  historyLength,
  onClose,
  onMinimize,
  onToggleMaximize,
  onNavigateBack,
  onReload,
  reloadKey,
  onImmersiveChange
}) => {
  const [isRotating, setIsRotating] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);
  const [isHoveringTop, setIsHoveringTop] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Notificar cambio de modo inmersivo al componente contenedor
  useEffect(() => {
    onImmersiveChange?.(isImmersive);
    return () => {
      onImmersiveChange?.(false);
    };
  }, [isImmersive, onImmersiveChange]);

  // Activación automática de modo inmersivo tras cargar (800ms)
  useEffect(() => {
    if (!isOpen || isMinimized) {
      setIsImmersive(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsImmersive(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [project.id, reloadKey, isOpen, isMinimized]);

  // Manejo de hover en zona superior para mostrar barra de controles en modo inmersivo
  const handleTopAreaMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHoveringTop(true);
  }, []);

  const handleTopAreaMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHoveringTop(false);
    }, 400);
  }, []);

  // Soporte de tecla Escape para alternar/salir de modo inmersivo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isImmersive) {
        setIsImmersive(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImmersive]);

  const handleReloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRotating(true);
    onReload();
    setTimeout(() => setIsRotating(false), 600);
  };

  if (!isOpen || isMinimized) return null;

  const showHeader = !isImmersive || isHoveringTop;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          transition: { type: 'spring', stiffness: 420, damping: 32 } 
        }}
        exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.16 } }}
        className={`absolute z-40 flex flex-col overflow-hidden transition-all duration-300 ease-out ${
          isImmersive
            ? 'inset-0 rounded-none border-0 bg-black'
            : isMaximized
              ? 'inset-1 bottom-11 rounded-xl border border-white/20 bg-[#0c0e14]/95 backdrop-blur-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)]'
              : 'inset-x-[4%] top-[4%] bottom-[15%] rounded-xl border border-white/20 bg-[#0c0e14]/95 backdrop-blur-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)]'
        }`}
        drag={!isMaximized && !isImmersive}
        dragConstraints={{ left: -30, right: 30, top: -15, bottom: 15 }}
        dragMomentum={false}
        dragElastic={0.05}
      >
        {/* Zona reactiva invisible en el borde superior para recuperar controles en modo inmersivo */}
        {isImmersive && (
          <div
            className="absolute top-0 inset-x-0 h-9 z-50 pointer-events-auto"
            onMouseEnter={handleTopAreaMouseEnter}
            onMouseLeave={handleTopAreaMouseLeave}
          />
        )}

        {/* Header Compacto (32px) / Kiosk Bar */}
        <div 
          className={`h-8 shrink-0 flex items-center justify-between px-2.5 z-40 select-none cursor-move transition-all duration-250 ease-out ${
            isImmersive
              ? `absolute top-0 inset-x-0 bg-black/85 backdrop-blur-xl border-b border-white/15 shadow-2xl ${
                  showHeader ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
                }`
              : 'bg-black/75 border-b border-white/10'
          }`}
          onMouseEnter={isImmersive ? handleTopAreaMouseEnter : undefined}
          onMouseLeave={isImmersive ? handleTopAreaMouseLeave : undefined}
          onDoubleClick={onToggleMaximize}
        >
          {/* Navegación izquierda: Atrás y Recargar */}
          <div className="flex items-center gap-1 shrink-0 pointer-events-auto">
            <button
              type="button"
              onClick={onNavigateBack}
              disabled={historyLength <= 1}
              aria-label="Atrás"
              title="Atrás"
              className={`p-1 rounded-md transition-colors flex items-center justify-center ${
                historyLength > 1 
                  ? 'text-white/80 hover:bg-white/10 hover:text-white cursor-pointer active:scale-95' 
                  : 'text-white/20 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={14} />
            </button>

            <button
              type="button"
              onClick={handleReloadClick}
              aria-label="Recargar proyecto"
              title="Recargar"
              className="p-1 rounded-md text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer active:scale-95 flex items-center justify-center"
            >
              <RotateCw size={12} className={isRotating ? 'animate-spin text-[#F2D019]' : ''} />
            </button>
          </div>

          {/* Centro: Título del Proyecto en Modo Kiosk Limpio */}
          <div className="flex items-center gap-1.5 min-w-0 px-2.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/10 max-w-[60%]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2fa39b] animate-pulse shrink-0 drop-shadow-[0_0_5px_#2fa39b]" />
            <span className="truncate font-['Teko'] text-lg font-bold uppercase tracking-wider text-[#F2D019] leading-none pt-0.5">
              {project.title}
            </span>
            <span className="font-['Roboto_Mono'] text-[8.5px] text-white/40 border-l border-white/15 pl-1.5 shrink-0 hidden sm:inline">
              {project.type}
            </span>
          </div>

          {/* Controles de Ventana (Inmersivo, Minimizar, Maximizar, Cerrar) */}
          <div className="flex items-center gap-1 shrink-0 pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsImmersive(prev => !prev)}
              aria-label={isImmersive ? "Modo ventana" : "Modo inmersivo"}
              title={isImmersive ? "Restaurar ventana" : "Modo inmersivo"}
              className="p-1 rounded-md text-white/70 hover:bg-white/10 hover:text-[#F2D019] transition-colors cursor-pointer active:scale-95"
            >
              {isImmersive ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
            </button>

            {!isImmersive && (
              <>
                <button
                  type="button"
                  onClick={onMinimize}
                  aria-label="Minimizar"
                  title="Minimizar"
                  className="p-1 rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer active:scale-95"
                >
                  <Minus size={12} />
                </button>

                <button
                  type="button"
                  onClick={onToggleMaximize}
                  aria-label={isMaximized ? "Restaurar" : "Maximizar"}
                  title={isMaximized ? "Restaurar" : "Maximizar"}
                  className="p-1 rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer active:scale-95"
                >
                  <Square size={10} />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              title="Cerrar"
              className="p-1 rounded-md text-white/70 hover:bg-red-500/80 hover:text-white transition-colors cursor-pointer active:scale-95"
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* Cuerpo de la Ventana: ProjectLiveViewer ocupando 100% de la superficie */}
        <div className="flex-1 w-full h-full min-h-0 relative overflow-hidden bg-black">
          <ProjectLiveViewer project={project} reloadKey={reloadKey} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
