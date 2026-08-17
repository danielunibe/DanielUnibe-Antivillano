import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { ProfileBadge } from './ProfileBadge';
import { WhiteCapsuleBadge } from './WhiteCapsuleBadge';
import { MusicPlayerPill } from './MusicPlayerPill';
import { Tooltip } from './Tooltip';
import { AppIconButton } from './dock/AppIconButton';
import { WindowsIcon } from './WindowsIcon';
import { SearchCircleButton } from './dock/SearchCircleButton';
import { NotificationCircleButton } from './dock/NotificationCircleButton';

import { CalendarPanel } from './CalendarPanel';
import { NotificationsPanel } from './NotificationsPanel';
import { SearchResultsPanel } from './SearchResultsPanel';
import { MusicPanel } from './MusicPanel';
import { StartMenu } from './StartMenu'; 
import { SearchView } from './dock/views/SearchView';
import { NotificationsDockView } from './dock/views/NotificationsDockView';
import { viewAnimation } from './dock/animations';

import { Notification } from '../types';
import { useDockState } from '../hooks/useDockState';

interface DockProps {
    notifications: Notification[];
    onClearNotifications: () => void;
    onExtractWidget?: (x: number, y: number) => void;
    onDismissNotification: (id: number) => void;
}

const ICON_SIZE = 38; 

export const Dock: React.FC<DockProps> = ({ 
  notifications, 
  onClearNotifications, 
  onExtractWidget, 
  onDismissNotification 
}) => {
  const {
    activeView,
    searchText,
    setSearchText,
    isCalendarOpen,
    setIsCalendarOpen,
    isResultsOpen,
    setIsResultsOpen,
    isMusicOpen,
    setIsMusicOpen,
    isStartMenuOpen,
    setIsStartMenuOpen,
    isRegeneratingMusic,
    dockOffset,
    notificationsPanelStyle,
    searchResultsPanelStyle,
    musicPanelStyle,
    startMenuStyle,
    dockRef,
    musicButtonRef,
    windowsButtonRef,
    searchButtonRef,
    notificationsButtonRef,
    capsuleBadgeRef,
    calendarPanelRef,
    notificationsPanelRef,
    searchResultsPanelRef,
    musicPanelRef,
    startMenuRef,
    isSearching,
    searchResponse,
    searchSources,
    handleSearchSubmit,
    handleCloseActiveView,
    handleMusicClick,
    handleMusicDragEnd,
    handleSearchClick,
    handleNotificationsClick,
    handleWindowsClick,
  } = useDockState({ onExtractWidget });

  const dispatchLaunchInfo = (appName: string, description: string) => {
    const event = new CustomEvent('system-notification', {
      detail: {
        title: `Abriendo ${appName}`,
        message: description
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <motion.div
        className="relative"
        animate={{ x: dockOffset }}
        transition={{ type: 'spring', stiffness: 350, damping: 35 }}
    >
        <div className="relative">
            <AnimatePresence>
                {isCalendarOpen && activeView === 'default' && <CalendarPanel ref={calendarPanelRef} />}
                {isMusicOpen && activeView === 'default' && !isRegeneratingMusic && <MusicPanel ref={musicPanelRef} style={musicPanelStyle} />}
                {isStartMenuOpen && <StartMenu ref={startMenuRef} style={startMenuStyle} />}
                
                {activeView === 'notifications' && (
                    <NotificationsPanel 
                        ref={notificationsPanelRef} 
                        style={notificationsPanelStyle}
                        notifications={notifications}
                        onClear={onClearNotifications}
                        onDismiss={onDismissNotification}
                    />
                )}
                {isResultsOpen && (
                    <SearchResultsPanel
                        ref={searchResultsPanelRef}
                        style={searchResultsPanelStyle}
                        isLoading={isSearching}
                        response={searchResponse}
                        sources={searchSources}
                    />
                )}
            </AnimatePresence>

            <motion.div
                ref={dockRef}
                className="relative rounded-full"
                layout
                transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            >
                <div
                    className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-[60px]"
                    style={{ boxShadow: '0px 40px 70px -20px rgba(0, 0, 0, 0.7), inset 0px 1px 1.5px rgba(255, 255, 255, 0.18)' }}
                />

                <div className="relative z-10 flex items-center p-1 px-1.5">
                    <AnimatePresence mode="popLayout">
                        {activeView === 'search' ? (
                            <SearchView
                                onClose={handleCloseActiveView}
                                searchText={searchText}
                                setSearchText={setSearchText}
                                onSubmit={handleSearchSubmit}
                                isSearching={isSearching}
                            />
                        ) : activeView === 'notifications' ? (
                            <NotificationsDockView onClose={handleCloseActiveView} count={notifications.length} />
                        ) : (
                            <motion.div className="flex items-center gap-1 sm:gap-1.5" key="dock-icons" {...viewAnimation}>
                                
                                <Tooltip label="Profile">
                                    <ProfileBadge size={ICON_SIZE} />
                                </Tooltip>
                                
                                <div className="w-px bg-white/10 self-center mx-0.5 h-6" />
                                
                                <AnimatePresence mode='wait'>
                                    {isRegeneratingMusic ? (
                                        <motion.div
                                            key="placeholder"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center justify-center"
                                            style={{ width: ICON_SIZE, height: ICON_SIZE }}
                                        >
                                            <motion.div 
                                                className="w-6 h-6 rounded-full border border-dashed border-white/20 bg-white/5"
                                                animate={{ rotate: 180, scale: [1, 0.9, 1] }}
                                                transition={{ 
                                                    rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                                                    scale: { duration: 1, repeat: Infinity }
                                                }}
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="music-pill"
                                            ref={musicButtonRef}
                                            initial={{ scale: 0, opacity: 0, rotate: -180 }}
                                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                            drag
                                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                            dragElastic={0.2}
                                            dragSnapToOrigin={true}
                                            onDragEnd={handleMusicDragEnd}
                                            whileDrag={{ scale: 1.15, zIndex: 100, rotate: 5 }}
                                            className="touch-none"
                                        >
                                            <Tooltip label="Now Playing" enableJumpAnimation>
                                                <MusicPlayerPill size={ICON_SIZE} onClick={handleMusicClick} isOpen={isMusicOpen} />
                                            </Tooltip>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                                <Tooltip label="File Explorer" enableJumpAnimation>
                                    <AppIconButton 
                                        size={ICON_SIZE} 
                                        iconUrl="https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/7f1b8eb89f4332e3639c72fe31ccca12_low_res_Windows_File_Explorer.png" 
                                        alt="Files" 
                                        onClick={() => dispatchLaunchInfo('File Explorer', 'Navegando y preparando el sistema de archivos de VoyagerOS...')}
                                    />
                                </Tooltip>
                                <Tooltip label="Creative Studio" enableJumpAnimation>
                                    <AppIconButton 
                                        size={ICON_SIZE} 
                                        iconUrl="https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/df9a283090ea9acf17ac48891d2ca1ce_0qKddJKQeG.png" 
                                        alt="Studio" 
                                        onClick={() => dispatchLaunchInfo('Creative Studio', 'Inicializando el motor gráfico Voyager-Render v4...')}
                                    />
                                </Tooltip>
                                <Tooltip label="Terminal" enableJumpAnimation>
                                    <AppIconButton 
                                        size={ICON_SIZE} 
                                        iconUrl="https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/75a91b2cdac5d2777076863bc246789e_cA31CaSncF.png" 
                                        alt="Terminal" 
                                        onClick={() => dispatchLaunchInfo('Terminal Core', 'Shell bash conectado con privilegios de root@voyageros.')}
                                    />
                                </Tooltip>
                                <Tooltip label="Gallery" enableJumpAnimation>
                                    <AppIconButton 
                                        size={ICON_SIZE} 
                                        iconUrl="https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/c3be764d323d03b2ce9921be92216fca_yrypldfXBR.png" 
                                        alt="Gallery" 
                                        onClick={() => dispatchLaunchInfo('Biblioteca de Fotos', 'Cargando visuales, renders 3D e imágenes del sistema...')}
                                    />
                                </Tooltip>
                                
                                {/* INDIVIDUAL SEARCH CIRCULAR BUTTON */}
                                <Tooltip label="Buscar en VoyagerOS" enableJumpAnimation>
                                    <div ref={searchButtonRef} className="flex items-center justify-center">
                                        <SearchCircleButton 
                                            size={ICON_SIZE * 0.84}
                                            isActive={activeView === 'search'}
                                            onClick={handleSearchClick}
                                        />
                                    </div>
                                </Tooltip>

                                {/* STANDALONE WINDOWS START ICON (IN THE MIDDLE) */}
                                <Tooltip label="Menú Inicio (Windows)" enableJumpAnimation>
                                    <div ref={windowsButtonRef} className="flex items-center justify-center">
                                        <WindowsIcon 
                                            size={ICON_SIZE}
                                            onClick={handleWindowsClick}
                                        />
                                    </div>
                                </Tooltip>

                                {/* INDIVIDUAL NOTIFICATIONS CIRCULAR BUTTON */}
                                <Tooltip label="Centro de Notificaciones" enableJumpAnimation>
                                    <div ref={notificationsButtonRef} className="flex items-center justify-center">
                                        <NotificationCircleButton 
                                            size={ICON_SIZE * 0.84}
                                            isActive={activeView === 'notifications'}
                                            notificationCount={notifications.length}
                                            onClick={handleNotificationsClick}
                                        />
                                    </div>
                                </Tooltip>
                                
                                <Tooltip label="USB Drive" enableJumpAnimation>
                                    <AppIconButton 
                                        size={ICON_SIZE} 
                                        iconUrl="https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/4bbdc4219ff8ed6f1eeb9346243a3004_low_res_USB.png" 
                                        alt="USB Drive" 
                                        onClick={() => dispatchLaunchInfo('Unidad USB', 'Medios extraíbles detectados y montados de forma segura.')}
                                    />
                                </Tooltip>

                                <div className="w-px bg-white/10 self-center mx-0.5 h-6" />
                                
                                <Tooltip label="System Tray & Calendar">
                                    <div ref={capsuleBadgeRef}>
                                        <WhiteCapsuleBadge height={ICON_SIZE} onClick={() => { setIsCalendarOpen(!isCalendarOpen); setIsMusicOpen(false); setIsStartMenuOpen(false); }} />
                                    </div>
                                </Tooltip>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    </motion.div>
  );
};
