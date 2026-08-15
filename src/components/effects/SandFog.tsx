
import React, { useEffect, useRef } from 'react';
import { Ticker } from '../../utils/GlobalTicker';

interface SandFogProps {
    scrollRef: React.MutableRefObject<number>;
}

export const SandFog: React.FC<SandFogProps> = React.memo(({ scrollRef }) => {
    const layerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let lastOffset = Number.NaN;
        // Usamos el Ticker global en lugar de crear un nuevo loop rAF.
        // Esto asegura que la niebla se mueva EXACTAMENTE al mismo tiempo que el cielo y las partículas.
        const update = () => {
            if (layerRef.current) {
                const currentScroll = scrollRef.current;
                // Interpolación lineal directa para máxima respuesta (0.4 velocidad)
                const xOffset = currentScroll * 0.4;
                if (xOffset === lastOffset) return;
                lastOffset = xOffset;
                layerRef.current.style.transform = `translate3d(-${xOffset}px, 0, 0)`;
            }
        };

        update();
        if (!reduceMotion) Ticker.add(update);

        return () => {
            if (!reduceMotion) Ticker.remove(update);
        };
    }, []);

    return (
        <div 
            id="sand-storm-wrapper" 
            className="absolute left-0 w-full z-[35] pointer-events-none overflow-hidden bottom-[19%] h-[52%] [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_76%,transparent)]"
        >
            <div 
                 ref={layerRef}
                 id="sand-parallax-layer" 
                 className="w-[300%] h-full relative will-change-transform"
            >
                {/* Noise Texture optimization: Use a smaller repeating pattern */}
                <div className="absolute inset-[-35%] w-[170%] h-[170%] opacity-16 mix-blend-soft-light z-21 bg-[url('data:image/svg+xml,%3Csvg_viewBox=%270_0_160_160%27_xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter_id=%27noiseFilter%27%3E%3CfeTurbulence_type=%27fractalNoise%27_baseFrequency=%270.48%27_numOctaves=%272%27_stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect_width=%27100%25%27_height=%27100%25%27_filter=%27url(%23noiseFilter)%27_opacity=%270.75%27/%3E%3C/svg%3E')] animate-grain"></div>
                <div className="desert-wind-streak desert-wind-streak-a" aria-hidden="true" />
                <div className="desert-wind-streak desert-wind-streak-b" aria-hidden="true" />
                
                <div className="flex w-[150%] h-full absolute animate-drift">
                    {[...Array(4)].map((_, i) => {
                        const isEven = i % 2 === 0;
                        const isThird = i % 3 === 0;
                        
let classes = "flex-shrink-0 rounded-[50%] -ml-[12%] blur-xl ";
                        let blobStyle: React.CSSProperties = {};

                        if (isEven) {
                            classes += "w-[75%] h-[40%] animate-blob-2 ";
                            blobStyle = {
                                background: 'radial-gradient(circle at center, rgba(238, 217, 181, 0.68), rgba(209, 175, 126, 0.28), transparent 68%)',
                                animationDelay: '-5s',
                                transform: 'translateY(15px)'
                            };
                        } else if (isThird) {
                            classes += "w-[55%] h-[30%] blur-2xl animate-blob-3 ";
                            blobStyle = {
                                background: 'radial-gradient(circle at center, rgba(248, 231, 201, 0.48), transparent 72%)',
                                animationDelay: '-2s'
                            };
                        } else {
                            classes += "w-[60%] h-[35%] animate-blob-1 ";
                            blobStyle = {
                                background: 'radial-gradient(circle at center, rgba(229, 204, 166, 0.62), rgba(196, 157, 104, 0.28), transparent 72%)'
                            };
                        }

                        return <div key={i} className={classes} style={blobStyle} />;
                    })}
                </div>
            </div>
        </div>
    );
});
