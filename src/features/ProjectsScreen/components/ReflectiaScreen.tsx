import { useEffect, useRef, useState } from 'react';

const VIRTUAL_W = 1400;
const VIRTUAL_H = 870;

export const ReflectiaScreen = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const compute = () => {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                setScale(Math.min(rect.width / VIRTUAL_W, rect.height / VIRTUAL_H));
            }
        };
        compute();
        const ro = new ResizeObserver(compute);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 h-full w-full overflow-hidden bg-transparent"
        >
            <div
                className="absolute left-1/2 top-1/2"
                style={{
                    width: VIRTUAL_W,
                    height: VIRTUAL_H,
                    transform: `translate(-50%, -50%) scale(${scale || 0})`,
                }}
            >
                <iframe
                    src="/reflectia.html"
                    title="Reflectia — AirPlay en Windows"
                    className="h-full w-full border-0"
                    allow="autoplay; fullscreen"
                />
            </div>
        </div>
    );
};
