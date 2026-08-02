import { useCallback, useState } from 'react';
import { reverseGeocode } from '../lib/api';
import type { WeatherLocation } from '../types/weather';

export function useGeolocation() {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locate = useCallback((onSuccess: (loc: WeatherLocation) => void) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const place = await reverseGeocode(latitude, longitude);
        onSuccess({
          name: place?.name ?? 'Current location',
          admin1: place?.admin1,
          country: place?.country ?? '',
          latitude,
          longitude,
        });
        setLocating(false);
      },
      () => {
        setError('Location access was denied.');
        setLocating(false);
      }
    );
  }, []);

  return { locate, locating, error };
}
