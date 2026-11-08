import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('renders the HomeLander marketplace introduction', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /find a place to call home/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore homes/i })).toBeVisible();
    expect(screen.getByRole('heading', { name: /sample homes in abuja/i })).toBeVisible();
    expect(screen.getByText(/illustrative listings for design review/i)).toBeVisible();
  });
});
