import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { DashboardHomePage } from './DashboardHomePage';
import { DashboardPropertiesPage } from './DashboardPropertiesPage';
import { PropertySubmissionPage } from './PropertySubmissionPage';
import {
  propertyOwnerMockService,
  resetPropertyOwnerMockData,
} from '../services/propertyOwnerMockService';
import { propertySubmissionSchema } from '../schemas/propertySubmissionSchema';
import { getPropertyStatus } from '../utils/propertyStatus';

afterEach(() => {
  resetPropertyOwnerMockData();
});

describe('property owner module', () => {
  it('renders owner dashboard metrics and recent sample submissions', async () => {
    render(
      <MemoryRouter>
        <DashboardHomePage />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeVisible();
    expect(screen.getByText('Properties submitted')).toBeVisible();
    expect(screen.getByText('Verified properties')).toBeVisible();
    expect(screen.getByText('Awaiting verification')).toBeVisible();
    expect(screen.getByText('Rejected properties')).toBeVisible();
    expect(screen.getByRole('link', { name: /add a property/i })).toHaveAttribute(
      'href',
      '/dashboard/properties/new',
    );
    expect(screen.getByText('Bright apartment in Jabi')).toBeVisible();
  });

  it('filters owner properties by query and status and shows status labels', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <MemoryRouter>
        <DashboardPropertiesPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Bright apartment in Jabi')).toBeVisible();
    expect(screen.getAllByText('Verified').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Rejected').length).toBeGreaterThan(0);

    await user.type(screen.getByLabelText('Search properties'), 'Gwarinpa');
    expect(screen.getByText('Modern terrace in Gwarinpa')).toBeVisible();
    expect(screen.queryByText('Bright apartment in Jabi')).not.toBeInTheDocument();

    await user.clear(screen.getByLabelText('Search properties'));
    await user.selectOptions(screen.getByLabelText('Filter by status'), 'rejected');
    expect(screen.getByText('Wuse two-bedroom flat')).toBeVisible();
    expect(screen.queryByText('Modern terrace in Gwarinpa')).not.toBeInTheDocument();
  });

  it('maps known backend statuses and clearly labels unmapped values', () => {
    expect(getPropertyStatus('pending-verification').label).toBe('Pending Verification');
    expect(getPropertyStatus('VERIFIED').status).toBe('verified');
    expect(getPropertyStatus('awaiting-admin-review').label).toBe('Status unavailable');
  });

  it('keeps a locally submitted property unverified', async () => {
    const submission = {
      title: 'Family home near central Abuja',
      propertyType: 'Detached home',
      description: 'A comfortable family property with spacious rooms and secure parking.',
      askingPrice: '85000000',
      bedrooms: '3',
      bathrooms: '2',
      toilets: '3',
      sizeSqm: '180',
      features: 'Parking, garden',
      state: 'FCT',
      city: 'Abuja',
      neighbourhood: 'Jabi',
      streetAddress: '10 Example Street',
      locationDetails: '',
      images: [new File(['image'], 'home.png', { type: 'image/png' })],
      ownershipDocuments: [new File(['document'], 'title.pdf', { type: 'application/pdf' })],
    };

    const property = await propertyOwnerMockService.submit(submission);
    expect(property.status).toBe('submitted');
    expect(property.status).not.toBe('verified');
    expect(await propertyOwnerMockService.getById(property.id)).toMatchObject({
      status: 'submitted',
      rawStatus: 'submitted',
    });
  });

  it('validates required fields and rejects unsupported or oversized uploads', () => {
    const validValues = {
      title: 'Family home near central Abuja',
      propertyType: 'Detached home',
      description: 'A comfortable family property with spacious rooms and secure parking.',
      askingPrice: '85000000',
      bedrooms: '3',
      bathrooms: '2',
      toilets: '3',
      sizeSqm: '180',
      features: 'Parking, garden',
      state: 'FCT',
      city: 'Abuja',
      neighbourhood: 'Jabi',
      streetAddress: '10 Example Street',
      locationDetails: '',
      images: [new File(['image'], 'home.png', { type: 'image/png' })],
      ownershipDocuments: [new File(['document'], 'title.pdf', { type: 'application/pdf' })],
    };

    expect(propertySubmissionSchema.safeParse(validValues).success).toBe(true);
    expect(
      propertySubmissionSchema.safeParse({
        ...validValues,
        title: 'Home',
        images: [new File(['text'], 'image.svg', { type: 'image/svg+xml' })],
      }).success,
    ).toBe(false);
    expect(
      propertySubmissionSchema.safeParse({
        ...validValues,
        ownershipDocuments: [],
      }).success,
    ).toBe(false);
    expect(
      propertySubmissionSchema.safeParse({
        ...validValues,
        images: [
          new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' }),
        ],
      }).success,
    ).toBe(false);
  });

  it('navigates between steps while preserving entered values', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <MemoryRouter initialEntries={['/dashboard/properties/new']}>
        <PropertySubmissionPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText('Property title'), 'Family home in Jabi');
    await user.selectOptions(screen.getByLabelText('Property type'), 'Detached home');
    await user.type(
      screen.getByLabelText('Property description'),
      'A comfortable family home with a garden, parking, and a flexible living space.',
    );
    await user.type(screen.getByLabelText('Asking price (₦)'), '85000000');
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(await screen.findByRole('heading', { name: 'Property details' })).toBeVisible();
    await user.type(screen.getByLabelText('Bedrooms'), '3');
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByLabelText('Property title')).toHaveValue('Family home in Jabi');
    expect(screen.getByLabelText('Property description')).toHaveValue(
      'A comfortable family home with a garden, parking, and a flexible living space.',
    );
  });

  it('selects, previews, and removes images while keeping documents unpreviewed', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <MemoryRouter initialEntries={['/dashboard/properties/new']}>
        <PropertySubmissionPage />
      </MemoryRouter>,
    );

    await enterBasicInformation(user);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await enterPropertyDetails(user);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await enterLocation(user);
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    const image = new File(['image bytes'], 'front.png', { type: 'image/png' });
    const document = new File(['document bytes'], 'ownership.pdf', { type: 'application/pdf' });
    await user.upload(screen.getByLabelText(/Property images/i), image);
    await user.upload(screen.getByLabelText(/Ownership documents/i), document);

    expect(screen.getByRole('img', { name: 'Selected property image: front.png' })).toBeVisible();
    expect(screen.getByText('ownership.pdf')).toBeVisible();
    expect(screen.getByLabelText('Selected image previews')).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /ownership/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove image front.png' }));
    await waitFor(() => {
      expect(
        screen.queryByRole('img', { name: 'Selected property image: front.png' }),
      ).not.toBeInTheDocument();
    });
    expect(
      within(screen.getByLabelText('Selected ownership documents')).getByText('ownership.pdf'),
    ).toBeVisible();
  });
});

async function enterBasicInformation(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Property title'), 'Family home in Jabi');
  await user.selectOptions(screen.getByLabelText('Property type'), 'Detached home');
  await user.type(
    screen.getByLabelText('Property description'),
    'A comfortable family home with a garden, parking, and a flexible living space.',
  );
  await user.type(screen.getByLabelText('Asking price (₦)'), '85000000');
}

async function enterPropertyDetails(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Bedrooms'), '3');
  await user.type(screen.getByLabelText('Bathrooms'), '2');
  await user.type(screen.getByLabelText('Toilets'), '3');
  await user.type(screen.getByLabelText('Property size (m²)'), '180');
}

async function enterLocation(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('State'), 'FCT');
  await user.type(screen.getByLabelText('City'), 'Abuja');
  await user.type(screen.getByLabelText('Area or neighbourhood'), 'Jabi');
  await user.type(screen.getByLabelText('Street address'), '10 Example Street');
}
