import React, { useCallback, useEffect, useRef, useState } from 'react';

type RkTrack = {
    id: string;
    t: string;
    a: string;
    src: string;
    cover: string;
    dur: number;
};

const STORAGE_INDEX = 'rk-last-track';

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
const STORAGE_VOLUME = 'rk-volume';

const FALLBACK_TRACKS: RkTrack[] = [
    {
        id: 'anti-villano',
        t: 'Anti-Villano',
        a: 'danielunibe',
        src: '/assets/audio/music/anti-villano.mp3',
        cover: '/assets/audio/covers/anti-villano.jpg',
        dur: 204,
    },
    {
        id: 'anti-villano-x',
        t: 'Anti-Villano X Anti-villano',
        a: 'danielunibe',
        src: '/assets/audio/music/anti-villano-x.mp3',
        cover: '/assets/audio/covers/anti-villano-x.jpg',
        dur: 178,
    },
    {
        id: 'anti-villano-x2',
        t: 'Anti-Villano X Anti-villano',
        a: 'danielunibe',
        src: '/assets/audio/music/anti-villano-x2.mp3',
        cover: '/assets/audio/covers/anti-villano-x2.jpg',
        dur: 221,
    },
    {
        id: 'not-the-role-they-gave',
        t: 'Not the role they gave',
        a: 'danielunibe',
        src: '/assets/audio/music/not-the-role-they-gave.mp3',
        cover: '/assets/audio/covers/not-the-role-they-gave.jpg',
        dur: 192,
    },
    {
        id: 'not-the-role-they-gave-alt',
        t: 'Not the role they gave (Alt)',
        a: 'danielunibe',
        src: '/assets/audio/music/not-the-role-they-gave-alt.mp3',
        cover: '/assets/audio/covers/not-the-role-they-gave-alt.jpg',
        dur: 185,
    },
    {
        id: 'nucleo-del-exilio',
        t: 'Nucleo del Exilio',
        a: 'danielunibe',
        src: '/assets/audio/music/nucleo-del-exilio.mp3',
        cover: '/assets/audio/covers/nucleo-del-exilio.jpg',
        dur: 167,
    },
    {
        id: 'patio-de-chatarra',
        t: 'Patio de Chatarra',
        a: 'danielunibe',
        src: '/assets/audio/music/patio-de-chatarra.mp3',
        cover: '/assets/audio/covers/patio-de-chatarra.jpg',
        dur: 198,
    },
];

const formatTime = (secs: number) => {
    if (!Number.isFinite(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export interface RadioKairosPlayerProps {
    isWorld?: boolean;
    onTrackChange?: (track: { title: string; artist: string; cover: string }) => void;
    globalMuted?: boolean;
    ducked?: boolean;
    muted?: boolean;
    arrowsEnabled?: boolean;
}

export const RadioKairosPlayer: React.FC<RadioKairosPlayerProps> = ({
    onTrackChange,
    globalMuted = false,
    muted = false,
}) => {
    const [tracks, setTracks] = useState<RkTrack[]>(FALLBACK_TRACKS);
    const [curIdx, setCurIdx] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [vol, setVol] = useState(() => {
        const saved = localStorage.getItem(STORAGE_VOLUME);
        return saved !== null ? Math.max(0, Math.min(1, parseFloat(saved))) : 0.8;
    });
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState<number>(0); // 0 off, 1 todo, 2 una
    const [isOpen, setIsOpen] = useState(false);
    const [coverGradient, setCoverGradient] = useState<string | null>(null);

    const currentTrack = tracks[curIdx] || FALLBACK_TRACKS[0];

    const closeTimerRef = useRef<number | null>(null);
    const playerRef = useRef<HTMLDivElement | null>(null);
    const miniBarRef = useRef<HTMLDivElement | null>(null);
    const pBarRef = useRef<HTMLDivElement | null>(null);

    // WebAudio Context refs
    const audioCtxRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    const srcNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const curBufRef = useRef<AudioBuffer | null>(null);
    const bufCacheRef = useRef<Map<string, AudioBuffer>>(new Map());

    const posBaseRef = useRef(0);
    const startAtRef = useRef(0);
    const isPlayingRef = useRef(false);
    const curIdxRef = useRef(0);
    const tracksRef = useRef<RkTrack[]>(FALLBACK_TRACKS);
    const repeatRef = useRef(0);
    const shuffleRef = useRef(false);
    const volRef = useRef(vol);
    const isMutedRef = useRef(globalMuted || muted);

    isPlayingRef.current = isPlaying;
    curIdxRef.current = curIdx;
    tracksRef.current = tracks;
    repeatRef.current = repeat;
    shuffleRef.current = shuffle;
    volRef.current = vol;
    isMutedRef.current = globalMuted || muted;

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

    // Load dynamic playlist from playlist.json
    useEffect(() => {
        let mounted = true;
        fetch('/playlist.json', { cache: 'no-cache' })
            .then(res => (res.ok ? res.json() : Promise.reject(new Error('no playlist'))))
            .then(data => {
                if (!mounted || !data?.tracks || !Array.isArray(data.tracks) || data.tracks.length === 0) return;
                const loaded: RkTrack[] = data.tracks.map((t: { id?: string; title?: string; artist?: string; src?: string; cover?: string }, index: number) => ({
                    id: t.id || `track-${index}`,
                    t: t.title || 'Pista sin título',
                    a: t.artist || 'danielunibe',
                    src: t.src || '',
                    cover: t.cover || '/assets/audio/covers/anti-villano.jpg',
                    dur: 180,
                }));
                setTracks(loaded);
                tracksRef.current = loaded;

                const savedIdx = localStorage.getItem(STORAGE_INDEX);
                if (savedIdx !== null) {
                    const parsed = parseInt(savedIdx, 10);
                    if (!isNaN(parsed) && parsed >= 0 && parsed < loaded.length) {
                        setCurIdx(parsed);
                        curIdxRef.current = parsed;
                    }
                }
            })
            .catch(() => {
                /* fallback already active */
            });

        return () => {
            mounted = false;
        };
    }, []);

    // Ensure Audio Context
    const ensureAudio = useCallback(() => {
        if (audioCtxRef.current) {
            if (audioCtxRef.current.state === 'suspended') {
                void audioCtxRef.current.resume();
            }
            return audioCtxRef.current;
        }
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AC) return null;
        const ctx = new AC();
        const master = ctx.createGain();
        master.gain.value = isMutedRef.current ? 0 : volRef.current * 0.9;
        master.connect(ctx.destination);

        audioCtxRef.current = ctx;
        masterGainRef.current = master;
        return ctx;
    }, []);

    const stopSrc = useCallback(() => {
        if (srcNodeRef.current) {
            try {
                srcNodeRef.current.stop();
                srcNodeRef.current.disconnect();
            } catch {
                /* noop */
            }
            srcNodeRef.current = null;
        }
    }, []);

    const startSrc = useCallback((offset: number) => {
        const ctx = audioCtxRef.current;
        const buf = curBufRef.current;
        const master = masterGainRef.current;
        if (!ctx || !buf || !master) return;

        stopSrc();
        const s = ctx.createBufferSource();
        s.buffer = buf;
        s.connect(master);
        const off = Math.max(0, Math.min(offset, buf.duration - 0.05));
        s.start(0, off);
        srcNodeRef.current = s;
    }, [stopSrc]);

    const curPos = useCallback(() => {
        if (!isPlayingRef.current || !audioCtxRef.current) return posBaseRef.current;
        return posBaseRef.current + (audioCtxRef.current.currentTime - startAtRef.current);
    }, []);

    const loadBuffer = useCallback(async (tr: RkTrack, autoStart: boolean) => {
        let buf = bufCacheRef.current.get(tr.src);
        if (!buf) {
            try {
                const resp = await fetch(tr.src, { cache: 'no-store' });
                const ab = await resp.arrayBuffer();
                const ctx = ensureAudio();
                if (!ctx) return;
                buf = await ctx.decodeAudioData(ab);
                bufCacheRef.current.set(tr.src, buf);
            } catch {
                return;
            }
        }
        if (!buf) return;
        const current = tracksRef.current[curIdxRef.current];
        if (!current || current.src !== tr.src) return;

        curBufRef.current = buf;
        tr.dur = buf.duration;
        setTracks(prev => [...prev]);

        if (autoStart && isPlayingRef.current && audioCtxRef.current) {
            posBaseRef.current = 0;
            startAtRef.current = audioCtxRef.current.currentTime;
            startSrc(0);
        }
    }, [ensureAudio, startSrc]);

    const play = useCallback(() => {
        const ctx = ensureAudio();
        if (!ctx) return;
        void ctx.resume();
        setIsPlaying(true);
        isPlayingRef.current = true;
        document.body.classList.add('is-playing');

        startAtRef.current = ctx.currentTime;
        if (curBufRef.current) {
            startSrc(posBaseRef.current);
        } else {
            const tr = tracksRef.current[curIdxRef.current];
            if (tr) void loadBuffer(tr, true);
        }
    }, [ensureAudio, loadBuffer, startSrc]);

    const pause = useCallback(() => {
        if (!isPlayingRef.current) return;
        posBaseRef.current = curPos();
        setIsPlaying(false);
        isPlayingRef.current = false;
        document.body.classList.remove('is-playing');
        stopSrc();
    }, [curPos, stopSrc]);

    const togglePlay = useCallback(() => {
        if (isPlayingRef.current) pause();
        else play();
    }, [pause, play]);

    const nextIndex = useCallback(() => {
        const list = tracksRef.current;
        if (shuffleRef.current && list.length > 1) {
            let next: number;
            do {
                next = Math.floor(Math.random() * list.length);
            } while (next === curIdxRef.current);
            return next;
        }
        return (curIdxRef.current + 1) % list.length;
    }, []);

    const loadTrack = useCallback((index: number, autoPlay = true) => {
        const list = tracksRef.current;
        if (!list.length) return;
        const nextIdx = ((index % list.length) + list.length) % list.length;
        setCurIdx(nextIdx);
        curIdxRef.current = nextIdx;
        localStorage.setItem(STORAGE_INDEX, String(nextIdx));

        posBaseRef.current = 0;
        setProgress(0);
        stopSrc();

        const tr = list[nextIdx];
        if (tr) {
            onTrackChange?.({ title: tr.t, artist: tr.a, cover: tr.cover });
            void loadBuffer(tr, autoPlay);
            if (autoPlay) {
                const ctx = ensureAudio();
                if (ctx) {
                    void ctx.resume();
                    setIsPlaying(true);
                    isPlayingRef.current = true;
                    document.body.classList.add('is-playing');
                    startAtRef.current = ctx.currentTime;
                }
            }
        }
    }, [ensureAudio, loadBuffer, onTrackChange, stopSrc]);

    const handleNext = useCallback(() => {
        loadTrack(nextIndex(), isPlayingRef.current);
    }, [loadTrack, nextIndex]);

    const handlePrev = useCallback(() => {
        if (curPos() > 3) {
            posBaseRef.current = 0;
            if (audioCtxRef.current) startAtRef.current = audioCtxRef.current.currentTime;
            if (isPlayingRef.current) startSrc(0);
        } else {
            loadTrack(curIdxRef.current - 1, isPlayingRef.current);
        }
    }, [curPos, loadTrack, startSrc]);

    const toggleShuffle = useCallback(() => {
        setShuffle(prev => !prev);
    }, []);

    const cycleRepeat = useCallback(() => {
        setRepeat(prev => (prev + 1) % 3);
    }, []);

    // Apply Volume
    const handleVolChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const v = parseFloat(e.target.value);
        setVol(v);
        volRef.current = v;
        localStorage.setItem(STORAGE_VOLUME, String(v));
        if (masterGainRef.current && audioCtxRef.current) {
            const target = isMutedRef.current ? 0 : v * 0.9;
            masterGainRef.current.gain.setTargetAtTime(target, audioCtxRef.current.currentTime, 0.05);
        }
    }, []);

    useEffect(() => {
        if (masterGainRef.current && audioCtxRef.current) {
            const target = (globalMuted || muted) ? 0 : vol * 0.9;
            masterGainRef.current.gain.setTargetAtTime(target, audioCtxRef.current.currentTime, 0.05);
        }
    }, [globalMuted, muted, vol]);

    // Track progression loop
    useEffect(() => {
        let raf = 0;
        const tick = () => {
            raf = requestAnimationFrame(tick);
            const tr = tracksRef.current[curIdxRef.current];
            const p = curPos();
            if (tr && tr.dur > 0) {
                setProgress(p);
                if (isPlayingRef.current && p >= tr.dur) {
                    if (repeatRef.current === 2) {
                        posBaseRef.current = 0;
                        if (audioCtxRef.current) startAtRef.current = audioCtxRef.current.currentTime;
                        startSrc(0);
                    } else if (repeatRef.current === 1 || curIdxRef.current + 1 < tracksRef.current.length) {
                        loadTrack(nextIndex(), true);
                    } else {
                        pause();
                        posBaseRef.current = 0;
                        setProgress(0);
                    }
                }
            }
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [curPos, loadTrack, nextIndex, pause, startSrc]);

    // Keyboard Space shortcut
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
            if (e.code === 'Space') {
                e.preventDefault();
                togglePlay();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [togglePlay]);

    // Seek handler for bars
    const handleSeek = useCallback((el: HTMLElement, clientX: number) => {
        const rect = el.getBoundingClientRect();
        if (rect.width <= 0) return;
        const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
        const tr = tracksRef.current[curIdxRef.current];
        if (!tr || !tr.dur) return;
        const targetSecs = ratio * tr.dur;
        posBaseRef.current = targetSecs;
        setProgress(targetSecs);
        if (audioCtxRef.current) {
            startAtRef.current = audioCtxRef.current.currentTime;
        }
        if (isPlayingRef.current) {
            startSrc(targetSecs);
        }
    }, [startSrc]);

    const handleSeekStart = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        handleSeek(el, e.clientX);
        const onMove = (ev: PointerEvent) => handleSeek(el, ev.clientX);
        const onUp = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
    }, [handleSeek]);

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

    const duration = currentTrack.dur || 180;
    const progressPct = Math.min(Math.max((progress / duration) * 100, 0), 100);

    return (
        <>
            {/* 1. BARRA INFERIOR DELGADA (DOCK) */}
            <div className="dock" />

            {/* 2. REPRODUCTOR FLOTANTE */}
            <div
                id="player"
                ref={playerRef}
                className={`${isOpen ? 'open' : ''} ${isPlaying ? 'playing' : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Panel expandido */}
                <div className="panel">
                    <div className="p-head">
                        <img className="p-art" id="pArt" src={currentTrack.cover} alt="Carátula del álbum" />
                        <div className="p-meta">
                            <div id="pTitle">{currentTrack.t}</div>
                            <div id="pArtist">{currentTrack.a}</div>
                            <span className="p-tag">Sonando ahora</span>
                        </div>
                    </div>

                    <div className="p-bar">
                        <span className="t" id="tCur">{formatTime(progress)}</span>
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
                        <span className="t" id="tTot">{formatTime(duration)}</span>
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
                            onClick={togglePlay}
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
                            className={`ctl ${repeat > 0 ? 'active' : ''} ${repeat === 2 ? 'one' : ''}`}
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
                            value={vol}
                            onChange={handleVolChange}
                            style={{ '--v': `${vol * 100}%` } as React.CSSProperties}
                            aria-label="Volumen"
                        />
                    </div>

                    <div className="p-list-title">
                        <span>Cola de reproducción</span>
                        <span id="countLbl">{tracks.length} pistas</span>
                    </div>
                    <ul className="p-list" id="list">
                        {tracks.map((t, idx) => (
                            <li
                                key={t.id}
                                className={idx === curIdx ? 'active' : ''}
                                onClick={() => loadTrack(idx, true)}
                            >
                                <span className="idx">{idx + 1}</span>
                                <span className="eq"><i></i><i></i><i></i></span>
                                <img src={t.cover} alt="" />
                                <span className="d">{formatTime(t.dur || 0)}</span>
                                <span className="t">{t.t}<em>{t.a}</em></span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Barra mini */}
                <div className="mini">
                    <button type="button" className="art" id="artBtn" onClick={handleArtClick} aria-label="Ampliar reproductor">
                        <img id="miniArt" src={currentTrack.cover} alt="Carátula" />
                    </button>
                    <div className="mini-col">
                        <div className="mini-head">
                            <span className="time" id="miniTime">{formatTime(progress)} / {formatTime(duration)}</span>
                            <span className="title" id="miniTitle">{currentTrack.t} — {currentTrack.a}</span>
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