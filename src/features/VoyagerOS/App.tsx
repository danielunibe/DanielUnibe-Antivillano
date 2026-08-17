import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dock } from './components/Dock';
import { DesktopWidget } from './components/DesktopWidget';
import { DesktopIcons } from './components/DesktopIcons';
import { OsBrowserWindow } from './components/browser/OsBrowserWindow';
import { VirtualCursor } from './components/browser/VirtualCursor';
import { Notification } from './types';
import { MusicProvider } from './contexts/MusicContext';
import type { Project } from '../ProjectsScreen/types';
import { sfx } from '../../utils/SoundManager';

const backgroundImages = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1600&auto=format&fit=crop'
];

const initialNotifications: Notification[] = [
  { 
    id: 1, 
    title: 'Five options to relax after work', 
    message: 'Discover handpicked spots, quiet corners, and perfect settings to unwind after a heavy day.',
    time: '15:33 12.05',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #f97316 100%)'
  },
  { 
    id: 2, 
    title: 'Documents for a trip to SF', 
    message: 'Your flight tickets, hotel reservations, and travel itinerary are prepared and updated.',
    time: '14:12 12.05',
    imageUrl: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=300&q=80'
  },
  { 
    id: 3, 
    title: 'Ventilate the room now', 
    message: 'Indoor carbon dioxide level is higher than usual. Open a window to refresh the atmosphere.',
    time: '10:33 12.05',
    iconType: 'ventilate'
  },
];

const sampleNotifications: Notification[] = [
  { id: 4, title: 'New Message', message: 'Hey, how are you doing today?' },
  { id: 5, title: 'System Update', message: 'A new update is available for VoyagerOS.' },
  { id: 6, title: 'Calendar Reminder', message: 'Team meeting in 15 minutes.' },
  { id: 7, title: 'File Downloaded', message: 'Your file "project-brief.pdf" has been downloaded.' },
  { id: 8, title: 'Email from Jane', message: 'Re: Project Alpha discussion' },
];

interface AppProps {
  activeProject?: Project;
}

export default function App({ activeProject }: AppProps): React.JSX.Element {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [notificationsPaused, setNotificationsPaused] = useState(false);
  
  // State for the Desktop Widget "Clone"
  const [isWidgetActive, setIsWidgetActive] = useState(false);
  const [widgetPosition, setWidgetPosition] = useState({ x: 0, y: 0 });

  // Browser Window State
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [isBrowserMaximized, setIsBrowserMaximized] = useState(false);
  const [isBrowserMinimized, setIsBrowserMinimized] = useState(false);
  const [browserProject, setBrowserProject] = useState<Project | null>(activeProject || null);
  const [projectHistory, setProjectHistory] = useState<Project[]>(activeProject ? [activeProject] : []);
  const [reloadKey, setReloadKey] = useState(0);

  // Autopilot State
  const [autopilotRunning, setAutopilotRunning] = useState(false);
  const [targetCursorPos, setTargetCursorPos] = useState({ x: 38, y: 38 });
  const lastActiveProjectIdRef = useRef<number | string | null>(null);

  // Abrir proyecto en navegador
  const openProjectInBrowser = useCallback((proj: Project) => {
    setBrowserProject(proj);
    setProjectHistory(prev => {
      if (prev.length > 0 && prev[prev.length - 1].id === proj.id) return prev;
      return [...prev, proj];
    });
    setIsBrowserOpen(true);
    setIsBrowserMinimized(false);
  }, []);

  // Reaccionar a cambios en activeProject seleccionado desde el panel exterior
  useEffect(() => {
    if (!activeProject) return;

    // Si es la primera vez o cambia el proyecto
    if (lastActiveProjectIdRef.current !== activeProject.id) {
      lastActiveProjectIdRef.current = activeProject.id;

      // Si el navegador ya estaba abierto y visible, simplemente actualizamos el proyecto sin repetir autopilot largo
      if (isBrowserOpen && !isBrowserMinimized) {
        setBrowserProject(activeProject);
        setProjectHistory(prev => [...prev, activeProject]);
        setReloadKey(k => k + 1);
        return;
      }

      // Si no estaba abierto, iniciamos la secuencia de autopilot
      setTargetCursorPos({ x: 36, y: 38 });
      setAutopilotRunning(true);
    }
  }, [activeProject, isBrowserOpen, isBrowserMinimized]);

  // Completar autopilot: sonido de click y apertura de ventana
  const handleAutopilotComplete = useCallback(() => {
    sfx.play('CLICK');
    setAutopilotRunning(false);
    if (activeProject) {
      openProjectInBrowser(activeProject);
    }
  }, [activeProject, openProjectInBrowser]);

  const handleCloseBrowser = useCallback(() => {
    setIsBrowserOpen(false);
  }, []);

  const handleMinimizeBrowser = useCallback(() => {
    setIsBrowserMinimized(true);
  }, []);

  const handleToggleMaximizeBrowser = useCallback(() => {
    setIsBrowserMaximized(prev => !prev);
  }, []);

  const handleReloadBrowser = useCallback(() => {
    setReloadKey(prev => prev + 1);
  }, []);

  const handleNavigateBackBrowser = useCallback(() => {
    if (projectHistory.length > 1) {
      const newHistory = [...projectHistory];
      newHistory.pop();
      const previousProject = newHistory[newHistory.length - 1];
      setProjectHistory(newHistory);
      setBrowserProject(previousProject);
      setReloadKey(prev => prev + 1);
    }
  }, [projectHistory]);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 15000); 
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleShuffle = () => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    };
    window.addEventListener('shuffle-wallpaper', handleShuffle);
    return () => window.removeEventListener('shuffle-wallpaper', handleShuffle);
  }, []);

  useEffect(() => {
    const handleSystemNotification = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const { title, message } = customEvent.detail;
        const newNotif: Notification = {
          id: Date.now(),
          title: title || 'Notificación de VoyagerOS',
          message: message || '',
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    };
    window.addEventListener('system-notification', handleSystemNotification);
    return () => window.removeEventListener('system-notification', handleSystemNotification);
  }, []);
  
  useEffect(() => {
    const addNotification = () => {
        if (notificationsPaused) return; 
        setNotifications(prev => {
            if (prev.length >= sampleNotifications.length) return prev;
            return [...prev, sampleNotifications[prev.length]];
        });
    };
    
    const firstTimeout = setTimeout(addNotification, 4000);
    const intervalId = setInterval(addNotification, 18000);

    return () => {
        clearTimeout(firstTimeout);
        clearInterval(intervalId);
    };
  }, [notificationsPaused]);
  
  const handleClearNotifications = () => {
    setNotifications([]);
    setNotificationsPaused(true);
  };

  const desktopContainerRef = useRef<HTMLDivElement>(null);

  const handleDismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleWidgetExtract = (clientX: number, clientY: number) => {
      if (desktopContainerRef.current) {
          const rect = desktopContainerRef.current.getBoundingClientRect();
          const relX = Math.max(100, Math.min(rect.width - 100, clientX - rect.left));
          const relY = Math.max(80, Math.min(rect.height - 80, clientY - rect.top));
          setWidgetPosition({ x: relX, y: relY });
      } else {
          setWidgetPosition({ x: 300, y: 140 });
      }
      setIsWidgetActive(true);
  };

  const handleCloseWidget = () => {
      setIsWidgetActive(false);
  };

  return (
    <MusicProvider>
      <div 
        ref={desktopContainerRef} 
        className="h-full w-full text-white flex items-end justify-center pb-2 relative overflow-hidden select-none"
      >
        <AnimatePresence>
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${backgroundImages[currentImageIndex]}')` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        {/* Desktop Icons */}
        <DesktopIcons />

        {/* The Desktop Widget "Clone" */}
        <AnimatePresence>
            {isWidgetActive && (
                <DesktopWidget 
                    initialX={widgetPosition.x} 
                    initialY={widgetPosition.y} 
                    onClose={handleCloseWidget}
                />
            )}
        </AnimatePresence>

        {/* Simulated OS Browser Window (Kiosk / Project Viewer) */}
        {browserProject && (
          <OsBrowserWindow
            project={browserProject}
            isOpen={isBrowserOpen}
            isMaximized={isBrowserMaximized}
            isMinimized={isBrowserMinimized}
            historyLength={projectHistory.length}
            onClose={handleCloseBrowser}
            onMinimize={handleMinimizeBrowser}
            onToggleMaximize={handleToggleMaximizeBrowser}
            onNavigateBack={handleNavigateBackBrowser}
            onReload={handleReloadBrowser}
            reloadKey={reloadKey}
          />
        )}

        {/* Autopilot Virtual Cursor */}
        <VirtualCursor
          isRunning={autopilotRunning}
          targetPosition={targetCursorPos}
          onComplete={handleAutopilotComplete}
        />
        
        <div className="relative z-50">
          <Dock 
              notifications={notifications}
              onClearNotifications={handleClearNotifications}
              onExtractWidget={handleWidgetExtract}
              onDismissNotification={handleDismissNotification}
          />
        </div>
      </div>
    </MusicProvider>
  );
}