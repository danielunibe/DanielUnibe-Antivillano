import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  FileText, 
  Monitor, 
  Trash2, 
  Folder, 
  Settings, 
  Network, 
  HelpCircle,
  Gamepad2,
  Cpu,
  Boxes,
  Code,
  Globe,
  LucideIcon
} from 'lucide-react';
import { DesktopItemObj, AppItem } from './types';

const iconMap: Record<string, LucideIcon> = {
  Monitor,
  Trash2,
  Folder,
  Settings,
  FileText,
  Network,
  Gamepad2,
  Cpu,
  Boxes,
  Code,
  Globe,
};

const appColors: Record<string, string> = {
  Monitor: '#3b82f6', 
  Trash2: '#f87171', 
  Folder: '#eab308', 
  Settings: '#a78bfa', 
  FileText: '#cbd5e1', 
  Network: '#10b981', 
  Gamepad2: '#F2D019',
  Cpu: '#00A4EF',
  Boxes: '#ec4899',
  Code: '#10b981',
  Globe: '#38bdf8',
};

interface DesktopItemProps {
  item: DesktopItemObj;
  isSelected: boolean;
  isEditMode: boolean;
  isDragging: boolean;
  isQuickLooking: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  onLongPress: () => void;
  onDrag: (id: string, dx: number, dy: number) => void;
  onDragEnd: (id: string) => void;
  setRef: (el: HTMLDivElement | null) => void;
  onRemove: (id: string) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export const IconComponent: React.FC<{ name: string; size?: number }> = React.memo(({ name, size = 36 }) => {
  const Icon = iconMap[name] || HelpCircle;
  const colorHex = appColors[name] || '#ffffff';
  
  return (
    <div className="relative flex items-center justify-center transition-all duration-300" style={{ width: size, height: size }}>
      <Icon 
        size={size} 
        className="absolute opacity-0 group-hover:opacity-45 transition-all duration-300 pointer-events-none" 
        style={{ filter: `blur(8px)`, color: colorHex, transform: 'translateY(1px) scale(1.05)' }} 
        strokeWidth={2.5} 
      />
      <Icon 
        size={size} 
        className="relative z-10 transition-transform duration-300 group-hover:scale-105" 
        style={{ color: colorHex, filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.45))' }} 
        strokeWidth={1.8} 
      />
    </div>
  );
});

export const FolderIconView: React.FC<{ items: AppItem[] }> = React.memo(({ items }) => {
  return (
    <div className="w-full h-full grid grid-cols-2 gap-1.5 p-0.5 items-center justify-center overflow-hidden pointer-events-none">
      {items.slice(0, 4).map(app => {
        const MIcon = iconMap[app.icon] || FileText;
        const colorHex = appColors[app.icon] || '#ffffff';
        return (
          <MIcon 
            key={app.id} 
            size={14} 
            style={{ color: colorHex }} 
            className="drop-shadow-sm mx-auto" 
            strokeWidth={2} 
          />
        );
      })}
    </div>
  );
});

export const DesktopItem: React.FC<DesktopItemProps> = React.memo(({ 
  item, 
  isSelected, 
  isEditMode, 
  isDragging,
  isQuickLooking,
  onClick, 
  onDoubleClick, 
  onLongPress, 
  onDrag,
  onDragEnd, 
  setRef,
  onRemove,
  onContextMenu
}) => {
  const [isBouncing, setIsBouncing] = React.useState(false);
  const [showRipple, setShowRipple] = React.useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const bounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rippleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const charCode = item.id.charCodeAt(0) || 0;
  const isEven = charCode % 2 === 0;
  const jiggleDelay = (charCode % 5) * 0.05;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (bounceTimeoutRef.current) clearTimeout(bounceTimeoutRef.current);
      if (rippleTimeoutRef.current) clearTimeout(rippleTimeoutRef.current);
    };
  }, []);
  
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    
    if (!isEditMode) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onLongPress();
      }, 600);
    }
  };
  
  const cancelLongPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    setShowRipple(true);
    if (rippleTimeoutRef.current) clearTimeout(rippleTimeoutRef.current);
    rippleTimeoutRef.current = setTimeout(() => {
      setShowRipple(false);
    }, 600);
    onClick(e);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    setIsBouncing(true);
    setShowRipple(true);
    
    if (bounceTimeoutRef.current) clearTimeout(bounceTimeoutRef.current);
    bounceTimeoutRef.current = setTimeout(() => {
      setIsBouncing(false);
    }, 600);
    
    if (rippleTimeoutRef.current) clearTimeout(rippleTimeoutRef.current);
    rippleTimeoutRef.current = setTimeout(() => {
      setShowRipple(false);
    }, 800);
    
    onDoubleClick(e);
  };
  
  return (
    <motion.div
      ref={setRef}
      id={item.id}
      onPan={(_e, info) => {
        cancelLongPress();
        onDrag(item.id, info.delta.x, info.delta.y);
      }}
      onPanEnd={() => {
        onDragEnd(item.id);
      }}
      initial={false}
      animate={{ 
        x: item.x, 
        y: isBouncing ? [item.y, item.y - 20, item.y + 4, item.y - 4, item.y] : item.y,
        scale: isBouncing ? [1, 0.85, 1.18, 0.93, 1.03, 1] : 1,
        rotate: isEditMode ? (isEven ? [-1.3, 1.3, -1.3] : [1.3, -1.3, 1.3]) : 0
      }}
      transition={isDragging ? {
        x: { type: 'tween', duration: 0 },
        y: { type: 'tween', duration: 0 }
      } : isEditMode ? {
        rotate: { repeat: Infinity, duration: 0.28, ease: 'linear', delay: jiggleDelay },
        x: { type: 'spring', stiffness: 450, damping: 32 },
        y: { type: 'spring', stiffness: 450, damping: 32 }
      } : isBouncing ? {
        y: { duration: 0.58, ease: "easeInOut" },
        scale: { duration: 0.58, ease: "easeInOut" }
      } : {
        type: 'spring', stiffness: 450, damping: 32
      }}
      whileTap={{ scale: 0.9, scaleY: 0.86, scaleX: 1.10 }}
      whileHover={{ scale: 1.05 }}
      onPointerDown={handlePointerDown}
      onPointerUp={cancelLongPress}
      onPointerMove={cancelLongPress}
      onPointerCancel={cancelLongPress}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={(e) => {
        cancelLongPress();
        onContextMenu(e);
      }}
      className={`absolute left-0 top-0 flex flex-col items-center justify-center p-1.5 rounded-xl cursor-pointer w-[64px] gap-1 transition-all duration-150 group select-none ${
        isSelected 
          ? 'bg-white/20 backdrop-blur-md shadow-lg ring-1 ring-white/30' 
          : 'hover:bg-white/10'
      }`}
      style={{ 
        zIndex: isSelected || isDragging || isBouncing ? 100 : 10,
        boxShadow: isSelected 
          ? '0 8px 18px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255, 255, 255, 0.2)' 
          : 'none'
      }}
    >
      <AnimatePresence>
        {showRipple && (
          <motion.div
            initial={{ opacity: 0.8, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="absolute inset-0 rounded-xl pointer-events-none z-0"
            style={{
              background: `radial-gradient(circle, ${appColors[item.icon] || '#3b82f6'}33 0%, transparent 75%)`
            }}
          />
        )}
      </AnimatePresence>
      {isEditMode && (
        <button 
          onPointerDown={(e) => e.stopPropagation()} 
          onClick={(e) => { 
            e.stopPropagation(); 
            onRemove(item.id); 
          }}
          className="absolute -top-1 -left-1 w-4 h-4 bg-white backdrop-blur-md text-gray-900 rounded-full flex items-center justify-center z-20 shadow-md hover:bg-neutral-100 active:scale-90 transition-transform"
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
      
      {item.type === 'folder' ? (
        <div className="relative flex items-center justify-center w-[40px] h-[40px] group transition-all duration-300">
          <div 
            className="w-[40px] h-[40px] rounded-xl bg-amber-500/20 group-hover:bg-amber-500/25 shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
            style={{
              boxShadow: '0 6px 16px -4px rgba(0,0,0,0.45)',
              background: 'radial-gradient(circle at top left, rgba(245,158,11,0.25) 0%, rgba(217,119,6,0.15) 100%)'
            }}
          >
            <div style={{ opacity: isQuickLooking ? 0 : 1 }} className="w-full h-full p-1.5 bg-black/5 rounded-xl">
              <FolderIconView items={item.items} />
            </div>
          </div>
        </div>
      ) : item.type === 'image' ? (
        <div className="relative flex items-center justify-center w-[40px] h-[40px] group transition-all duration-300">
          <div 
            className="w-[40px] h-[40px] rounded-xl overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-300"
            style={{
              boxShadow: '0 6px 16px -4px rgba(0,0,0,0.45)'
            }}
          >
            <img 
              src={item.url} 
              alt={item.label} 
              style={{ opacity: isQuickLooking ? 0 : 1 }}
              className="w-full h-full object-cover relative z-10 pointer-events-none bg-white/20" 
            />
          </div>
        </div>
      ) : (
        <div style={{ opacity: isQuickLooking ? 0 : 1 }} className="flex items-center justify-center w-[40px] h-[40px]">
          <div className="group-hover:scale-105 transition-transform duration-300">
            <IconComponent name={item.icon} size={28} />
          </div>
        </div>
      )}
      
      <span className="text-white text-[10px] text-center drop-shadow-md truncate w-full px-0.5 font-medium select-none" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
        {item.label}
      </span>
    </motion.div>
  );
});
