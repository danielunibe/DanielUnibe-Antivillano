import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { FluentSearchIcon } from '../../icons/FluentSearchIcon';
import { FlatDockButton } from '../../FlatDockButton';
import { viewAnimation } from '../animations';

interface SearchViewProps {
  onClose: () => void;
  searchText: string;
  setSearchText: (text: string) => void;
  onSubmit: () => void;
  isSearching: boolean;
}

export const SearchView: React.FC<SearchViewProps> = ({
  onClose,
  searchText,
  setSearchText,
  onSubmit,
  isSearching,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Slight delay to allow animation to start before focusing
    const timer = setTimeout(() => searchInputRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, []);
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchText.trim().length > 0 && !isSearching) {
      onSubmit();
    }
  };

  return (
    <motion.div
      className="flex items-center gap-2 w-full"
      style={{ width: '450px' }}
      key="search"
      {...viewAnimation}
    >
      <div className="flex-shrink-0">
        <FluentSearchIcon size={28} color="white" />
      </div>
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Ask Gemini anything..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow h-12 bg-transparent text-white placeholder-white/60 text-lg outline-none"
        disabled={isSearching}
      />
      <FlatDockButton
        label={searchText.trim().length > 0 ? 'Perform Search' : 'Close'}
        onClick={searchText.trim().length > 0 ? onSubmit : onClose}
        disabled={isSearching && !!searchText}
      >
        {searchText ? <FluentSearchIcon size={24} color="white" /> : <X size={24} color="white" />}
      </FlatDockButton>
    </motion.div>
  );
};
