
import React from 'react';
import { ASSETS } from '../../config/assets';

export const Floor: React.FC = React.memo(() => {
    return (
        <div 
            id="global-floor" 
            // User request: lift the floor image a bit and reduce perceived heaviness.
className="absolute bottom-[-8%] left-0 h-[60%] flex pointer-events-none z-0 overflow-hidden"
            style={{ width: '300%' }}
        >
            <div className="relative w-full h-full">
                <img
                    src={ASSETS.BG.FLOOR} 
                    alt="" 
                    aria-hidden="true"
                    draggable="false"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 h-full w-full select-none"
                    style={{ 
                        objectFit: 'cover',
                        objectPosition: 'center bottom',
                        opacity: 0.62,
                        filter: 'saturate(0.95) contrast(0.95)'
                    }}
                />
            </div>
        </div>
    );
});
