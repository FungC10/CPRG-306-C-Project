'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { GeoPoint, Units, CurrentWeather, Forecast } from '@/lib/types';
import { queryKeys } from '@/lib/queryKeys';
import { getCurrent, getForecast } from '@/lib/api';
import { getJSON } from '@/lib/storage';
import { parseCityFromUrl } from '@/lib/cityUtils';
import SearchBar from '@/components/SearchBar';
import UnitToggle from '@/components/UnitToggle';
import ThemeToggle from '@/components/ThemeToggle';
import { HeaderHeightVar } from '@/components/HeaderHeightVar';
import CurrentCard from '@/components/CurrentCard';
import ForecastList from '@/components/ForecastList';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import LoadingShimmer from '@/components/LoadingShimmer';

// Lazy-load MapPanel to protect initial bundle
const MapPanel = dynamic(() => import('@/components/MapPanel'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-slate-800/50 rounded-lg border border-slate-700/30 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-400 border-t-transparent mx-auto mb-2"></div>
        <p className="text-slate-400 text-sm">Loading map...</p>
      </div>
    </div>
  )
});

interface CityPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CityPage({ params }: CityPageProps) {
  const searchParams = useSearchParams();
  const [units, setUnits] = useState<Units>('metric');
  const [showMap, setShowMap] = useState(false);
  const [slug, setSlug] = useState<string>('');

  // Handle async params
  useEffect(() => {
    params.then(({ slug }) => setSlug(slug));
  }, [params]);

  // Parse city data from URL parameters
  const { city: selectedCity, units: urlUnits } = slug ? parseCityFromUrl(slug, searchParams) : { city: null, units: 'metric' };

  // Initialize units from URL or localStorage
  useEffect(() => {
    if (urlUnits && (urlUnits === 'metric' || urlUnits === 'imperial')) {
      setUnits(urlUnits);
    } else {
      // Fallback to stored units
      const storedUnits = getJSON<Units>('weatherflow:units');
      if (storedUnits) {
        setUnits(storedUnits);
      }
    }
  }, [urlUnits]);

  // Fetch weather data
  const { data: currentWeather, isLoading: isLoadingWeather, error: weatherError } = useQuery({
    queryKey: queryKeys.current(selectedCity?.lat || 0, selectedCity?.lon || 0, units),
    queryFn: () => getCurrent(selectedCity!.lat, selectedCity!.lon, units),
    enabled: !!selectedCity && typeof window !== 'undefined',
  });

  const { data: forecastData, isLoading: isLoadingForecast, error: forecastError } = useQuery({
    queryKey: queryKeys.forecast(selectedCity?.lat || 0, selectedCity?.lon || 0, units),
    queryFn: () => getForecast(selectedCity!.lat, selectedCity!.lon, units),
    enabled: !!selectedCity && typeof window !== 'undefined',
  });

  const handleUnitsChange = (newUnits: Units) => {
    setUnits(newUnits);
    // Update URL with new units
    const url = new URL(window.location.href);
    url.searchParams.set('u', newUnits);
    window.history.replaceState({}, '', url.toString());
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  // Determine app state
  const isLoading = isLoadingWeather || isLoadingForecast;
  const hasError = weatherError || forecastError;
  const hasData = currentWeather && forecastData;

  let appState: 'empty' | 'loading' | 'error' | 'success' = 'empty';
  if (isLoading) appState = 'loading';
  else if (hasError) appState = 'error';
  else if (hasData) appState = 'success';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500">
      {/* Animated Background Elements - Behind everything, disabled in Safari */}
      <div className="bg-blobs fixed inset-0 pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-400/20 dark:bg-cyan-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

      {/* Header - Matching main page structure - Clean sticky wrapper, blur on inner div */}
      <HeaderHeightVar className="site-header top-0 z-[9999] isolate">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
          <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            {/* Logo with back button */}
            <button
              onClick={handleBackToHome}
              className="flex items-center space-x-4 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 rounded-lg p-2 -m-2"
              aria-label="Back to main page"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
              </svg>
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                  WeatherFlow
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedCity ? selectedCity.name : 'City Weather'}
                </p>
              </div>
            </button>

          {/* Search and Controls */}
            <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4 w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
                <div className="w-full sm:w-80">
              <SearchBar onCitySelect={() => {}} disabled />
                </div>
                <div className="flex items-center space-x-3">
                  <UnitToggle onChange={handleUnitsChange} />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </HeaderHeightVar>

      <main className="relative z-10 min-h-screen" role="main">
        <div className="container mx-auto px-6 py-8 max-w-4xl">

        {/* Content */}
        {appState === 'empty' && (
          <EmptyState 
            title="Invalid City URL"
            message="The city URL is invalid or missing required parameters."
            action={{
              label: "Back to Search",
              onClick: handleBackToHome
            }}
          />
        )}

        {appState === 'loading' && (
          <LoadingShimmer />
        )}

        {appState === 'error' && (
          <ErrorState 
            title="Failed to load weather data"
            message={
              weatherError instanceof Error ? weatherError.message :
              forecastError instanceof Error ? forecastError.message :
              'Something went wrong'
            }
            onRetry={handleRetry}
          />
        )}

        {appState === 'success' && (
          <div className="space-y-6">
            {/* Current Weather */}
            <CurrentCard weather={currentWeather!} units={units} />

            {/* Forecast */}
            <ForecastList forecasts={forecastData!.daily} units={units} />

            {/* Map Toggle and Panel */}
            <div className="space-y-3">
              <button
                onClick={() => setShowMap(!showMap)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>{showMap ? 'Hide map' : 'Show map'}</span>
              </button>
              
              {showMap && (
                <MapPanel
                  city={selectedCity}
                  currentWeather={currentWeather || null}
                  units={units}
                  isVisible={showMap}
                />
              )}
            </div>
          </div>
        )}
      </div>
      </main>
    </div>
  );
}
