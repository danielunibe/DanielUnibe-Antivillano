import React from 'react';
import { ASSETS } from '../../config/assets';
import { CastShadow } from '../effects/shadows/CastShadow';
import { WorldTooltip } from '../ui/WorldTooltip';
import { useImageInteraction } from '../../features/InteractionSystem';
import { useLocale } from '../../features/profile/useLocale';
import type { TargetVisualState } from '../../features/experience/types';

interface PortalProps {
    onQuestClick: () => void;
    activeIndex: number;
    visualState: TargetVisualState;
    layout?: 'north' | 'west';
}

export const Portal: React.FC<PortalProps> = ({ onQuestClick, activeIndex, visualState, layout = 'north' }) => {
    const { t } = useLocale();
    const isActive = activeIndex === 1;
    
    // Interaction hook for the Quest Giver prop (asset key remains `ASSETS.PROPS.PROPP`).
    const questGiverInteraction = useImageInteraction(t('questGiver'), ASSETS.PROPS.PROPP);
    
    const charHeight = isActive ? 'calc(var(--stage-h) * 0.29)' : 'calc(var(--stage-h) * 0.23)';
    
    const containerTransform =
        layout === 'west'
            ? 'translateX(-210px) translateY(140px)'
            : 'translateX(0px) translateY(0px)';

    const imgWrapperTransform =
        layout === 'west'
            ? 'translateX(0px) translateY(0px)'
            : 'translateX(0px) translateY(0px)';

    return (
        <div 
            className="relative pointer-events-none flex items-end justify-center"
            style={{
                transform: containerTransform, 
            }}
        >
            {/* QUEST GIVER / CHARACTER (FRENTE - INTERACTIVO) */}
            <button type="button" aria-label={t('openProjectQuestLog')} className="world-target relative z-[100] flex items-end justify-center pointer-events-auto cursor-pointer group border-0 bg-transparent p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2D019]"
                 data-target-state={visualState}
                 style={{ 
                     animationDelay: '0.2s',
                     filter: 'none'
                 }}
                 onClick={onQuestClick}
                 onMouseEnter={questGiverInteraction.onMouseEnter}
                 onMouseLeave={questGiverInteraction.onMouseLeave}
            >
                <CastShadow
                    shadowSrc={ASSETS.PROPS.PROPP}
                    debugId="PROPP"
                    height={charHeight}
                    initialConfig={{ perspective: 1140, rotateX: 44, skewX: -9, scaleY: 1.33, x: -121, y: 26.3, blur: 1.5, opacity: 0.8 }}
                >
                    <div className="relative" style={{ transform: imgWrapperTransform }}>
                        <img 
                            src={ASSETS.PROPS.PROPP} 
                            alt={t('questGiver')}
                            className={`object-contain object-bottom select-none brightness-100 ${questGiverInteraction.className}`}
                            style={{ height: charHeight, transform: 'scale(1.38) translate(12%, 10%)', transformOrigin: 'bottom right' }} 
                        />
                    </div>
                </CastShadow>
                
                {/* Tooltip informativo */}
                <span className="world-target-signal" aria-hidden="true" />
                <WorldTooltip title={t('quests')} subtitle={t('projectLog')} side="top" className="!bottom-[100%]" state={visualState} />
            </button>
        </div>
    );
};
