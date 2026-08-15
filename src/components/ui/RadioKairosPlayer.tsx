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
const STORAGE_VOLUME = 'rk-volume';

type RkRefs = {
    root: HTMLDivElement;
    cover: HTMLImageElement;
    title: HTMLSpanElement;
    artist: HTMLSpanElement;
    prog: HTMLElement;
    timeText?: HTMLSpanElement | null;
    btnPlay: HTMLButtonElement;
    icoPlay: SVGSVGElement;
    icoPause: SVGSVGElement;
    btnPrev: HTMLButtonElement;
    btnNext: HTMLButtonElement;
    btnList: HTMLButtonElement;
    drop: HTMLDivElement;
    volRange: HTMLInputElement;
    btnMute: HTMLButtonElement;
};

interface RkEngine {
    loadTrack: (i: number) => void;
    play: () => void;
    pause: () => void;
    toggle: () => void;
    toggleMute: () => void;
    setVol: (v: number) => void;
    setDucked: (d: boolean) => void;
    setGlobalMuted: (m: boolean) => void;
    seekPercent: (pct: number) => void;
    isPlaying: () => boolean;
    startLoop: () => void;
    destroy: () => void;
}

const formatTime = (secs: number) => {
    if (!Number.isFinite(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};

function createRadioEngine(
    refs: RkRefs,
    onCurIdx: (i: number) => void,
    getArrowsEnabled: () => boolean,
    tracks: RkTrack[],
): RkEngine {
    let curIdx = 0;
    let playing = false;
    let widgetMuted = false;
    let vol = 0.8;
    let globalMuted = false;
    let ducked = false;

    let ctxA: AudioContext | null = null;
    let master: GainNode | null = null;
    let analyser: AnalyserNode | null = null;
    let windGain: GainNode | null = null;
    let noiseBuf: AudioBuffer | null = null;

    let curBuf: AudioBuffer | null = null;
    let srcNode: AudioBufferSourceNode | null = null;
    const bufCache = new Map<string, AudioBuffer>();

    let posBase = 0;
    let startAt = 0;
    let rafId = 0;

    function ensureAudio() {
        if (ctxA) return;
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AC) return;
        ctxA = new AC();
        master = ctxA.createGain();
        master.gain.value = (globalMuted || widgetMuted) ? 0 : vol * 0.9;
        const comp = ctxA.createDynamicsCompressor();
        analyser = ctxA.createAnalyser();
        analyser.fftSize = 64;
        master.connect(comp);
        comp.connect(analyser);
        analyser.connect(ctxA.destination);
        noiseBuf = ctxA.createBuffer(1, ctxA.sampleRate, ctxA.sampleRate);
        const d = noiseBuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        const w = ctxA.createBufferSource();
        w.buffer = noiseBuf;
        w.loop = true;
        const wf = ctxA.createBiquadFilter();
        wf.type = 'lowpass';
        wf.frequency.value = 260;
        windGain = ctxA.createGain();
        windGain.gain.value = 0;
        const lfo = ctxA.createOscillator();
        lfo.frequency.value = 0.18;
        const lfoG = ctxA.createGain();
        lfoG.gain.value = 0.015;
        lfo.connect(lfoG);
        lfoG.connect(windGain.gain);
        lfo.start();
        w.connect(wf);
        wf.connect(windGain);
        windGain.connect(master);
        w.start();
    }

    function applyMaster() {
        if (!master || !ctxA) return;
        const m = globalMuted || widgetMuted;
        const target = m ? 0 : (ducked ? vol * 0.25 : vol * 0.9);
        master.gain.setTargetAtTime(target, ctxA.currentTime, 0.08);
    }

    function curPos() {
        if (!playing || !ctxA) return posBase;
        return posBase + (ctxA.currentTime - startAt);
    }

    function stopSrc() {
        if (srcNode) {
            try {
                srcNode.stop();
                srcNode.disconnect();
            } catch {
                /* noop */
            }
            srcNode = null;
        }
    }

    function startSrc(offset: number) {
        if (!ctxA || !curBuf) return;
        stopSrc();
        const s = ctxA.createBufferSource();
        s.buffer = curBuf;
        s.connect(master as GainNode);
        const off = Math.max(0, Math.min(offset, curBuf.duration - 0.05));
        s.start(0, off);
        srcNode = s;
    }

    async function loadBuffer(tr: RkTrack) {
        let buf = bufCache.get(tr.src);
        if (!buf) {
            try {
                const resp = await fetch(tr.src, { cache: 'no-store' });
                const ab = await resp.arrayBuffer();
                ensureAudio();
                if (!ctxA) return;
                buf = await ctxA.decodeAudioData(ab);
                bufCache.set(tr.src, buf);
            } catch {
                return;
            }
        }
        if (!buf) return;
        const current = tracks[curIdx];
        if (!current || current.src !== tr.src) return;
        curBuf = buf;
        tr.dur = buf.duration;
        if (playing && ctxA) {
            posBase = 0;
            startAt = ctxA.currentTime;
            startSrc(0);
        }
    }

    function loadTrack(i: number) {
        if (!tracks.length) return;
        curIdx = ((i % tracks.length) + tracks.length) % tracks.length;
        const tr = tracks[curIdx];
        posBase = 0;
        stopSrc();
        refs.cover.src = tr.cover;
        refs.title.textContent = tr.t;
        refs.artist.textContent = tr.a;
        refs.title.classList.remove('swap');
        void refs.title.offsetWidth;
        refs.title.classList.add('swap');
        onCurIdx(curIdx);
        void loadBuffer(tr);
    }

    function play() {
        ensureAudio();
        if (!ctxA) return;
        void ctxA.resume();
        playing = true;
        startAt = ctxA.currentTime;
        if (curBuf) startSrc(posBase);
        if (windGain) windGain.gain.setTargetAtTime(0.05, ctxA.currentTime, 0.8);
        refs.root.classList.add('playing');
        refs.icoPlay.style.display = 'none';
        refs.icoPause.style.display = 'block';
    }

    function pause() {
        if (!playing) return;
        posBase = curPos();
        playing = false;
        stopSrc();
        if (windGain && ctxA) windGain.gain.setTargetAtTime(0, ctxA.currentTime, 0.3);
        refs.root.classList.remove('playing');
        refs.icoPlay.style.display = 'block';
        refs.icoPause.style.display = 'none';
    }

    function toggle() {
        if (playing) pause();
        else play();
    }

    function toggleMute() {
        widgetMuted = !widgetMuted;
        applyMaster();
        refs.btnMute.style.opacity = widgetMuted ? '0.45' : '1';
    }

    function setVol(v: number) {
        vol = v;
        if (widgetMuted && v > 0) {
            widgetMuted = false;
            refs.btnMute.style.opacity = '1';
        }
        applyMaster();
    }

    function setDucked(d: boolean) {
        ducked = d;
        applyMaster();
    }

    function setGlobalMuted(m: boolean) {
        globalMuted = m;
        applyMaster();
    }

    function seekPercent(pct: number) {
        const tr = tracks[curIdx];
        if (!tr || !tr.dur || !curBuf || !ctxA) return;
        const targetPos = Math.max(0, Math.min(pct * tr.dur, tr.dur - 0.1));
        posBase = targetPos;
        if (playing) {
            startAt = ctxA.currentTime;
            startSrc(posBase);
        }
    }

    const onKey = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement | null;
        if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
        if (e.code === 'Space') {
            e.preventDefault();
            toggle();
        } else if (e.code === 'ArrowRight' && getArrowsEnabled()) {
            e.preventDefault();
            loadTrack(curIdx + 1);
        } else if (e.code === 'ArrowLeft' && getArrowsEnabled()) {
            e.preventDefault();
            loadTrack(curIdx - 1);
        }
    };

    function loop() {
        rafId = requestAnimationFrame(loop);
        const tr = tracks[curIdx];
        const p = curPos();
        if (tr && tr.dur > 0) {
            const pct = (Math.min(p, tr.dur) / tr.dur) * 100;
            refs.prog.style.width = `${pct}%`;
            if (refs.timeText) {
                refs.timeText.textContent = `${formatTime(p)} / ${formatTime(tr.dur)}`;
            }
        }
        if (playing && tr && tr.dur > 0 && p >= tr.dur) loadTrack(curIdx + 1);
    }

    function destroy() {
        cancelAnimationFrame(rafId);
        window.removeEventListener('keydown', onKey);
        refs.btnPlay.removeEventListener('click', onClickPlay);
        refs.btnNext.removeEventListener('click', onClickNext);
        refs.btnPrev.removeEventListener('click', onClickPrev);
        refs.btnList.removeEventListener('click', onClickList);
        refs.btnMute.removeEventListener('click', onClickMute);
        stopSrc();
        if (ctxA) void ctxA.close().catch(() => undefined);
    }

    const onClickPlay = () => toggle();
    const onClickNext = () => loadTrack(curIdx + 1);
    const onClickPrev = () => {
        if (curPos() > 4) loadTrack(curIdx);
        else loadTrack(curIdx - 1);
    };
    const onClickList = () => {
        refs.drop.classList.toggle('open');
        refs.btnList.classList.toggle('list-on');
    };
    const onClickMute = () => toggleMute();

    window.addEventListener('keydown', onKey);
    refs.btnPlay.addEventListener('click', onClickPlay);
    refs.btnNext.addEventListener('click', onClickNext);
    refs.btnPrev.addEventListener('click', onClickPrev);
    refs.btnList.addEventListener('click', onClickList);
    refs.btnMute.addEventListener('click', onClickMute);

    return {
        loadTrack,
        play,
        pause,
        toggle,
        toggleMute,
        setVol,
        setDucked,
        setGlobalMuted,
        seekPercent,
        isPlaying: () => playing,
        startLoop: () => {
            rafId = requestAnimationFrame(loop);
        },
        destroy,
    };
}

export interface RadioKairosPlayerProps {
    ducked?: boolean;
    muted?: boolean;
    arrowsEnabled?: boolean;
}

export const RadioKairosPlayer: React.FC<RadioKairosPlayerProps> = ({ ducked = false, muted = false, arrowsEnabled = false }) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const coverRef = useRef<HTMLImageElement>(null);
    const titleRef = useRef<HTMLSpanElement>(null);
    const artistRef = useRef<HTMLSpanElement>(null);
    const progRef = useRef<HTMLElement>(null);
    const timeTextRef = useRef<HTMLSpanElement>(null);
    const btnPlayRef = useRef<HTMLButtonElement>(null);
    const icoPlayRef = useRef<SVGSVGElement>(null);
    const icoPauseRef = useRef<SVGSVGElement>(null);
    const btnPrevRef = useRef<HTMLButtonElement>(null);
    const btnNextRef = useRef<HTMLButtonElement>(null);
    const btnListRef = useRef<HTMLButtonElement>(null);
    const dropRef = useRef<HTMLDivElement>(null);
    const volRef = useRef<HTMLInputElement>(null);
    const btnMuteRef = useRef<HTMLButtonElement>(null);

    const engineRef = useRef<RkEngine | null>(null);
    const [tracks, setTracks] = useState<RkTrack[]>([]);
    const [curIdx, setCurIdx] = useState(0);
    const [isHoverCorner, setIsHoverCorner] = useState(false);
    const [volState, setVolState] = useState<number>(() => {
        const saved = parseFloat(localStorage.getItem(STORAGE_VOLUME) ?? '');
        return Number.isFinite(saved) ? saved : 80;
    });

    const duckedRef = useRef(ducked);
    const mutedRef = useRef(muted);
    const arrowsRef = useRef(arrowsEnabled);

    useEffect(() => {
        duckedRef.current = ducked;
        engineRef.current?.setDucked(ducked);
    }, [ducked]);

    useEffect(() => {
        mutedRef.current = muted;
        engineRef.current?.setGlobalMuted(muted);
    }, [muted]);

    useEffect(() => {
        arrowsRef.current = arrowsEnabled;
    }, [arrowsEnabled]);

    useEffect(() => {
        if (
            !rootRef.current || !coverRef.current || !titleRef.current || !artistRef.current ||
            !progRef.current || !btnPlayRef.current || !icoPlayRef.current || !icoPauseRef.current ||
            !btnPrevRef.current || !btnNextRef.current || !btnListRef.current || !dropRef.current ||
            !volRef.current || !btnMuteRef.current
        ) {
            return;
        }
        let disposed = false;
        void (async () => {
            let list: RkTrack[] = [];
            try {
                const resp = await fetch('/playlist.json', { cache: 'no-store' });
                const data = (await resp.json()) as {
                    tracks?: Array<{ id?: string; title?: string; artist?: string; src?: string; cover?: string; durationHint?: number }>;
                };
                list = (Array.isArray(data.tracks) ? data.tracks : [])
                    .map((t, i) => ({
                        id: t.id ?? String(i),
                        t: t.title ?? '—',
                        a: t.artist ?? '—',
                        src: t.src ?? '',
                        cover: t.cover ?? '/assets/audio/covers/anti-villano.jpg',
                        dur: t.durationHint ?? 0,
                    }))
                    .filter((t) => t.src);
            } catch {
                list = [];
            }
            if (disposed) return;
            if (!list.length) return;
            setTracks(list);

            const engine = createRadioEngine(
                {
                    root: rootRef.current as HTMLDivElement,
                    cover: coverRef.current as HTMLImageElement,
                    title: titleRef.current as HTMLSpanElement,
                    artist: artistRef.current as HTMLSpanElement,
                    prog: progRef.current as HTMLElement,
                    timeText: timeTextRef.current,
                    btnPlay: btnPlayRef.current as HTMLButtonElement,
                    icoPlay: icoPlayRef.current as SVGSVGElement,
                    icoPause: icoPauseRef.current as SVGSVGElement,
                    btnPrev: btnPrevRef.current as HTMLButtonElement,
                    btnNext: btnNextRef.current as HTMLButtonElement,
                    btnList: btnListRef.current as HTMLButtonElement,
                    drop: dropRef.current as HTMLDivElement,
                    volRange: volRef.current as HTMLInputElement,
                    btnMute: btnMuteRef.current as HTMLButtonElement,
                },
                (i) => {
                    setCurIdx(i);
                    try {
                        localStorage.setItem(STORAGE_INDEX, String(i));
                    } catch {
                        /* noop */
                    }
                },
                () => arrowsRef.current,
                list,
            );
            engineRef.current = engine;
            engine.setDucked(duckedRef.current);
            engine.setGlobalMuted(mutedRef.current);
            engine.setVol(volState / 100);
            const savedIdx = parseInt(localStorage.getItem(STORAGE_INDEX) ?? '-1', 10);
            const initial = savedIdx >= 0 && savedIdx < list.length ? savedIdx : Math.floor(Math.random() * list.length);
            engine.loadTrack(initial);
            engine.startLoop();
        })();
        return () => {
            disposed = true;
            engineRef.current?.destroy();
            engineRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePick = useCallback((i: number) => {
        const engine = engineRef.current;
        if (!engine) return;
        engine.loadTrack(i);
        if (!engine.isPlaying()) engine.play();
    }, []);

    const handleVolume = useCallback((value: number) => {
        setVolState(value);
        engineRef.current?.setVol(value / 100);
        try {
            localStorage.setItem(STORAGE_VOLUME, String(value));
        } catch {
            /* noop */
        }
    }, []);

    const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, clickX / rect.width));
        engineRef.current?.seekPercent(pct);
    }, []);

    const currentTrack = tracks[curIdx];

    return (
        <div className="rk-hud-bottom" ref={rootRef}>
            {/* 1. LARGE PROTRUDING ALBUM ART IN THE BOTTOM-LEFT CORNER */}
            <div 
                className="rk-corner-anchor"
                onMouseEnter={() => setIsHoverCorner(true)}
                onMouseLeave={() => setIsHoverCorner(false)}
            >
                <div className="rk-protruding-cover-wrap group">
                    <img ref={coverRef} className="rk-protruding-cover" alt="Album Cover" draggable={false} />
                    
                    {/* Pulsing indicator when playing */}
                    <div className="rk-corner-pulse-dot" />

                    {/* DISCREET CONTROLS OVERLAY (Revealed smoothly on hover) */}
                    <div className={`rk-corner-hover-controls ${isHoverCorner ? 'is-visible' : ''}`}>
                        <div className="flex items-center justify-center gap-1.5 p-1">
                            <button className="rk-mb rk-step-sm" ref={btnPrevRef} title="Anterior" type="button" aria-label="Anterior">
                                <svg viewBox="0 0 24 24"><path d="M6 5h3v14H6zM20 5v14L9.5 12z" /></svg>
                            </button>

                            <button className="rk-mb rk-play-sm" ref={btnPlayRef} title="Play / Pausa" type="button" aria-label="Reproducir o pausar">
                                <svg ref={icoPlayRef} viewBox="0 0 24 24"><path d="M7 4l14 8-14 8z" /></svg>
                                <svg ref={icoPauseRef} viewBox="0 0 24 24" style={{ display: 'none' }}><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
                            </button>

                            <button className="rk-mb rk-step-sm" ref={btnNextRef} title="Siguiente" type="button" aria-label="Siguiente">
                                <svg viewBox="0 0 24 24"><path d="M15 5h3v14h-3zM4 5v14l10.5-7z" /></svg>
                            </button>
                        </div>
                        
                        {/* Mini volume & mute bar */}
                        <div className="flex items-center justify-center gap-1.5 px-2 py-1 bg-black/80 border-t border-white/10 w-full">
                            <button className="rk-mb-mini" ref={btnMuteRef} title="Silenciar" type="button" aria-label="Silenciar">
                                <svg viewBox="0 0 24 24" className="w-3 h-3"><path d="M3 9v6h4l5 4V5L7 9H3zm13.5 3a3.5 3.5 0 0 0-2-3.15v6.3a3.5 3.5 0 0 0 2-3.15z" /></svg>
                            </button>
                            <input ref={volRef} className="rk-vol-mini" type="range" min="0" max="100" value={volState} onChange={(e) => handleVolume(Number(e.target.value))} aria-label="Control de volumen" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. DISCREET DARK-GRAY BOTTOM BAR (100vw) */}
            <div className="rk-bottom-bar">
                {/* Thin top progress line */}
                <div className="rk-prog-line-track" onClick={handleProgressClick}>
                    <i ref={progRef} className="rk-prog-line-fill" />
                </div>

                {/* Left padding space reserved for the protruding cover */}
                <div className="w-24 sm:w-28 shrink-0" />

                {/* 3. CENTRAL INFORMATION & DESCRIPTION ROW (RENGLÓN CENTRAL) */}
                <div className="rk-center-info-row flex-1 flex items-center justify-center px-4 overflow-hidden">
                    <div className="flex items-center gap-3 text-xs font-mono tracking-wider text-gray-300 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F2D019] animate-pulse shrink-0" />
                        <span className="text-[#F2D019] font-bold uppercase shrink-0 font-['Teko'] text-lg pt-0.5" ref={titleRef}>
                            {currentTrack?.t || 'Anti-Villano'}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400 uppercase truncate" ref={artistRef}>
                            {currentTrack?.a || 'danielunibe'}
                        </span>
                        <span className="text-gray-600 hidden md:inline">•</span>
                        <span className="text-gray-400 hidden md:inline truncate">
                            Banda Sonora Original // ECHO AUDIO KAIROS
                        </span>
                        <span className="text-gray-600 hidden lg:inline">•</span>
                        <span className="text-[#00F0FF] font-bold text-[11px] shrink-0" ref={timeTextRef}>
                            0:00 / 0:00
                        </span>
                    </div>
                </div>

                {/* 4. DISCREET RIGHT TELEMETRY & PLAYLIST BUTTON */}
                <div className="flex items-center gap-3 shrink-0 pr-4">
                    {/* Sutil micro-equalizer */}
                    <div className="rk-meq-discreet hidden sm:flex">
                        <i /><i /><i /><i />
                    </div>

                    {/* Discrete Playlist button */}
                    <button className="rk-btn-discreet" ref={btnListRef} type="button" title="Ver lista de canciones">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="currentColor" d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" /></svg>
                        <span className="font-['Teko'] text-base tracking-wider pt-0.5">LISTA</span>
                    </button>
                </div>
            </div>

            {/* PLAYLIST DRAWER (Opens Upwards Above Bottom Bar) */}
            <div className="rk-drop" ref={dropRef}>
                <div className="rk-drop-header">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#F2D019] rounded-full animate-pulse" />
                        <span className="font-['Teko'] text-xl tracking-wider uppercase font-bold text-white">ECHO PLAYLIST</span>
                    </div>
                    <span className="rk-drop-count font-mono text-[10px] text-[#00F0FF]">{tracks.length} PISTAS</span>
                </div>
                <ul className="rk-plist sci-fi-scroll">
                    {tracks.map((tr, i) => (
                        <li key={tr.id} className={`rk-track-item ${i === curIdx ? 'current' : ''}`} onClick={() => handlePick(i)}>
                            <img src={tr.cover} alt="" className="rk-item-cover" draggable={false} />
                            <div className="rk-item-info">
                                <span className="rk-item-title">{tr.t}</span>
                                <span className="rk-item-artist">{tr.a}</span>
                            </div>
                            <span className="rk-item-dur">
                                {tr.dur ? formatTime(tr.dur) : '--:--'}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};