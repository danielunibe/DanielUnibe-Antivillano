import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { sfx } from '../../utils/SoundManager';
import { ASSETS } from '../../config/assets';
import { useLocale } from '../profile/useLocale';
import { Icons } from '../StackScreen/assets/Icons';
import { GoBackButton } from '../../components/ui/GoBackButton';
import { LootMapEmblem } from './emblem';
import {
    CAREER_MAP_BACKGROUND,
    getAdjacentCareerMilestone,
    getCareerMapLanePosition,
    getCareerMapVisualState,
    getHeroChapter,
    getSortedCareerMilestones,
    type CareerMapAction,
    type CareerMilestoneType,
} from './model';

const CAREER_MAP_NATURAL_WIDTH = 3000;
const CAREER_MAP_NATURAL_HEIGHT = 1012;
const EDGE_PAN_THRESHOLD = 96;
const EDGE_PAN_MAX_SPEED = 7;
const SIDE_BUTTON_PAN_SPEED = 6;
const DETAIL_CARD_WIDTH = 320;
const DETAIL_CARD_GAP = 24;
const DETAIL_CARD_H_GAP = 48;
const DETAIL_CARD_MARGIN = 8;

const LANE_STROKE: Record<CareerMilestoneType, string> = {
    education: '#00F0FF',
    experience: '#F2D019',
    recognition: '#A3E635',
    project: '#F2D019',
};

const CLOUD_LAYERS = [
    { src: ASSETS.CLOUDS[0], top: '7%', width: '10vw', duration: 150, delay: -28 },
    { src: ASSETS.CLOUDS[1], top: '26%', width: '7vw', duration: 190, delay: -95 },
    { src: ASSETS.CLOUDS[0], top: '48%', width: '8.5vw', duration: 170, delay: -140 },
    { src: ASSETS.CLOUDS[1], top: '68%', width: '6vw', duration: 210, delay: -45 },
    { src: ASSETS.CLOUDS[0], top: '86%', width: '11vw', duration: 160, delay: -120 },
];

interface LootMapScreenProps {
    onClose: () => void;
    onOpenStack: () => void;
    onOpenProjects: () => void;
}

export const LootMapScreen: React.FC<LootMapScreenProps> = ({ onClose, onOpenStack, onOpenProjects }) => {
    const { t, text } = useLocale();
    const milestones = useMemo(() => getSortedCareerMilestones(), []);
    const [activeMilestoneId, setActiveMilestoneId] = useState(milestones[0]?.id ?? '');
    const [openMilestoneId, setOpenMilestoneId] = useState<string | null>(null);
    const [isCardHiding, setIsCardHiding] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const mapViewportRef = useRef<HTMLElement>(null);
    const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
    const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const dragState = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number } | null>(null);
    const pointerPosRef = useRef<{ x: number } | null>(null);
    const sidePanRef = useRef<{ direction: -1 | 1; active: boolean } | null>(null);
    const activeMilestone = useMemo(
        () => milestones.find(milestone => milestone.id === activeMilestoneId) ?? milestones[0],
        [activeMilestoneId, milestones],
    );
    const activeChapter = getHeroChapter(activeMilestone.chapter);
    const activeIndex = milestones.findIndex(milestone => milestone.id === activeMilestone.id) + 1;
    const letterByMilestoneId = useMemo(() => {
        const map = new Map<string, string>();
        milestones.forEach((milestone, index) => map.set(milestone.id, String.fromCharCode(65 + index)));
        return map;
    }, [milestones]);
    const positionByMilestoneId = useMemo(() => {
        const map = new Map<string, { x: number; y: number }>();
        milestones.forEach(milestone => map.set(milestone.id, getCareerMapLanePosition(milestone, milestones)));
        return map;
    }, [milestones]);
    const groupedMilestones = useMemo(() => {
        const groups = new Map<CareerMilestoneType, typeof milestones>();
        milestones.forEach(milestone => {
            const lane = groups.get(milestone.type) ?? [];
            lane.push(milestone);
            groups.set(milestone.type, lane);
        });
        return groups;
    }, [milestones]);
    const laneTypes: CareerMilestoneType[] = useMemo(
        () => [...new Set(milestones.map(milestone => milestone.type))].filter(type => groupedMilestones.get(type)!.length > 1),
        [groupedMilestones, milestones],
    );
    const globalRoute = useMemo(() => milestones.map(milestone => {
        const position = positionByMilestoneId.get(milestone.id)!;
        return `${position.x},${position.y}`;
    }).join(' '), [milestones, positionByMilestoneId]);
    const typeLabels: Record<CareerMilestoneType, string> = {
        education: t('capabilityMapEducation'),
        experience: t('capabilityMapExperience'),
        recognition: t('capabilityMapRecognition'),
        project: t('capabilityMapProject'),
    };

    const clampOffset = useCallback((x: number, y: number) => {
        const minX = Math.min(0, viewportSize.width - mapSize.width);
        const minY = Math.min(0, viewportSize.height - mapSize.height);
        return { x: Math.max(minX, Math.min(0, x)), y: Math.max(minY, Math.min(0, y)) };
    }, [viewportSize, mapSize]);

    useLayoutEffect(() => {
        const viewport = mapViewportRef.current;
        if (!viewport) return;

        const measureMap = () => {
            const width = Math.max(0, viewport.clientWidth);
            const height = Math.max(0, viewport.clientHeight);
            setViewportSize({ width, height });
            if (!width || !height) return;
            const scale = Math.max(width / CAREER_MAP_NATURAL_WIDTH, height / CAREER_MAP_NATURAL_HEIGHT);
            const displayWidth = Math.round(CAREER_MAP_NATURAL_WIDTH * scale);
            const displayHeight = Math.round(CAREER_MAP_NATURAL_HEIGHT * scale);
            setMapSize({ width: displayWidth, height: displayHeight });
            const minX = Math.min(0, width - displayWidth);
            const minY = Math.min(0, height - displayHeight);
            setOffset({
                x: Math.max(minX, Math.min(0, Math.round((width - displayWidth) / 2))),
                y: Math.max(minY, Math.min(0, Math.round((height - displayHeight) / 2))),
            });
        };

        const observer = new ResizeObserver(measureMap);
        observer.observe(viewport);
        measureMap();
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        let raf = 0;
        const loop = () => {
            const viewport = mapViewportRef.current;
            if (viewport) {
                let panX = 0;
                if (!dragState.current && pointerPosRef.current) {
                    const rect = viewport.getBoundingClientRect();
                    const pointerX = pointerPosRef.current.x;
                    const leftDistance = pointerX - rect.left;
                    const rightDistance = rect.right - pointerX;
                    if (leftDistance < EDGE_PAN_THRESHOLD) {
                        panX = (EDGE_PAN_THRESHOLD - leftDistance) / EDGE_PAN_THRESHOLD * EDGE_PAN_MAX_SPEED;
                    } else if (rightDistance < EDGE_PAN_THRESHOLD) {
                        panX = -((EDGE_PAN_THRESHOLD - rightDistance) / EDGE_PAN_THRESHOLD * EDGE_PAN_MAX_SPEED);
                    }
                }
                if (panX === 0 && sidePanRef.current?.active) {
                    panX = sidePanRef.current.direction * SIDE_BUTTON_PAN_SPEED;
                }
                if (panX !== 0) {
                    setOffset(prev => clampOffset(prev.x + panX, prev.y));
                }
            }
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [clampOffset]);

    const dismissCard = useCallback(() => {
        if (!openMilestoneId) return;
        setIsCardHiding(true);
        window.setTimeout(() => {
            setIsCardHiding(false);
            setOpenMilestoneId(null);
        }, 220);
    }, [openMilestoneId]);

    const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
        if (event.button !== 0) return;
        const target = event.target as HTMLElement;
        if (target.closest('button') || target.closest('[data-detail-card]')) return;
        if (openMilestoneId) dismissCard();
        event.currentTarget.setPointerCapture(event.pointerId);
        dragState.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: offset.x, originY: offset.y };
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
        pointerPosRef.current = { x: event.clientX };
        const drag = dragState.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        setOffset(clampOffset(drag.originX + (event.clientX - drag.startX), drag.originY + (event.clientY - drag.startY)));
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLElement>) => {
        if (dragState.current?.pointerId === event.pointerId) dragState.current = null;
    };

    const handleWheel = (event: React.WheelEvent<HTMLElement>) => {
        event.preventDefault();
        setOffset(prev => clampOffset(prev.x - event.deltaX, prev.y - event.deltaY));
    };

    const handleLootMapClose = useCallback(() => {
        if (isClosing) return;
        sfx.play('CLICK');
        setIsClosing(true);
        window.setTimeout(onClose, 300);
    }, [isClosing, onClose]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                if (openMilestoneId) {
                    dismissCard();
                } else {
                    handleLootMapClose();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dismissCard, handleLootMapClose, openMilestoneId]);

    const handleRoute = useCallback((action: CareerMapAction) => {
        if (!action) return;
        sfx.play('CLICK');
        if (action === 'STACK') onOpenStack();
        if (action === 'PROJECTS') onOpenProjects();
    }, [onOpenProjects, onOpenStack]);

    const handleMapKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        const direction = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
            ? -1
            : event.key === 'ArrowRight' || event.key === 'ArrowDown'
                ? 1
                : 0;

        if (!direction) return;
        event.preventDefault();
        const nextMilestone = getAdjacentCareerMilestone(activeMilestone.id, direction as -1 | 1);
        setActiveMilestoneId(nextMilestone.id);
        setOpenMilestoneId(nextMilestone.id);
        window.requestAnimationFrame(() => document.getElementById(`career-milestone-${nextMilestone.id}`)?.focus());
    };

    const primaryActionLabel = activeMilestone.action === 'STACK'
        ? t('capabilityMapOpenStack')
        : activeMilestone.action === 'PROJECTS'
            ? t('capabilityMapOpenProjects')
            : null;

    const openMilestone = openMilestoneId ? (milestones.find(milestone => milestone.id === openMilestoneId) ?? null) : null;
    const cardGeometry = useMemo(() => {
        if (!openMilestone || !mapSize.width || !viewportSize.width) return null;
        const position = positionByMilestoneId.get(openMilestone.id);
        if (!position) return null;
        const nodeX = offset.x + (position.x / 100) * mapSize.width;
        const nodeY = offset.y + (position.y / 100) * mapSize.height;
        const cardWidth = Math.min(DETAIL_CARD_WIDTH, viewportSize.width - DETAIL_CARD_MARGIN * 2);
        const placeAbove = nodeY > viewportSize.height * 0.55;
        const placeRight = nodeX <= viewportSize.width / 2;
        const left = placeRight
            ? Math.max(DETAIL_CARD_MARGIN, Math.min(nodeX + DETAIL_CARD_H_GAP, viewportSize.width - cardWidth - DETAIL_CARD_MARGIN))
            : Math.max(DETAIL_CARD_MARGIN, Math.min(nodeX - cardWidth - DETAIL_CARD_H_GAP, viewportSize.width - cardWidth - DETAIL_CARD_MARGIN));
        const arrowLeft = placeRight
            ? DETAIL_CARD_MARGIN + 12
            : cardWidth - DETAIL_CARD_MARGIN - 12;
        return { left, placeAbove, nodeX, nodeY, arrowLeft, cardWidth };
    }, [mapSize.width, viewportSize.width, offset, openMilestone, positionByMilestoneId]);

    const [mapSrc, setMapSrc] = useState(CAREER_MAP_BACKGROUND);

    return (
        <div data-screen="loot-map" className={`fixed inset-0 z-[200] overflow-hidden bg-[#050505] text-white select-none ${isClosing ? 'animate-out fade-out duration-300' : 'animate-stack-entry'}`}>
            <div className="interface-dot-grid" />
            <div className="interface-screen-vignette" />
            <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(rgba(255,255,255,0.035)_50%,rgba(0,0,0,0.16)_50%)] bg-[length:100%_4px] opacity-20" />

            {/* TOP CENTER SECTION TITLE - 100% Mathematically and visually centered */}
            <div className="pointer-events-none absolute inset-x-0 top-3 z-40 flex flex-col items-center justify-center text-center animate-fade-up delay-100 sm:top-4">
                <div className="flex flex-col items-center justify-center text-center -skew-x-[6deg]">
                    <h1
                        className="font-['Bebas_Neue','Anton','Teko',sans-serif] text-3xl sm:text-4xl md:text-5xl font-bold uppercase italic leading-none tracking-wider text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] whitespace-nowrap"
                        style={{ textShadow: '2px 2px 0 #000, 0 0 16px rgba(0,240,255,0.45)' }}
                    >
                        <span className="text-[#00F0FF]">FAST TRAVEL</span>
                        <span className="mx-2 text-[#F2D019]">///</span>
                        <span className="text-white">MAPA PLANETARIO</span>
                    </h1>
                    <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.35em] font-bold text-[#F2D019] uppercase mt-0.5">
                        PANDORA SECTOR EXPLORATION // CAREER NAV
                    </span>
                </div>
            </div>

            <main
                ref={mapViewportRef}
                className="absolute inset-0 z-10 cursor-grab touch-none overflow-hidden active:cursor-grabbing"
                aria-label={t('capabilityMapNavigation')}
                onKeyDown={handleMapKeyDown}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={() => { pointerPosRef.current = null; }}
                onWheel={handleWheel}
            >
                <div
                    className="absolute left-0 top-0 will-change-transform select-none"
                    style={{
                        width: mapSize.width > 0 ? `${mapSize.width}px` : '100%',
                        height: mapSize.height > 0 ? `${mapSize.height}px` : '100%',
                        transform: `translate(${offset.x}px, ${offset.y}px)`,
                    }}
                >
                    <img
                        src={mapSrc}
                        onError={() => setMapSrc(ASSETS.STRUCTURES.MAPA)}
                        alt="Tactical Loot Map"
                        width={CAREER_MAP_NATURAL_WIDTH}
                        height={CAREER_MAP_NATURAL_HEIGHT}
                        className="absolute inset-0 h-full w-full object-cover"
                        draggable={false}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(5,7,13,0.45)_100%)]" />

                    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                        <polyline points={globalRoute} fill="none" stroke="#FFFFFF" strokeOpacity="0.28" strokeWidth="0.35" strokeDasharray="1.2 1.4" vectorEffect="non-scaling-stroke" />
                        {laneTypes.map(type => {
                            const points = groupedMilestones.get(type)!.map(milestone => {
                                const position = positionByMilestoneId.get(milestone.id)!;
                                return `${position.x},${position.y}`;
                            }).join(' ');
                            return (
                                <polyline
                                    key={type}
                                    points={points}
                                    fill="none"
                                    stroke={LANE_STROKE[type]}
                                    strokeOpacity="0.6"
                                    strokeWidth="0.4"
                                    strokeDasharray="1.6 1.2"
                                    vectorEffect="non-scaling-stroke"
                                />
                            );
                        })}
                    </svg>

                    {laneTypes.filter(type => type !== 'experience' && type !== 'recognition').map(type => (
                        <div
                            key={type}
                            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 border-l-2 bg-black/72 px-2 py-1 font-mono text-[8px] font-black uppercase tracking-[0.18em] sm:text-[9px]"
                            style={{ left: '1.5%', top: `${positionByMilestoneId.get(groupedMilestones.get(type)![0].id)!.y}%`, borderColor: LANE_STROKE[type], color: LANE_STROKE[type] }}
                        >
                            {typeLabels[type]}
                        </div>
                    ))}

                    {milestones.map(milestone => {
                        const visualState = getCareerMapVisualState(milestone, activeMilestone.id);
                        const isSelected = visualState === 'selected';
                        const position = positionByMilestoneId.get(milestone.id)!;
                        const laneColor = LANE_STROKE[milestone.type];
                        const labelPosition = position.x < 18
                            ? 'left-0 translate-x-0'
                            : position.x > 82
                                ? 'right-0 translate-x-0'
                                : 'left-1/2 -translate-x-1/2';
                        return (
                            <button
                                type="button"
                                id={`career-milestone-${milestone.id}`}
                                key={milestone.id}
                                aria-label={`${t('capabilityMapSelect')}: ${text(milestone.title)}, ${text(milestone.date)}`}
                                aria-pressed={isSelected}
                                className="group absolute z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-transparent p-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2D019]"
                                style={{ left: `${position.x}%`, top: `${position.y}%` }}
                                onClick={() => { setActiveMilestoneId(milestone.id); setIsCardHiding(false); setOpenMilestoneId(milestone.id); sfx.play('CLICK'); }}
                            >
                                <span className={`absolute inset-0 rounded-full blur-md transition-opacity duration-200 motion-reduce:transition-none ${isSelected ? 'bg-[#F2D019] opacity-70 motion-safe:animate-pulse' : visualState === 'verified' ? 'bg-[#00F0FF] opacity-25 group-hover:opacity-60' : 'bg-white/30 opacity-20'}`} />
                                <span className={`relative flex h-9 w-9 items-center justify-center border-2 font-['Teko'] text-xl font-black leading-none transition-transform duration-200 motion-reduce:transition-none ${isSelected ? 'scale-125 border-white bg-[#F2D019] text-black' : visualState === 'verified' ? 'group-hover:scale-110' : 'border-white/45 bg-black/85 text-white/90 group-hover:scale-110'}`} style={visualState === 'verified' ? { borderColor: laneColor, backgroundColor: 'rgba(0,0,0,0.85)', color: laneColor } : undefined}>
                                    {letterByMilestoneId.get(milestone.id)}
                                </span>
                                <span className={`pointer-events-none absolute top-10 hidden whitespace-nowrap border border-[#F2D019]/30 bg-black/88 px-2 py-1 text-center sm:block ${labelPosition} ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus:opacity-100'}`}>
                                    <span className="block max-w-48 truncate font-['Teko'] text-sm font-bold leading-none tracking-wider text-white">{text(milestone.title)}</span>
                                    <span className="block font-mono text-[7px] uppercase tracking-[0.16em] text-[#00F0FF]">{text(milestone.date)}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                <GoBackButton
                    onClick={handleLootMapClose}
                    isClosing={isClosing}
                    className="absolute left-4 top-4 z-50"
                    ariaLabel={t('close')}
                    title={t('close')}
                />

                <button
                    type="button"
                    className="absolute left-2 top-1/2 z-40 flex h-16 w-10 -translate-y-1/2 items-center justify-center border border-[#00F0FF]/40 bg-black/70 text-[#00F0FF] transition hover:bg-[#00F0FF] hover:text-black"
                    onPointerEnter={() => { sidePanRef.current = { direction: 1, active: true }; }}
                    onPointerLeave={() => { if (sidePanRef.current?.direction === 1) sidePanRef.current = null; }}
                    onClick={() => setOffset(prev => clampOffset(prev.x + 220, prev.y))}
                    aria-label="Desplazar mapa a la izquierda"
                >
                    <span className="text-xl font-black leading-none">&lt;</span>
                </button>
                <button
                    type="button"
                    className="absolute right-2 top-1/2 z-40 flex h-16 w-10 -translate-y-1/2 items-center justify-center border border-[#00F0FF]/40 bg-black/70 text-[#00F0FF] transition hover:bg-[#00F0FF] hover:text-black"
                    onPointerEnter={() => { sidePanRef.current = { direction: -1, active: true }; }}
                    onPointerLeave={() => { if (sidePanRef.current?.direction === -1) sidePanRef.current = null; }}
                    onClick={() => setOffset(prev => clampOffset(prev.x - 220, prev.y))}
                    aria-label="Desplazar mapa a la derecha"
                >
                    <span className="text-xl font-black leading-none">&gt;</span>
                </button>

                <div className="pointer-events-none absolute inset-0 z-[15] overflow-hidden" aria-hidden="true" style={{ transform: `translateX(${offset.x}px)` }}>
                    {CLOUD_LAYERS.map((cloud, index) => (
                        <img
                            key={index}
                            src={cloud.src}
                            alt=""
                            draggable={false}
                            loading="lazy"
                            className="animate-cloud-across absolute left-0 mix-blend-screen"
                            style={{
                                top: cloud.top,
                                width: cloud.width,
                                height: 'auto',
                                animationDuration: `${cloud.duration}s`,
                                animationDelay: `${cloud.delay}s`,
                            }}
                        />
                    ))}
                </div>

                {cardGeometry && activeMilestone && (
                    <div
                        data-detail-card
                        role="region"
                        aria-label={activeMilestone.title ? text(activeMilestone.title) : undefined}
                        aria-live="polite"
                        className="pointer-events-none absolute z-30 transition-all duration-200 ease-out motion-reduce:transition-none"
                        style={{
                            left: cardGeometry.left,
                            top: cardGeometry.nodeY,
                            opacity: isCardHiding ? 0 : 1,
                            transform: `${isCardHiding ? 'scale(0.95)' : ''} ${cardGeometry.placeAbove ? `translateY(calc(-100% - ${DETAIL_CARD_GAP}px))` : `translateY(${DETAIL_CARD_GAP}px)`}`,
                        }}
                    >
                        <div
                            className="pointer-events-auto relative overflow-hidden border border-white/15 bg-black/70 shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                            style={{ width: cardGeometry.cardWidth }}
                        >
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" aria-hidden="true" />
                            <LootMapEmblem className="pointer-events-none absolute -bottom-16 -right-12 h-64 w-auto rotate-12 text-[#F2D019]/40 opacity-60" />

                            <div className="relative flex items-center gap-3 border-b border-white/10 px-4 py-2">
                                <p className="font-mono text-[8px] font-black uppercase tracking-[0.19em] text-[#F2D019]/80">{text(activeChapter.shortTitle)}</p>
                                <p className="ml-auto font-mono text-[8px] font-black uppercase tracking-[0.16em] text-white/50">{String(activeIndex).padStart(2, '0')} / {String(milestones.length).padStart(2, '0')}</p>
                            </div>

                            <div className="relative px-4 pt-3">
                                <h2 className="font-['Teko'] text-2xl font-black uppercase leading-none tracking-wide text-[#F2D019]">{text(activeMilestone.title)}</h2>
                                {activeMilestone.role && <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-white/75">{text(activeMilestone.role)}</p>}
                            </div>

                            <div className="relative px-4 py-3">
                                <p className="flex items-center gap-2 font-mono text-[8px] font-black uppercase tracking-[0.19em] text-[#00F0FF]/80">
                                    <span aria-hidden="true" className="inline-block h-px w-5 bg-[#00F0FF]/50" />
                                    {t('capabilityMapVerified')}
                                </p>
                                <p className="mt-2 font-['Roboto_Mono'] text-[11px] leading-relaxed text-white/70">{text(activeMilestone.evidence)}</p>
                            </div>

                            <div className="relative flex items-center gap-3 border-t border-white/10 px-4 py-2">
                                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-white/50">{text(activeMilestone.date)}</p>
                                <div className="ml-auto flex items-center gap-2">
                                    {activeMilestone.thumbnail && <img src={activeMilestone.thumbnail} alt={activeMilestone.thumbnailAlt ? text(activeMilestone.thumbnailAlt) : ''} width={72} height={48} loading="lazy" className="h-12 w-[72px] border border-white/15 object-cover" />}
                                    {primaryActionLabel && <button type="button" onClick={() => handleRoute(activeMilestone.action)} className="min-h-10 bg-[#00F0FF] px-3 font-['Teko'] text-base font-black uppercase tracking-wider text-black transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{primaryActionLabel}</button>}
                                </div>
                            </div>
                        </div>

                        <span
                            aria-hidden="true"
                            className="absolute left-0 h-0 w-0 border-x-[7px]"
                            style={{
                                left: cardGeometry.arrowLeft,
                                top: cardGeometry.placeAbove ? undefined : '-10px',
                                bottom: cardGeometry.placeAbove ? '-10px' : undefined,
                                borderLeftColor: 'transparent',
                                borderRightColor: 'transparent',
                                borderTop: cardGeometry.placeAbove ? `10px solid rgba(255,255,255,0.22)` : 'none',
                                borderBottom: cardGeometry.placeAbove ? 'none' : `10px solid rgba(255,255,255,0.22)`,
                            }}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};