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
    isPlaying: () => boolean;
    startLoop: () => void;
    destroy: () => void;
}

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
    let dragVol = false;
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
    let mx = -9999;
    let my = -9999;

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
        lfo.frequency.value = 0.11;
        const lg = ctxA.createGain();
        lg.gain.value = 130;
        lfo.connect(lg);
        lg.connect(wf.frequency);
        lfo.start();
        w.connect(wf);
        wf.connect(windGain);
        windGain.connect(master);
        w.start();
    }

    function applyMaster() {
        if (!master || !ctxA) return;
        const target = (globalMuted || widgetMuted) ? 0 : vol * 0.9 * (ducked ? 0.8 : 1);
        master.gain.setTargetAtTime(target, ctxA.currentTime, 0.05);
    }

    function curPos() {
        if (playing && ctxA && srcNode) return posBase + (ctxA.currentTime - startAt);
        return posBase;
    }

    function stopSrc() {
        if (srcNode) {
            try {
                srcNode.stop();
            } catch {
                /* already stopped */
            }
            try {
                srcNode.disconnect();
            } catch {
                /* noop */
            }
            srcNode = null;
        }
    }

    function startSrc(offset: number) {
        if (!ctxA || !master || !curBuf) return;
        stopSrc();
        srcNode = ctxA.createBufferSource();
        srcNode.buffer = curBuf;
        srcNode.loop = true;
        srcNode.connect(master);
        srcNode.start(0, offset);
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

    const onMouseMove = (e: MouseEvent) => {
        mx = e.clientX;
        my = e.clientY;
    };

    const onPointerDown = (e: PointerEvent) => {
        if (e.pointerType === 'touch') refs.root.classList.add('open');
    };

    const onVolDown = () => {
        dragVol = true;
    };

    const onWinUp = () => {
        dragVol = false;
    };

    function loop() {
        rafId = requestAnimationFrame(loop);
        const r = refs.root.getBoundingClientRect();
        const dx = Math.max(r.left - mx, 0, mx - r.right);
        const dy = Math.max(r.top - my, 0, my - r.bottom);
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) refs.root.classList.add('open');
        else if (d > 180 && !dragVol) {
            refs.root.classList.remove('open');
            refs.drop.classList.remove('open');
            refs.btnList.classList.remove('list-on');
        }
        const tr = tracks[curIdx];
        const p = curPos();
        if (tr && tr.dur > 0) refs.prog.style.width = `${(Math.min(p, tr.dur) / tr.dur) * 100}%`;
        if (playing && tr && tr.dur > 0 && p >= tr.dur) loadTrack(curIdx + 1);
    }

    function destroy() {
        cancelAnimationFrame(rafId);
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointerup', onWinUp);
        refs.btnPlay.removeEventListener('click', onClickPlay);
        refs.btnNext.removeEventListener('click', onClickNext);
        refs.btnPrev.removeEventListener('click', onClickPrev);
        refs.btnList.removeEventListener('click', onClickList);
        refs.btnMute.removeEventListener('click', onClickMute);
        refs.volRange.removeEventListener('pointerdown', onVolDown);
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
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onWinUp);
    refs.btnPlay.addEventListener('click', onClickPlay);
    refs.btnNext.addEventListener('click', onClickNext);
    refs.btnPrev.addEventListener('click', onClickPrev);
    refs.btnList.addEventListener('click', onClickList);
    refs.btnMute.addEventListener('click', onClickMute);
    refs.volRange.addEventListener('pointerdown', onVolDown);

    return {
        loadTrack,
        play,
        pause,
        toggle,
        toggleMute,
        setVol,
        setDucked,
        setGlobalMuted,
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

    return (
        <div className="rk-mini" ref={rootRef}>
            <div className="rk-bar">
                {/* Portada del álbum destacada */}
                <div className="rk-cover-wrap">
                    <img ref={coverRef} className="rk-cover" alt="Album Cover" draggable={false} />
                </div>

                {/* Info de la pista: Título completo y artista */}
                <div className="rk-tt">
                    <span className="rk-title" ref={titleRef}>—</span>
                    <span className="rk-art" ref={artistRef}>—</span>
                </div>

                {/* Controles de reproducción */}
                <div className="rk-controls">
                    <div className="rk-x rk-lx">
                        <button className="rk-mb rk-step" ref={btnPrevRef} title="Anterior" type="button" aria-label="Anterior">
                            <svg viewBox="0 0 24 24"><path d="M6 5h3v14H6zM20 5v14L9.5 12z" /></svg>
                        </button>
                    </div>

                    <button className="rk-mb rk-play" ref={btnPlayRef} title="Play / Pausa" type="button" aria-label="Reproducir o pausar">
                        <svg ref={icoPlayRef} viewBox="0 0 24 24"><path d="M7 4l14 8-14 8z" /></svg>
                        <svg ref={icoPauseRef} viewBox="0 0 24 24" style={{ display: 'none' }}><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
                    </button>

                    <div className="rk-x rk-rx1">
                        <button className="rk-mb rk-step" ref={btnNextRef} title="Siguiente" type="button" aria-label="Siguiente">
                            <svg viewBox="0 0 24 24"><path d="M15 5h3v14h-3zM4 5v14l10.5-7z" /></svg>
                        </button>
                    </div>
                </div>

                {/* Ecualizador LED dinámico */}
                <div className="rk-meq">
                    <i /><i /><i /><i />
                </div>

                {/* Controles extendidos: Volumen y Lista */}
                <div className="rk-x rk-rx2">
                    <button className="rk-mb rk-mute" ref={btnMuteRef} title="Silenciar" type="button" aria-label="Silenciar">
                        <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 4V5L7 9H3zm13.5 3a3.5 3.5 0 0 0-2-3.15v6.3a3.5 3.5 0 0 0 2-3.15zM14.5 3.8v2.1a6.5 6.5 0 0 1 0 12.2v2.1a8.5 8.5 0 0 0 0-16.4z" /></svg>
                    </button>
                    <input ref={volRef} className="rk-vol" type="range" min="0" max="100" value={volState} onChange={(e) => handleVolume(Number(e.target.value))} aria-label="Control de volumen" />
                    <button className="rk-mb rk-txt" ref={btnListRef} type="button">
                        <svg className="rk-list-ico" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" /></svg>
                        <span>LISTA</span>
                    </button>
                </div>

                {/* Barra de progreso */}
                <div className="rk-prog"><i ref={progRef} /></div>
            </div>

            {/* Lista de pistas visual y organizada */}
            <div className="rk-drop" ref={dropRef}>
                <div className="rk-drop-header">
                    <span>PLAYLIST</span>
                    <span className="rk-drop-count">{tracks.length} CANCIONES</span>
                </div>
                <ul className="rk-plist">
                    {tracks.map((tr, i) => (
                        <li key={tr.id} className={`rk-track-item ${i === curIdx ? 'current' : ''}`} onClick={() => handlePick(i)}>
                            <img src={tr.cover} alt="" className="rk-item-cover" draggable={false} />
                            <div className="rk-item-info">
                                <span className="rk-item-title">{tr.t}</span>
                                <span className="rk-item-artist">{tr.a}</span>
                            </div>
                            <span className="rk-item-dur">
                                {tr.dur ? `${Math.floor(tr.dur / 60)}:${('0' + (tr.dur % 60)).slice(-2)}` : '--:--'}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};