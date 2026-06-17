import { render, screen, act } from '@testing-library/react';
import { OfflineBanner } from '../components/OfflineBanner';

describe('OfflineBanner', () => {
  afterEach(() => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
  });

  it('renders nothing when online', () => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    const { container } = render(<OfflineBanner />);
    expect(container.firstChild).toBeNull();
  });

  it('shows offline message when offline', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    render(<OfflineBanner />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/you are offline/i)).toBeInTheDocument();
  });

  it('shows cached time when cachedAt provided and offline', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    const cachedAt = Date.now() - 5 * 60 * 1000; // 5 minutes ago
    render(<OfflineBanner cachedAt={cachedAt} />);
    expect(screen.getByText(/5m ago/i)).toBeInTheDocument();
  });

  it('hides when connection is restored', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    render(<OfflineBanner />);
    expect(screen.getByRole('alert')).toBeInTheDocument();

    await act(async () => {
      Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
      window.dispatchEvent(new Event('online'));
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
