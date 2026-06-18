import { useState } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { useWeather } from './hooks/useWeather';
import { WeatherCard } from './components/WeatherCard';
import { OfflineBanner } from './components/OfflineBanner';

function App() {
  const [cityInput, setCityInput] = useState('');
  const [searchCity, setSearchCity] = useState<string | null>(null);

  const { position, error: geoError, loading: geoLoading } = useGeolocation();

  const lat = searchCity ? null : (position?.coords.latitude ?? null);
  const lon = searchCity ? null : (position?.coords.longitude ?? null);

  const { weather, cachedWeather, loading, error, isStale } = useWeather(lat, lon, searchCity);

  const displayData = weather ?? cachedWeather?.data ?? null;
  const cachedAt = cachedWeather?.cachedAt;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = cityInput.trim();
    if (trimmed) setSearchCity(trimmed);
  }

  function handleReset() {
    setSearchCity(null);
    setCityInput('');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 px-4 py-12">
      <div className="mx-auto max-w-md space-y-4">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Weather App</h1>
          <p className="mt-1 text-sm text-gray-500">Offline-first with Network-First caching</p>
        </header>

        <OfflineBanner cachedAt={cachedAt} />

        {/* Geolocation error — show manual city input */}
        {geoError && !searchCity && (
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm text-gray-500">
              Location access denied. Enter a city name:
            </p>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={cityInput}
                onChange={(e) => { setCityInput(e.target.value); }}
                placeholder="e.g. London"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                aria-label="City name"
              />
              <button
                type="submit"
                className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Show search override bar when using city search */}
        {searchCity && (
          <div className="flex items-center justify-between rounded-lg bg-white px-4 py-2 shadow-sm text-sm">
            <span className="text-gray-500">
              Showing weather for <strong>{searchCity}</strong>
            </span>
            <button
              onClick={handleReset}
              className="text-sky-500 hover:underline"
            >
              Use my location
            </button>
          </div>
        )}

        {/* Loading */}
        {(geoLoading || loading) && !displayData && (
          <p className="py-12 text-center text-sm text-gray-400" role="status">
            {geoLoading ? 'Detecting location…' : 'Fetching weather…'}
          </p>
        )}

        {/* Error with no fallback */}
        {error && !displayData && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        {/* Weather display */}
        {displayData && (
          <WeatherCard data={displayData} isStale={isStale} />
        )}

        {/* City search when geo succeeded but user wants to search */}
        {position && !geoError && (
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={cityInput}
              onChange={(e) => { setCityInput(e.target.value); }}
              placeholder="Search another city…"
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              aria-label="Search city"
            />
            <button
              type="submit"
              className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600"
            >
              Search
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
