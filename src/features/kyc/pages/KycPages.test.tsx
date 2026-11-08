import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { kycSubmissionSchema } from '../schemas/kycSchema';
import { kycMockService, resetKycMockData } from '../services/kycMockService';
import {
  createKycDocumentUploadService,
  KycDocumentUploadNotConfiguredError,
} from '../services/kycDocumentUploadService';
import { createKycService, KycApiNotConfiguredError } from '../services/kycService';
import { apiClient } from '../../../lib/api/client';
import { getKycStatus } from '../utils/kycStatus';
import { KycDashboardPage } from './KycDashboardPage';
import { KycSubmissionPage } from './KycSubmissionPage';

afterEach(() => {
  vi.restoreAllMocks();
  resetKycMockData();
});

describe('KYC module', () => {
  it('keeps API and secure document upload unconfigured until contracts are supplied', async () => {
    const service = createKycService(apiClient);
    const uploadService = createKycDocumentUploadService(apiClient);

    expect(service.mode).toBe('api');
    expect(uploadService.isConfigured).toBe(false);
    await expect(service.getCurrent()).rejects.toBeInstanceOf(KycApiNotConfiguredError);
    await expect(
      uploadService.upload(new File(['document'], 'identity.pdf', { type: 'application/pdf' })),
    ).rejects.toBeInstanceOf(KycDocumentUploadNotConfiguredError);
  });

  it('renders current status, dates, feedback, and a rejected resubmission action', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/kyc']}>
        <KycDashboardPage />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'Identity verification' })).toBeVisible();
    expect(screen.getByText('Rejected')).toBeVisible();
    expect(screen.getByText('Date submitted')).toBeVisible();
    expect(screen.getByText('Last updated')).toBeVisible();
    expect(screen.getByText(/could not match the document image/i)).toBeVisible();
    expect(screen.getByRole('link', { name: /resubmit verification/i })).toHaveAttribute(
      'href',
      '/dashboard/kyc/submit',
    );
    expect(screen.getByText(/separate from verification of a property listing/i)).toBeVisible();
  });

  it('maps configurable status values and keeps unknown statuses unavailable', () => {
    expect(getKycStatus('in-review').label).toBe('Under Review');
    expect(getKycStatus('verified').label).toBe('Approved');
    expect(getKycStatus('new_backend_state').label).toBe('Status unavailable');
    expect(getKycStatus('new_backend_state').status).toBeNull();
  });

  it('validates personal information, consent, document type, and size', () => {
    const validValues = {
      fullName: 'Ada Example',
      dateOfBirth: '1990-05-10',
      phoneNumber: '+234 801 234 5678',
      email: 'ada@example.com',
      residentialAddress: '10 Example Street, Abuja',
      identificationType: 'nin_slip_card',
      identificationNumber: '12345678901',
      identityDocument: new File(['image'], 'identity.png', { type: 'image/png' }),
      consent: true,
    };

    expect(kycSubmissionSchema.safeParse(validValues).success).toBe(true);
    expect(kycSubmissionSchema.safeParse({ ...validValues, consent: false }).success).toBe(false);
    expect(
      kycSubmissionSchema.safeParse({
        ...validValues,
        identityDocument: new File(['contents'], 'identity.svg', { type: 'image/svg+xml' }),
      }).success,
    ).toBe(false);
    expect(
      kycSubmissionSchema.safeParse({
        ...validValues,
        identityDocument: new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'identity.png', {
          type: 'image/png',
        }),
      }).success,
    ).toBe(false);
  });

  it('navigates through form steps and preserves personal information', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <MemoryRouter initialEntries={['/dashboard/kyc/submit']}>
        <KycSubmissionPage />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'Personal information' })).toBeVisible();
    await fillPersonalInformation(user);
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(await screen.findByRole('heading', { name: 'Identification' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByLabelText('Full name')).toHaveValue('Ada Example');
    expect(screen.getByLabelText('Email address')).toHaveValue('ada@example.com');
  });

  it('supports identity document selection, private preview, removal, and replacement', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <MemoryRouter initialEntries={['/dashboard/kyc/submit']}>
        <KycSubmissionPage />
      </MemoryRouter>,
    );

    await screen.findByRole('heading', { name: 'Personal information' });
    await fillPersonalInformation(user);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.selectOptions(
      await screen.findByLabelText('Identification document type'),
      'international_passport',
    );
    const firstDocument = new File(['image'], 'passport.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText(/Upload identity document/), firstDocument);
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(await screen.findByRole('heading', { name: 'Document preview' })).toBeVisible();
    expect(screen.getByText('passport.png')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Preview document' }));
    expect(
      screen.getByRole('img', { name: 'Private local identity document preview' }),
    ).toBeVisible();
    expect(screen.getByText(/temporary browser URL/i)).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Back' }));
    await user.click(screen.getByRole('button', { name: 'Remove selected identity document' }));
    const replacement = new File(['replacement'], 'passport-updated.pdf', {
      type: 'application/pdf',
    });
    await user.upload(screen.getByLabelText(/Upload identity document/), replacement);
    expect(screen.getByText('passport-updated.pdf')).toBeVisible();
    expect(screen.queryByText('passport.png')).not.toBeInTheDocument();
  });

  it('allows rejected KYC resubmission and records only a mock status, not PII', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <MemoryRouter initialEntries={['/dashboard/kyc/submit']}>
        <Routes>
          <Route element={<KycSubmissionPage />} path='/dashboard/kyc/submit' />
          <Route element={<KycDashboardPage />} path='/dashboard/kyc' />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/previous review feedback/i)).toBeVisible();
    await fillPersonalInformation(user);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.selectOptions(
      await screen.findByLabelText('Identification document type'),
      'nin_slip_card',
    );
    await user.type(screen.getByLabelText(/identification number/i), '12345678901');
    await user.upload(
      screen.getByLabelText(/Upload identity document/),
      new File(['image'], 'nin.png', { type: 'image/png' }),
    );
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(await screen.findByRole('button', { name: 'Continue' }));

    expect(await screen.findByRole('heading', { name: 'Review & submit' })).toBeVisible();
    expect(screen.getByText('•••• 8901')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Submit for review' }));
    expect(await screen.findByText(/consent is required/i)).toBeVisible();

    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Submit for review' }));
    expect(await screen.findByText(/demo submission recorded in memory only/i)).toBeVisible();
    expect(await screen.findByText('Pending')).toBeVisible();
    expect(await kycMockService.getCurrent()).toMatchObject({ status: 'pending' });
    expect(JSON.stringify(await kycMockService.getCurrent())).not.toContain('Ada Example');
    expect(await screen.findByRole('heading', { name: 'Identity verification' })).toBeVisible();
  });

  it('does not allow editing an approved KYC submission', async () => {
    vi.spyOn(kycMockService, 'getCurrent').mockResolvedValue({
      status: 'approved',
      rawStatus: 'approved',
      submittedAt: '2026-10-12T10:00:00.000Z',
      updatedAt: '2026-10-18T10:00:00.000Z',
    });

    render(
      <MemoryRouter initialEntries={['/dashboard/kyc/submit']}>
        <KycSubmissionPage />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'Submission unavailable' })).toBeVisible();
    expect(
      screen.getByText(/approved or in-review identity information cannot be edited/i),
    ).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Submit for review' })).not.toBeInTheDocument();
  });
});

async function fillPersonalInformation(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Full name'), 'Ada Example');
  await user.type(screen.getByLabelText('Date of birth'), '1990-05-10');
  await user.type(screen.getByLabelText('Phone number'), '+234 801 234 5678');
  await user.type(screen.getByLabelText('Email address'), 'ada@example.com');
  await user.type(screen.getByLabelText('Residential address'), '10 Example Street, Abuja');
}
