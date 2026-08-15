import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Droplets, Wind, Sun, Sunrise, Sunset } from 'lucide-react';
import { getWeatherMeta, getUVDetails } from '../lib/weatherCodes';
import { BentoCard } from './inspira/BentoGrid';
import type { DailyData } from '../types/weather';

interface DailyListProps {
  daily: DailyData;
}

function fmtDate(iso: string, isToday: boolean) {
  if (isToday) return { day: 'Today', date: 'Now' };
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString([], { weekday: 'short' }),
    date: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
  };
}

function fmtTime(iso?: string) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } catch {
    return '—';
  }
}

export default function DailyList({ daily }: DailyListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const allMin = Math.min(...daily.temperature_2m_min);
  const allMax = Math.max(...daily.temperature_2m_max);
  const range = allMax - allMin || 1;

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <BentoCard className="w-full">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h3 className="font-mono text-xs uppercase tracking-wider text-white/50">
          7-Day Forecast Matrix
        </h3>
        <span className="font-mono text-[10px] text-white/30">Click row to expand</span>
      </div>

      <div className="mt-1 divide-y divide-white/[0.04]">
        {daily.time.map((date, i) => {
          const isToday = i === 0;
          const { day } = fmtDate(date, isToday);
          const { label, icon: Icon } = getWeatherMeta(daily.weather_code[i], true);
          const lo = daily.temperature_2m_min[i];
          const hi = daily.temperature_2m_max[i];
          const barStart = ((lo - allMin) / range) * 100;
          const barWidth = Math.max(8, ((hi - lo) / range) * 100);
          const precipProb = daily.precipitation_probability_max[i];
          const precipSum = daily.precipitation_sum ? daily.precipitation_sum[i] : 0;
          const maxWind = daily.wind_speed_10m_max ? Math.round(daily.wind_speed_10m_max[i]) : null;
          const maxGusts = daily.wind_gusts_10m_max ? Math.round(daily.wind_gusts_10m_max[i]) : null;
          const uvMax = daily.uv_index_max ? daily.uv_index_max[i] : null;
          const uvInfo = uvMax !== null ? getUVDetails(uvMax) : null;
          const isExpanded = expandedIndex === i;

          return (
            <div key={date} className="transition-colors">
              <button
                onClick={() => toggleExpand(i)}
                className={`flex w-full items-center gap-3 py-3 text-left text-sm transition-colors duration-200 rounded-xl px-1.5 ${
                  isExpanded ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* Day label */}
                <span className={`w-14 shrink-0 font-mono text-xs ${isToday ? 'text-[var(--sky)] font-medium' : 'text-white/80'}`}>
                  {day}
                </span>

                {/* Weather icon & label */}
                <div className="flex w-28 sm:w-36 shrink-0 items-center gap-2">
                  <Icon size={16} strokeWidth={1.5} className="shrink-0 text-[var(--sky)]" />
                  <span className="truncate text-xs text-white/65">{label}</span>
                </div>

                {/* Rain probability */}
                <div className="w-10 shrink-0">
                  {precipProb > 10 ? (
                    <span className="font-mono text-[11px] text-[var(--gold)]">
                      {precipProb}%
                    </span>
                  ) : (
                    <span className="font-mono text-[11px] text-white/20">•</span>
                  )}
                </div>

                {/* Low temp */}
                <span className="w-7 shrink-0 text-right font-mono text-xs text-white/50 tabular-nums">
                  {Math.round(lo)}°
                </span>

                {/* Scaled bar */}
                <div className="relative mx-1 h-1.5 flex-1 rounded-full bg-white/[0.08]">
                  <div
                    className="absolute h-full rounded-full transition-all duration-700"
                    style={{
                      left: `${barStart}%`,
                      width: `${barWidth}%`,
                      background: 'linear-gradient(90deg, var(--sky), var(--gold))',
                    }}
                  />
                </div>

                {/* High temp */}
                <span className="w-7 shrink-0 font-mono text-xs text-white/90 tabular-nums">
                  {Math.round(hi)}°
                </span>

                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-white/30"
                >
                  <ChevronDown size={13} />
                </motion.div>
              </button>

              {/* Smooth Animated Accordion Drawer */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="my-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-xs font-mono">
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-white/70">
                        <div className="flex items-center gap-1.5">
                          <Wind size={13} className="text-[var(--sky)]" />
                          <span>Wind {maxWind ?? '—'} km/h {maxGusts ? `(${maxGusts}g)` : ''}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Droplets size={13} className="text-[var(--gold)]" />
                          <span>Rain {precipSum > 0 ? `${precipSum.toFixed(1)} mm` : '0 mm'}</span>
                        </div>

                        {uvInfo && (
                          <div className="flex items-center gap-1.5">
                            <Sun size={13} style={{ color: uvInfo.color }} />
                            <span>UV Max {uvMax} ({uvInfo.level})</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Sunrise size={12} className="text-[var(--gold)]" />
                            <span>{fmtTime(daily.sunrise[i])}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Sunset size={12} className="text-orange-300" />
                            <span>{fmtTime(daily.sunset[i])}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </BentoCard>
  );
}
