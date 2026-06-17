import type { WeatherData } from '../types/weather';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY as string;
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<WeatherData>;
}

export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY as string;
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<WeatherData>;
}
