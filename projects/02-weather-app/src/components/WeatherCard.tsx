import type { WeatherData } from '../types/weather';
import { LocationDisplay } from './LocationDisplay';

interface WeatherCardProps {
  data: WeatherData;
  isStale?: boolean;
}

export function WeatherCard({ data, isStale = false }: WeatherCardProps) {
  const condition = data.weather[0];
  const iconUrl = condition
    ? `https://openweathermap.org/img/wn/${condition.icon}@2x.png`
    : null;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <LocationDisplay
        city={data.name}
        country={data.sys.country}
        lat={data.coord.lat}
        lon={data.coord.lon}
      />

      {isStale && (
        <p className="mt-2 text-center text-xs text-amber-500">Stale data — refresh when online</p>
      )}

      <div className="mt-6 flex items-center justify-center gap-4">
        {iconUrl && (
          <img
            src={iconUrl}
            alt={condition?.description ?? 'weather icon'}
            width={80}
            height={80}
            className="drop-shadow"
          />
        )}
        <div>
          <p className="text-6xl font-thin text-gray-800">
            {Math.round(data.main.temp)}°
          </p>
          <p className="text-sm capitalize text-gray-500">{condition?.description}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 divide-x divide-gray-100 text-center text-sm">
        <div className="px-2">
          <p className="font-semibold text-gray-700">{data.main.humidity}%</p>
          <p className="text-gray-400">Humidity</p>
        </div>
        <div className="px-2">
          <p className="font-semibold text-gray-700">{data.wind.speed} m/s</p>
          <p className="text-gray-400">Wind</p>
        </div>
        <div className="px-2">
          <p className="font-semibold text-gray-700">{Math.round(data.main.feels_like)}°</p>
          <p className="text-gray-400">Feels like</p>
        </div>
      </div>
    </div>
  );
}
