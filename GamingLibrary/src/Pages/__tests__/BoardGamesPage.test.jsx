import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BoardGamesPage from '../BoardGamesPage';
import { searchBoardGames, getFallbackBoardGames } from '../../services/BoardGame';

vi.mock('../../services/BoardGame', () => ({
  searchBoardGames: vi.fn(),
  getFallbackBoardGames: vi.fn(),
}));

describe('BoardGamesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders heading, subtitle, and board games from searchBoardGames', async () => {
    searchBoardGames.mockResolvedValue([
      { id: '13', name: 'Catan', type: 'Board Game' },
      { id: '30549', name: 'Pandemic', type: 'Board Game' },
    ]);
    getFallbackBoardGames.mockReturnValue([]);

    render(
      <MemoryRouter>
        <BoardGamesPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Board Games Catalog')).toBeInTheDocument();
    expect(
      screen.getByText('Explore top-rated tabletop games and strategy classics.')
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(searchBoardGames).toHaveBeenCalledWith('');
      expect(screen.getByText('Catan')).toBeInTheDocument();
      expect(screen.getByText('Pandemic')).toBeInTheDocument();
    });
  });

  it('falls back to getFallbackBoardGames when searchBoardGames returns empty or fails', async () => {
    searchBoardGames.mockRejectedValueOnce(new Error('API error'));
    getFallbackBoardGames.mockReturnValue([
      { id: '170416', name: 'Scythe', type: 'Board Game' },
    ]);

    render(
      <MemoryRouter>
        <BoardGamesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getFallbackBoardGames).toHaveBeenCalled();
      expect(screen.getByText('Scythe')).toBeInTheDocument();
    });
  });
});