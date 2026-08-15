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
    const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
    const [isExiting, setIsExiting] = useState(false);

    const handleClick = useCallback(() => {
        sfx.play('CLICK');
        setIsExiting(true);
        onClick();
    }, [onClick]);

    // Position tracking: aligns the high-z-index portal button precisely with the in-flow slot
    useLayoutEffect(() => {
        let raf = 0;
        const sync = () => {
            const el = slotRef.current;
            if (el) {
                const rect = el.getBoundingClientRect();
                setPos(prev =>
                    prev &&
                    Math.abs(prev.x - rect.left) < 0.5 &&
                    Math.abs(prev.y - rect.top) < 0.5
                        ? prev
                        : { x: rect.left, y: rect.top }
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
                            left: pos.x + 25,
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