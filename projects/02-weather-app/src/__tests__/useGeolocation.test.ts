import { renderHook, act } from '@testing-library/react';
import { useGeolocation } from '../hooks/useGeolocation';

const mockCoords = {
  latitude: 51.5074,
  longitude: -0.1278,
  accuracy: 10,
  altitude: null,
  altitudeAccuracy: null,
  heading: null,
  speed: null,
  toJSON: () => ({}),
} as GeolocationCoordinates;

const mockPosition: GeolocationPosition = {
  coords: mockCoords,
  timestamp: Date.now(),
  toJSON: () => ({}),
};

describe('useGeolocation', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns position on success', async () => {
    const getCurrentPosition = jest.fn((success: PositionCallback) => {
      success(mockPosition);
    });
    Object.defineProperty(navigator, 'geolocation', {
      value: { getCurrentPosition },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.position).toBe(mockPosition);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('returns error when permission denied', async () => {
    const err = { message: 'User denied Geolocation', code: 1 } as GeolocationPositionError;
    const getCurrentPosition = jest.fn(
      (_success: PositionCallback, error?: PositionErrorCallback | null) => {
        error?.(err);
      }
    );
    Object.defineProperty(navigator, 'geolocation', {
      value: { getCurrentPosition },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.position).toBeNull();
    expect(result.current.error).toBe('User denied Geolocation');
    expect(result.current.loading).toBe(false);
  });

  it('returns error when geolocation not supported', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.error).toBe('Geolocation is not supported by your browser.');
    expect(result.current.loading).toBe(false);
  });
});
