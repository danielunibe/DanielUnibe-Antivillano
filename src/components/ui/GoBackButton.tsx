import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ASSETS } from '../../config/assets';
import { sfx } from '../../utils/SoundManager';

export interface GoBackButtonProps {
    onClick: () => void;
    className?: string;
    ariaLabel?: string;
    title?: string;
    isClosing?: boolean;
}

export const GoBackButton: React.FC<GoBackButtonProps> = ({
    onClick,
    className = '',
    ariaLabel = 'Regresar al mundo',
    title = 'Regresar al mundo',
    isClosing = false,
}) => {
    const slotRef = useRef<HTMLButtonElement | null>(null);
    // La placa se presenta SIEMPRE fija en la esquina superior izquierda del
    // viewport. El slot solo se usa para reservar espacio en el flujo; si queda
    // fuera del viewport por scroll, la placa no lo sigue (siempre visible).
    const [pos, setPos] = useState<{ x: number; y: number }>({ x: 16, y: 9 });
    const [isExiting, setIsExiting] = useState(false);

    const handleClick = useCallback(() => {
        sfx.play('CLICK');
        setIsExiting(true);
        onClick();
    }, [onClick]);

    // Position tracking: aligns the high-z-index portal button precisely with the in-flow slot
    // while guaranteeing it never leaves the visible area (clamped to viewport).
    useLayoutEffect(() => {
        let raf = 0;
        const sync = () => {
            const el = slotRef.current;
            if (el) {
                const rect = el.getBoundingClientRect();
                const isVisible =
                    rect.top >= 0 &&
                    rect.top <= window.innerHeight - 60 &&
                    rect.left >= 0 &&
                    rect.left <= window.innerWidth - 60;
                const px = isVisible ? rect.left : 16;
                const py = isVisible ? rect.top : 9;
                setPos(prev =>
                    Math.abs(prev.x - px) < 0.5 && Math.abs(prev.y - py) < 0.5
                        ? prev
                        : { x: px, y: py }
                );
            }
            raf = requestAnimationFrame(sync);
        };
        raf = requestAnimationFrame(sync);
        return () => cancelAnimationFrame(raf);
    }, []);

    const closing = isClosing || isExiting;
    const animationClass = closing ? 'go-back-btn--exiting' : 'go-back-btn--entering';

    const imgClass =
        'go-back-btn-img h-[57px] sm:h-[63px] md:h-[75px] lg:h-[80px] w-auto max-w-[315px] object-contain -rotate-[10deg] transition-transform duration-180 ease-out group-hover:scale-105 group-active:scale-95';

    return (
        <>
            <button
                ref={slotRef}
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                className={`go-back-btn group relative z-50 flex shrink-0 items-center justify-center p-0 border-0 bg-transparent cursor-pointer select-none opacity-0 pointer-events-none ${className}`}
            >
                <img src={ASSETS.INTERFACE.GO_BACK} alt="" draggable={false} className={imgClass} />
            </button>
            {pos &&
                createPortal(
                    <button
                        type="button"
                        onClick={handleClick}
                        className={`go-back-btn ${animationClass} group flex shrink-0 items-center justify-center p-0 border-0 bg-transparent cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00f0ff] ${className}`}
                        style={{
                            position: 'fixed',
                            top: pos.y,
                            left: pos.x,
                            zIndex: 30000,
                            margin: 0,
                        }}
                        aria-label={ariaLabel}
                        title={title}
                    >
                        <img src={ASSETS.INTERFACE.GO_BACK} alt="GO BACK" draggable={false} className={imgClass} />
                    </button>,
                    document.body
                )}
        </>
    );
};