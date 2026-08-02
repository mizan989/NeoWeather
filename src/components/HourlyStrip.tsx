import { getWeatherMeta } from '../lib/weatherCodes';
import type { HourlyData, TempUnit } from '../types/weather';

interface Props {
  hourly: HourlyData;
  timezone: string;
  unit: TempUnit;
}

export default function HourlyStrip({ hourly }: Props) {
  const now = new Date();
  const startIdx = hourly.time.findIndex((t) => new Date(t) >= now);
  const idx = startIdx === -1 ? 0 : startIdx;
  const slice = Array.from({ length: 24 }, (_, i) => idx + i).filter((i) => i < hourly.time.length);

  return (
    <section>
      <h2 className="mb-3 font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--ink-soft)' }}>
        Next 24 hours
      </h2>
      <div className="hide-scrollbar flex gap-6 overflow-x-auto pb-2">
        {slice.map((i) => {
          const time = new Date(hourly.time[i]);
          const hourLabel = time.toLocaleTimeString([], { hour: 'numeric' });
          const isDayHour = time.getHours() >= 6 && time.getHours() < 20;
          const { icon: Icon } = getWeatherMeta(hourly.weather_code[i], isDayHour);
          return (
            <div key={hourly.time[i]} className="flex shrink-0 flex-col items-center gap-2">
              <span className="font-mono text-xs" style={{ color: 'var(--ink-soft)' }}>
                {i === idx ? 'Now' : hourLabel}
              </span>
              <Icon size={18} strokeWidth={1.5} style={{ color: 'var(--sky)' }} />
              <span className="text-sm tabular-nums">{Math.round(hourly.temperature_2m[i])}°</span>
              {hourly.precipitation_probability[i] > 15 && (
                <span className="font-mono text-[10px]" style={{ color: 'var(--gold)' }}>
                  {hourly.precipitation_probability[i]}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
