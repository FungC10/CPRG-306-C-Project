# WeatherFlow

A weather application built with Next.js 15, TypeScript, and Tailwind CSS. Search for any city to view current weather, 5-day forecasts, and see locations on an interactive map.

## Features

- Current weather with temperature, humidity, wind speed, and conditions
- 5-day weather forecast
- Hourly temperature chart (24-hour prediction)
- Search bar with city suggestions
- Favorite cities (save up to 8)
- Temperature unit toggle (Celsius/Fahrenheit)
- Light/dark mode toggle
- Interactive map with zoom controls
- Use current location
- Offline support (caches last forecast)
- Can be installed as mobile app (PWA)

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query (React Query)
- Leaflet & React-Leaflet (maps)
- Chart.js (charts)
- React Hook Form
- Framer Motion (animations)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

The app works with Open-Meteo API by default (no API key needed). If you want to use OpenWeatherMap instead, create a `.env.local` file:

```
NEXT_PUBLIC_WEATHER_PROVIDER=openweather
NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## APIs Used

- **Weather**: Open-Meteo (https://api.open-meteo.com/v1/forecast)
- **Geocoding**: Open-Meteo Geocoding API
- **Maps**: OpenStreetMap tiles via Leaflet

## Project Structure

```
src/
├── app/          # Next.js pages
├── components/   # React components
├── lib/          # Utilities and API functions
└── styles/       # Global CSS
```
