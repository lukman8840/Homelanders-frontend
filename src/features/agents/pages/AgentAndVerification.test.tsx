import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { AgentApplicationPage } from './AgentApplicationPage';
import { AgentTasksPage } from './AgentTasksPage';
import { InspectionReportPage } from './InspectionReportPage';
import { VerificationDetailsPage } from '../../verification/pages/VerificationDetailsPage';
import { agentApplicationSchema } from '../schemas/agentApplicationSchema';
import { inspectionSchema } from '../schemas/inspectionSchema';
import {
  agentDashboardMockService,
  agentApplicationMockService,
  inspectionMockService,
  resetAgentMockData,
} from '../services/agentMockService';
import {
  getAgentApplicationStatus,
  getAgentTaskStatus,
  getFinalVerificationStatus,
} from '../utils/agentStatuses';

afterEach(() => {
  resetAgentMockData();
});

describe('agent and property verification module', () => {
  it('validates required agent application fields and optional supported files', () => {
    const values = {
      fullName: 'Ada Example',
      email: 'ada@example.com',
      phoneNumber: '+234 801 234 5678',
      residentialAddress: '10 Example Street, Abuja',
      state: 'FCT',
      city: 'Abuja',
      professionalExperience: 'Property consultant for five years',
      previousRealEstateExperience: 'Supported buyers with residential viewings.',
      introduction: 'I enjoy helping people find a home that fits their needs.',
      supportingDocuments: [new File(['document'], 'cv.pdf', { type: 'application/pdf' })],
    };

    expect(agentApplicationSchema.safeParse(values).success).toBe(true);
    expect(
      agentApplicationSchema.safeParse({
        ...values,
        supportingDocuments: [new File(['data'], 'cv.exe', { type: 'application/x-msdownload' })],
      }).success,
    ).toBe(false);
    expect(
      agentApplicationSchema.safeParse({
        ...values,
        email: 'invalid',
      }).success,
    ).toBe(false);
  });

  it('displays application status and permits rejected applications to be resubmitted', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <MemoryRouter>
        <AgentApplicationPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Rejected')).toBeVisible();
    expect(screen.getByText(/previous property work/i)).toBeVisible();
    await user.type(screen.getByLabelText('Full name'), 'Ada Example');
    await user.type(screen.getByLabelText('Email address'), 'ada@example.com');
    await user.type(screen.getByLabelText('Phone number'), '+234 801 234 5678');
    await user.type(screen.getByLabelText('State'), 'FCT');
    await user.type(screen.getByLabelText('City'), 'Abuja');
    await user.type(screen.getByLabelText('Residential address'), '10 Example Street, Abuja');
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    await user.type(screen.getByLabelText('Professional experience'), 'Property agent, five years');
    await user.type(
      screen.getByLabelText('Previous real estate experience'),
      'Supported residential buyers with viewings and negotiations.',
    );
    await user.type(
      screen.getByLabelText('Short personal introduction'),
      'I help clients make informed decisions about their next home.',
    );
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(await screen.findByRole('heading', { name: 'Review' })).toBeVisible();
    expect(screen.getByText('Ada Example')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Submit application' }));

    expect(await screen.findByText(/demo application recorded in memory only/i)).toBeVisible();
    expect(screen.getByText('Pending')).toBeVisible();
    expect(await agentApplicationMockService.getCurrent()).toMatchObject({ status: 'pending' });
  });

  it('maps application, task, and final verification statuses independently', () => {
    expect(getAgentApplicationStatus('in-review').label).toBe('Under Review');
    expect(getAgentTaskStatus('in-progress').label).toBe('In Progress');
    expect(getFinalVerificationStatus('verified').label).toBe('Verified');
    expect(getFinalVerificationStatus('agent-inspected').label).toBe('Status unavailable');
  });

  it('renders assigned property tasks and their separate verification statuses', async () => {
    render(
      <MemoryRouter>
        <AgentTasksPage />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'Assigned properties' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Sample family home in Asokoro' })).toBeVisible();
    expect(screen.getByText('Assigned')).toBeVisible();
    expect(screen.getByText('Pending Verification')).toBeVisible();
    expect(screen.getByText(/does not approve or verify a property/i)).toBeVisible();
  });

  it('validates inspection report and location confirmation', () => {
    const values = {
      inspectionDate: '2026-10-25',
      outcome: 'satisfactory',
      conditionObservations: 'The exterior and interior were observed in good condition.',
      locationConfirmed: true,
      supportingPhotos: [new File(['photo'], 'front.jpg', { type: 'image/jpeg' })],
      additionalNotes: '',
    };
    expect(inspectionSchema.safeParse(values).success).toBe(true);
    expect(inspectionSchema.safeParse({ ...values, locationConfirmed: false }).success).toBe(false);
    expect(
      inspectionSchema.safeParse({
        ...values,
        supportingPhotos: [new File(['svg'], 'front.svg', { type: 'image/svg+xml' })],
      }).success,
    ).toBe(false);
  });

  it('submits inspection reports without granting final verification approval', async () => {
    await agentDashboardMockService.updateTaskStatus('sample-task-101', 'accepted');
    const result = await inspectionMockService.submit('sample-task-101', {
      inspectionDate: '2026-10-25',
      outcome: 'satisfactory',
      conditionObservations: 'The exterior and interior were observed in good condition.',
      locationConfirmed: true,
      supportingPhotos: [],
      additionalNotes: '',
    });

    expect(result).toMatchObject({
      taskStatus: 'completed',
      finalVerificationStatus: 'pending_verification',
    });
    expect(await agentDashboardMockService.getTask('sample-task-101')).toMatchObject({
      taskStatus: 'completed',
      finalStatus: 'pending_verification',
    });
  });

  it('shows verification result and distinguishes completed inspection from final approval', async () => {
    render(
      <MemoryRouter initialEntries={['/agent/dashboard/verification/sample-task-102']}>
        <Routes>
          <Route
            element={<VerificationDetailsPage />}
            path='/agent/dashboard/verification/:taskId'
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'Sample apartment in Jabi' })).toBeVisible();
    expect(screen.getByText(/Completed/)).toBeVisible();
    expect(screen.getByText('Under Review')).toBeVisible();
    expect(screen.getByText(/agent inspection is not final approval/i)).toBeVisible();
    expect(screen.getAllByText('Awaiting admin decision')).toHaveLength(2);
  });

  it('loads inspection form for a task only after it has been accepted', async () => {
    await agentDashboardMockService.updateTaskStatus('sample-task-101', 'accepted');
    render(
      <MemoryRouter initialEntries={['/agent/dashboard/tasks/sample-task-101/inspection']}>
        <Routes>
          <Route
            element={<InspectionReportPage />}
            path='/agent/dashboard/tasks/:taskId/inspection'
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'Inspection report' })).toBeVisible();
    expect(screen.getByLabelText('Inspection date')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Submit inspection report' })).toBeVisible();
  });
});
