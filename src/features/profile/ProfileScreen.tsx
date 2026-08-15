import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GoBackButton } from '../../components/ui/GoBackButton';
import { Icons } from '../StackScreen/assets/Icons';
import { PROFILE_DATA, createPublicProfileSnapshot } from './data';
import { useLocale } from './useLocale';
import type { PublicProfileSnapshot } from './types';

interface ProfileScreenProps {
    onClose: () => void;
    onOpenProjects: () => void;
    onOpenStack: () => void;
    onOpenProcess: () => void;
    onOpenContact: () => void;
    onOpenRecruiter: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
    onClose,
    onOpenProjects,
    onOpenStack,
    onOpenProcess,
    onOpenContact,
    onOpenRecruiter,
}) => {
    const { locale, t, text } = useLocale();
    const [isClosing, setIsClosing] = useState(false);
    const localSnapshot = useMemo(() => createPublicProfileSnapshot(PROFILE_DATA, locale), [locale]);
    const [publicSnapshot, setPublicSnapshot] = useState<PublicProfileSnapshot>(localSnapshot);

    const handleProfileClose = useCallback(() => {
        setIsClosing(true);
        window.setTimeout(onClose, 280);
    }, [onClose]);

    useEffect(() => {
        // Vite has no Functions runtime; the verified local snapshot is the
        // intended development fallback and avoids a noisy local 404 request.
        if (!import.meta.env.PROD) return;
        const controller = new AbortController();
        setPublicSnapshot(localSnapshot);
        void fetch(`/api/profile?locale=${locale}`, { signal: controller.signal })
            .then(response => response.ok ? response.json() as Promise<PublicProfileSnapshot> : Promise.reject(new Error('PROFILE_API_UNAVAILABLE')))
            .then(snapshot => setPublicSnapshot(snapshot))
            .catch(() => undefined);
        return () => controller.abort();
    }, [locale, localSnapshot]);

    const sourceLabel = publicSnapshot.source === 'linkedin' && publicSnapshot.syncStatus === 'fresh'
        ? t('linkedinSynced')
        : t('localVerified');

    return (
        <div
            data-screen="profile"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-title"
            tabIndex={-1}
            className={`fixed inset-0 z-[220] overflow-y-auto bg-[#050505] text-white ${isClosing ? 'animate-out fade-out duration-300' : 'animate-stack-entry'}`}
        >
            <div className="interface-dot-grid" />
            <div className="interface-screen-vignette" />
            <header className="sticky top-0 z-40 flex min-h-[78px] items-center justify-between gap-4 border-b border-white/10 bg-black/90 px-4 py-3 backdrop-blur-xl md:px-8">
                <GoBackButton onClick={handleProfileClose} isClosing={isClosing} ariaLabel={t('backToWorld')} title={t('backToWorld')} />
                <div className="min-w-0 text-right">
                    <p className="font-mono text-[9px] font-black uppercase tracking-[0.28em] text-[#00F0FF]">NORTH // IDENTITY TARGET</p>
                    <h1 id="profile-title" className="truncate font-['Teko'] text-3xl font-black uppercase leading-none tracking-wide text-[#F2D019] md:text-5xl">{t('profile')}</h1>
                </div>
            </header>

            <main className="relative z-10 mx-auto w-full max-w-[1280px] space-y-6 px-4 py-6 md:space-y-8 md:px-8 md:py-10">
                <section className="grid gap-6 overflow-hidden border border-[#F2D019]/45 bg-[linear-gradient(120deg,rgba(242,208,25,0.12),rgba(0,0,0,0.8)_50%,rgba(0,240,255,0.09))] p-5 shadow-[0_0_45px_rgba(0,0,0,0.42)] md:grid-cols-[260px_1fr] md:p-8">
                    <div className="relative mx-auto aspect-square w-full max-w-[260px] flex items-center justify-center">
                        {/* Outer industrial frame */}
                        <img
                            src={ASSETS.INTERFACE.PROFILE_FRAME}
                            alt=""
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 h-full w-full object-contain select-none z-20"
                        />
                        {/* Portrait photo fitted inside frame area */}
                        <div className="relative w-[78%] h-[78%] overflow-hidden rounded-[8px] border border-black/60 bg-black shadow-inner z-10">
                            <img src={PROFILE_DATA.portrait} alt={`${PROFILE_DATA.name} portrait`} className="h-full w-full object-cover" />
                        </div>
                    </div>
                    <div className="flex min-w-0 flex-col justify-center">
                        <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[0.18em]">
                            <span className="border border-[#00F0FF]/55 bg-[#00F0FF]/10 px-2 py-1 text-[#00F0FF]">{sourceLabel}</span>
                            <span className="text-white/45">UPDATED {publicSnapshot.updatedAt.slice(0, 10)}</span>
                        </div>
                        <h2 className="font-['Teko'] text-6xl font-black uppercase leading-[0.82] tracking-wide text-white md:text-8xl">{PROFILE_DATA.name}</h2>
                        <p className="mt-3 font-['Teko'] text-3xl font-black uppercase leading-none tracking-wide text-[#F2D019] md:text-4xl">{publicSnapshot.title}</p>
                        <p className="mt-5 max-w-3xl font-['Roboto_Mono'] text-xs leading-relaxed text-white/72 md:text-sm">{text(PROFILE_DATA.summary)}</p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            {publicSnapshot.specialties.map(specialty => (
                                <span key={specialty} className="border border-white/15 bg-black/45 px-3 py-2 font-mono text-[9px] font-black uppercase tracking-[0.12em] text-white/78">{specialty}</span>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
                    <div className="border-l-4 border-[#F2D019] bg-white/[0.045] p-5">
                        <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-white/48">EXPERIENCE LEVEL</p>
                        <p className="mt-2 font-['Teko'] text-6xl font-black uppercase leading-none tracking-wide text-[#F2D019]">LVL {String(publicSnapshot.level).padStart(2, '0')}</p>
                        <p className="mt-3 font-['Roboto_Mono'] text-xs leading-relaxed text-white/68">
                            {locale === 'es'
                                ? `${publicSnapshot.level}+ años de experiencia profesional verificada. El conteo descarta el primer año parcial documentado y periodos superpuestos.`
                                : `${publicSnapshot.level}+ years of verified professional experience. The count excludes the documented partial first year and overlapping periods.`}
                        </p>
                    </div>
                    <div className="border border-[#00F0FF]/30 bg-[#00F0FF]/[0.035] p-5">
                        <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[#00F0FF]">OPEN CHANNELS</p>
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                            {publicSnapshot.links.map(link => (
                                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-between border border-white/15 bg-black/55 px-3 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-white/82 transition hover:border-[#F2D019] hover:text-[#F2D019] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00F0FF]">
                                    <span>{link.label}</span><span className="text-white/40">↗</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                <section aria-label="Profile routes" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <ProfileRoute label={t('projects')} onClick={onOpenProjects} />
                    <ProfileRoute label={t('stack')} onClick={onOpenStack} />
                    <ProfileRoute label={t('credits')} onClick={onOpenProcess} />
                    <ProfileRoute label={t('contact')} onClick={onOpenContact} />
                    <ProfileRoute label={t('recruiter')} onClick={onOpenRecruiter} tone="cyan" />
                </section>
            </main>
        </div>
    );
};

const ProfileRoute = ({ label, onClick, tone = 'yellow' }: { label: string; onClick: () => void; tone?: 'yellow' | 'cyan' }) => (
    <button
        type="button"
        onClick={onClick}
        className={`min-h-11 border px-4 py-3 font-['Teko'] text-2xl font-black uppercase tracking-wider transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${tone === 'cyan' ? 'border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF] hover:text-black' : 'border-[#F2D019] text-[#F2D019] hover:bg-[#F2D019] hover:text-black'}`}
    >
        {label}
    </button>
);
