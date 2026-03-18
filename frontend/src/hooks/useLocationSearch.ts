import { useState, useCallback, useRef } from 'react';
import api from '../api/axios';

export interface LocationResult {
  place_id: string;
  full_address: string;
  administrative_units: {
    state: string;
    city: string;
    suburb: string;
    street: string;
    postcode: string;
  };
  coordinates: {
    lat: number;
    lon: number;
  };
  bounding_box?: string[];
}

export const useLocationSearch = () => {
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Debounce timeout ref
  const timeoutRef = useRef<number | ReturnType<typeof setTimeout> | null>(null);

  const searchLocations = useCallback((query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<LocationResult[]>(`/location/search?q=${encodeURIComponent(query)}`);
        setResults(response.data);
      } catch (err: any) {
        console.error('Location search error:', err);
        setError(err.response?.data?.error || 'Failed to search location');
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return { results, loading, error, searchLocations, clearResults };
};
