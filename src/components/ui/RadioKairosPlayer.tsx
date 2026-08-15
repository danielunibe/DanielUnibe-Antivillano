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
            {/* FLOATING QUICK CONFIG & PROFILE MODAL (Appears when hovering bottom-left corner) */}
            <div 
                className={`rk-corner-modal ${isHoverCorner ? 'open' : ''}`}
                onMouseEnter={() => setIsHoverCorner(true)}
                onMouseLeave={() => setIsHoverCorner(false)}
            >
                <div className="rk-corner-modal-header">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#F2D019] rotate-45" />
                        <span className="font-mono text-[10px] text-white/60 tracking-[0.25em] font-bold uppercase">AUDIO // KAIROS CONFIG</span>
                    </div>
                    <span className="font-mono text-[9px] text-[#00F0FF] tracking-wider uppercase">v4.2 ECHO</span>
                </div>

                <div className="rk-corner-modal-body">
                    {/* Big Portrait / Album Cover */}
                    <div className="flex gap-4 items-center">
                        <div className="rk-corner-modal-art">
                            <img 
                                src={currentTrack?.cover || '/assets/audio/covers/anti-villano.jpg'} 
                                alt="Album Art" 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 border border-white/20 pointer-events-none" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-mono text-[9px] uppercase tracking-widest text-[#F2D019]">ÁLBUM // ORIGINAL</div>
                            <h4 className="font-['Teko'] text-2xl font-bold uppercase text-white leading-tight truncate">
                                {currentTrack?.t || 'Anti-Villano'}
                            </h4>
                            <p className="font-['Roboto_Mono'] text-[11px] text-gray-400">
                                Por <strong>Daniel Unibe</strong>
                            </p>
                        </div>
                    </div>

                    {/* Controls inside Quick Config */}
                    <div className="mt-4 space-y-3 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">VOLUMEN MAESTRO</span>
                            <span className="font-mono text-[10px] font-bold text-[#F2D019]">{volState}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={volState} 
                            onChange={(e) => handleVolume(Number(e.target.value))} 
                            className="rk-vol w-full"
                        />

                        <div className="flex items-center justify-between pt-1">
                            <span className="font-mono text-[9px] text-gray-500 uppercase">EFECTOS 3D / RADIO</span>
                            <span className="font-mono text-[9px] text-[#00F0FF] uppercase">SINCRONIZADO</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* FULL-WIDTH HUD BOTTOM BAR (100vw) */}
            <div className="rk-bottom-bar">
                {/* 1. LEFT CORNER: Album Cover & Track Meta */}
                <div 
                    className="rk-bar-left flex items-center gap-3 sm:gap-4 shrink-0"
                    onMouseEnter={() => setIsHoverCorner(true)}
                    onMouseLeave={() => setIsHoverCorner(false)}
                >
                    {/* Interactive Corner Cover Art */}
                    <div className="rk-corner-cover-wrap group">
                        <img ref={coverRef} className="rk-corner-cover" alt="Album Cover" draggable={false} />
                        <div className="rk-corner-cover-overlay group-hover:opacity-100">
                            <svg className="w-4 h-4 text-[#F2D019]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    {/* Metadata Header */}
                    <div className="rk-meta flex flex-col justify-center min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="rk-title truncate font-['Teko'] text-xl sm:text-2xl font-bold uppercase tracking-wider text-white" ref={titleRef}>—</span>
                            <span className="font-mono text-[9px] text-[#F2D019] px-1.5 py-0.2 bg-[#F2D019]/10 rounded border border-[#F2D019]/30 uppercase hidden md:inline">
                                ECHO AUDIO
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="rk-art font-['Roboto_Mono'] text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest truncate" ref={artistRef}>—</span>
                            <span className="text-gray-600 text-[10px] hidden sm:inline">•</span>
                            <span className="font-mono text-[10px] text-[#00F0FF] hidden sm:inline" ref={timeTextRef}>0:00 / 0:00</span>
                        </div>
                    </div>
                </div>

                {/* 2. CENTER: Transport Controls & Scrubber */}
                <div className="rk-bar-center flex flex-col items-center justify-center flex-1 max-w-[580px] px-2 sm:px-4">
                    {/* Tactile Playback Buttons */}
                    <div className="rk-controls flex items-center gap-3 sm:gap-4 mb-1">
                        <button className="rk-mb rk-step" ref={btnPrevRef} title="Anterior" type="button" aria-label="Anterior">
                            <svg viewBox="0 0 24 24"><path d="M6 5h3v14H6zM20 5v14L9.5 12z" /></svg>
                        </button>

                        <button className="rk-mb rk-play" ref={btnPlayRef} title="Play / Pausa" type="button" aria-label="Reproducir o pausar">
                            <svg ref={icoPlayRef} viewBox="0 0 24 24"><path d="M7 4l14 8-14 8z" /></svg>
                            <svg ref={icoPauseRef} viewBox="0 0 24 24" style={{ display: 'none' }}><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
                        </button>

                        <button className="rk-mb rk-step" ref={btnNextRef} title="Siguiente" type="button" aria-label="Siguiente">
                            <svg viewBox="0 0 24 24"><path d="M15 5h3v14h-3zM4 5v14l10.5-7z" /></svg>
                        </button>
                    </div>

                    {/* Progress Bar / Scrubber */}
                    <div className="rk-prog-track w-full cursor-pointer py-1" onClick={handleProgressClick}>
                        <div className="rk-prog-bg">
                            <i ref={progRef} className="rk-prog-fill" />
                        </div>
                    </div>
                </div>

                {/* 3. RIGHT: Equalizer, Volume & Playlist Button */}
                <div className="rk-bar-right flex items-center justify-end gap-3 sm:gap-4 shrink-0">
                    {/* Dynamic LED Equalizer */}
                    <div className="rk-meq hidden sm:flex">
                        <i /><i /><i /><i /><i />
                    </div>

                    {/* Volume Slider & Mute */}
                    <div className="flex items-center gap-2 hidden md:flex">
                        <button className="rk-mb rk-mute" ref={btnMuteRef} title="Silenciar" type="button" aria-label="Silenciar">
                            <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 4V5L7 9H3zm13.5 3a3.5 3.5 0 0 0-2-3.15v6.3a3.5 3.5 0 0 0 2-3.15zM14.5 3.8v2.1a6.5 6.5 0 0 1 0 12.2v2.1a8.5 8.5 0 0 0 0-16.4z" /></svg>
                        </button>
                        <input ref={volRef} className="rk-vol" type="range" min="0" max="100" value={volState} onChange={(e) => handleVolume(Number(e.target.value))} aria-label="Control de volumen" />
                    </div>

                    {/* Playlist Drawer Button */}
                    <button className="rk-mb rk-txt" ref={btnListRef} type="button">
                        <svg className="rk-list-ico" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" /></svg>
                        <span className="hidden sm:inline">LISTA</span>
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
                    <span className="rk-drop-count font-mono text-[10px] text-[#00F0FF]">{tracks.length} CANCIONES</span>
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