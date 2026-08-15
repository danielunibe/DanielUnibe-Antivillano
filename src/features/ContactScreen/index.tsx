import React, { useCallback, useState } from 'react';
import { sfx } from '../../utils/SoundManager';
import { Icons } from '../StackScreen/assets/Icons';
import { GoBackButton } from '../../components/ui/GoBackButton';
import { useImageInteraction } from '../InteractionSystem';
import { PROFILE_DATA } from '../profile/data';
import type { SocialLink } from '../profile/types';

interface ContactScreenProps {
    onClose: () => void;
}

interface ContactSocialLink extends SocialLink {
    name: string;
    color: string;
}

const SOCIAL_COLORS: Record<SocialLink['id'], string> = {
    linkedin: '#c084fc',
    artstation: '#00F0FF',
    dribbble: '#fb923c',
    codepen: '#F2D019',
};

const CONTACT_SOCIAL_LINKS: ContactSocialLink[] = PROFILE_DATA.socialLinks.map(link => ({
    ...link,
    name: link.label.toUpperCase(),
    color: SOCIAL_COLORS[link.id],
}));

const CONTACT_EMAIL_ADDRESS = PROFILE_DATA.publicEmail;

export const ContactScreen: React.FC<ContactScreenProps> = ({ onClose }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [copyStatus, setCopyStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

    const handleContactClose = useCallback(() => {
        sfx.play('CLICK');
        setIsClosing(true);
        setTimeout(onClose, 300);
    }, [onClose]);

    const handleCopyEmail = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(CONTACT_EMAIL_ADDRESS);
            setCopyStatus('SUCCESS');
            sfx.play('EQUIP');
        } catch {
            setCopyStatus('ERROR');
        }
    }, []);

    return (
        <div className={`
            fixed inset-0 z-[300] flex flex-col items-stretch lg:items-center
            bg-black/95 overflow-y-auto overflow-x-hidden lg:overflow-hidden select-none
            ${isClosing ? 'animate-out fade-out duration-300' : 'animate-stack-entry'}
        `}>
            <div className="interface-dot-grid" />
            <div className="interface-screen-vignette" />

            {/* Header con GoBackButton y etiqueta */}
            <div className="relative z-50 mt-2 mb-2 flex w-full max-w-[1800px] shrink-0 flex-col items-stretch justify-between gap-3 px-3 animate-fade-up delay-100 md:mt-8 md:mb-6 md:flex-row md:items-center md:px-10">
                <div className="flex flex-wrap items-center gap-3">
                    <GoBackButton onClick={handleContactClose} isClosing={isClosing} ariaLabel="Salir" title="Salir" />
                    <div className="flex h-12 items-center rounded-sm border border-white/10 bg-[#151515] px-6 md:h-14">
                        <span className="pt-1 font-['Teko'] text-2xl font-bold tracking-widest text-white md:text-3xl">COMM_UPLINK</span>
                    </div>
                </div>

                <div className="flex flex-col items-end transform -skew-x-[10deg] border-r-4 border-[#F2D019] pr-4 self-end md:self-auto ml-auto">
                    <h1 className="max-w-full truncate font-['Teko'] text-4xl font-bold uppercase italic leading-none tracking-wider text-white md:text-6xl">CONTACT_STATION</h1>
                    <span className="font-mono text-[10px] tracking-[0.4em] font-bold text-[#F2D019]">
                            PUBLISHED_CHANNELS / PROFILE DATA
                    </span>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="relative z-10 grid h-auto w-full max-w-[1400px] flex-none grid-cols-1 gap-6 overflow-visible p-4 pb-12 lg:h-full lg:flex-grow lg:grid-cols-2 lg:gap-12 lg:overflow-hidden lg:p-10 lg:pb-20">
                
                {/* Lado Izquierdo: Social Data Nodes */}
                <div className="flex flex-col gap-4 overflow-visible pr-0 animate-fade-up delay-200 sci-fi-scroll lg:overflow-y-auto lg:pr-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-[#F2D019] rotate-45" />
                        <span className="text-xs font-mono text-[#F2D019] tracking-[0.3em] font-bold uppercase">SOCIAL_SIGNAL_MAP</span>
                    </div>

                    {CONTACT_SOCIAL_LINKS.map((link, i) => (
                        <SocialNode key={link.id} link={link} index={i} />
                    ))}
                </div>

                {/* Lado Derecho: Email & System Info */}
                <div className="flex flex-col gap-8 animate-fade-up delay-300">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-cyan-400 rotate-45" />
                            <span className="text-xs font-mono text-cyan-400 tracking-[0.3em] font-bold uppercase">ENCRYPTED_UPLINK</span>
                        </div>
                        
                        <div className="p-8 bg-black/60 border-2 border-cyan-900/50 backdrop-blur-md rounded-lg relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/20 animate-scanline" />
                            
                            <div className="flex flex-col gap-2 relative z-10">
                                <span className="font-mono text-[10px] text-cyan-400/60 uppercase">Primary Data Channel</span>
                                <div className="break-all font-['Teko'] text-3xl tracking-widest text-white sm:text-4xl md:text-5xl">
                                    {CONTACT_EMAIL_ADDRESS}
                                </div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-amber-300/75">Dirección publicada en esta versión · entrega externa pendiente de verificación.</p>
                                
                                <button 
                                    onClick={handleCopyEmail}
                                    className="mt-6 w-full py-4 bg-cyan-500 text-black font-['Teko'] text-3xl font-black uppercase tracking-widest hover:bg-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_5px_15px_rgba(0,240,255,0.4)]"
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)' }}
                                >
                                    {copyStatus === 'SUCCESS' ? 'EMAIL COPIED' : copyStatus === 'ERROR' ? 'COPY FAILED — SELECT EMAIL' : 'EXTRACT DATA [COPY]'}
                                </button>
                                <p className="min-h-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/65" aria-live="polite">
                                    {copyStatus === 'SUCCESS' && 'Contact address copied to clipboard.'}
                                    {copyStatus === 'ERROR' && 'Clipboard access failed. Select and copy the address shown above.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto p-6 bg-white/5 border border-white/10 rounded-lg flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <span className="font-mono text-[10px] text-gray-500 uppercase">Link evidence</span>
                            <span className="font-['Teko'] text-xl text-[#00F0FF] uppercase">Local verified</span>
                        </div>
                        <div className="w-full h-1 bg-gray-800">
                            <div className="w-full h-full bg-[#00F0FF]" />
                        </div>
                        <p className="font-['Roboto_Mono'] text-[10px] text-gray-400 leading-relaxed italic">
                            Los nodos sociales comparten el perfil local normalizado y abren los canales profesionales documentados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Fix: Type SocialNode as React.FC to include default React attributes like 'key' in the component props
const SocialNode: React.FC<{ link: ContactSocialLink; index: number }> = ({ link, index }) => {
    const interaction = useImageInteraction(`SOCIAL NODE: ${link.name}`, "");

    return (
        <a 
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => { sfx.play('HOVER'); interaction.onMouseEnter(); }}
            onMouseLeave={interaction.onMouseLeave}
            className="flex items-center p-6 bg-black/40 border-l-4 border-white/10 hover:border-white transition-all group"
            style={{ 
                borderLeftColor: link.color,
                transitionDelay: `${index * 50}ms` 
            }}
        >
            <div className="flex flex-col">
                <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-1 group-hover:text-white transition-colors">
                    PUBLIC PROFILE · EXTERNAL LINK
                </span>
                <div className="font-['Teko'] text-4xl text-white font-bold tracking-wide group-hover:translate-x-2 transition-transform">
                    {link.name}
                </div>
                <div className="font-mono text-xs text-gray-400 mt-1" style={{ color: link.color + 'aa' }}>
                    @{link.handle}
                </div>
            </div>
            
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 border-2 rounded-full flex items-center justify-center animate-spin-slow" style={{ borderColor: link.color }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: link.color }} />
                </div>
            </div>
        </a>
    );
};
