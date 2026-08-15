import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, ArrowUp, ArrowDown } from 'lucide-react';
import { getWeatherMeta } from '../lib/weatherCodes';
import { BorderBeam } from './inspira/BorderBeam';
import { NumberTicker } from './inspira/NumberTicker';
import { Spotlight } from './inspira/Spotlight';
import type { CurrentData, DailyData, TempUnit, WeatherLocation } from '../types/weather';

interface HeroWeatherCardProps {
  location: WeatherLocation;
  current: CurrentData;
  daily: DailyData;
  unit: TempUnit;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  timezone?: string;
}

export default function HeroWeatherCard({
  location,
  current,
  daily,
  unit,
  isBookmarked,
  onToggleBookmark,
  timezone,
}: HeroWeatherCardProps) {
  const isDay = current.is_day === 1;
  const { label, icon: WeatherIcon } = getWeatherMeta(current.weather_code, isDay);
  const [localTime, setLocalTime] = useState<string>('');

  useEffect(() => {
    function updateClock() {
      try {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: timezone || undefined,
        };
        setLocalTime(new Intl.DateTimeFormat([], options).format(now));
      } catch {
        setLocalTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  const high = daily.temperature_2m_max[0] ?? current.temperature_2m;
  const low = daily.temperature_2m_min[0] ?? current.temperature_2m;
  const unitLabel = unit === 'celsius' ? '°' : '°';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Spotlight
        fill="rgba(220, 232, 255, 0.08)"
        size={500}
        className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-2xl transition-colors duration-300 md:p-8"
      >
        <BorderBeam
          size={220}
          duration={16}
          borderWidth={1}
          colorFrom="rgba(220, 232, 255, 0.45)"
          colorTo="rgba(255, 217, 138, 0.3)"
        />

        {/* Top header row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="font-display text-2xl font-medium tracking-tight text-white/95 md:text-3xl">
                {location.name}
              </h2>
              {location.country && (
                <span className="font-mono text-xs text-white/40">
                  {location.country}
                </span>
              )}
            </div>
            <p className="mt-1 font-mono text-xs text-white/45">
              Local time {localTime || '—'}
            </p>
          </div>

          <button
            onClick={onToggleBookmark}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark location'}
            className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-white/60 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white active:scale-95"
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck size={13} className="text-[var(--gold)]" />
                <span className="hidden sm:inline text-white/80">Saved</span>
              </>
            ) : (
              <>
                <Bookmark size={13} className="text-white/40" />
                <span className="hidden sm:inline">Save</span>
              </>
            )}
          </button>
        </div>

        {/* Hero temperature display */}
        <div className="mt-6 flex items-end justify-between gap-6">
          <div>
            <div className="flex items-baseline">
              <span className="font-display text-7xl font-light tracking-tighter text-white md:text-8xl lg:text-9xl">
                <NumberTicker value={Math.round(current.temperature_2m)} />
              </span>
              <span className="font-display text-4xl font-extralight text-white/40 md:text-5xl">
                {unitLabel}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-4 font-mono text-xs text-white/60">
              <span>
                Feels like <span className="text-white font-medium">{Math.round(current.apparent_temperature)}°</span>
              </span>
              <span className="flex items-center gap-1 text-white/75">
                <ArrowUp size={12} className="text-white/40" />
                <span>{Math.round(high)}°</span>
                <span className="text-white/30">/</span>
                <ArrowDown size={12} className="text-white/40" />
                <span>{Math.round(low)}°</span>
              </span>
            </div>
          </div>

          {/* Condition Icon & Label */}
          <div className="flex flex-col items-end gap-1.5 pb-1">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center justify-center"
            >
              <WeatherIcon size={44} strokeWidth={1.25} className="text-[var(--sky)]" />
            </motion.div>
            <span className="text-sm font-medium tracking-tight text-white/90">{label}</span>
          </div>
        </div>

        {/* Minimalist divider and subtle status line */}
        <div className="mt-6 border-t border-white/[0.06] pt-3.5 flex items-center justify-between text-xs text-white/60 font-mono">
          <span>{label} throughout the day</span>
          <span className="text-[var(--sky)]">
            Rain chance: {daily.precipitation_probability_max[0]}%
          </span>
        </div>
      </Spotlight>
    </motion.div>
  );
}
