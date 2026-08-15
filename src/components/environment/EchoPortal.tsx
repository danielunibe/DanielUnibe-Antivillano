
import React, { useEffect, useRef } from 'react';
import { PROFILE_DATA } from '../../features/profile/data';
import { useLocale } from '../../features/profile/useLocale';
import type { TargetVisualState } from '../../features/experience/types';

interface EchoPortalProps {
    trigger?: boolean;
    onOpenProfile?: () => void;
    visualState?: TargetVisualState;
}

export const EchoPortal: React.FC<EchoPortalProps> = ({ trigger = false, onOpenProfile, visualState = 'available' }) => {
    const { t } = useLocale();
    // Internal-only naming: keep CSS selectors/classNames unchanged.
    const identityLaserRef = useRef<HTMLDivElement>(null);
    const identityTitlesRef = useRef<HTMLElement>(null);
    const identityBannerRef = useRef<HTMLDivElement>(null);
    const identityParagraphRef = useRef<HTMLDivElement>(null);
    const identityStatsRef = useRef<HTMLElement>(null);

    const LABEL_UI_UX = 'UI/UX';
    const LABEL_GAME_DESIGNER = t('gameDesigner');

    useEffect(() => {
        const refs = [identityLaserRef, identityTitlesRef, identityBannerRef, identityParagraphRef, identityStatsRef];
        
        // Limpiar clases al desmontar o reiniciar
        const resetActiveClasses = () => {
            refs.forEach(ref => {
                if (ref.current) ref.current.classList.remove('active');
            });
        };

        if (trigger) {
            resetActiveClasses();

            const sequence = [
                { ref: identityLaserRef, delay: 100 },
                { ref: identityTitlesRef, delay: 500 },
                { ref: identityBannerRef, delay: 1100 },
                { ref: identityParagraphRef, delay: 1600 },
                { ref: identityStatsRef, delay: 2000 }
            ];

            const timeouts: ReturnType<typeof setTimeout>[] = [];

            sequence.forEach(item => {
                const t = setTimeout(() => {
                    if (item.ref.current) {
                        item.ref.current.classList.add('active');
                    }
                }, item.delay);
                timeouts.push(t);
            });

            return () => timeouts.forEach(clearTimeout);
        } else {
            resetActiveClasses();
        }
    }, [trigger]);

    return (
        <div
            className="world-target relative w-[calc(var(--stage-h)_*_0.78)] max-w-[calc(var(--stage-w)_*_0.9)] aspect-[16/9] md:w-[calc(var(--stage-h)_*_0.94)] pointer-events-auto cursor-pointer group echo-portal-root"
            data-target-state={visualState}
            role={onOpenProfile ? 'button' : undefined}
            tabIndex={onOpenProfile ? 0 : undefined}
            aria-label={onOpenProfile ? t('openProfile') : undefined}
            // Keep the portal compact and stable so all holographic layers feel like one object.
            style={{ ['--echo-overlay-scale' as any]: '0.84' }}
            onMouseMove={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;  // 0..1
                const y = (e.clientY - rect.top) / rect.height;  // 0..1
                // CSS vars are consumed by .echo-card::before for holographic parallax/glow.
                el.style.setProperty('--echo-mx', x.toFixed(4));
                el.style.setProperty('--echo-my', y.toFixed(4));
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                // Reset to center so it doesn't "stick" after leaving.
                el.style.setProperty('--echo-mx', '0.5');
                el.style.setProperty('--echo-my', '0.5');
            }}
            onClick={onOpenProfile}
            onKeyDown={(event) => {
                if (!onOpenProfile || (event.key !== 'Enter' && event.key !== ' ')) return;
                event.preventDefault();
                onOpenProfile();
            }}
        >
            <div className="echo-scene">
                {/* Overlay group: keep avatar/portal and UI elements united */}
                <div className="echo-overlay">
                    {/* Tarjeta Base Holográfica (BG Hex) */}
                    <div className="echo-card" aria-hidden="true" style={{ transform: 'translate(calc(-50% - 205px), calc(-50% + 410px)) rotate(-180deg)' }}>
                        <div className="echo-laser" ref={identityLaserRef}></div>
                    </div>

                    {/* Efectos de Luz y Personaje (Superpuesto en Z-Index 20) */}
                    <div className="echo-hologram-wrapper">
                        {/* 30% larger, moved 25px down and 25px right */}
                        <div
                            className="relative flex items-center justify-center pointer-events-none"
                            style={{
                                transform: 'scale(2.665) translate(-75px, 225px)',
                                transformOrigin: 'center center',
                            }}
                        >
                            {/* Industrial Profile Frame */}
                            <img 
                                src={PROFILE_DATA.worldTargetImage}
                                alt="Profile Frame" 
                                className="echo-img select-none pointer-events-none" 
                                referrerPolicy="no-referrer"
                            />
                            {/* User portrait photo placed on top inside the frame */}
                            <div className="absolute inset-0 m-auto w-[62%] h-[62%] overflow-hidden rounded-[8px] border border-black/80 bg-black/60 shadow-inner z-20">
                                <img
                                    src={PROFILE_DATA.portrait}
                                    alt={PROFILE_DATA.name}
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Capa de Interfaz UI (Z-Index 30) */}
                    <div className="echo-ui" style={{ transform: 'translate(-205px, 410px)' }}>
                        {/* Bloque de Identidad y Párrafo Descriptivo */}
                        <div style={{ transform: 'translateY(-210px)', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <header className="echo-txt-container" ref={identityTitlesRef}>
                                <h1 className="echo-line-title echo-line-uiux">{LABEL_UI_UX}</h1>
                                <h2 className="echo-line-title echo-line-designer">{LABEL_GAME_DESIGNER}</h2>

                                <div className="echo-status-banner" ref={identityBannerRef}>
                                    <div className="echo-hazard-bar" aria-hidden="true"></div>
                                    <span className="echo-status-text">{t('portfolioSystems')}</span>
                                    <div className="echo-hazard-bar" style={{left: 'auto', right: 0}}></div>
                                </div>
                            </header>

                            {/* Párrafo Descriptivo (moved between header and stats grid) */}
                            <div className="echo-data-container" ref={identityParagraphRef} style={{ marginTop: '1.5cqw' }}>
                                <p className="echo-data-paragraph">
                                    {t('ecosystemStatement')}
                                </p>
                            </div>
                        </div>

                        {/* Sistema de Estadísticas (stays anchored to the bottom) */}
                        <section className="echo-stats-grid" ref={identityStatsRef}>
                            {/* Stat: Años */}
                            <article className="echo-stat-box">
                                <div className="echo-stat-tag"></div>
                                <div className="echo-stat-icon-wrapper" aria-hidden="true">
                                    <svg className="echo-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="echo-stat-value">{t('design')}</span>
                                <span className="echo-stat-label">{t('product')}</span>
                            </article>

                            {/* Stat: Proyectos */}
                            <article className="echo-stat-box">
                                <div className="echo-stat-tag"></div>
                                <div className="echo-stat-icon-wrapper" aria-hidden="true">
                                    <svg className="echo-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                    </svg>
                                </div>
                                <span className="echo-stat-value">{t('build')}</span>
                                <span className="echo-stat-label">{t('frontend')}</span>
                            </article>

                            {/* Stat: Cursos */}
                            <article className="echo-stat-box">
                                <div className="echo-stat-tag"></div>
                                <div className="echo-stat-icon-wrapper" aria-hidden="true">
                                    <svg className="echo-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                    </svg>
                                </div>
                                <span className="echo-stat-value">{t('world')}</span>
                                <span className="echo-stat-label">{t('interaction')}</span>
                            </article>

                            {/* Stat: Awards */}
                            <article className="echo-stat-box">
                                <div className="echo-stat-tag"></div>
                                <div className="echo-stat-icon-wrapper" aria-hidden="true">
                                    <svg className="echo-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="8" r="7" />
                                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                                    </svg>
                                </div>
                                <span className="echo-stat-value">{t('verify')}</span>
                                <span className="echo-stat-label">QA</span>
                            </article>
                        </section>
                    </div>
                </div>
            </div>
            {onOpenProfile && (
                <div className="pointer-events-none absolute bottom-2 left-2 z-[70] border border-[#00f0ff]/70 bg-black/80 px-3 py-2 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-[#00f0ff] shadow-[0_0_18px_rgba(0,240,255,0.18)]">
                    {t('profileIdentityArchive')}
                </div>
            )}
            <span className="world-target-signal" aria-hidden="true" />
        </div>
    );
};
