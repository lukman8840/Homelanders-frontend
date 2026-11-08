import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { sampleProperties } from '../data/sampleProperties';
import { PropertiesPage } from '../pages/PropertiesPage';
import { PropertyDetailsPage } from '../pages/PropertyDetailsPage';
import { PropertyCard } from './PropertyCard';
import { PropertyFilters } from './PropertyFilters';
import { PropertyGrid } from './PropertyGrid';
import type { PropertyFilters as PropertyFiltersValue } from '../types/property';

const emptyFilters: PropertyFiltersValue = {
  query: '',
  location: '',
  minPrice: '',
  maxPrice: '',
  propertyType: '',
  minBedrooms: '',
  minBathrooms: '',
  sortBy: 'newest',
};

describe('property marketplace components', () => {
  it('renders illustrative content and links the property card to its detail page', () => {
    render(
      <MemoryRouter>
        <PropertyCard property={sampleProperties[0]} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Sample listing')).toBeVisible();
    expect(screen.getByText('Example · not verified')).toBeVisible();
    expect(screen.getByRole('link', { name: /light-filled family home/i })).toHaveAttribute(
      'href',
      '/properties/sample-aso-drive',
    );
  });

  it('renders property grid cards and an empty state', () => {
    const { rerender } = render(
      <MemoryRouter>
        <PropertyGrid properties={sampleProperties.slice(0, 2)} />
      </MemoryRouter>,
    );

    expect(screen.getAllByText('Sample listing')).toHaveLength(2);
    rerender(
      <MemoryRouter>
        <PropertyGrid properties={[]} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'No sample listings match' })).toBeVisible();
  });

  it('renders loading skeletons and a retryable error state', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const { rerender } = render(<PropertyGrid properties={[]} status='loading' />);

    expect(screen.getByRole('status', { name: 'Loading sample properties' })).toBeVisible();
    rerender(
      <PropertyGrid error='Try again later' onRetry={onRetry} properties={[]} status='error' />,
    );

    expect(screen.getByText('Try again later')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('submits structured location, type, and price filter values', () => {
    const onApply = vi.fn();
    render(<PropertyFilters filters={emptyFilters} onApply={onApply} onClear={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Abuja district'), { target: { value: 'Jabi' } });
    fireEvent.change(screen.getByLabelText('Property type'), {
      target: { value: 'apartment' },
    });
    fireEvent.change(screen.getByLabelText('Maximum price (₦)'), {
      target: { value: '100000000' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }));

    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({
        location: 'Jabi',
        propertyType: 'apartment',
        maxPrice: '100000000',
      }),
    );
  });

  it('filters properties by price, district, and bedroom count', () => {
    render(
      <MemoryRouter initialEntries={['/properties?location=Jabi&maxPrice=80000000&beds=2']}>
        <Routes>
          <Route element={<PropertiesPage />} path='/properties' />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'A bright city apartment' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Calm, modern terrace' })).not.toBeInTheDocument();
  });

  it('sorts by price and paginates results', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/properties']}>
        <Routes>
          <Route element={<PropertiesPage />} path='/properties' />
        </Routes>
      </MemoryRouter>,
    );

    await user.selectOptions(screen.getByLabelText('Sort by'), 'price-asc');
    await user.click(screen.getByRole('button', { name: 'Apply filters' }));
    expect(screen.getByRole('heading', { name: 'A bright city apartment' })).toBeVisible();
    expect(screen.getByText('Page 1 of 2')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Next results page' }));
    expect(screen.getByText('Page 2 of 2')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Room to grow in Wuse' })).toBeVisible();
  });

  it('clears applied URL filters and resets the filter controls', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/properties']}>
        <Routes>
          <Route element={<PropertiesPage />} path='/properties' />
        </Routes>
      </MemoryRouter>,
    );

    await user.selectOptions(screen.getByLabelText('Abuja district'), 'Jabi');
    await user.click(screen.getByRole('button', { name: 'Apply filters' }));
    expect(screen.getByRole('heading', { name: 'Easy-living Jabi apartment' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByLabelText('Abuja district')).toHaveValue('');
    expect(screen.getByRole('heading', { name: 'Light-filled family home' })).toBeVisible();
  });

  it('renders detailed property data and switches the gallery image', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/properties/sample-aso-drive']}>
        <Routes>
          <Route element={<PropertyDetailsPage />} path='/properties/:id' />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Light-filled family home' })).toBeVisible();
    expect(screen.getByText(/Example address · Aso Drive/)).toBeVisible();
    expect(screen.getByText('320 m²')).toBeVisible();
    expect(screen.getByText('SAMPLE-001')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Contact owner or agent' })).toBeEnabled();
    expect(screen.getByText(/Demo listings do not connect to a real owner or agent/)).toBeVisible();

    await user.click(screen.getByRole('button', { name: /show sample image 2/i }));
    const gallery = screen.getByLabelText('Sample property image gallery');
    expect(
      within(gallery).getByAltText('Illustrative sample image of a modern home exterior'),
    ).toBeVisible();
  });

  it('opens a conversation associated with the selected property', async () => {
    const user = userEvent.setup();
    function Destination() {
      const location = useLocation();
      return <p>{location.search}</p>;
    }

    render(
      <MemoryRouter initialEntries={['/properties/sample-aso-drive']}>
        <Routes>
          <Route element={<PropertyDetailsPage />} path='/properties/:id' />
          <Route element={<Destination />} path='/dashboard/messages' />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Contact owner or agent' }));
    expect(await screen.findByText('?propertyId=sample-aso-drive')).toBeVisible();
  });
});
