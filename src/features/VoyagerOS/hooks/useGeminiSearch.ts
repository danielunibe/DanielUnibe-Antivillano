import { useState } from 'react';
import { performWebSearch, SearchResult } from '../services/gemini';
import { GroundingChunk } from '../types';

export const useGeminiSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResponse, setSearchResponse] = useState<string | null>(null);
  const [searchSources, setSearchSources] = useState<GroundingChunk[]>([]);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchResponse(null);
    setSearchSources([]);
    setError(null);

    try {
      const result: SearchResult = await performWebSearch(query);
      setSearchResponse(result.text);
      setSearchSources(result.sources);
    } catch (err) {
      setError("Sorry, I couldn't get a response. Please check your connection or API key.");
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResponse(null);
    setSearchSources([]);
    setError(null);
    setIsSearching(false);
  };

  return {
    isSearching,
    searchResponse,
    searchSources,
    error,
    search,
    clearSearch
  };
};
