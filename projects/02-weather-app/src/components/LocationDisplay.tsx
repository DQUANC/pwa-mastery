interface LocationDisplayProps {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

export function LocationDisplay({ city, country, lat, lon }: LocationDisplayProps) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900">
        {city}, <span className="text-gray-500">{country}</span>
      </h2>
      <p className="mt-1 text-xs text-gray-400">
        {lat.toFixed(4)}°N, {lon.toFixed(4)}°E
      </p>
    </div>
  );
}
