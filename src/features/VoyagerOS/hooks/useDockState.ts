import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { PanInfo } from 'framer-motion';
import { useGeminiSearch } from './useGeminiSearch';

type ActiveView = 'default' | 'search' | 'notifications';

interface UseDockStateProps {
  onExtractWidget?: (x: number, y: number) => void;
}

export const useDockState = ({ onExtractWidget }: UseDockStateProps) => {
  const [activeView, setActiveView] = useState<ActiveView>('default');
  const [searchText, setSearchText] = useState('');
  
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  // Controls the "Regeneration" of the dock icon after drag out
  const [isRegeneratingMusic, setIsRegeneratingMusic] = useState(false);

  const [dockOffset] = useState(0); 
  const [notificationsPanelStyle, setNotificationsPanelStyle] = useState({});
  const [searchResultsPanelStyle, setSearchResultsPanelStyle] = useState({});
  const [musicPanelStyle, setMusicPanelStyle] = useState({});
  const [startMenuStyle, setStartMenuStyle] = useState({});

  const dockRef = useRef<HTMLDivElement>(null);
  const musicButtonRef = useRef<HTMLDivElement>(null);
  const windowsButtonRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLDivElement>(null);
  const notificationsButtonRef = useRef<HTMLDivElement>(null);

  const capsuleBadgeRef = useRef<HTMLDivElement>(null);
  const calendarPanelRef = useRef<HTMLDivElement>(null);
  const notificationsPanelRef = useRef<HTMLDivElement>(null);
  const searchResultsPanelRef = useRef<HTMLDivElement>(null);
  const musicPanelRef = useRef<HTMLDivElement>(null);
  const startMenuRef = useRef<HTMLDivElement>(null);

  const { search, isSearching, searchResponse, searchSources, clearSearch } = useGeminiSearch();

  const handleSearchSubmit = () => {
    if (!searchText.trim() || isSearching) return;
    setIsResultsOpen(true);
    search(searchText);
  };

  const handleCloseActiveView = () => {
    setActiveView('default');
    setSearchText('');
    setIsResultsOpen(false);
    clearSearch();
  };

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (isCalendarOpen && 
          calendarPanelRef.current && !calendarPanelRef.current.contains(target) && 
          capsuleBadgeRef.current && !capsuleBadgeRef.current.contains(target)) {
          setIsCalendarOpen(false);
      }

      if (isMusicOpen &&
          musicPanelRef.current && !musicPanelRef.current.contains(target) &&
          musicButtonRef.current && !musicButtonRef.current.contains(target)) {
          setIsMusicOpen(false);
      }

      if (isStartMenuOpen && 
          startMenuRef.current && !startMenuRef.current.contains(target) && 
          windowsButtonRef.current && !windowsButtonRef.current.contains(target)) {
          setIsStartMenuOpen(false);
      }

      let isClickOutside = true;
      if (dockRef.current?.contains(target)) isClickOutside = false;
      if (activeView === 'notifications' && notificationsPanelRef.current?.contains(target)) isClickOutside = false;
      if (isResultsOpen && searchResultsPanelRef.current?.contains(target)) isClickOutside = false;

      if (activeView !== 'default' && isClickOutside) handleCloseActiveView();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCalendarOpen, activeView, isResultsOpen, isMusicOpen, isStartMenuOpen]);
  
  // Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (activeView !== 'default') handleCloseActiveView();
        if (isCalendarOpen) setIsCalendarOpen(false);
        if (isMusicOpen) setIsMusicOpen(false);
        if (isStartMenuOpen) setIsStartMenuOpen(false);
      }
      if (event.key === 'Meta' || event.key === 'OS') { // Typical Windows Key
        setIsStartMenuOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView, isCalendarOpen, isMusicOpen, isStartMenuOpen]);

  // Panel Positioning Logic
  useLayoutEffect(() => {
    const dockRect = dockRef.current?.getBoundingClientRect();
    if (!dockRect) return;

    if (activeView === 'notifications' && notificationsButtonRef.current) {
         const notifRect = notificationsButtonRef.current.getBoundingClientRect();
         const panelWidth = 320;
         const leftPos = (notifRect.left + notifRect.width / 2 - dockRect.left) - (panelWidth / 2); 
         setNotificationsPanelStyle({ left: `${leftPos}px`, width: `${panelWidth}px` });
    }
    
    if (isResultsOpen) {
        const panelWidth = 500;
        setSearchResultsPanelStyle({ left: `${(dockRect.width/2) - (panelWidth/2)}px` });
    }

    if (isMusicOpen && musicButtonRef.current) {
        const btnRect = musicButtonRef.current.getBoundingClientRect();
        const relativeLeft = btnRect.left - dockRect.left + (btnRect.width / 2);
        setMusicPanelStyle({ left: `${relativeLeft - 160}px` });
    }

    if (isStartMenuOpen) {
        const panelWidth = 580;
        setStartMenuStyle({ left: `${(dockRect.width/2) - (panelWidth/2)}px` });
    }
  }, [activeView, isResultsOpen, isMusicOpen, isStartMenuOpen, dockOffset]);

  const handleMusicClick = () => {
      if (isRegeneratingMusic) return;
      setIsMusicOpen(!isMusicOpen);
      setIsCalendarOpen(false);
      setIsStartMenuOpen(false);
      handleCloseActiveView();
  };

  const handleMusicDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if ((info.offset.y < -35 || Math.abs(info.offset.x) > 60) && onExtractWidget) {
          onExtractWidget(info.point.x, info.point.y);
          setIsMusicOpen(false);
          setIsRegeneratingMusic(true);
          setTimeout(() => {
             setIsRegeneratingMusic(false);
          }, 1000); 
      }
  };

  const handleSearchClick = () => {
      setActiveView('search'); 
      setIsCalendarOpen(false); 
      setIsMusicOpen(false);
      setIsStartMenuOpen(false);
  };

  const handleNotificationsClick = () => {
      setActiveView(prev => prev === 'notifications' ? 'default' : 'notifications'); 
      setIsCalendarOpen(false); 
      setIsMusicOpen(false);
      setIsStartMenuOpen(false);
  };

  const handleWindowsClick = () => {
      setIsStartMenuOpen(prev => !prev);
      setIsCalendarOpen(false);
      setIsMusicOpen(false);
      handleCloseActiveView();
  };

  return {
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
  };
};
