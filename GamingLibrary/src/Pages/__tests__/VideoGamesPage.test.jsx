import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VideoGamesPage from '../VideoGamesPage';
import { getSteamGames } from '../../services/Steam';

vi.mock('../../services/Steam', () => ({
  getSteamGames: vi.fn(),
}));

describe('VideoGamesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders heading and video games from getSteamGames', async () => {
    getSteamGames.mockResolvedValue([
      { id: '730', name: 'Counter-Strike 2', type: 'Video Game' },
      { id: '570', name: 'Dota 2', type: 'Video Game' },
    ]);

    render(
      <MemoryRouter>
        <VideoGamesPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Video Games')).toBeInTheDocument();

    await waitFor(() => {
      expect(getSteamGames).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Counter-Strike 2')).toBeInTheDocument();
      expect(screen.getByText('Dota 2')).toBeInTheDocument();
    });
  });

  it('renders error message when getSteamGames fails', async () => {
    getSteamGames.mockRejectedValueOnce(new Error('Steam API failed'));

    render(
      <MemoryRouter>
        <VideoGamesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load video games.')).toBeInTheDocument();
    });
  });
});