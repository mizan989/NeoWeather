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
  weather_code: number[];
  precipitation_probability: number[];
}

export interface DailyData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  sunrise: string[];
  sunset: string[];
}

export interface CurrentData {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  pressure_msl: number;
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
