import { Droplets, Wind, Gauge, Sunrise, Sunset, Eye } from 'lucide-react';
import type { CurrentData, DailyData } from '../types/weather';

interface Props {
  current: CurrentData;
  daily: DailyData;
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function DetailsGrid({ current, daily }: Props) {
  const items = [
    { icon: Droplets, label: 'Humidity', value: `${current.relative_humidity_2m}%` },
    { icon: Wind, label: 'Wind', value: `${Math.round(current.wind_speed_10m)} km/h` },
    { icon: Gauge, label: 'Pressure', value: `${Math.round(current.pressure_msl)} hPa` },
    { icon: Sunrise, label: 'Sunrise', value: fmtTime(daily.sunrise[0]) },
    { icon: Sunset, label: 'Sunset', value: fmtTime(daily.sunset[0]) },
    { icon: Eye, label: 'Rain chance', value: `${daily.precipitation_probability_max[0]}%` },
  ];

  return (
    <section className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5" style={{ color: 'var(--ink-soft)' }}>
            <Icon size={13} strokeWidth={1.5} />
            <span className="font-mono text-[10px] uppercase tracking-wider">{label}</span>
          </div>
          <span className="text-lg tabular-nums">{value}</span>
        </div>
      ))}
    </section>
  );
}
