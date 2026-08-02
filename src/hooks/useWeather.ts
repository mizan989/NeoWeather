import { useCallback, useEffect, useState } from 'react';
import { fetchForecast } from '../lib/api';
import type { ForecastResponse, TempUnit, WeatherLocation } from '../types/weather';

interface UseWeatherResult {
  data: ForecastResponse | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useWeather(location: WeatherLocation | null, unit: TempUnit): UseWeatherResult {
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!location) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchForecast(location.latitude, location.longitude, unit)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? 'Something went wrong');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [location, unit, tick]);

  return { data, loading, error, reload };
}
