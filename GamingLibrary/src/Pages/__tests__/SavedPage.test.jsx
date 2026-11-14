import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import SavedPage from '../SavedPage';

describe('SavedPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders empty state message when savedGames is empty', () => {
    localStorage.setItem('savedGames', JSON.stringify([]));

    render(
      <MemoryRouter>
        <SavedPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Your Saved Games')).toBeInTheDocument();
    expect(
      screen.getByText(
        "You haven't saved any games yet. Browse video games or board games to add some!"
      )
    ).toBeInTheDocument();
  });

  it('renders saved games from localStorage', () => {
    localStorage.setItem(
      'savedGames',
      JSON.stringify([
        { id: '13', name: 'Catan', type: 'Board Game' },
        { id: '730', name: 'Counter-Strike 2', type: 'Video Game' },
      ])
    );

    render(
      <MemoryRouter>
        <SavedPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Catan')).toBeInTheDocument();
    expect(screen.getByText('Counter-Strike 2')).toBeInTheDocument();
  });
});