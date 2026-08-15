import { 
  Wind, Sunrise, Sunset, Sun, Droplets, Eye, Gauge, Compass
} from 'lucide-react';
import { BentoCard, BentoGrid } from './inspira/BentoGrid';
import { getWindDirection, getUVDetails, getBeaufortScale, getHumidityComfort } from '../lib/weatherCodes';
import type { CurrentData, DailyData } from '../types/weather';

interface TelemetryBentoGridProps {
  current: CurrentData;
  daily: DailyData;
}

function fmtTime(iso?: string) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } catch {
    return '—';
  }
}

export default function TelemetryBentoGrid({ current, daily }: TelemetryBentoGridProps) {
  const sunriseIso = daily.sunrise[0];
  const sunsetIso = daily.sunset[0];
  const sunriseStr = fmtTime(sunriseIso);
  const sunsetStr = fmtTime(sunsetIso);

  let sunProgress = 0.5;
  let isSunUp = true;
  if (sunriseIso && sunsetIso) {
    const now = new Date().getTime();
    const rise = new Date(sunriseIso).getTime();
    const set = new Date(sunsetIso).getTime();
    if (now < rise) {
      sunProgress = 0;
      isSunUp = false;
    } else if (now > set) {
      sunProgress = 1;
      isSunUp = false;
    } else {
      sunProgress = (now - rise) / (set - rise);
      isSunUp = true;
    }
  }

  const windDir = getWindDirection(current.wind_direction_10m);
  const beaufort = getBeaufortScale(current.wind_speed_10m);
  const gustSpeed = current.wind_gusts_10m ? Math.round(current.wind_gusts_10m) : Math.round(current.wind_speed_10m * 1.2);

  const uvVal = current.uv_index ?? (daily.uv_index_max ? daily.uv_index_max[0] : 0);
  const uvInfo = getUVDetails(uvVal);

  const comfort = getHumidityComfort(current.relative_humidity_2m, current.dew_point_2m);
  const visibilityKm = current.visibility ? (current.visibility / 1000).toFixed(1) : '10.0';
  const cloudCover = current.cloud_cover ?? 20;
  const pressure = Math.round(current.pressure_msl);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-mono text-xs uppercase tracking-wider text-white/40">
        Atmospheric Conditions
      </h3>

      <BentoGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* 1. Wind & Direction */}
        <BentoCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50">
            <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider">
              <Wind size={14} className="text-[var(--sky)]" />
              <span>Wind</span>
            </div>
            <span className="font-mono text-xs">{windDir.cardinal}</span>
          </div>

          <div className="my-3 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-4xl font-light text-white">
                  {Math.round(current.wind_speed_10m)}
                </span>
                <span className="font-mono text-xs text-white/40">km/h</span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-white/60">
                Gusts {gustSpeed} km/h • {beaufort.description}
              </p>
            </div>

            {/* Minimalist Compass */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02]">
              <div
                className="transition-transform duration-1000 ease-out"
                style={{ transform: `rotate(${current.wind_direction_10m}deg)` }}
              >
                <Compass size={24} strokeWidth={1.25} className="text-[var(--sky)]" />
              </div>
            </div>
          </div>

          <div className="font-mono text-[11px] text-white/40">
            From {windDir.label} ({Math.round(current.wind_direction_10m)}°)
          </div>
        </BentoCard>

        {/* 2. Solar Arc */}
        <BentoCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50">
            <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider">
              <Sun size={14} className="text-[var(--gold)]" />
              <span>Sun & Daylight</span>
            </div>
            <span className="font-mono text-xs">{isSunUp ? 'Day' : 'Night'}</span>
          </div>

          {/* Minimalist SVG Solar Arc */}
          <div className="my-2 flex flex-col items-center">
            <div className="w-full h-14 overflow-hidden">
              <svg viewBox="0 0 160 60" className="w-full h-full">
                <path
                  d="M 15 55 Q 80 5 145 55"
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
                {isSunUp && (
                  <circle
                    cx={15 + 130 * sunProgress}
                    cy={55 - 50 * Math.sin(sunProgress * Math.PI)}
                    r="4"
                    fill="var(--gold)"
                    className="filter drop-shadow-[0_0_6px_rgba(255,217,138,0.8)]"
                  />
                )}
              </svg>
            </div>

            <div className="flex w-full items-center justify-between text-xs font-mono text-white/70">
              <div className="flex items-center gap-1">
                <Sunrise size={12} className="text-[var(--gold)]" />
                <span>{sunriseStr}</span>
              </div>
              <div className="flex items-center gap-1">
                <Sunset size={12} className="text-orange-300" />
                <span>{sunsetStr}</span>
              </div>
            </div>
          </div>

          <div className="font-mono text-[11px] text-white/40">
            {isSunUp ? `${Math.round(sunProgress * 100)}% daylight passed` : 'Night interval'}
          </div>
        </BentoCard>

        {/* 3. UV Index */}
        <BentoCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50">
            <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider">
              <Sun size={14} style={{ color: uvInfo.color }} />
              <span>UV Index</span>
            </div>
            <span className="font-mono text-xs" style={{ color: uvInfo.color }}>
              {uvInfo.level}
            </span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-light text-white">
                {uvVal.toFixed(1)}
              </span>
              <span className="font-mono text-xs text-white/40">/ 11+</span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-white/60">
              {uvInfo.advice}
            </p>
          </div>

          {/* Minimalist Bar */}
          <div className="h-1 w-full rounded-full bg-white/[0.08] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, (uvVal / 11) * 100)}%`,
                backgroundColor: uvInfo.color,
              }}
            />
          </div>
        </BentoCard>

        {/* 4. Humidity */}
        <BentoCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50">
            <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider">
              <Droplets size={14} className="text-[var(--sky)]" />
              <span>Humidity</span>
            </div>
            <span className="font-mono text-xs">{comfort.label}</span>
          </div>

          <div className="my-3 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-4xl font-light text-white">
                  {current.relative_humidity_2m}
                </span>
                <span className="font-mono text-sm text-[var(--sky)]">%</span>
              </div>
              {current.dew_point_2m !== undefined && (
                <p className="mt-1 font-mono text-[11px] text-white/60">
                  Dew point {Math.round(current.dew_point_2m)}°
                </p>
              )}
            </div>

            <div className="h-10 w-10 flex items-center justify-center rounded-full border border-white/[0.08]">
              <Droplets size={16} className="text-[var(--sky)]" />
            </div>
          </div>

          <div className="font-mono text-[11px] text-white/40">
            {comfort.description}
          </div>
        </BentoCard>

        {/* 5. Visibility & Clouds */}
        <BentoCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50">
            <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider">
              <Eye size={14} className="text-emerald-400" />
              <span>Visibility</span>
            </div>
            <span className="font-mono text-xs">{cloudCover}% clouds</span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-light text-white">
                {visibilityKm}
              </span>
              <span className="font-mono text-xs text-white/40">km</span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-white/60">
              {Number(visibilityKm) >= 10 ? 'Clear atmospheric horizon' : 'Moderate haze'}
            </p>
          </div>

          <div className="h-1 w-full rounded-full bg-white/[0.08] overflow-hidden">
            <div
              className="h-full rounded-full bg-white/40 transition-all duration-700"
              style={{ width: `${cloudCover}%` }}
            />
          </div>
        </BentoCard>

        {/* 6. Pressure */}
        <BentoCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50">
            <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider">
              <Gauge size={14} className="text-amber-300" />
              <span>Pressure</span>
            </div>
            <span className="font-mono text-xs">hPa</span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-light text-white">
                {pressure}
              </span>
              <span className="font-mono text-xs text-white/40">hPa</span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-white/60">
              {pressure > 1018 ? 'High pressure • Stable' : pressure < 1008 ? 'Low pressure • Precipit.' : 'Standard baseline'}
            </p>
          </div>

          <div className="font-mono text-[11px] text-white/40">
            MSL normalized (1013 hPa std)
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
