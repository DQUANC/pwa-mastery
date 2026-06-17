import { render, screen } from '@testing-library/react';
import { WeatherCard } from '../components/WeatherCard';
import type { WeatherData } from '../types/weather';

const mockData: WeatherData = {
  coord: { lat: 51.5074, lon: -0.1278 },
  weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
  main: {
    temp: 18.5,
    feels_like: 17.2,
    temp_min: 16,
    temp_max: 21,
    pressure: 1013,
    humidity: 65,
  },
  wind: { speed: 3.2, deg: 220 },
  name: 'London',
  dt: 1700000000,
  sys: { country: 'GB', sunrise: 1699940000, sunset: 1699975000 },
};

describe('WeatherCard', () => {
  it('renders city and country', () => {
    render(<WeatherCard data={mockData} />);
    expect(screen.getByText('London,')).toBeInTheDocument();
    expect(screen.getByText('GB')).toBeInTheDocument();
  });

  it('renders temperature rounded', () => {
    render(<WeatherCard data={mockData} />);
    expect(screen.getByText('19°')).toBeInTheDocument();
  });

  it('renders humidity, wind, feels like', () => {
    render(<WeatherCard data={mockData} />);
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('3.2 m/s')).toBeInTheDocument();
    expect(screen.getByText('17°')).toBeInTheDocument();
  });

  it('shows stale warning when isStale is true', () => {
    render(<WeatherCard data={mockData} isStale />);
    expect(screen.getByText(/stale data/i)).toBeInTheDocument();
  });

  it('does not show stale warning by default', () => {
    render(<WeatherCard data={mockData} />);
    expect(screen.queryByText(/stale data/i)).not.toBeInTheDocument();
  });
});
