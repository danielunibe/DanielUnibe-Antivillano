import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useMusicPlayer } from '../../features/music/MusicPlayerContext';

function sampleCoverGradient(src: string): Promise<string | null> {
    return new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const size = 8;
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                if (!ctx) {
                    resolve(null);
                    return;
                }
                ctx.drawImage(img, 0, 0, size, size);
                const { data } = ctx.getImageData(0, 0, size, size);
                const rgb: [number, number, number][] = [];
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i + 3] < 128) continue;
                    rgb.push([data[i], data[i + 1], data[i + 2]]);
                }
                if (rgb.length < 2) {
                    resolve(null);
                    return;
                }
                const avg = (list: [number, number, number][]) => {
                    const r = list.reduce((s, c) => s + c[0], 0) / list.length;
                    const g = list.reduce((s, c) => s + c[1], 0) / list.length;
                    const b = list.reduce((s, c) => s + c[2], 0) / list.length;
                    return [Math.round(r), Math.round(g), Math.round(b)] as const;
                };
                const c1 = avg(rgb);
                let best = rgb[0];
                let bestD = -1;
                for (const c of rgb) {
                    const d = Math.abs(c[0] - c1[0]) + Math.abs(c[1] - c1[1]) + Math.abs(c[2] - c1[2]);
                    if (d > bestD) {
                        bestD = d;
                        best = c;
                    }
                }
                const c2 = best;
                resolve(`linear-gradient(90deg, rgb(${c1.join(',')}), rgb(${c2.join(',')}))`);
            } catch {
                resolve(null);
            }
        };
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

const formatTime = (secs: number) => {
    if (!Number.isFinite(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export interface RadioKairosPlayerProps {
    onTrackChange?: (track: { title: string; artist: string; cover: string }) => void;
    arrowsEnabled?: boolean;
    glassmorphism?: boolean;
}

export const RadioKairosPlayer: React.FC<RadioKairosPlayerProps> = ({
    onTrackChange,
    arrowsEnabled = true,
    glassmorphism = false,
}) => {
    const { state, api } = useMusicPlayer();
    const { status, currentIndex, playlist, volume, repeatMode, shuffle, currentTime, duration } = state;

    const isPlaying = status === 'PLAYING';
    const currentTrack = playlist[currentIndex];
    const trackTitle = currentTrack?.title ?? 'Kairos FM';
    const trackArtist = currentTrack?.artist ?? '';
    const trackCover = currentTrack?.cover ?? '/assets/audio/covers/anti-villano.jpg';

    const [isOpen, setIsOpen] = useState(false);
    const [coverGradient, setCoverGradient] = useState<string | null>(null);

    const closeTimerRef = useRef<number | null>(null);
    const playerRef = useRef<HTMLDivElement | null>(null);
    const miniBarRef = useRef<HTMLDivElement | null>(null);
    const pBarRef = useRef<HTMLDivElement | null>(null);
    const lastTrackIdRef = useRef<string | undefined>(undefined);

    // Derive animated timeline gradient from current album cover
    useEffect(() => {
        let cancelled = false;
        const cover = currentTrack?.cover;
        if (!cover) return;
        sampleCoverGradient(cover).then(gradient => {
            if (!cancelled) setCoverGradient(gradient);
        });
        return () => {
            cancelled = true;
        };
    }, [currentTrack?.cover]);

    // Notify parent when the active track changes
    useEffect(() => {
        if (!currentTrack || currentTrack.id === lastTrackIdRef.current) return;
        lastTrackIdRef.current = currentTrack.id;
        onTrackChange?.({ title: currentTrack.title, artist: currentTrack.artist ?? '', cover: currentTrack.cover ?? '' });
    }, [currentTrack, onTrackChange]);

    // Body marker for CSS-driven playback indicators
    useEffect(() => {
        if (isPlaying) document.body.classList.add('is-playing');
        else document.body.classList.remove('is-playing');
        return () => document.body.classList.remove('is-playing');
    }, [isPlaying]);

    // Keyboard Space shortcut (disabled while another interface is open)
    useEffect(() => {
        if (arrowsEnabled === false) return;
        const onKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
            if (e.code === 'Space') {
                e.preventDefault();
                void api.toggle();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [arrowsEnabled, api]);

    // Seek handler for bars
    const handleSeek = useCallback(
        (el: HTMLElement, clientX: number) => {
            const rect = el.getBoundingClientRect();
            if (rect.width <= 0) return;
            const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
            const dur = duration > 0 ? duration : currentTrack?.durationHint ?? 0;
            if (dur <= 0) return;
            api.seek(ratio * dur);
        },
        [api, currentTrack?.durationHint, duration]
    );

    const handleSeekStart = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            const el = e.currentTarget;
            handleSeek(el, e.clientX);
            const onMove = (ev: PointerEvent) => handleSeek(el, ev.clientX);
            const onUp = () => {
                window.removeEventListener('pointermove', onMove);
                window.removeEventListener('pointerup', onUp);
            };
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp);
        },
        [handleSeek]
    );

    // Hover open / close interaction with 260ms delay
    const handleMouseEnter = useCallback(() => {
        if (closeTimerRef.current) {
            window.clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
        setIsOpen(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        closeTimerRef.current = window.setTimeout(() => {
            setIsOpen(false);
        }, 260);
    }, []);

    const handleArtClick = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const handleVolChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        api.setVolume(parseFloat(e.target.value));
    }, [api]);

    const handleNext = useCallback(() => {
        void api.next();
    }, [api]);

    const handlePrev = useCallback(() => {
        void api.prev();
    }, [api]);

    const cycleRepeat = useCallback(() => {
        api.setRepeatMode(((repeatMode + 1) % 3) as 0 | 1 | 2);
    }, [api, repeatMode]);

    const toggleShuffle = useCallback(() => {
        api.setShuffle(!shuffle);
    }, [api, shuffle]);

    const handleTrackSelect = useCallback(
        (index: number) => {
            void api.setCurrentIndex(index, { autoplay: true });
        },
        [api]
    );

    const totalDuration = duration > 0 ? duration : currentTrack?.durationHint ?? 0;
    const progressPct = totalDuration > 0 ? Math.min(Math.max((currentTime / totalDuration) * 100, 0), 100) : 0;

    return (
        <>
            {/* 1. BARRA INFERIOR DELGADA (DOCK) */}
            <div className={`dock ${glassmorphism ? 'glass' : ''}`} />

            {/* 2. REPRODUCTOR FLOTANTE */}
            <div
                id="player"
                ref={playerRef}
                className={`${isOpen ? 'open' : ''} ${isPlaying ? 'playing' : ''} ${glassmorphism ? 'glass' : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Panel expandido */}
                <div className="panel">
                    <div className="p-head">
                        <img className="p-art" id="pArt" src={trackCover} alt="Carátula del álbum" />
                        <div className="p-meta">
                            <div id="pTitle">{trackTitle}</div>
                            <div id="pArtist">{trackArtist}</div>
                            <span className="p-tag">Sonando ahora</span>
                        </div>
                    </div>

                    <div className="p-bar">
                        <span className="t" id="tCur">{formatTime(currentTime)}</span>
                        <div
                            className="bar"
                            id="pBar"
                            ref={pBarRef}
                            onPointerDown={handleSeekStart}
                            style={{ '--p': `${progressPct}%` } as React.CSSProperties}
                        >
                            <div className="fill" style={coverGradient ? { '--rk-fill': coverGradient } as React.CSSProperties : undefined} />
                            <div className="knob" />
                        </div>
                        <span className="t" id="tTot">{formatTime(totalDuration)}</span>
                    </div>

                    <div className="p-controls">
                        <button
                            type="button"
                            className={`ctl ${shuffle ? 'active' : ''}`}
                            id="btnShuf"
                            onClick={toggleShuffle}
                            title="Aleatorio"
                            aria-label="Aleatorio"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 7h4l10 10h4" />
                                <path d="M3 17h4l10-10h4" />
                                <path d="M18 4l3 3-3 3" />
                                <path d="M18 14l3 3-3 3" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="ctl"
                            id="btnPrev"
                            onClick={handlePrev}
                            title="Anterior"
                            aria-label="Anterior"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 6v12L9 12z" />
                                <rect x="6" y="6" width="2" height="12" rx="1" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="ctl ctl-play"
                            id="btnPlay"
                            onClick={() => void api.toggle()}
                            title="Reproducir / Pausar"
                            aria-label="Reproducir o pausar"
                        >
                            {!isPlaying ? (
                                <svg id="icoPlay" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            ) : (
                                <svg id="icoPause" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
                                </svg>
                            )}
                        </button>
                        <button
                            type="button"
                            className="ctl"
                            id="btnNext"
                            onClick={handleNext}
                            title="Siguiente"
                            aria-label="Siguiente"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 6v12l9-6z" />
                                <rect x="16" y="6" width="2" height="12" rx="1" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className={`ctl ${repeatMode > 0 ? 'active' : ''} ${repeatMode === 2 ? 'one' : ''}`}
                            id="btnRep"
                            onClick={cycleRepeat}
                            title="Repetir"
                            aria-label="Repetir"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 1l4 4-4 4" />
                                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                                <path d="M7 23l-4-4 4-4" />
                                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                            </svg>
                            <span className="badge">1</span>
                        </button>
                    </div>

                    <div className="p-vol">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 5L6 9H2v6h4l5 4z" fill="currentColor" stroke="none" />
                            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                        </svg>
                        <input
                            type="range"
                            id="vol"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolChange}
                            style={{ '--v': `${volume * 100}%` } as React.CSSProperties}
                            aria-label="Volumen"
                        />
                    </div>

                    <div className="p-list-title">
                        <span>Cola de reproducción</span>
                        <span id="countLbl">{playlist.length} pistas</span>
                    </div>
                    <ul className="p-list" id="list">
                        {playlist.map((t, idx) => (
                            <li
                                key={t.id}
                                className={idx === currentIndex ? 'active' : ''}
                                onClick={() => handleTrackSelect(idx)}
                            >
                                <span className="idx">{idx + 1}</span>
                                <span className="eq"><i></i><i></i><i></i></span>
                                <img src={t.cover ?? '/assets/audio/covers/anti-villano.jpg'} alt="" />
                                <span className="d">{formatTime(t.durationHint ?? 0)}</span>
                                <span className="t">{t.title}<em>{t.artist}</em></span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Barra mini */}
                <div className="mini">
                    <button type="button" className="art" id="artBtn" onClick={handleArtClick} aria-label="Ampliar reproductor">
                        <img id="miniArt" src={trackCover} alt="Carátula" />
                    </button>
                    <div className="mini-col">
                        <div className="mini-head">
                            <span className="time" id="miniTime">{formatTime(currentTime)} / {formatTime(totalDuration)}</span>
                            <span className="title" id="miniTitle">{trackTitle} — {trackArtist}</span>
                        </div>
                        <div className="mini-line">
                            <div
                                className="line"
                                id="miniBar"
                                ref={miniBarRef}
                                onPointerDown={handleSeekStart}
                                style={{ '--p': `${progressPct}%` } as React.CSSProperties}
                            >
                                <div className="fill" style={coverGradient ? { '--rk-fill': coverGradient } as React.CSSProperties : undefined} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};