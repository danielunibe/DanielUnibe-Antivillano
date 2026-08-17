import { GroundingChunk } from '../types';

export interface SearchResult {
  text: string;
  sources: GroundingChunk[];
}

export const performWebSearch = async (query: string): Promise<SearchResult> => {
  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.text || 'No response generated.',
      sources: data.sources || [],
    };
  } catch (error) {
    console.error("Gemini API Client Proxy Error:", error);
    throw error;
  }
};
