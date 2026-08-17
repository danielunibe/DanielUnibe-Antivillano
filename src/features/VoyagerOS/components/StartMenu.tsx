import React, { forwardRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Power, Settings, Lock, RotateCcw, X, Folder, FileText } from 'lucide-react';
import { AVATAR_URL } from './ProfileBadge';

const pinnedApps = [
  { name: 'Edge', icon: 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-png/dark/edge.png', desc: 'Explorador web Microsoft Edge' },
  { name: 'Word', icon: 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-png/dark/word.png', desc: 'Procesador de textos Office' },
  { name: 'Excel', icon: 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-png/dark/excel.png', desc: 'Hojas de cálculo y análisis' },
  { name: 'PowerPoint', icon: 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-png/dark/powerpoint.png', desc: 'Presentaciones interactivas' },
  { name: 'Outlook', icon: 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-png/dark/outlook.png', desc: 'Correo electrónico y contactos' },
  { name: 'Calendar', icon: 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-png/dark/calendar.png', desc: 'Agenda y eventos sincronizados' },
  { name: 'Store', icon: 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-png/dark/windows.png', desc: 'Microsoft Store oficial' },
  { name: 'Photos', icon: 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-png/dark/photos.png', desc: 'Visor multimedia Voyager' },
  { name: 'Settings', icon: 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-png/dark/settings.png', desc: 'Configuración del sistema' },
  { name: 'Calculator', icon: 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-png/dark/calculator.png', desc: 'Calculadora científica' },
  { name: 'Notepad', icon: 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-png/dark/notepad.png', desc: 'Editor de notas rápidas' },
  { name: 'Paint', icon: 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-png/dark/paint.png', desc: 'Lienzo de dibujo vectorial' },
];

const recommendedItems = [
  { name: 'Proyecto Alpha 2026', time: 'Modificado recientemente', type: 'doc' },
  { name: 'Notas de Reunión Core', time: 'Ayer a las 4:30 PM', type: 'note' },
  { name: 'Diseño Voyager Glass', time: 'Lunes a las 9:15 AM', type: 'design' },
  { name: 'Itinerario de Viaje', time: 'Hace 3 días', type: 'sheet' },
];

interface StartMenuProps {
  style?: React.CSSProperties;
}

export const StartMenu = forwardRef<HTMLDivElement, StartMenuProps>(({ style }, ref) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPowerMenu, setShowPowerMenu] = useState(false);

  const notify = (title: string, message: string) => {
    window.dispatchEvent(new CustomEvent('system-notification', {
      detail: { title, message }
    }));
  };

  const filteredApps = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return pinnedApps;
    return pinnedApps.filter(app => 
      app.name.toLowerCase().includes(term) ||
      app.desc.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const filteredRecommended = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return recommendedItems;
    return recommendedItems.filter(item =>
      item.name.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <motion.div
      ref={ref}
      style={{
        ...style,
        transformOrigin: 'bottom center',
        boxShadow: '0 30px 80px -15px rgba(0,0,0,0.85), inset 0 1px 1.5px rgba(255, 255, 255, 0.15)'
      }}
      className="absolute bottom-[calc(100%+18px)] w-[580px] max-w-[92vw] h-[640px] rounded-[26px] bg-neutral-950/85 backdrop-blur-[70px] flex flex-col overflow-hidden z-[60] select-none"
      initial={{ opacity: 0, y: 30, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 420, damping: 30, mass: 0.8 }}
    >
      {/* Background Ambient Lighting */}
      <div className="absolute top-0 left-1/3 w-1/3 h-28 bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Top Search Bar */}
      <div className="p-6 pb-2 relative z-10">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-white/40 group-focus-within:text-blue-400 transition-colors" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Escribe aquí para buscar..."
            className="w-full h-11 bg-white/6 hover:bg-white/[0.09] focus:bg-white/12 rounded-xl pl-11 pr-10 text-sm text-white placeholder-white/40 outline-none transition-all shadow-inner"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-3 flex items-center text-white/40 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="px-6 flex-grow overflow-y-auto custom-scrollbar relative z-10 space-y-5 pb-3">
        {/* Pinned Applications Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
              {searchTerm ? 'Aplicaciones' : 'Ancladas'}
            </span>
            <button 
              onClick={() => notify('Todas las Aplicaciones', 'Catálogo de aplicaciones del sistema')}
              className="text-xs px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all"
            >
              Todas las apps &gt;
            </button>
          </div>

          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-6 gap-2">
              {filteredApps.map((app, i) => (
                <motion.button 
                  key={i}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => notify(`Ejecutando ${app.name}`, app.desc)}
                  className="flex flex-col items-center gap-1.5 p-2 hover:bg-white/8 rounded-2xl transition-colors group"
                  title={app.desc}
                >
                  <div className="relative w-9 h-9 flex items-center justify-center">
                    <img 
                      src={app.icon} 
                      alt={app.name} 
                      className="w-8 h-8 object-contain drop-shadow-md transition-transform group-hover:scale-105" 
                    />
                  </div>
                  <span className="text-[11px] text-white/80 group-hover:text-white font-medium text-center truncate w-full">
                    {app.name}
                  </span>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-sm text-white/40">
              No se encontraron aplicaciones
            </div>
          )}
        </div>

        {/* Recommended Items Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
              {searchTerm ? 'Archivos' : 'Recomendados'}
            </span>
            <button 
              onClick={() => notify('Archivos Recientes', 'Historial de documentos de Voyager')}
              className="text-xs px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all"
            >
              Más &gt;
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {filteredRecommended.map((item, i) => (
              <motion.button 
                key={i}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => notify(`Abriendo ${item.name}`, `Cargando el archivo...`)}
                className="flex items-center gap-3 p-3 bg-white/[0.04] hover:bg-white/10 rounded-2xl transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/25 transition-colors">
                  {item.type === 'doc' ? <FileText size={16} /> : <Folder size={16} />}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-medium text-white/90 group-hover:text-white truncate">{item.name}</span>
                  <span className="text-[10px] text-white/40 truncate">{item.time}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Profile & Power Menu */}
      <div className="h-16 px-6 bg-black/40 flex items-center justify-between mt-auto relative z-20">
        {/* User Profile */}
        <button 
          onClick={() => notify('Perfil', 'Daniel Unibe (Vault Developer)')}
          className="flex items-center gap-3 p-1.5 px-2.5 hover:bg-white/8 rounded-2xl transition-all group"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-sm ring-1 ring-white/20">
            <img 
              src={AVATAR_URL} 
              alt="Daniel Unibe" 
              className="w-full h-full object-cover transition-transform group-hover:scale-105" 
            />
          </div>
          <span className="text-xs font-medium text-white group-hover:text-[#f4a91f] transition-colors">
            Daniel Unibe
          </span>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 relative">
          <button 
            onClick={() => notify('Configuración', 'Abriendo panel de control...')}
            title="Configuración"
            className="p-2 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-all"
          >
            <Settings size={18} />
          </button>

          <button 
            onClick={() => setShowPowerMenu(!showPowerMenu)}
            title="Energía"
            className={`p-2 rounded-xl transition-all ${
              showPowerMenu ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <Power size={18} />
          </button>

          {/* Power Options Dropdown */}
          <AnimatePresence>
            {showPowerMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="absolute bottom-full right-0 mb-2 w-44 bg-neutral-900/95 backdrop-blur-2xl rounded-2xl p-1.5 shadow-2xl z-30"
              >
                <button
                  onClick={() => {
                    setShowPowerMenu(false);
                    notify('Bloqueo', 'Sesión bloqueada');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  <Lock size={14} /> Bloquear
                </button>
                <button
                  onClick={() => {
                    setShowPowerMenu(false);
                    notify('Reinicio', 'Reiniciando sistema...');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  <RotateCcw size={14} /> Reiniciar
                </button>
                <button
                  onClick={() => {
                    setShowPowerMenu(false);
                    notify('Apagar', 'Apagando el sistema...');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <Power size={14} /> Apagar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </motion.div>
  );
});

StartMenu.displayName = 'StartMenu';
