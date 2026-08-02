# NeoWeather

Weather, reimagined — minimally.

A quiet, precise weather app. No glass cards, no particle storms — just a
clean type-forward layout with one signature detail: the **horizon line**, a
thin gradient bar under the temperature that shifts color with the current
condition and time of day (warm blue-to-gold by day, deep navy-to-indigo
by night, cooler grays for fog/rain/snow).

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- [Open-Meteo](https://open-meteo.com/) — forecast + geocoding APIs (free, no key required)
- lucide-react for icons

## Features

- Search any city, or use current location (geolocation + reverse geocoding)
- Current conditions: temperature, feels-like, condition, humidity, wind, pressure, sunrise/sunset, rain chance
- Next 24 hours, scrollable
- 7-day forecast with a scaled low/high range bar per day
- °C / °F toggle
- Light / dark mode (persisted, respects system preference by default)
- Fully responsive, mobile-first

## Run it

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Output goes to `dist/` — deploy it anywhere static (Vercel, Netlify, GitHub Pages).

## Project structure

```
src/
  components/     UI pieces (SearchBar, CurrentWeather, HourlyStrip, DailyList, DetailsGrid, Toggles)
  hooks/          useWeather (data fetching), useGeolocation
  lib/            api.ts (Open-Meteo client), weatherCodes.ts (WMO code -> icon/label),
                  horizon.ts (the signature gradient logic)
  types/          shared TypeScript types
```

## Notes / next steps

This is a deliberately trimmed-down build of a larger spec (air quality, maps,
charts, PWA install, favorites). The architecture (typed API layer, one hook
per concern) is set up so any of those can be added as a new component plus a
small addition to `lib/api.ts` without restructuring anything.
