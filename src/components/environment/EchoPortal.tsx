import React, { useEffect, useRef } from 'react';
import { ASSETS } from '../../config/assets';
import { PROFILE_DATA } from '../../features/profile/data';
import { useLocale } from '../../features/profile/useLocale';
import type { TargetVisualState } from '../../features/experience/types';

interface EchoPortalProps {
    trigger?: boolean;
    onOpenProfile?: () => void;
    onContactClick?: () => void;
    visualState?: TargetVisualState;
    contactVisualState?: TargetVisualState;
}

export const EchoPortal: React.FC<EchoPortalProps> = ({ 
    trigger = false, 
    onOpenProfile, 
    onContactClick,
    visualState = 'available',
    contactVisualState = 'available'
}) => {
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
                    {/* Placa/Marco Industrial Amarillo (por detrás del Portal) */}
                    <div
                        className="echo-backplate"
                        aria-hidden="true"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(calc(-50% - 205px), calc(-50% + 410px))',
                            width: '54%',
                            height: '112%',
                            zIndex: 0,
                            pointerEvents: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <img
                            src={ASSETS.STRUCTURES.PORTAL_PLATE}
                            alt=""
                            className="w-full h-full object-contain select-none pointer-events-none"
                            style={{
                                filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.75))',
                            }}
                            draggable={false}
                        />
                    </div>

                    {/* Tarjeta Base Holográfica (BG Hex) */}
                    <div className="echo-card" aria-hidden="true" style={{ transform: 'translate(calc(-50% - 205px), calc(-50% + 410px)) rotate(-180deg)' }}>
                        <div className="echo-laser" ref={identityLaserRef}></div>
                    </div>

                    {/* Efectos de Luz y Personaje (Superpuesto en Z-Index 20) */}
                    <div className="echo-hologram-wrapper">
                        <img 
                            src={PROFILE_DATA.worldTargetImage}
                            alt="Avatar Vault Hunter" 
                            className="echo-img" 
                            // Keep a controlled scale; the overall group scaling happens in `.echo-overlay`.
                            style={{ transform: 'scale(2.05) translate(-100px, 200px)', transformOrigin: 'center center' }} 
                            referrerPolicy="no-referrer"
                        />
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

                            {/* Stat: Contacto / Uplink */}
                            <article
                                className="echo-stat-box cursor-pointer"
                                tabIndex={onContactClick ? 0 : undefined}
                                role={onContactClick ? 'button' : undefined}
                                aria-label={t('openContact')}
                                data-target-state={contactVisualState}
                                onClick={(e) => {
                                    if (onContactClick) {
                                        e.stopPropagation();
                                        onContactClick();
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (onContactClick && (e.key === 'Enter' || e.key === ' ')) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onContactClick();
                                    }
                                }}
                            >
                                <div className="echo-stat-tag"></div>
                                <div className="echo-stat-icon-wrapper" aria-hidden="true">
                                    <svg className="echo-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <span className="echo-stat-value">{t('contact')}</span>
                                <span className="echo-stat-label">{t('uplink')}</span>
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
