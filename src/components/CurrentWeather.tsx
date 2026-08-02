import { getWeatherMeta } from '../lib/weatherCodes';
import type { CurrentData, TempUnit, WeatherLocation } from '../types/weather';

interface Props {
  location: WeatherLocation;
  current: CurrentData;
  unit: TempUnit;
}

export default function CurrentWeather({ location, current, unit }: Props) {
  const { label, icon: Icon } = getWeatherMeta(current.weather_code, current.is_day === 1);
  const unitSymbol = unit === 'celsius' ? '°' : '°';

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-baseline gap-2">
        <p className="font-mono text-xs tracking-wide" style={{ color: 'var(--ink-soft)' }}>
          {location.name}{location.admin1 ? `, ${location.admin1}` : ''}
        </p>
      </div>

      <div className="flex items-center gap-5">
        <span className="font-display text-[5.5rem] leading-none font-medium tabular-nums" style={{ letterSpacing: '-0.03em' }}>
          {Math.round(current.temperature_2m)}{unitSymbol}
        </span>
        <Icon size={44} strokeWidth={1.25} style={{ color: 'var(--sky)' }} />
      </div>

      <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--ink-soft)' }}>
        <span>{label}</span>
        <span className="font-mono text-xs">feels {Math.round(current.apparent_temperature)}{unitSymbol}</span>
      </div>
    </div>
  );
}
