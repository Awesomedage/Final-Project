import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GameDetailPage from '../GameDetailPage';
import { getSteamGameDetails } from '../../services/Steam';
import { getBoardGameDetails } from '../../services/BoardGame';

vi.mock('../../services/Steam', () => ({
  getSteamGameDetails: vi.fn(),
}));

vi.mock('../../services/BoardGame', () => ({
  getBoardGameDetails: vi.fn(),
}));

describe('GameDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Steam video game details when getSteamGameDetails resolves', async () => {
    getSteamGameDetails.mockResolvedValue({
      name: 'Counter-Strike 2',
      short_description: 'Tactical shooter',
      header_image: 'https://example.com/cs2.jpg',
    });
    getBoardGameDetails.mockResolvedValue(null);

    render(
      <MemoryRouter initialEntries={['/game/730']}>
        <Routes>
          <Route path="/game/:id" element={<GameDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /← Back to Home/i })).toHaveAttribute('href', '/');

    await waitFor(() => {
      expect(getSteamGameDetails).toHaveBeenCalledWith('730');
      expect(screen.getByText('Counter-Strike 2')).toBeInTheDocument();
      expect(screen.getByText(/Video Game/i)).toBeInTheDocument();
      expect(screen.getByText('Tactical shooter')).toBeInTheDocument();
    });
  });

  it('falls back to board game details when Steam returns null', async () => {
    getSteamGameDetails.mockResolvedValue(null);
    getBoardGameDetails.mockResolvedValue({
      name: 'Catan',
      description: 'Trade and build',
      image: 'https://example.com/catan.jpg',
    });

    render(
      <MemoryRouter initialEntries={['/game/13']}>
        <Routes>
          <Route path="/game/:id" element={<GameDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getBoardGameDetails).toHaveBeenCalledWith('13');
      expect(screen.getByText('Catan')).toBeInTheDocument();
      expect(screen.getByText(/Board Game/i)).toBeInTheDocument();
    });
  });

  it('renders error message when neither service finds the game', async () => {
    getSteamGameDetails.mockResolvedValue(null);
    getBoardGameDetails.mockResolvedValue(null);

    render(
      <MemoryRouter initialEntries={['/game/999']}>
        <Routes>
          <Route path="/game/:id" element={<GameDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getSteamGameDetails).toHaveBeenCalledWith('999');
      expect(getBoardGameDetails).toHaveBeenCalledWith('999');
      expect(screen.getByText('Game not found')).toBeInTheDocument();
    });
  });
});