export const viewAnimation = {
  initial: { opacity: 0, y: 15, scale: 0.94, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -12, scale: 0.96, filter: 'blur(6px)', position: 'absolute' as const },
  transition: { 
    type: 'spring' as const, 
    stiffness: 320, 
    damping: 28, 
    mass: 0.9 
  },
};
