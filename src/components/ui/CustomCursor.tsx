
import React, { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const rotateGroupRef = useRef<SVGGElement>(null);
    const recoilGroupRef = useRef<SVGGElement>(null);

    // Refs para lógica de estado
    const rotationAngle = useRef(0);
    const isVisible = useRef(false);
    // Throttle ref
    const lastHoverCheck = useRef(0);
    const lastInteractiveState = useRef(false);

    useEffect(() => {
        document.body.classList.add('custom-cursor-enabled');

        const handleMouseMove = (e: MouseEvent) => {
            // 1. MOVIMIENTO SIN LAG (Direct Hardware Update) - Always Instant
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
            }

            // 2. VISIBILIDAD
            if (!isVisible.current) {
                isVisible.current = true;
                if (cursorRef.current) cursorRef.current.style.opacity = '1';
            }

            // 3. DETECCIÓN DE INTERACTIVIDAD (Throttled)
            // Solo verificamos el hover cada 100ms para evitar excesivo DOM traversal
            const now = Date.now();
            if (now - lastHoverCheck.current > 100) {
                lastHoverCheck.current = now;
                const target = e.target as HTMLElement;
                const isInteractive = Boolean(
                    target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer, .interaction-target, .interactive')
                );
                
                if (isInteractive !== lastInteractiveState.current) {
                    lastInteractiveState.current = isInteractive;
                    document.body.classList.toggle('hovering', isInteractive);
                }
            }
        };

        const handleMouseDown = () => {
            document.body.classList.remove('fired');
            void document.body.offsetWidth; // Force Reflow
            document.body.classList.add('fired');
            
            rotationAngle.current += 90;
            if (rotateGroupRef.current) {
                rotateGroupRef.current.style.transform = `rotate(${rotationAngle.current}deg)`;
            }
        };

        const handleAnimationEnd = () => {
             document.body.classList.remove('fired');
        };
        
        const recoilEl = recoilGroupRef.current;
        if (recoilEl) {
            recoilEl.addEventListener('animationend', handleAnimationEnd);
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mousedown', handleMouseDown);

        const handleMouseEnter = () => { if (cursorRef.current) cursorRef.current.style.opacity = '1'; };
        const handleMouseLeave = () => { if (cursorRef.current) cursorRef.current.style.opacity = '0'; };

        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.body.classList.remove('custom-cursor-enabled', 'hovering', 'fired');
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
            if (recoilEl) {
                recoilEl.removeEventListener('animationend', handleAnimationEnd);
            }
        };
    }, []);

    return (
        <div 
            id="bl4-cursor" 
            ref={cursorRef} 
            className="fixed top-0 left-0 w-16 h-16 pointer-events-none z-[10000] mix-blend-normal will-change-transform transition-opacity duration-300 opacity-0"
            style={{
                transitionProperty: 'opacity', 
                transitionDuration: '300ms'
            }}
        >
            <svg className="w-full h-full overflow-visible drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]" viewBox="0 0 64 64">
                <g className="static-center">
                    <circle className="c-part c-dot" cx="32" cy="32" r="2.5" />
                    <g className="c-part c-plus">
                        <line x1="32" y1="26" x2="32" y2="38" stroke="currentColor" />
                        <line x1="26" y1="32" x2="38" y2="32" stroke="currentColor" />
                    </g>
                </g>
                <g className="c-part" style={{ opacity: 0.6 }}>
                    <line x1="32" y1="18" x2="32" y2="10" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="32" y1="46" x2="32" y2="54" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="18" y1="32" x2="10" y2="32" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="46" y1="32" x2="54" y2="32" stroke="currentColor" strokeWidth="1.5" />
                </g>
                <g id="c-rotate" ref={rotateGroupRef} className="c-part">
                    <rect x="0" y="0" width="64" height="64" fill="none" /> 
                    <g id="c-breathe">
                        <g id="c-recoil" ref={recoilGroupRef}>
                            <path className="c-part corner-tl" d="M 16 22 L 10 22 L 10 10 L 22 10 L 22 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
                            <path className="c-part corner-tr" d="M 48 22 L 54 22 L 54 10 L 42 10 L 42 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
                            <path className="c-part corner-br" d="M 48 42 L 54 42 L 54 54 L 42 54 L 42 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
                            <path className="c-part corner-bl" d="M 16 42 L 10 42 L 10 54 L 22 54 L 22 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
};
