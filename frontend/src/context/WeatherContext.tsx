import React, { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import api from '../api/axios';
import { defaultWeatherData } from './weatherTypes';
import type { WeatherData } from './weatherTypes';
import { WeatherContext } from './useWeather';

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherData>(defaultWeatherData);
  const [loading, setLoading] = useState(false); // Start false because we might have cached data
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [lastParams, setLastParams] = useState<string | null>(null);
  const [defaultWeatherDataCache, setDefaultWeatherDataCache] = useState<{data: WeatherData, timestamp: number} | null>(null);

  const fetchWeather = useCallback(async (lat?: string, lon?: string, q?: string, name?: string) => {
    const isDefaultRequest = !lat && !lon && !q;
    const currentParams = q ? `q=${q}` : `lat=${lat}&lon=${lon}&name=${name || ''}`;
    
    // Check if we can use cached data (5 minutes cache)
    if (
      weatherData !== defaultWeatherData &&
      lastParams === currentParams && 
      lastUpdated && 
      Date.now() - lastUpdated < 5 * 60 * 1000
    ) {
      return;
    }

    if (isDefaultRequest && defaultWeatherDataCache) {
      setWeatherData(defaultWeatherDataCache.data);
      setLastUpdated(defaultWeatherDataCache.timestamp);
      setLastParams(currentParams);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      let url = '/weather/uv';
      const params = new URLSearchParams();
      if (q) {
        params.append('q', q);
      } else if (lat !== undefined && lon !== undefined) {
        params.append('lat', lat);
        params.append('lon', lon);
      }
      
      if (name) {
        params.append('name', name);
      }
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const response = await api.get(url);
      setWeatherData(response.data);
      setLastUpdated(Date.now());
      setLastParams(currentParams);
      setError(null);

      if (isDefaultRequest) {
        setDefaultWeatherDataCache({ data: response.data, timestamp: Date.now() });
      }
    } catch (err: unknown) {
      console.error('Error fetching weather:', err);
      let errorMessage = 'Failed to fetch weather data.';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response: { data: { error?: string } } };
        errorMessage = axiosError.response?.data?.error || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [weatherData, lastUpdated, lastParams, defaultWeatherDataCache]);

  return (
    <WeatherContext.Provider value={{ weatherData, loading, error, fetchWeather, lastUpdated }}>
      {children}
    </WeatherContext.Provider>
  );
};
