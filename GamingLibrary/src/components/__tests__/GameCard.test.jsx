import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import GameCard from '../GameCard';

const sampleGame = {
  id: '13',
  name: 'Catan',
  type: 'Board Game',
  releaseDate: '1995',
  rating: '7.2',
  image: 'https://example.com/catan.jpg',
};

describe('GameCard', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('savedGames', JSON.stringify([]));
  });

  it('renders nothing when game prop is null', () => {
    const { container } = render(
      <MemoryRouter>
        <GameCard game={null} />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders game details and Details link successfully', () => {
    render(
      <MemoryRouter>
        <GameCard game={sampleGame} />
      </MemoryRouter>
    );

    expect(screen.getByText('Catan')).toBeInTheDocument();
    expect(screen.getByText(/Board Game/i)).toBeInTheDocument();
    expect(screen.getByText('1995')).toBeInTheDocument();
    expect(screen.getByText('7.2')).toBeInTheDocument();
    expect(screen.getByAltText('Catan')).toHaveAttribute('src', sampleGame.image);
    expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute('href', '/game/13');
    expect(screen.getByRole('button', { name: 'Save Game' })).toBeInTheDocument();
  });

  it('initializes as Unsave when game is already in localStorage savedGames', () => {
    localStorage.setItem('savedGames', JSON.stringify([{ id: '13', name: 'Catan' }]));

    render(
      <MemoryRouter>
        <GameCard game={sampleGame} />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: 'Unsave' })).toBeInTheDocument();
  });

  it('toggles saved state and updates localStorage on button click', () => {
    render(
      <MemoryRouter>
        <GameCard game={sampleGame} />
      </MemoryRouter>
    );

    const actionButton = screen.getByRole('button', { name: 'Save Game' });
    fireEvent.click(actionButton);

    expect(screen.getByRole('button', { name: 'Unsave' })).toBeInTheDocument();
    let saved = JSON.parse(localStorage.getItem('savedGames'));
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({
      id: '13',
      name: 'Catan',
      type: 'Board Game',
      releaseDate: '1995',
      rating: '7.2',
      image: 'https://example.com/catan.jpg',
    });

    // Click again to unsave
    fireEvent.click(screen.getByRole('button', { name: 'Unsave' }));
    expect(screen.getByRole('button', { name: 'Save Game' })).toBeInTheDocument();
    saved = JSON.parse(localStorage.getItem('savedGames'));
    expect(saved).toHaveLength(0);
  });
});