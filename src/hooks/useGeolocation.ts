import { useCallback, useState } from 'react';
import { reverseGeocode, ipGeolocate } from '../lib/api';
import type { WeatherLocation } from '../types/weather';

export function useGeolocation() {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locate = useCallback(async (onSuccess: (loc: WeatherLocation) => void) => {
    setLocating(true);
    setError(null);

    const resolveLocationWithReverse = async (lat: number, lon: number): Promise<WeatherLocation> => {
      const place = await reverseGeocode(lat, lon);
      return {
        name: place?.name || 'Your Location',
        admin1: place?.admin1,
        country: place?.country || '',
        latitude: lat,
        longitude: lon,
      };
    };

    const fallbackToIp = async (reason?: string) => {
      try {
        const ipLoc = await ipGeolocate();
        if (ipLoc) {
          onSuccess(ipLoc);
          if (reason) {
            setError(`${reason} Located via network approximation.`);
          }
          setLocating(false);
          return true;
        }
      } catch {
        // ignore
      }
      return false;
    };

    if (!navigator.geolocation) {
      const ipSuccess = await fallbackToIp('Browser GPS is not supported.');
      if (!ipSuccess) {
        setError('Geolocation is not supported by your browser.');
        setLocating(false);
      }
      return;
    }

    // Try HTML5 Geolocation with high accuracy first
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const loc = await resolveLocationWithReverse(latitude, longitude);
          onSuccess(loc);
        } catch {
          onSuccess({
            name: 'Current Location',
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            country: '',
          });
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        // If high accuracy failed or timed out, try standard accuracy fallback
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const { latitude, longitude } = pos.coords;
              const loc = await resolveLocationWithReverse(latitude, longitude);
              onSuccess(loc);
            } catch {
              onSuccess({
                name: 'Current Location',
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                country: '',
              });
            } finally {
              setLocating(false);
            }
          },
          async (lowErr) => {
            // If GPS is unavailable/denied, seamlessly fall back to IP geolocation
            const messages: Record<number, string> = {
              1: 'Location permission was denied.',
              2: 'GPS sensor unavailable.',
              3: 'Location request timed out.',
            };
            const msg = messages[lowErr.code] || messages[err.code] || 'GPS position unavailable.';
            const ipSuccess = await fallbackToIp(msg);
            if (!ipSuccess) {
              setError(`${msg} Please search for your city manually.`);
              setLocating(false);
            }
          },
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
        );
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  return { locate, locating, error };
}