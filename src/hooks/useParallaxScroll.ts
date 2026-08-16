import { useRef, useState, useEffect, useCallback } from 'react';

export const useParallaxScroll = () => {
    const viewerRef = useRef<HTMLDivElement>(null);
    
    // Referencia mutable para compartir el valor de scroll sin re-renderizar
    const scrollRef = useRef<number>(0); 
    
    // Estado solo para cambios discretos de UI
    const [activeIndex, setActiveIndex] = useState(1); 
    const activeIndexRef = useRef(activeIndex);

    useEffect(() => {
        // 1. Inicialización: Posicionar en el centro (Norte)
        if (viewerRef.current) {
            const startX = viewerRef.current.clientWidth;
            viewerRef.current.scrollLeft = startX;
            scrollRef.current = startX;
        }

        // 2. Handler de Scroll optimizado
        const handleScroll = () => {
            if (!viewerRef.current) return;

            const currentX = viewerRef.current.scrollLeft;
            
            // Actualizar ref para animaciones (ThreeJS, CSS Transform directos)
            scrollRef.current = currentX; 
            
            // Calcular índice para la UI (limitando re-renders)
            const viewportWidth = viewerRef.current.clientWidth || window.innerWidth;
            const newIndex = Math.max(0, Math.min(2, Math.round(currentX / viewportWidth)));
            activeIndexRef.current = newIndex;
            
            setActiveIndex(prevIndex => {
                if (prevIndex !== newIndex) return newIndex;
                return prevIndex;
            });
        };

        const currentViewer = viewerRef.current;
        if (currentViewer) {
            currentViewer.addEventListener('scroll', handleScroll, { passive: true });
        }

        // scrollLeft is measured in pixels, so it must be recalculated when a
        // viewport resize changes the width of each world sector.
        let resizeFrame = 0;
        const handleResize = () => {
            const viewer = viewerRef.current;
            if (!viewer) return;
            window.cancelAnimationFrame(resizeFrame);
            resizeFrame = window.requestAnimationFrame(() => {
                const index = Math.max(0, Math.min(2, activeIndexRef.current));
                const target = index * viewer.clientWidth;
                // Direct assignment bypasses the viewer's CSS smooth-scroll rule.
                viewer.scrollLeft = target;
                scrollRef.current = target;
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            if (currentViewer) {
                currentViewer.removeEventListener('scroll', handleScroll);
            }
            window.cancelAnimationFrame(resizeFrame);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

// 3. Handler para navegación por clics
    const scrollToSection = useCallback((index: number) => {
        const viewer = viewerRef.current;
        if (!viewer) return;
        const safeIndex = Math.max(0, Math.min(2, index));
        const target = safeIndex * viewer.clientWidth;
        const currentIndex = activeIndexRef.current;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // Solo forzar parada del scroll previo si realmente cambia de sección.
        if (currentIndex !== safeIndex) {
            // Cancelar cualquier smooth scroll en curso para que el nuevo destino siempre se aplique.
            viewer.scrollTo({ left: viewer.scrollLeft, behavior: 'auto' });
        }
        activeIndexRef.current = safeIndex;
        setActiveIndex(safeIndex);
        viewer.scrollTo({ left: target, behavior: reduceMotion ? 'auto' : 'smooth' });
        scrollRef.current = target;
    }, []);

    return {
        viewerRef,
        scrollRef,
        activeIndex,
        scrollToSection
    };
};
