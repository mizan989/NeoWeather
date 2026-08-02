import { getWeatherMeta } from '../lib/weatherCodes';
import type { DailyData } from '../types/weather';

interface Props {
  daily: DailyData;
}

export default function DailyList({ daily }: Props) {
  // Establish the min/max range across the week so each day's bar
  // is drawn to scale — a quiet way to show relative temperature.
  const allMin = Math.min(...daily.temperature_2m_min);
  const allMax = Math.max(...daily.temperature_2m_max);
  const range = allMax - allMin || 1;

  return (
    <section>
      <h2 className="mb-3 font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--ink-soft)' }}>
        7-day forecast
      </h2>
      <ul>
        {daily.time.map((date, i) => {
          const d = new Date(date);
          const label = i === 0 ? 'Today' : d.toLocaleDateString([], { weekday: 'short' });
          const { icon: Icon } = getWeatherMeta(daily.weather_code[i], true);
          const lo = daily.temperature_2m_min[i];
          const hi = daily.temperature_2m_max[i];
          const barStart = ((lo - allMin) / range) * 100;
          const barWidth = ((hi - lo) / range) * 100;

          return (
            <li
              key={date}
              className="flex items-center gap-4 border-b py-3 text-sm last:border-none"
              style={{ borderColor: 'var(--line)' }}
            >
              <span className="w-10 shrink-0" style={{ color: 'var(--ink-soft)' }}>{label}</span>
              <Icon size={16} strokeWidth={1.5} style={{ color: 'var(--sky)' }} className="shrink-0" />
              {daily.precipitation_probability_max[i] > 15 ? (
                <span className="w-8 shrink-0 font-mono text-[11px]" style={{ color: 'var(--gold)' }}>
                  {daily.precipitation_probability_max[i]}%
                </span>
              ) : (
                <span className="w-8 shrink-0" />
              )}
              <span className="w-7 shrink-0 text-right tabular-nums" style={{ color: 'var(--ink-soft)' }}>
                {Math.round(lo)}°
              </span>
              <div className="relative h-[3px] flex-1 rounded-full" style={{ backgroundColor: 'var(--line)' }}>
                <div
                  className="absolute h-full rounded-full"
                  style={{
                    left: `${barStart}%`,
                    width: `${barWidth}%`,
                    background: 'linear-gradient(90deg, var(--sky), var(--gold))',
                  }}
                />
              </div>
              <span className="w-7 shrink-0 tabular-nums">{Math.round(hi)}°</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
