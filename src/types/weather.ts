export type TempUnit = 'celsius' | 'fahrenheit';

export interface GeocodeResult {
  id: number;
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface HourlyData {
  time: string[];
  temperature_2m: number[];
  apparent_temperature?: number[];
  weather_code: number[];
  precipitation_probability: number[];
  precipitation?: number[];
  relative_humidity_2m?: number[];
  wind_speed_10m?: number[];
  uv_index?: number[];
  visibility?: number[];
}

export interface DailyData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max?: number[];
  apparent_temperature_min?: number[];
  precipitation_probability_max: number[];
  precipitation_sum?: number[];
  uv_index_max?: number[];
  wind_speed_10m_max?: number[];
  wind_gusts_10m_max?: number[];
  sunrise: string[];
  sunset: string[];
  daylight_duration?: number[];
}

export interface CurrentData {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m?: number;
  pressure_msl: number;
  surface_pressure?: number;
  cloud_cover?: number;
  uv_index?: number;
  visibility?: number;
  dew_point_2m?: number;
  is_day: number;
  time: string;
}

export interface ForecastResponse {
  current: CurrentData;
  hourly: HourlyData;
  daily: DailyData;
  timezone: string;
  utc_offset_seconds: number;
}

export interface WeatherLocation {
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
}

export type WeatherViewTab = 'overview' | 'hourly' | 'daily' | 'telemetry';
