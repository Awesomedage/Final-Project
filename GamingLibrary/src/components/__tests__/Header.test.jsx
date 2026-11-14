import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Header from '../Header';

describe('Header', () => {
  it('renders title, navigation links, and search input/button', () => {
    render(
      <MemoryRouter>
        <Header onSearch={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText('Gaming Library')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Saved Games' })).toHaveAttribute('href', '/saved');
    expect(screen.getByPlaceholderText('Search games...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('updates searchQuery state and calls onSearch on button click and Enter key', () => {
    const mockOnSearch = vi.fn();

    render(
      <MemoryRouter>
        <Header onSearch={mockOnSearch} />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Search games...');
    const button = screen.getByRole('button', { name: 'Search' });

    // Empty/whitespace query should not trigger onSearch
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Click search with valid query
    fireEvent.change(input, { target: { value: 'Catan' } });
    expect(input.value).toBe('Catan');
    fireEvent.click(button);
    expect(mockOnSearch).toHaveBeenCalledWith('Catan');

    // Press Enter with valid query
    fireEvent.change(input, { target: { value: 'Counter-Strike' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(mockOnSearch).toHaveBeenCalledWith('Counter-Strike');
  });
});