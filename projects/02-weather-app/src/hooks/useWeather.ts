import { useState, useEffect } from 'react';
import { fetchWeatherByCoords, fetchWeatherByCity } from '../api/weather';
import { saveWeatherCache, loadWeatherCache } from '../db/cache';
import type { WeatherData, CachedWeather } from '../types/weather';

export interface WeatherState {
  weather: WeatherData | null;
  cachedWeather: CachedWeather | null;
  loading: boolean;
  error: string | null;
  isStale: boolean;
}

const STALE_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes

export function useWeather(
  lat: number | null,
  lon: number | null,
  city: string | null
): WeatherState {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [cachedWeather, setCachedWeather] = useState<CachedWeather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    const hasCoords = lat !== null && lon !== null;
    const hasCity = city !== null && city.trim().length > 0;

    if (!hasCoords && !hasCity) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      // Load cached data first for instant display
      const cached = await loadWeatherCache();
      if (cached && !cancelled) {
        setCachedWeather(cached);
        const age = Date.now() - cached.cachedAt;
        setIsStale(age > STALE_THRESHOLD_MS);
      }

      try {
        const data = hasCoords
          ? await fetchWeatherByCoords(lat!, lon!)
          : await fetchWeatherByCity(city!);

        if (!cancelled) {
          setWeather(data);
          setIsStale(false);
          await saveWeatherCache(data);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to fetch weather';
          setError(message);
          // Fall back to cached data if available
          if (!cached) {
            setError(navigator.onLine ? message : 'You are offline. No cached weather available.');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [lat, lon, city]);

  return { weather, cachedWeather, loading, error, isStale };
}
