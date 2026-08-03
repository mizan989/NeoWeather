import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import SearchBar from './components/SearchBar';
import { UnitToggle, ThemeToggle } from './components/Toggles';
import CurrentWeather from './components/CurrentWeather';
import HourlyStrip from './components/HourlyStrip';
import DailyList from './components/DailyList';
import DetailsGrid from './components/DetailsGrid';
import { useWeather } from './hooks/useWeather';
import { useGeolocation } from './hooks/useGeolocation';
import { getConditionFamily } from './lib/weatherCodes';
import { horizonGradient, skyGradient } from './lib/horizon';
import type { TempUnit, WeatherLocation } from './types/weather';
import WeatherBackground from './components/WeatherBackground';

const DEFAULT_LOCATION: WeatherLocation = {
  name: 'Kolkata',
  admin1: 'West Bengal',
  country: 'India',
  latitude: 22.5726,
  longitude: 88.3639,
};

function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('neoweather-theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('neoweather-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return [dark, setDark] as const;
}

export default function App() {
  const [location, setLocation] = useState<WeatherLocation>(DEFAULT_LOCATION);
  const [unit, setUnit] = useState<TempUnit>('celsius');
  const [dark, setDark] = useDarkMode();
  const { locate, locating, error: geoError } = useGeolocation();
  const { data, loading, error } = useWeather(location, unit);

  const family = data ? getConditionFamily(data.current.weather_code) : 'clear';
  const isDay = data ? data.current.is_day === 1 : true;

  useEffect(() => {
    if (data) {
      document.documentElement.style.setProperty('--horizon-gradient', horizonGradient(family, isDay));
    }
  }, [data, family, isDay]);

  return (
    <>
      <div
        className="fixed inset-0 -z-20 transition-[background] duration-1000"
        style={{ background: skyGradient(family, isDay) }}
      />
      <WeatherBackground family={family} isDay={isDay} />

        <div className="mx-auto flex h-screen w-full max-w-md flex-col overflow-y-auto px-6 py-8 sm:max-w-lg md:max-w-2xl md:px-10 lg:max-w-4xl xl:max-w-5xl">      <header className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-sm font-medium tracking-tight">
          Neo<span style={{ color: 'var(--sky)' }}>Weather</span>
        </h1>
        <div className="flex items-center gap-3">
          <UnitToggle unit={unit} onChange={setUnit} />
          <ThemeToggle dark={dark} onChange={setDark} />
        </div>
      </header>

      <SearchBar
        onSelect={setLocation}
        onUseLocation={() => locate(setLocation)}
        locating={locating}
      />
      {geoError && (
        <p className="mt-2 font-mono text-[11px]" style={{ color: 'var(--gold)' }}>{geoError}</p>
      )}

      <div className="mt-8 mb-6 horizon-line" />

      {loading && !data && (
        <div className="flex flex-1 items-center justify-center py-24">
          <Loader2 className="animate-spin" size={22} style={{ color: 'var(--ink-soft)' }} />
        </div>
      )}

      {error && (
        <div className="py-16 text-center text-sm" style={{ color: 'var(--ink-soft)' }}>
          Couldn't load the forecast. Check your connection and try again.
        </div>
      )}

      {data && (
        <div className="flex flex-col gap-10">
          <CurrentWeather location={location} current={data.current} unit={unit} />
          <HourlyStrip hourly={data.hourly} timezone={data.timezone} unit={unit} />
          <DetailsGrid current={data.current} daily={data.daily} />
          <DailyList daily={data.daily} />
        </div>
      )}

      <footer className="mt-12 pt-6 font-mono text-[10px]" style={{ color: 'var(--ink-soft)' }}>
      <span>Made with ❤️ and 🍵 by <a href="https://github.com/mizan989" target="_blank" rel="noreferrer">Md Mizan</a></span>
      </footer>
    </div>
     </>
  );
}
