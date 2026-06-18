import { openDB, type IDBPDatabase } from 'idb';
import type { CachedWeather, WeatherData } from '../types/weather';

const DB_NAME = 'weather-app';
const STORE_NAME = 'weather-cache';
const DB_VERSION = 1;
const CACHE_KEY = 'last-weather';

async function getDb(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveWeatherCache(data: WeatherData): Promise<void> {
  const db = await getDb();
  const entry: CachedWeather = { data, cachedAt: Date.now() };
  await db.put(STORE_NAME, entry, CACHE_KEY);
}

export async function loadWeatherCache(): Promise<CachedWeather | undefined> {
  const db = await getDb();
  return db.get(STORE_NAME, CACHE_KEY) as Promise<CachedWeather | undefined>;
}

export async function clearWeatherCache(): Promise<void> {
  const db = await getDb();
  await db.delete(STORE_NAME, CACHE_KEY);
}
