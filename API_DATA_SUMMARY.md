# Real vs Fake API Data Summary

## Real API Data (from Open-Meteo)

All of these come from the actual Open-Meteo API:

1. **Current Weather** (`src/lib/api.ts` - `getCurrentOpenMeteo()`)
   - Temperature
   - Humidity
   - Wind speed and direction
   - Weather conditions/codes
   - Location coordinates

2. **Daily Forecast** (`src/lib/api.ts` - `getForecast()`)
   - 5-day forecast with daily high/low temperatures
   - Weather conditions for each day
   - All from real API

3. **City Search/Geocoding** (`src/lib/api.ts` - `searchCity()`)
   - City names and coordinates
   - Country information
   - All from Open-Meteo Geocoding API

## Fake/Generated Data

1. **Hourly Temperature Data** - FAKE
   - Location: `src/lib/api.ts` line 165-179 (`buildDeterministicHourly()`)
   - Also: `src/components/CurrentCard.tsx` line 137-152 (fallback if no hourly data)
   - Why: Open-Meteo API doesn't always provide hourly data in the format we need, so we generate deterministic fake data based on current temperature and location
   - How: Uses math functions (sin/cos) to create a realistic-looking 24-hour temperature curve

2. **Pressure Data** - FAKE (hardcoded)
   - Location: `src/lib/api.ts` line 96
   - Value: Always 1013 hPa
   - Why: Open-Meteo free tier doesn't provide pressure data

3. **Feels Like Temperature** - FAKE (same as actual temp)
   - Location: `src/lib/api.ts` line 94
   - Value: Same as `temperature_2m`
   - Why: Open-Meteo doesn't provide feels_like in free tier

## Summary

- **Real**: Current weather, daily forecasts, city search
- **Fake**: Hourly temperature chart, pressure (always 1013), feels_like (same as temp)

The hourly chart is the main fake data - it's generated to always show something in the UI even when the API doesn't provide hourly data.

