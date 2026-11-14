import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomePage from '../HomePage';
import { getSteamGames } from '../../services/Steam';
import { searchBoardGames, getFallbackBoardGames } from '../../services/BoardGame';

vi.mock('../../services/Steam', () => ({
  getSteamGames: vi.fn(),
}));

vi.mock('../../services/BoardGame', () => ({
  searchBoardGames: vi.fn(),
  getFallbackBoardGames: vi.fn(),
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

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

  it('renders hero, category links, and categorized sections after loading', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Welcome to Gaming Library/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Video Games/i })).toHaveAttribute('href', '/video-games');
    expect(screen.getByRole('link', { name: /Board Games/i })).toHaveAttribute('href', '/board-games');

    await waitFor(() => {
      expect(getSteamGames).toHaveBeenCalledTimes(1);
      expect(searchBoardGames).toHaveBeenCalledWith('');
      expect(screen.getByText('Top Video Games')).toBeInTheDocument();
      expect(screen.getByText('Top Board Games')).toBeInTheDocument();
      expect(screen.getByText('Counter-Strike 2')).toBeInTheDocument();
      expect(screen.getByText('Catan')).toBeInTheDocument();
    });
  });

  it('renders search results view when searchResults prop is passed', async () => {
    const matchingGames = [
      { id: '13', name: 'Catan', type: 'Board Game' },
    ];

    render(
      <MemoryRouter>
        <HomePage searchResults={matchingGames} />
      </MemoryRouter>
    );

    expect(await screen.findByText('Search Results')).toBeInTheDocument();
    expect(screen.getByText('Found 1 matching title(s)')).toBeInTheDocument();
    expect(screen.getByText('Catan')).toBeInTheDocument();
    expect(screen.queryByText('Top Video Games')).not.toBeInTheDocument();
    expect(screen.queryByText('Top Board Games')).not.toBeInTheDocument();
  });

  it('renders empty state message when searchResults is an empty array', async () => {
    render(
      <MemoryRouter>
        <HomePage searchResults={[]} />
      </MemoryRouter>
    );

    expect(await screen.findByText('Search Results')).toBeInTheDocument();
    expect(screen.getByText('Found 0 matching title(s)')).toBeInTheDocument();
    expect(screen.getByText('No games found matching your search.')).toBeInTheDocument();
  });
});