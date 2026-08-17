import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Link } from 'lucide-react';
import { GroundingChunk } from '../types';

interface SearchResultsPanelProps {
  isLoading: boolean;
  response: string | null;
  sources: GroundingChunk[];
  style?: React.CSSProperties;
}

const LoadingIndicator = () => (
    <div className="flex flex-col items-center justify-center text-center p-8 gap-3">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
            <BrainCircuit size={32} className="text-white/60" />
        </motion.div>
        <p className="text-sm text-white/80 animate-pulse">Thinking...</p>
    </div>
);

const ResponseContent = ({ response, sources }: { response: string; sources: GroundingChunk[] }) => (
    <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto pr-2">
        <p className="text-base text-white/95 leading-relaxed">{response}</p>
        {sources.length > 0 && (
            <div>
                <h4 className="font-semibold text-sm mb-2 text-white/80">Sources</h4>
                <div className="flex flex-col gap-2">
                    {sources.map((source, index) => (
                        <a
                            key={index}
                            href={source.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-300 hover:underline bg-white/5 p-2 rounded-md flex items-center gap-2 truncate transition-colors hover:bg-white/10"
                        >
                            <Link size={14} />
                            <span className="truncate">{source.web.title || source.web.uri}</span>
                        </a>
                    ))}
                </div>
            </div>
        )}
    </div>
);

export const SearchResultsPanel = forwardRef<HTMLDivElement, SearchResultsPanelProps>(
  ({ isLoading, response, sources, style }, ref) => {
    return (
      <motion.div
        ref={ref}
        style={{
            ...style,
            boxShadow: '0 30px 60px -15px rgba(0,0,0,0.85), inset 0 1px 1.5px rgba(255, 255, 255, 0.15)'
        }}
        tabIndex={-1}
        className="absolute bottom-[calc(100%+20px)] w-[500px] max-w-[90vw] rounded-2xl bg-neutral-950/80 backdrop-blur-3xl p-5 text-white flex flex-col gap-2"
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isLoading && <LoadingIndicator />}
        {!isLoading && response && <ResponseContent response={response} sources={sources} />}
      </motion.div>
    );
  }
);

SearchResultsPanel.displayName = 'SearchResultsPanel';
