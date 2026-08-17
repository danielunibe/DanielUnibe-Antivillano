import React, { useState, useEffect, useRef } from 'react';
import { ASSETS, getPreloadList } from '../../config/assets';
import { ExperienceMode } from '../../features/experience/types';
import { useLocale } from '../../features/profile/useLocale';
import { LootMapEmblem } from '../../features/LootMapScreen/emblem';

interface IntroScreenProps {
    onStart: (mode: ExperienceMode) => void;
    onToggleFullscreen: () => void;
    onFadeComplete?: () => void;
}

type IntroPhase = 'entering' | 'shifting' | 'revealed';

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart, onToggleFullscreen, onFadeComplete }) => {
    const { t } = useLocale();
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [failedAssets, setFailedAssets] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [introPhase, setIntroPhase] = useState<IntroPhase>('entering');

    useEffect(() => {
        const syncFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
        syncFullscreen();
        document.addEventListener('fullscreenchange', syncFullscreen);
        return () => document.removeEventListener('fullscreenchange', syncFullscreen);
    }, []);

    // Coreografía de animación de entrada secuencial
    useEffect(() => {
        const shiftTimer = window.setTimeout(() => {
            setIntroPhase('shifting');
        }, 800);

        const revealTimer = window.setTimeout(() => {
            setIntroPhase('revealed');
        }, 1450);

        return () => {
            window.clearTimeout(shiftTimer);
            window.clearTimeout(revealTimer);
        };
    }, []);

    // useRef para evitar re-ejecuciones en StrictMode
    const hasLoadedRef = useRef(false);

    useEffect(() => {
        if (hasLoadedRef.current) return;
        hasLoadedRef.current = true;

        const assetsToPreload = getPreloadList();
        
        let completedCount = 0;
        let failures = 0;
        let readyTimer: number | undefined;
        let cancelled = false;
        const total = assetsToPreload.length;

        const updateProgress = (didFail: boolean) => {
            if (cancelled) return;
            completedCount++;
            if (didFail) {
                failures++;
                setFailedAssets(failures);
            }
            const percent = Math.min((completedCount / Math.max(total, 1)) * 100, 100);
            setLoadingProgress(percent);
            
            if (completedCount >= total) {
                readyTimer = window.setTimeout(() => setIsReady(true), 400);
            }
        };

        if (total === 0) {
            setLoadingProgress(100);
            readyTimer = window.setTimeout(() => setIsReady(true), 100);
        }

        assetsToPreload.forEach(src => {
            const img = new Image();
            img.decoding = 'async';
            img.onload = () => updateProgress(false);
            img.onerror = () => updateProgress(true);
            img.src = src;
        });

        return () => {
            cancelled = true;
            if (readyTimer) window.clearTimeout(readyTimer);
        };
    }, []);

    const handleStart = (mode: ExperienceMode) => {
        if (isFadingOut) return;
        setIsFadingOut(true);
        onStart(mode);
        setTimeout(() => {
            onFadeComplete?.();
        }, 750);
    };

    const isDoorCentered = introPhase === 'entering';
    const isTextRevealed = introPhase === 'revealed';

    return (
        <div className={`fixed inset-0 z-[200] overflow-hidden bg-[#07090c] text-white select-none transition-all duration-700 ease-out ${
            isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
        }`}>
            {/* Fondo con contraste atmosférico */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_45%,#131720_0%,#07090c_75%)]" />
            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />

            {/* SVG del Emblema de la Cámara: fondo ambiental con animación extremadamente lenta (rotación + respiración). Sin glow. */}
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                <div className="animate-emblem-rotate relative flex w-full h-full items-center justify-center">
                    <div className="animate-emblem-breathe">
                        <LootMapEmblem className="h-[140vh] max-h-none w-auto max-w-none scale-[1.75] rotate-12 translate-x-[15%] opacity-20 text-[#F2D019] select-none pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Botón de pantalla completa superior derecho */}
            <button
                type="button"
                onClick={onToggleFullscreen}
                className="fixed right-4 top-4 z-[230] border border-white/10 bg-black/40 px-3 py-1.5 font-['Roboto_Mono'] text-[9px] uppercase tracking-[0.25em] text-white/50 transition hover:border-white/25 hover:bg-black/60 hover:text-white/80"
            >
                {isFullscreen ? t('exitFullscreen') : t('fullscreen')}
            </button>

            <div className="relative z-10 flex min-h-full flex-col justify-between">
                {/* Composición principal (Puerta + Menú) reajustada ligeramente hacia arriba para centro óptico 16:9 */}
                <div className="mx-auto grid flex-1 w-full max-w-6xl grid-cols-1 items-center gap-6 px-6 pt-10 pb-4 -translate-y-2 lg:-translate-y-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 lg:px-10">
                    {/* Columna Izquierda: Puerta Amarilla Grande + Logo Antivillano */}
                    <section className="relative flex items-center justify-center px-2 py-2">
                            <div
                                className={`relative w-full max-w-[390px] lg:max-w-[460px] transform-gpu transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                    isDoorCentered
                                        ? 'lg:translate-x-[45%] animate-intro-slam scale-[0.96]'
                                        : 'lg:translate-x-0 scale-100'
                                }`}
                            >
                                {/* Contenedor de la Puerta e imagen Antivillano perfectamente alineado y proporcionado */}
                                <div className="relative flex items-center justify-center scale-[1.4] -translate-x-[12%]">
                                    <img
                                    src={ASSETS.INTERFACE.DOOR}
                                    alt="Puerta portada"
                                    className="relative z-20 h-auto w-full object-contain select-none pointer-events-none drop-shadow-[0_12px_32px_rgba(0,0,0,0.9)]"
                                    draggable={false}
                                />
                                    <img
                                        src={ASSETS.INTERFACE.ANTI_VILLANO_LOGO}
                                        alt="Antivillano"
                                        className="absolute left-[calc(50%-10px)] top-[calc(50%+70px)] z-30 w-[70.3%] -translate-x-1/2 -translate-y-[35%] -rotate-3 object-contain select-none pointer-events-none drop-shadow-[0_4px_16px_rgba(242,208,25,0.35)]"
                                        draggable={false}
                                    />
                            </div>
                        </div>
                    </section>

                    {/* Columna Derecha: Menú de Acciones (CTA Amarillo Principal + Vista Rápida Secundaria) */}
                    <section className="relative flex items-center justify-center lg:justify-start px-2 py-2">
                        <div
                            className={`relative flex w-full max-w-[440px] flex-col items-start gap-3.5 transform-gpu transition-all duration-700 ease-out ${
                                isTextRevealed
                                    ? 'opacity-100 translate-x-0 pointer-events-auto'
                                    : 'opacity-0 translate-x-6 pointer-events-none'
                            }`}
                        >
                            {!isReady ? (
                                <div className="w-full border border-white/15 bg-black/50 p-4">
                                    <div className="h-2 overflow-hidden bg-white/10">
                                        <div
                                            className="h-full bg-[#F2D019] transition-all duration-100 ease-out"
                                            style={{ width: `${loadingProgress}%` }}
                                        />
                                    </div>
                                    <div className="mt-2.5 flex items-center justify-between font-['Roboto_Mono'] text-[10px] uppercase tracking-[0.2em] text-white/55">
                                        <span>
                                            {failedAssets ? `${failedAssets} · ${t('resourceUnavailable')}` : t('loadingResources')}
                                        </span>
                                        <span>{Math.round(loadingProgress)}%</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* CTA AMARILLO PRINCIPAL */}
                                    <button
                                        type="button"
                                        onClick={() => handleStart('EXPLORATION')}
                                        aria-label="Entrar a Unibelands 4 (modo inmersivo)"
                                        className="group relative flex w-full max-w-[420px] flex-col overflow-hidden bg-[#F2D019] px-6 pt-7 text-left shadow-[0_8px_18px_rgba(0,0,0,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.5)] active:translate-y-0 active:scale-[0.99] active:shadow-[0_4px_14px_rgba(0,0,0,0.4)] focus:outline-none"
                                    >
                                        {/* Marca '4' con el mismo tono de la franja inferior (black/10) empatada perfecta al borde derecho */}
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute right-0 top-0 bottom-0 z-0 flex items-center select-none font-['Teko'] text-[15.5rem] sm:text-[17.5rem] font-black leading-none -translate-y-0.5 text-black/10"
                                        >
                                            4
                                        </span>

                                        <span className="relative z-10 font-['Roboto_Mono'] text-[9px] font-bold uppercase tracking-[0.3em] text-black/70">
                                            MODO RECOMENDADO
                                        </span>

                                        <div className="relative z-10 mt-1 flex flex-col font-['Teko'] font-bold tracking-[0.03em] text-black">
                                            <span className="text-3xl uppercase leading-none sm:text-4xl">
                                                ENTRAR A
                                            </span>
                                            <span className="text-6xl uppercase leading-[0.85] sm:text-7xl">
                                                UNIBELANDS
                                            </span>
                                        </div>

                                        {/* Franja inferior: Ocupa todo el ancho exacto de la caja amarilla de borde a borde, sin outline */}
                                        <div className="relative z-10 -mx-6 mt-5 flex items-center justify-between bg-black/10 px-6 py-3">
                                            <span className="font-['Roboto_Mono'] text-[10px] font-bold uppercase tracking-[0.22em] text-black/85">
                                                PORTAFOLIO INTERACTIVO
                                            </span>
                                            <span className="flex items-center justify-center font-['Teko'] text-2xl font-bold leading-none text-black">
                                                ▶
                                            </span>
                                        </div>
                                    </button>

                                    {/* VISTA RÁPIDA SECUNDARIA (85% del ancho del CTA, alineada a la izquierda y con icono de triángulo coincidente) */}
                                    <button
                                        type="button"
                                        onClick={() => handleStart('QUICK')}
                                        aria-label="Vista rápida: resumen del perfil"
                                        className="group relative flex w-full max-w-[358px] items-center justify-between overflow-hidden bg-[#00F0FF]/[0.08] px-5 py-3 text-left transition-all duration-200 hover:bg-[#00F0FF]/[0.16] active:scale-[0.99] focus:outline-none"
                                    >
                                        <div>
                                            <span className="block font-['Teko'] text-2xl font-bold leading-none tracking-wide text-[#00F0FF]">
                                                VISTA RÁPIDA
                                            </span>
                                            <span className="mt-0.5 block font-['Roboto_Mono'] text-[9px] uppercase tracking-[0.2em] text-white/60">
                                                RESUMEN DEL PERFIL
                                            </span>
                                        </div>
                                        <span className="flex items-center justify-center pr-1 font-['Teko'] text-2xl font-bold leading-none text-[#00F0FF]">
                                            ▶
                                        </span>
                                    </button>
                                </>
                            )}
                        </div>
                    </section>
                </div>

                {/* Footer inferior discreto */}
                <div className="z-10 grid grid-cols-3 items-center gap-4 border-t border-white/[0.08] px-6 py-2.5 font-['Roboto_Mono'] text-[9px] uppercase tracking-[0.25em] text-white/40 lg:px-12">
                    <span className="justify-self-start">© DANIEL UNIBE</span>
                    <span className="inline-flex items-center justify-self-center gap-2">
                        <span className="h-1.5 w-1.5 bg-[#F2D019]" />
                        {t('systemVersion')}
                    </span>
                    <span className="justify-self-end">PORTAFOLIO INTERACTIVO // START SCREEN</span>
                </div>
            </div>
        </div>
    );
};


