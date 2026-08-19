import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactLenis } from 'lenis/react';
import {
  Loader2, RefreshCw, LayoutDashboard, Clock, CalendarDays, Activity
} from 'lucide-react';
import SearchBar from './components/SearchBar';
import SavedLocations from './components/SavedLocations';
import { UnitToggle } from './components/Toggles';
import HeroWeatherCard from './components/HeroWeatherCard';
import HourlyChart from './components/HourlyChart';
import DailyList from './components/DailyList';
import TelemetryBentoGrid from './components/TelemetryBentoGrid';
import WeatherBackground from './components/WeatherBackground';
import Footer from './components/Footer';
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
  const { locate, locating, error: geoError } = useGeolocation();
  const { data, loading, error, reload } = useWeather(location, unit);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

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
      const gradient = skyGradient(family, isDay);
      document.documentElement.style.setProperty('--horizon-gradient', horizonGradient(family, isDay));
      document.documentElement.style.setProperty('--sky-bg', gradient);
      document.body.style.backgroundImage = gradient;
    }
  }, [data, family, isDay]);

  const tabs: TabItem<WeatherViewTab>[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'hourly', label: '24h Hourly', icon: Clock },
    { id: 'daily', label: '7-Day Matrix', icon: CalendarDays },
    { id: 'telemetry', label: 'Atmosphere', icon: Activity },
  ];

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.0, smoothWheel: true }}>
      {/* Dynamic atmospheric sky background */}
      <div
        className="pointer-events-none fixed inset-0 -z-20 will-change-transform transition-[background] duration-1000"
        style={{
          background: data ? skyGradient(family, isDay) : '#0A0E16',
          transform: 'translate3d(0,0,0)',
          backfaceVisibility: 'hidden',
        }}
      />

      {/* Particle Canvas Engine */}
      {data && <WeatherBackground family={family} isDay={isDay} />}

      {/* Inspira Meteors for night and clear weather */}
      {(!isDay || family === 'clear') && <Meteors number={8} />}

      {/* Main App Container */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 py-6 sm:px-6 md:px-8"
      >
        {/* Minimalist Header */}
        <header className="mb-6 flex items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <h1 className="font-display text-2xl font-bold tracking-tight text-white/95 sm:text-3xl">
              Sky<span className="text-[var(--sky)]">lio</span>
            </h1>
          </motion.div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              title="Refresh weather"
              className="flex size-7.5 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-white/40 backdrop-blur-md transition-colors hover:border-white/20 hover:text-white disabled:opacity-40"
            >
              <RefreshCw
                size={13}
                className={isRefreshing || loading ? 'animate-spin text-[var(--sky)]' : ''}
              />
            </motion.button>
            <UnitToggle unit={unit} onChange={setUnit} />
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
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-xs text-[var(--gold)]"
            >
              {geoError}
            </motion.p>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-1 flex-col items-center justify-center py-28"
          >
            <Loader2 className="animate-spin text-[var(--sky)]" size={24} />
            <p className="mt-3 font-mono text-xs text-white/40">Syncing with atmospheric sensors...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="my-12 rounded-3xl border border-rose-500/20 bg-rose-950/20 p-6 text-center text-xs font-mono text-rose-200 backdrop-blur-md"
          >
            <p>Could not retrieve forecast for {location.name}.</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="mt-3 rounded-full border border-rose-500/30 bg-white/5 px-3 py-1 text-white hover:bg-white/10"
            >
              Retry
            </motion.button>
          </motion.div>
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

            {/* Tab Views with spring physics */}
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
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

        {/* Footer with social links */}
        <Footer />
      </motion.div>
    </ReactLenis>
  );
}
