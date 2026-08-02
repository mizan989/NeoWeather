import {
  Sun, Moon, CloudSun, CloudMoon, Cloudy,
  CloudFog, CloudDrizzle, CloudRain, CloudSnow,
  CloudLightning, CloudHail, type LucideIcon,
} from 'lucide-react';

export interface WeatherMeta {
  label: string;
  icon: LucideIcon;
}

// WMO weather interpretation codes -> label + icon
const CODES: Record<number, { label: string; day: LucideIcon; night: LucideIcon }> = {
  0:  { label: 'Clear sky',        day: Sun,          night: Moon },
  1:  { label: 'Mostly clear',     day: CloudSun,     night: CloudMoon },
  2:  { label: 'Partly cloudy',    day: CloudSun,     night: CloudMoon },
  3:  { label: 'Overcast',         day: Cloudy,       night: Cloudy },
  45: { label: 'Fog',              day: CloudFog,     night: CloudFog },
  48: { label: 'Rime fog',         day: CloudFog,     night: CloudFog },
  51: { label: 'Light drizzle',    day: CloudDrizzle, night: CloudDrizzle },
  53: { label: 'Drizzle',          day: CloudDrizzle, night: CloudDrizzle },
  55: { label: 'Dense drizzle',    day: CloudDrizzle, night: CloudDrizzle },
  56: { label: 'Freezing drizzle', day: CloudDrizzle, night: CloudDrizzle },
  57: { label: 'Freezing drizzle', day: CloudDrizzle, night: CloudDrizzle },
  61: { label: 'Light rain',       day: CloudRain,    night: CloudRain },
  63: { label: 'Rain',             day: CloudRain,    night: CloudRain },
  65: { label: 'Heavy rain',       day: CloudRain,    night: CloudRain },
  66: { label: 'Freezing rain',    day: CloudRain,    night: CloudRain },
  67: { label: 'Freezing rain',    day: CloudRain,    night: CloudRain },
  71: { label: 'Light snow',       day: CloudSnow,    night: CloudSnow },
  73: { label: 'Snow',             day: CloudSnow,    night: CloudSnow },
  75: { label: 'Heavy snow',       day: CloudSnow,    night: CloudSnow },
  77: { label: 'Snow grains',      day: CloudSnow,    night: CloudSnow },
  80: { label: 'Light showers',    day: CloudRain,    night: CloudRain },
  81: { label: 'Showers',          day: CloudRain,    night: CloudRain },
  82: { label: 'Heavy showers',    day: CloudRain,    night: CloudRain },
  85: { label: 'Snow showers',     day: CloudSnow,    night: CloudSnow },
  86: { label: 'Heavy snow showers', day: CloudSnow,  night: CloudSnow },
  95: { label: 'Thunderstorm',     day: CloudLightning, night: CloudLightning },
  96: { label: 'Thunderstorm, hail', day: CloudHail,  night: CloudHail },
  99: { label: 'Severe thunderstorm', day: CloudHail, night: CloudHail },
};

export function getWeatherMeta(code: number, isDay: boolean): WeatherMeta {
  const entry = CODES[code] ?? CODES[0];
  return { label: entry.label, icon: isDay ? entry.day : entry.night };
}

// Broad condition family, used to pick the horizon-gradient palette
export type ConditionFamily = 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm';

export function getConditionFamily(code: number): ConditionFamily {
  if (code === 0 || code === 1) return 'clear';
  if (code === 2 || code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 67) return 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 80 && code <= 82) return 'rain';
  if (code >= 95) return 'storm';
  return 'clear';
}
