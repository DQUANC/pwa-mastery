export interface WeatherCoords {
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WeatherWind {
  speed: number;
  deg: number;
}

export interface WeatherData {
  coord: WeatherCoords;
  weather: WeatherCondition[];
  main: WeatherMain;
  wind: WeatherWind;
  name: string;
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
}

export interface CachedWeather {
  data: WeatherData;
  cachedAt: number;
}
