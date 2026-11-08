import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';
import { Input } from './Input';
import { PropertyCard } from '../../features/properties/components/PropertyCard';
import { sampleProperties } from '../../features/properties/data/sampleProperties';
import { PropertiesPage } from '../../features/properties/pages/PropertiesPage';
import { Navbar } from '../common/Navbar';

describe('shared UI components', () => {
  it('renders a typed button and forwards click events', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button onClick={onClick} type='button'>
        Continue
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('connects input labels and validation messages accessibly', () => {
    render(<Input error='Enter a valid email address' label='Email address' type='email' />);

    expect(screen.getByLabelText('Email address')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
  });

  it('identifies sample data on property cards and formats Naira prices', () => {
    const property = sampleProperties[0];

    render(
      <MemoryRouter>
        <PropertyCard property={property} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Sample listing')).toBeVisible();
    expect(screen.getByText('Example · not verified')).toBeVisible();
    expect(screen.getByText(/₦285,000,000/)).toBeVisible();
    expect(
      screen.getByRole('link', { name: /view sample listing: light-filled family home/i }),
    ).toHaveAttribute('href', `/properties/${property.id}`);
  });

  it('filters illustrative listings by Abuja area', () => {
    render(
      <MemoryRouter initialEntries={['/properties?q=Jabi']}>
        <PropertiesPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'A bright city apartment' })).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: 'Light-filled family home' }),
    ).not.toBeInTheDocument();
  });

  it('exposes and toggles the mobile navigation accessibly', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const menuButton = screen.getByRole('button', { name: 'Open navigation menu' });
    expect(menuButton).toHaveAttribute('aria-controls', 'main-navigation-mobile');
    await user.click(menuButton);
    expect(screen.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });
});
