import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import { getSteamGames } from '../services/Steam';
import { searchBoardGames, getFallbackBoardGames } from '../services/BoardGame';

vi.mock('../services/Steam', () => ({
  getSteamGames: vi.fn(),
}));

vi.mock('../services/BoardGame', () => ({
  searchBoardGames: vi.fn(),
  getFallbackBoardGames: vi.fn(),
}));

let store = {};
const localStorageMock = {
  getItem: vi.fn((key) => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null)),
  setItem: vi.fn((key, value) => {
    store[key] = String(value);
  }),
  removeItem: vi.fn((key) => {
    delete store[key];
  }),
  clear: vi.fn(() => {
    store = {};
  }),
};
vi.stubGlobal('localStorage', localStorageMock);

describe('App', () => {
  beforeEach(() => {
    store = {};
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();

    getSteamGames.mockResolvedValue([
      { id: '730', name: 'Counter-Strike 2', type: 'Video Game' },
      { id: '570', name: 'Dota 2', type: 'Video Game' },
    ]);

    const mockBoardGames = [
      { id: '13', name: 'Catan', type: 'Board Game' },
      { id: '30549', name: 'Pandemic', type: 'Board Game' },
    ];

    searchBoardGames.mockResolvedValue(mockBoardGames);
    getFallbackBoardGames.mockReturnValue(mockBoardGames);
  });

  it('renders Header and HomePage and loads Steam and BoardGame services on mount', async () => {
    render(<App />);

    expect(screen.getByText('Gaming Library')).toBeInTheDocument();
    expect(await screen.findByText(/Welcome to Gaming Library/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(getSteamGames).toHaveBeenCalled();
      expect(searchBoardGames).toHaveBeenCalledWith('');
    });
  });

  it('calls searchBoardGames and filters homepage results when searching in Header', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Catan')).toBeInTheDocument();
      expect(screen.getByText('Counter-Strike 2')).toBeInTheDocument();
    });

    searchBoardGames.mockResolvedValueOnce([
      { id: '13', name: 'Catan', type: 'Board Game' },
    ]);

    const searchInput = screen.getByPlaceholderText(/search games/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'Catan' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(searchBoardGames).toHaveBeenCalledWith('Catan');
      expect(screen.getByText('Search Results')).toBeInTheDocument();
      expect(screen.getByText('Catan')).toBeInTheDocument();
      expect(screen.queryByText('Counter-Strike 2')).not.toBeInTheDocument();
    });
  });

  it('persists across component remounts cleanly', async () => {
    localStorageMock.setItem('savedGames', JSON.stringify([]));
    const { unmount } = render(<App />);

    await waitFor(() => {
      expect(getSteamGames).toHaveBeenCalled();
      expect(searchBoardGames).toHaveBeenCalled();
    });

    unmount();

    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Gaming Library')).toBeInTheDocument();
    });
  });
});