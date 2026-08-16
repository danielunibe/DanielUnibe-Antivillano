
import React, { Suspense, useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Horizon } from './components/environment/Horizon';
import { Floor } from './components/environment/Floor';
import { IntroScreen } from './components/ui/IntroScreen';
import { OverlayEffects } from './components/ui/OverlayEffects';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { useParallaxScroll } from './hooks/useParallaxScroll';
import { RadioKairosPlayer } from './components/ui/RadioKairosPlayer';
import { SectorNavButton } from './components/ui/SectorNavButton';
import { InteractionProvider } from './features/InteractionSystem';
import { MusicPlayerProvider } from './features/music/MusicPlayerContext';
import { RUNTIME_FLAGS } from './config/runtimeFlags';
import { ExperienceProvider, useExperience } from './features/experience/ExperienceContext';
import { MissionTracker } from './features/experience/MissionTracker';
import type { ExperienceMode, SectorId, WorldTargetId } from './features/experience/types';
import { SECTOR_BY_INDEX } from './features/experience/model';
import { getPrimaryTargetForSector, getWorldTargetStates } from './features/experience/targets';
import { ProfileScreen } from './features/profile/ProfileScreen';
import { LocaleProvider } from './features/profile/locale';
import { useLocale } from './features/profile/useLocale';
import { PROFILE_DATA } from './features/profile/data';
import { ASSETS } from './config/assets';
import { sfx } from './utils/SoundManager';

const ThreeSky = React.lazy(() => import('./components/environment/ThreeSky').then((module) => ({ default: module.ThreeSky })));
const StackScreen = React.lazy(() => import('./features/StackScreen').then((module) => ({ default: module.StackScreen })));
const LootMapScreen = React.lazy(() => import('./features/LootMapScreen').then((module) => ({ default: module.LootMapScreen })));
const ProjectsScreen = React.lazy(() => import('./features/ProjectsScreen').then((module) => ({ default: module.ProjectsScreen })));
const ContactScreen = React.lazy(() => import('./features/ContactScreen').then((module) => ({ default: module.ContactScreen })));
const CreditsScreen = React.lazy(() => import('./features/CreditsScreen').then((module) => ({ default: module.CreditsScreen })));
const RecruiterScreen = React.lazy(() => import('./features/experience/RecruiterScreen').then((module) => ({ default: module.RecruiterScreen })));

type InterfaceType = 'NONE' | 'PROFILE' | 'STACK' | 'LOOTMAP' | 'PROJECTS' | 'CONTACT' | 'CREDITS' | 'RECRUITER';

const SKY_GRADIENT = 'linear-gradient(180deg, #3aa3dd -24%, #8fc7dc 38%, #e8c48a 78%, #f2d5a4 100%)';

const AppContent: React.FC = () => {
    // Always start with the IntroScreen on every page load (no session persistence).
    const [hasStarted, setHasStarted] = useState(false);
    const [activeInterface, setActiveInterface] = useState<InterfaceType>('NONE');
    const [selectedProjectId, setSelectedProjectId] = useState(301);
    const [selectedTargetId, setSelectedTargetId] = useState<WorldTargetId | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const modalRef = useRef<HTMLDivElement>(null);
    const lastTriggerRef = useRef<HTMLElement | null>(null);
    const settingsButtonRef = useRef<HTMLButtonElement>(null);
    const touchStartXRef = useRef<number | null>(null);
    const { locale, setLocale, t } = useLocale();
    
    const { viewerRef, scrollRef, activeIndex, scrollToSection } = useParallaxScroll();
    const {
        mode,
        completedObjectives,
        startExperience,
        markObjective,
        markSector,
        resetProgress,
    } = useExperience();
    const activeSector = SECTOR_BY_INDEX[activeIndex] ?? 'NORTH';
    const worldTargetStates = useMemo(
        () => getWorldTargetStates(completedObjectives, selectedTargetId, activeSector),
        [activeSector, completedObjectives, selectedTargetId],
    );


    // --- OPTIMIZED HANDLERS (useCallback) ---
    // Prevents unnecessary re-renders of children when App state (like activeIndex) changes.
    
    const handleStart = useCallback((experienceMode: ExperienceMode) => {
        startExperience(experienceMode);
        setSelectedTargetId(null);
        setHasStarted(true);
        setActiveInterface(experienceMode === 'QUICK' ? 'RECRUITER' : 'NONE');
    }, [startExperience]);

    // The panoramic viewer mounts after the intro disappears. Center only once
    // it exists so the first immersive frame is the NORTH identity target.
    useEffect(() => {
        if (!hasStarted || mode !== 'EXPLORATION') return;
        const frame = window.requestAnimationFrame(() => scrollToSection(1));
        return () => window.cancelAnimationFrame(frame);
    }, [hasStarted, mode, scrollToSection]);

    useEffect(() => {
        if (!hasStarted) return;
        const sector = SECTOR_BY_INDEX[activeIndex];
        if (sector) markSector(sector);
    }, [activeIndex, hasStarted, markSector]);

    useEffect(() => {
        if (!isSettingsOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsSettingsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSettingsOpen]);

    useEffect(() => {
        sfx.setEnabled(soundEnabled);
    }, [soundEnabled]);

    const handleToggleFullscreen = useCallback(async () => {
        try {
            if (document.fullscreenElement) {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                }
                return;
            }

            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            }
        } catch (error) {
            console.warn('Fullscreen toggle failed:', error);
        }
    }, []);

    const handleCloseInterface = useCallback(() => {
        setActiveInterface('NONE');
        setSelectedTargetId(null);
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                const trigger = lastTriggerRef.current;
                if (trigger?.isConnected) trigger.focus();
                else settingsButtonRef.current?.focus();
            });
        });
    }, []);

    const openInterface = useCallback((value: InterfaceType, trigger?: HTMLElement | null) => {
        lastTriggerRef.current = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
        setActiveInterface(value);
    }, []);
    const handleOpenStack = useCallback(() => openInterface('STACK'), [openInterface]);
    const handleOpenLootMap = useCallback(() => openInterface('LOOTMAP'), [openInterface]);
    const handleOpenProjects = useCallback(() => openInterface('PROJECTS'), [openInterface]);
    const handleOpenContact = useCallback(() => {
        markObjective('CONTACT');
        openInterface('CONTACT');
    }, [markObjective, openInterface]);
    const handleOpenCredits = useCallback(() => {
        markObjective('PROCESS');
        openInterface('CREDITS');
    }, [markObjective, openInterface]);
    const handleOpenProfile = useCallback(() => {
        markObjective('IDENTITY');
        openInterface('PROFILE');
    }, [markObjective, openInterface]);
    const handleOpenRecruiter = useCallback(() => openInterface('RECRUITER'), [openInterface]);
    const handleToggleSettings = useCallback(() => {
        setIsSettingsOpen((currentValue) => !currentValue);
    }, []);
    const handleCloseSettings = useCallback(() => {
        setIsSettingsOpen(false);
    }, []);
    const handleResetWorld = useCallback(() => {
        setIsSettingsOpen(false);
        setActiveInterface('NONE');
        scrollToSection(1);
    }, [scrollToSection]);
    const handleOpenFromSettings = useCallback((value: Exclude<InterfaceType, 'NONE'>) => {
        setIsSettingsOpen(false);
        if (value === 'PROFILE') markObjective('IDENTITY');
        if (value === 'CONTACT') markObjective('CONTACT');
        if (value === 'CREDITS') markObjective('PROCESS');
        openInterface(value, settingsButtonRef.current);
    }, [markObjective, openInterface]);
    const handleToggleSound = useCallback(() => {
        setSoundEnabled(current => !current);
    }, []);
    const handleResetProgress = useCallback(() => {
        resetProgress();
        setSelectedTargetId(null);
        setIsSettingsOpen(false);
        setActiveInterface('NONE');
        scrollToSection(1);
    }, [resetProgress, scrollToSection]);
    const handleOpenProjectById = useCallback((projectId: number) => {
        setSelectedProjectId(projectId);
        openInterface('PROJECTS');
    }, [openInterface]);

    const handleActivateWorldTarget = useCallback((targetId: WorldTargetId) => {
        setSelectedTargetId(targetId);
        sfx.play(targetId === 'IDENTITY' ? 'OPEN' : 'CLICK');

        switch (targetId) {
            case 'IDENTITY':
                handleOpenProfile();
                break;
            case 'STACK':
                handleOpenStack();
                break;
            case 'PROJECTS':
                handleOpenProjects();
                break;
            case 'PROCESS':
                handleOpenCredits();
                break;
            case 'CONTACT':
                handleOpenContact();
                break;
            case 'LOOT_MAP':
                handleOpenLootMap();
                break;
            case 'RECRUITER':
                handleOpenRecruiter();
                break;
        }
    }, [handleOpenContact, handleOpenCredits, handleOpenLootMap, handleOpenProfile, handleOpenProjects, handleOpenRecruiter, handleOpenStack]);

    useEffect(() => {
        if (activeInterface === 'NONE') return;

        const focusInitialControl = () => {
            const modal = modalRef.current;
            const initialControl = modal?.querySelector<HTMLButtonElement>('button:not([disabled])');
            if (initialControl) {
                initialControl.focus();
                focusObserver.disconnect();
            } else {
                modal?.focus();
            }
        };
        const frame = window.requestAnimationFrame(focusInitialControl);
        const focusObserver = new MutationObserver(() => focusInitialControl());
        if (modalRef.current) {
            focusObserver.observe(modalRef.current, { childList: true, subtree: true });
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                handleCloseInterface();
                return;
            }
            if (event.key !== 'Tab') return;

            const modal = modalRef.current;
            if (!modal) return;
            const focusable = Array.from(modal.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )) as HTMLElement[];
            const visibleFocusable = focusable.filter((element) => element.getAttribute('aria-hidden') !== 'true');
            if (!visibleFocusable.length) {
                event.preventDefault();
                modal.focus();
                return;
            }
            const first = visibleFocusable[0];
            const last = visibleFocusable[visibleFocusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.cancelAnimationFrame(frame);
            focusObserver.disconnect();
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeInterface, handleCloseInterface]);

    const settingsLinks: Array<{ id: string; target: Exclude<InterfaceType, 'NONE'>; label: string; code: string }> = [
        { id: 'profile', target: 'PROFILE', label: t('profile'), code: 'ID' },
        { id: 'projects', target: 'PROJECTS', label: t('projects'), code: 'QST' },
        { id: 'stack', target: 'STACK', label: t('stack'), code: 'KIT' },
        { id: 'loot-map', target: 'LOOTMAP', label: t('lootMap'), code: 'MAP' },
        { id: 'contact', target: 'CONTACT', label: t('contact'), code: 'COM' },
        { id: 'credits', target: 'CREDITS', label: t('credits'), code: 'LOG' },
        { id: 'recruiter', target: 'RECRUITER', label: t('recruiter'), code: 'PRO' },
    ];

    const settingsPanel = hasStarted && activeInterface === 'NONE'
        ? createPortal(
<>
                  <button
                      type="button"
                      onClick={handleOpenProfile}
                      aria-label={t('profile')}
                      title={t('profile')}
                      className="fixed right-4 top-4 z-[12100] block transition-transform duration-200 hover:scale-105 active:scale-95 group overflow-visible"
                      style={{ width: 'min(112px, 18vw)', height: 'min(104px, 16.7vw)' }}
                  >
                      <div className="relative h-full w-full">
                          <div
                              className="absolute overflow-hidden"
                              style={{
                                  top: '12%',
                                  left: '11%',
                                  right: '16%',
                                  bottom: '12%',
                                  borderRadius: '8%',
                              }}
                          >
                              <img
                                  src={PROFILE_DATA.portrait}
                                  alt={t('profile')}
                                  draggable="false"
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                          </div>
                          <img
                              src={ASSETS.INTERFACE.PROFILE_FRAME}
                              alt=""
                              aria-hidden="true"
                              draggable="false"
                              className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
                          />
                      </div>
                  </button>

                  {/* Level bar — to the right of the profile image */}
                  <div
                      className="pointer-events-none fixed z-[12150] select-none"
                      style={{
                          right: '12px',
                          top: '30px',
                          width: '56px',
                          clipPath: 'polygon(8% 0, 100% 0, 100% 84%, 92% 100%, 0 100%, 0 16%)',
                          background: 'linear-gradient(180deg, rgba(20,20,20,0.92) 0%, rgba(5,5,5,0.88) 100%)',
                          border: '2px solid #F2D019',
                          boxShadow: '0 0 12px rgba(242,208,25,0.35), inset 0 0 8px rgba(0,0,0,0.9)',
                      }}
                      aria-hidden="true"
                  >
                      <div
                          className="flex items-center justify-between px-1.5 pb-0.5 pt-1.5"
                          style={{
                              background: 'linear-gradient(90deg, rgba(242,208,25,0.28) 0%, rgba(242,208,25,0.05) 100%)',
                              borderBottom: '1px solid rgba(242,208,25,0.35)',
                          }}
                      >
                          <span className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-[#F2D019] [text-shadow:0_1px_0_#000]">LVL</span>
                          <span className="font-mono text-[10px] font-black text-[#00F0FF] [text-shadow:0_0_6px_rgba(0,240,255,0.8),0_1px_0_#000]">42</span>
                      </div>
                      <div className="flex gap-[2px] px-1.5 pb-1.5 pt-1">
                          {[0, 1, 2, 3, 4].map((i) => (
                              <div
                                  key={i}
                                  className="relative flex-1"
                                  style={{
                                      height: '9px',
                                      clipPath: 'polygon(15% 0, 100% 0, 100% 70%, 85% 100%, 0 100%, 0 30%)',
                                      background: i < 3
                                          ? 'linear-gradient(180deg, #FFE94D 0%, #F2D019 55%, #C8A800 100%)'
                                          : 'rgba(242,208,25,0.10)',
                                      border: '1px solid rgba(242,208,25,0.55)',
                                      boxShadow: i < 3 ? '0 0 6px rgba(242,208,25,0.6)' : 'none',
                                  }}
                              />
                          ))}
                      </div>
                  </div>
                  <div className={`fixed right-4 bottom-4 z-[12000] max-md:bottom-4 ${isSettingsOpen ? 'max-md:inset-x-3' : 'max-md:right-3'}`}>
                  <button
                      ref={settingsButtonRef}
                      type="button"
                      className="group flex h-11 w-11 items-center justify-center border border-[#F2D019]/35 bg-black/75 text-[#F2D019] backdrop-blur-md transition hover:border-[#F2D019] hover:bg-[#F2D019] hover:text-black"
                      style={{ clipPath: 'polygon(14% 0, 100% 0, 100% 86%, 86% 100%, 0 100%, 0 14%)' }}
                      onClick={handleToggleSettings}
                      aria-label={t('systemMenu')}
                      aria-expanded={isSettingsOpen}
                      aria-controls="system-settings-panel"
                      title={t('systemMenu')}
                  >
                      <span className="font-mono text-[9px] font-black tracking-[0.12em]">CFG</span>
                  </button>

                  {isSettingsOpen && (
                      <div
                          id="system-settings-panel"
                          className="mt-3 w-[min(348px,100%)] border border-[#F2D019]/25 bg-black/92 p-3 text-white shadow-[0_0_28px_rgba(0,0,0,0.55)] backdrop-blur-md max-md:w-full"
                          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 92% 100%, 0 100%)' }}
                      >
                          <div className="flex items-center justify-between border-b border-[#F2D019]/15 pb-2">
                              <div>
                                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-[#00F0FF]">{t('systemMenu')}</p>
                                  <p className="font-['Teko'] text-2xl font-bold uppercase tracking-wider text-[#F2D019]">{t('configuration')}</p>
                              </div>
                              <button
                                  type="button"
                                  onClick={handleCloseSettings}
                                  className="border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/70 transition hover:border-white/25 hover:text-white"
                              >
                                  ESC
                              </button>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                              {settingsLinks.map(link => (
                                  <button
                                      key={link.id}
                                      type="button"
                                      onClick={() => handleOpenFromSettings(link.target)}
                                      className="flex min-h-11 items-center justify-between border border-white/10 bg-white/5 px-3 py-2 text-left transition hover:border-[#00F0FF]/60 hover:bg-[#00F0FF]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F2D019]"
                                  >
                                      <span className="font-['Teko'] text-xl font-bold uppercase leading-none tracking-wider text-white">{link.label}</span>
                                      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">{link.code}</span>
                                  </button>
                              ))}
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                              <button
                                  type="button"
                                  onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
                                  className="flex min-h-11 items-center justify-between border border-white/10 bg-white/5 px-3 py-2 text-left transition hover:border-[#F2D019]/60 hover:bg-[#F2D019]/10"
                              >
                                  <span className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-white/70">{t('language')}</span>
                                  <span className="font-['Teko'] text-xl font-bold uppercase text-[#F2D019]">{locale.toUpperCase()}</span>
                              </button>
                              <button
                                  type="button"
                                  onClick={handleToggleSound}
                                  className="flex min-h-11 items-center justify-between border border-white/10 bg-white/5 px-3 py-2 text-left transition hover:border-[#00F0FF]/60 hover:bg-[#00F0FF]/10"
                              >
                                  <span className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-white/70">{t('sound')}</span>
                                  <span className="font-['Teko'] text-xl font-bold uppercase text-[#00F0FF]">{soundEnabled ? t('soundOn') : t('soundOff')}</span>
                              </button>
                              <button
                                  type="button"
                                  onClick={handleResetWorld}
                                  className="flex w-full items-center justify-between border border-white/10 bg-white/5 px-3 py-2 text-left transition hover:border-[#F2D019]/60 hover:bg-[#F2D019]/10"
                              >
                                  <span className="font-['Teko'] text-xl font-bold uppercase tracking-wider text-white">{t('resetWorld')}</span>
                                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">{t('reset')}</span>
                              </button>
                              <button
                                  type="button"
                                  onClick={handleResetProgress}
                                  className="flex w-full items-center justify-between border border-white/10 bg-white/5 px-3 py-2 text-left transition hover:border-[#ef4444]/60 hover:bg-[#ef4444]/10"
                              >
                                  <span className="font-['Teko'] text-xl font-bold uppercase tracking-wider text-white">{t('resetProgress')}</span>
                                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">{t('clear')}</span>
                              </button>
                          </div>
                      </div>
                  )}
</div>
              </>,
              document.body,
          )
        : null;

    const handleNavigatePrev = useCallback(() => {
        scrollToSection(Math.max(0, activeIndex - 1));
    }, [activeIndex, scrollToSection]);

    const handleNavigateNext = useCallback(() => {
        scrollToSection(Math.min(2, activeIndex + 1));
    }, [activeIndex, scrollToSection]);

    const handleSelectActiveSector = useCallback(() => {
        handleActivateWorldTarget(getPrimaryTargetForSector(activeSector, worldTargetStates));
    }, [activeSector, handleActivateWorldTarget, worldTargetStates]);

    useEffect(() => {
        if (!hasStarted || activeInterface !== 'NONE') return;

        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
            const key = event.key.toLowerCase();

            if (key === 'a' || event.key === 'ArrowLeft') {
                event.preventDefault();
                handleNavigatePrev();
            } else if (key === 'd' || event.key === 'ArrowRight') {
                event.preventDefault();
                handleNavigateNext();
            } else if (event.key === 'Enter') {
                event.preventDefault();
                handleSelectActiveSector();
            } else if (key === 'm') {
                event.preventDefault();
                setIsSettingsOpen(true);
            } else if (event.key === 'Escape') {
                setIsSettingsOpen(false);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [activeInterface, handleNavigateNext, handleNavigatePrev, handleSelectActiveSector, hasStarted]);

    const activeModal = useMemo(() => {
        switch (activeInterface) {
            case 'PROFILE':
                return <ProfileScreen onClose={handleCloseInterface} onOpenProjects={handleOpenProjects} onOpenStack={handleOpenStack} onOpenProcess={handleOpenCredits} onOpenContact={handleOpenContact} onOpenRecruiter={handleOpenRecruiter} />;
            case 'STACK':
                return <StackScreen onClose={handleCloseInterface} onInspectCapability={() => markObjective('STACK')} />;
case 'LOOTMAP':
                return <LootMapScreen onClose={handleCloseInterface} onOpenStack={handleOpenStack} onOpenProjects={handleOpenProjects} />;
            case 'PROJECTS':
                return <ProjectsScreen onClose={handleCloseInterface} initialProjectId={selectedProjectId} onInspectProject={() => markObjective('PROJECTS')} />;
            case 'CONTACT':
                return <ContactScreen onClose={handleCloseInterface} />;
            case 'CREDITS':
                return <CreditsScreen onClose={handleCloseInterface} completedObjectives={completedObjectives.length} totalObjectives={5} onOpenContact={handleOpenContact} onOpenProjects={handleOpenProjects} onResetProgress={handleResetProgress} />;
            case 'RECRUITER':
                return <RecruiterScreen onClose={handleCloseInterface} onOpenProject={handleOpenProjectById} onOpenStack={handleOpenStack} onOpenContact={handleOpenContact} onOpenProfile={handleOpenProfile} />;
            default:
                return null;
        }
    }, [activeInterface, completedObjectives.length, handleCloseInterface, handleOpenContact, handleOpenCredits, handleOpenProfile, handleOpenProjectById, handleOpenProjects, handleOpenRecruiter, handleOpenStack, handleResetProgress, markObjective, selectedProjectId]);

    const previousSector: SectorId = activeIndex === 2 ? 'NORTH' : 'WEST';
    const nextSector: SectorId = activeIndex === 0 ? 'NORTH' : 'EAST';
    const previousSectorLabel = activeIndex === 2 ? t('north') : t('west');
    const nextSectorLabel = activeIndex === 0 ? t('north') : t('east');

    return (
            <MusicPlayerProvider enabled={hasStarted} ducked={activeInterface !== 'NONE' && activeInterface !== 'CREDITS'} muted={!soundEnabled}>
            <div className="bg-black fixed inset-0 overflow-hidden select-none font-sans text-white antialiased">
                <div className="h-full">
                    {!hasStarted ? (
                    <IntroScreen onStart={handleStart} onToggleFullscreen={handleToggleFullscreen} />
                ) : (
                <InteractionProvider>
                {/* INTERFACES (MODALS) */}
                {activeModal && (
                    <div
                        ref={modalRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label={t('interface')}
                        tabIndex={-1}
                    >
                        <Suspense fallback={<div className="fixed inset-0 z-[210] grid place-items-center bg-black text-[#F2D019] font-mono">{t('loadingInterface')}</div>}>
                            {activeModal}
                        </Suspense>
                    </div>
                )}

                <div className="contents" aria-hidden={activeInterface !== 'NONE' || undefined} inert={activeInterface !== 'NONE' || undefined}>

                {/* POST-PROCESADO */}
                <OverlayEffects />

                {/* 1. LAYER: ENVIRONMENT (FULL-WINDOW SKY; fills any area outside the 16:9 stage) */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    {RUNTIME_FLAGS.ENABLE_WEBGL_SKY ? (
                        <ErrorBoundary
                            fallback={
                                <div className="w-full h-full" style={{ background: SKY_GRADIENT }} />
                            }
                        >
                            <Suspense fallback={<div className="h-full w-full" style={{ background: SKY_GRADIENT }} />}>
                                <ThreeSky scrollRef={scrollRef} />
                            </Suspense>
                        </ErrorBoundary>
                    ) : (
                        <div className="w-full h-full" style={{ background: SKY_GRADIENT }} />
                    )}
                </div>

                {/* 2. LAYER: WORLD (locked to a bottom-anchored 16:9 stage) */}
                <div className="stage-16-9">
                    <div 
                        ref={viewerRef}
                        id="viewer" 
                        className="relative w-full h-full overflow-x-auto scroll-smooth snap-x snap-mandatory flex flex-row [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                        onTouchStart={(event) => {
                            touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
                        }}
                        onTouchEnd={(event) => {
                            const startX = touchStartXRef.current;
                            const endX = event.changedTouches[0]?.clientX;
                            touchStartXRef.current = null;
                            if (startX === null || endX === undefined || Math.abs(endX - startX) < 56) return;
                            if (endX < startX) handleNavigateNext();
                            else handleNavigatePrev();
                        }}
                    >
{/* Horizon is heavily memoized, so stable props are crucial here */}
                        <Horizon 
                            onActivateTarget={handleActivateWorldTarget}
                            targetStates={worldTargetStates}
                            activeIndex={activeIndex}
                            enableAnimations={hasStarted}
                            scrollRef={scrollRef}
                        />
                        <Floor />

                        <div className="min-w-[100%] h-full flex-shrink-0 snap-start pointer-events-none" />
                        <div className="min-w-[100%] h-full flex-shrink-0 snap-start pointer-events-none" />
                        <div className="min-w-[100%] h-full flex-shrink-0 snap-start pointer-events-none" />
                    </div>

{/* 3. LAYER: EFFECTS (moved inside Horizon so fog stays behind world UI elements) */}

                    {/* 4. LAYER: UI anchored to the world (nav arrows + mobile sector nav) */}
                    <div className="transition-opacity duration-1000 opacity-100">
                        {/* World navigation arrows (stage edges) */}
                        <div className="world-nav pointer-events-none" aria-hidden={!hasStarted}>
                            <SectorNavButton
                                sector={previousSector}
                                className="world-nav-btn-left"
                                onClick={handleNavigatePrev}
                                disabled={activeIndex === 0}
                                ariaLabel={t('goLeft')}
                                title={previousSectorLabel}
                                muted={!soundEnabled}
                            />
                            <SectorNavButton
                                sector={nextSector}
                                className="world-nav-btn-right"
                                onClick={handleNavigateNext}
                                disabled={activeIndex === 2}
                                ariaLabel={t('goRight')}
                                title={nextSectorLabel}
                                muted={!soundEnabled}
                            />
                        </div>
                        <nav className="sector-nav" aria-label={t('worldNavigation')}>
                            {[
                                { label: t('west'), index: 0 },
                                { label: t('north'), index: 1 },
                                { label: t('east'), index: 2 },
                            ].map(sector => (
                                <button
                                    key={sector.index}
                                    type="button"
                                    aria-current={activeIndex === sector.index ? 'page' : undefined}
                                    onClick={() => scrollToSection(sector.index)}
                                    className={activeIndex === sector.index ? 'is-active' : undefined}
                                >
                                    {sector.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* 5. LAYER: HUD (viewport-fixed chrome) */}
                <div className="transition-opacity duration-1000 opacity-100">
                    {settingsPanel}
                    {mode === 'EXPLORATION' && activeInterface === 'NONE' && <MissionTracker />}
                </div>

                </div>
                </InteractionProvider>
                )}
                {/* Corner logos + radio widget: visible on every screen except the intro/start screen */}
                {hasStarted && (
                <>
                <img
                    src={ASSETS.INTERFACE.CORNER_LOGO}
                    alt=""
                    aria-hidden="true"
                    className="corner-logo"
                    draggable={false}
                />
                <img
                    src={ASSETS.INTERFACE.CORNER_LOGO_RIGHT}
                    alt=""
                    aria-hidden="true"
                    className="corner-logo-right"
                    draggable={false}
                />
                <RadioKairosPlayer
                    ducked={activeInterface !== 'NONE'}
                    muted={!soundEnabled}
                    arrowsEnabled={activeInterface !== 'NONE'}
                />
                </>
                )}
                </div>
            </div>
            </MusicPlayerProvider>
    );
};

const App: React.FC = () => (
    <LocaleProvider>
        <ExperienceProvider>
            <AppContent />
        </ExperienceProvider>
    </LocaleProvider>
);

export default App;
