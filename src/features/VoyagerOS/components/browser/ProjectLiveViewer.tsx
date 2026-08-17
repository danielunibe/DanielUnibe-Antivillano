import React, { useState } from 'react';
import type { Project } from '../../../ProjectsScreen/types';
import { Loader2, MonitorPlay, AlertTriangle } from 'lucide-react';

interface ProjectLiveViewerProps {
  project: Project;
  reloadKey?: number;
}

export const ProjectLiveViewer: React.FC<ProjectLiveViewerProps> = ({ project, reloadKey = 0 }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasIframeError, setHasIframeError] = useState(false);

  // Si el proyecto cambia o se recarga, reiniciamos loading con timeout de seguridad
  React.useEffect(() => {
    setIsLoading(true);
    setHasIframeError(false);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, [project.id, reloadKey]);

  // Si el proyecto tiene embedUrl o url web interactiva
  let liveSrc = project.embedUrl || (project.url?.startsWith('http') ? project.url : undefined);

  // Optimización de perfil CodePen para priorizar el resultado interactivo sobre el editor
  if (liveSrc && (project.viewerProfile === 'codepen' || liveSrc.includes('codepen.io'))) {
    if (!liveSrc.includes('default-tab=result')) {
      liveSrc = `${liveSrc}${liveSrc.includes('?') ? '&' : '?'}default-tab=result&theme-id=dark&editable=false`;
    }
  }

  if (liveSrc && !hasIframeError) {
    return (
      <div className="relative w-full h-full bg-black overflow-hidden select-none">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm text-[#F2D019]">
            <Loader2 className="w-8 h-8 animate-spin text-[#F2D019] mb-3 drop-shadow-[0_0_8px_rgba(242,208,25,0.6)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/80">
              LOADING // {project.title}
            </span>
          </div>
        )}
        <iframe
          key={`${project.id}-${reloadKey}`}
          src={liveSrc}
          title={project.title}
          className="w-full h-full border-0 bg-black m-0 p-0 block"
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasIframeError(true);
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        />
      </div>
    );
  }

  // Si es un video renderizado
  if (project.videoUrl) {
    return (
      <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
        <video
          key={`${project.id}-${reloadKey}`}
          src={project.videoUrl}
          className="w-full h-full object-contain bg-black"
          controls
          autoPlay
          loop
          playsInline
        />
      </div>
    );
  }

  // Fallback profesional específico para NODIA cuando el runtime externo está protegido
  if (project.launchId === 'nodia' || project.title === 'NODIA') {
    return (
      <div className="relative w-full h-full bg-[#0a0c10] flex flex-col items-center justify-center p-4 overflow-hidden select-none">
        <div className="relative max-w-full max-h-[76%] flex items-center justify-center overflow-hidden rounded-xl border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.8)] bg-black">
          <img
            src={project.image}
            alt={project.title}
            className="max-w-full max-h-full object-contain block opacity-90"
            draggable={false}
          />
        </div>

        {/* Badge de estado específico para NODIA */}
        <div className="mt-3.5 flex flex-col items-center gap-1 text-center">
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-['Roboto_Mono'] text-[10px] font-bold tracking-wider text-amber-300 uppercase">
              {project.title} · LIVE PREVIEW UNAVAILABLE
            </span>
          </div>
          <span className="font-['Roboto_Mono'] text-[9px] text-white/45 tracking-wide">
            PREVIEW TEMPORAL · EL RUNTIME REQUIERE AUTENTICACIÓN DIRECTA EN GOOGLE AI STUDIO
          </span>
        </div>
      </div>
    );
  }

  // Fallback general para imágenes, 3D renders o archivos de archivo
  return (
    <div className="relative w-full h-full bg-[#0a0c10] flex flex-col items-center justify-center p-4 overflow-hidden select-none">
      <div className="relative max-w-full max-h-[82%] flex items-center justify-center overflow-hidden rounded-xl border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
        <img
          src={project.image}
          alt={project.title}
          className="max-w-full max-h-full object-contain block bg-black/60"
          draggable={false}
        />
      </div>

      {/* Badge informativo discreto (sin URLs ni botones externos) */}
      <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">
        <MonitorPlay className="w-3.5 h-3.5 text-[#2fa39b]" />
        <span className="font-mono text-[10px] tracking-wider text-white/60 uppercase">
          {project.type} · RECURSO VISUAL DE ARCHIVO
        </span>
      </div>
    </div>
  );
};
