import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, RefreshCw, LayoutDashboard, Clock, CalendarDays, Activity
} from 'lucide-react';
import SearchBar from './components/SearchBar';
import SavedLocations from './components/SavedLocations';
import { UnitToggle, ThemeToggle } from './components/Toggles';
import HeroWeatherCard from './components/HeroWeatherCard';
import HourlyChart from './components/HourlyChart';
import DailyList from './components/DailyList';
import TelemetryBentoGrid from './components/TelemetryBentoGrid';
import WeatherBackground from './components/WeatherBackground';
import { Meteors } from './components/inspira/Meteors';
import { AnimatedTabs, type TabItem } from './components/inspira/AnimatedTabs';
import { useWeather } from './hooks/useWeather';
import { useGeolocation } from './hooks/useGeolocation';
import { getConditionFamily } from './lib/weatherCodes';
import { horizonGradient, skyGradient } from './lib/horizon';
import type { TempUnit, WeatherLocation, WeatherViewTab } from './types/weather';

const DEFAULT_LOCATION: WeatherLocation = {
  name: 'Kolkata',
  admin1: 'West Bengal',
  country: 'India',
  latitude: 22.5726,
  longitude: 88.3639,
};

const DEFAULT_SAVED_LOCATIONS: WeatherLocation[] = [
  { name: 'Kolkata', admin1: 'West Bengal', country: 'India', latitude: 22.5726, longitude: 88.3639 },
  { name: 'Tokyo', country: 'Japan', latitude: 35.6895, longitude: 139.6917 },
  { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
  { name: 'New York', admin1: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060 },
  { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
];

function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('skylio-theme') || localStorage.getItem('neoweather-theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('skylio-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return [dark, setDark] as const;
}

export default function App() {
  const [location, setLocation] = useState<WeatherLocation>(() => {
    const saved = localStorage.getItem('skylio-current-location') || localStorage.getItem('neoweather-current-location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_LOCATION;
      }
    }
    return DEFAULT_LOCATION;
  });

  const [savedLocations, setSavedLocations] = useState<WeatherLocation[]>(() => {
    const stored = localStorage.getItem('skylio-bookmarks') || localStorage.getItem('neoweather-bookmarks');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_SAVED_LOCATIONS;
      }
    }
    return DEFAULT_SAVED_LOCATIONS;
  });

  const [unit, setUnit] = useState<TempUnit>('celsius');
  const [activeTab, setActiveTab] = useState<WeatherViewTab>('overview');
  const [dark, setDark] = useDarkMode();
  const { locate, locating, error: geoError } = useGeolocation();
  const { data, loading, error, reload } = useWeather(location, unit);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    localStorage.setItem('skylio-current-location', JSON.stringify(location));
  }, [location]);

  useEffect(() => {
    localStorage.setItem('skylio-bookmarks', JSON.stringify(savedLocations));
  }, [savedLocations]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    reload();
    setTimeout(() => setIsRefreshing(false), 600);
  }, [reload]);

  const toggleBookmark = useCallback(() => {
    setSavedLocations((prev) => {
      const exists = prev.some(
        (l) =>
          l.name.toLowerCase() === location.name.toLowerCase() &&
          Math.abs(l.latitude - location.latitude) < 0.1
      );
      if (exists) {
        return prev.filter(
          (l) =>
            !(
              l.name.toLowerCase() === location.name.toLowerCase() &&
              Math.abs(l.latitude - location.latitude) < 0.1
            )
        );
      } else {
        return [location, ...prev];
      }
    });
  }, [location]);

  const removeBookmark = useCallback((name: string) => {
    setSavedLocations((prev) => prev.filter((l) => l.name.toLowerCase() !== name.toLowerCase()));
  }, []);

  const isBookmarked = savedLocations.some(
    (l) =>
      l.name.toLowerCase() === location.name.toLowerCase() &&
      Math.abs(l.latitude - location.latitude) < 0.1
  );

  const family = data ? getConditionFamily(data.current.weather_code) : 'clear';
  const isDay = data ? data.current.is_day === 1 : true;

  useEffect(() => {
    if (data) {
      document.documentElement.style.setProperty('--horizon-gradient', horizonGradient(family, isDay));
    }
  }, [data, family, isDay]);

  const tabs: TabItem<WeatherViewTab>[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'hourly', label: '24h Hourly', icon: Clock },
    { id: 'daily', label: '7-Day Matrix', icon: CalendarDays },
    { id: 'telemetry', label: 'Atmosphere', icon: Activity },
  ];

  return (
    <>
      {/* Dynamic atmospheric sky background */}
      <div
        className="fixed inset-0 -z-20 transition-[background] duration-1000"
        style={{ background: data ? skyGradient(family, isDay) : '#0A0E16' }}
      />

      {/* Particle Canvas Engine */}
      {data && <WeatherBackground family={family} isDay={isDay} />}

      {/* Inspira Meteors for night and clear weather */}
      {(!isDay || family === 'clear') && <Meteors number={8} />}

      {/* Main App Container */}
      <div className="relative mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 py-6 sm:px-6 md:px-8">
        {/* Minimalist Header */}
        <header className="mb-6 flex items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div className="flex items-baseline gap-2">
            <h1 className="font-display text-sm font-medium tracking-tight text-white/90">
              Sky<span className="text-[var(--sky)]">lio</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              title="Refresh weather"
              className="flex items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] p-1.5 text-white/40 backdrop-blur-md transition-all hover:border-white/20 hover:text-white active:scale-95 disabled:opacity-40"
            >
              <RefreshCw
                size={13}
                className={isRefreshing || loading ? 'animate-spin text-[var(--sky)]' : ''}
              />
            </button>
            <UnitToggle unit={unit} onChange={setUnit} />
            <ThemeToggle dark={dark} onChange={setDark} />
          </div>
        </header>

        {/* Search & Pinned Bar */}
        <div className="flex flex-col gap-2.5">
          <SearchBar
            onSelect={setLocation}
            onUseLocation={() => locate(setLocation)}
            locating={locating}
          />
          {geoError && (
            <p className="font-mono text-xs text-[var(--gold)]">{geoError}</p>
          )}

          <SavedLocations
            locations={savedLocations}
            currentLocation={location}
            onSelect={setLocation}
            onRemove={removeBookmark}
          />
        </div>

        {/* Horizon hairline */}
        <div className="my-5 horizon-line" />

        {/* Navigation Tabs */}
        <div className="mb-6 flex justify-center sm:justify-start">
          <AnimatedTabs<WeatherViewTab>
            tabs={tabs}
            activeTab={activeTab}
            onChange={(t) => setActiveTab(t)}
          />
        </div>

        {/* Loading State */}
        {loading && !data && (
          <div className="flex flex-1 flex-col items-center justify-center py-28">
            <Loader2 className="animate-spin text-[var(--sky)]" size={24} />
            <p className="mt-3 font-mono text-xs text-white/40">Syncing with atmospheric sensors...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="my-12 rounded-3xl border border-rose-500/20 bg-rose-950/20 p-6 text-center text-xs font-mono text-rose-200 backdrop-blur-md">
            <p>Could not retrieve forecast for {location.name}.</p>
            <button
              onClick={handleRefresh}
              className="mt-3 rounded-full border border-rose-500/30 bg-white/5 px-3 py-1 text-white hover:bg-white/10"
            >
              Retry
            </button>
          </div>
        )}

        {/* Weather Presentation with smooth AnimatePresence */}
        {data && (
          <div className="flex flex-col gap-5">
            {/* Hero current weather */}
            <HeroWeatherCard
              location={location}
              current={data.current}
              daily={data.daily}
              unit={unit}
              isBookmarked={isBookmarked}
              onToggleBookmark={toggleBookmark}
              timezone={data.timezone}
            />

            {/* Tab Views */}
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-5"
                >
                  <HourlyChart
                    hourly={data.hourly}
                    timezone={data.timezone}
                    unit={unit}
                  />
                  <TelemetryBentoGrid
                    current={data.current}
                    daily={data.daily}
                  />
                  <DailyList
                    daily={data.daily}
                  />
                </motion.div>
              )}

              {activeTab === 'hourly' && (
                <motion.div
                  key="hourly"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-5"
                >
                  <HourlyChart
                    hourly={data.hourly}
                    timezone={data.timezone}
                    unit={unit}
                  />
                </motion.div>
              )}

              {activeTab === 'daily' && (
                <motion.div
                  key="daily"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-5"
                >
                  <DailyList
                    daily={data.daily}
                  />
                </motion.div>
              )}

              {activeTab === 'telemetry' && (
                <motion.div
                  key="telemetry"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-5"
                >
                  <TelemetryBentoGrid
                    current={data.current}
                    daily={data.daily}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Minimalist Footer */}
        <footer className="mt-16 flex items-center justify-between border-t border-white/[0.06] pt-6 font-mono text-[10px] text-white/30">
          <div>
            <span>Made by </span>
            <a
              href="https://github.com/mizan989"
              target="_blank"
              rel="noreferrer"
              className="text-white/60 hover:text-white transition-colors no-underline"
            >
              Md Mizan
            </a>
          </div>
          <div>
            <span>Open-Meteo</span>
          </div>
        </footer>
      </div>
    </>
  );
}
