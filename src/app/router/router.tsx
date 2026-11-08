import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PublicLayout } from '../layouts/PublicLayout';
import { ProtectedRoute } from '../../features/auth/components/ProtectedRoute';
import { DashboardHomePage } from '../../features/dashboard/pages/DashboardHomePage';
import { DashboardProfilePage } from '../../features/dashboard/pages/DashboardProfilePage';
import { DashboardPropertiesPage } from '../../features/dashboard/pages/DashboardPropertiesPage';
import { DashboardPropertyDetailsPage } from '../../features/dashboard/pages/DashboardPropertyDetailsPage';
import { MessagingPage } from '../../features/messaging/pages/MessagingPage';
import { KycDashboardPage } from '../../features/kyc/pages/KycDashboardPage';
import { KycSubmissionPage } from '../../features/kyc/pages/KycSubmissionPage';
import { RoleBasedRoute } from '../../features/auth/components/ProtectedRoute';
import { AgentDashboardLayout } from '../../features/agents/components/AgentDashboardLayout';
import { AgentApplicationPage } from '../../features/agents/pages/AgentApplicationPage';
import { AgentDashboardPage } from '../../features/agents/pages/AgentDashboardPage';
import { AgentTasksPage, AgentCommissionsPage } from '../../features/agents/pages/AgentTasksPage';
import { AgentPropertyTaskPage } from '../../features/agents/pages/AgentPropertyTaskPage';
import { InspectionReportPage } from '../../features/agents/pages/InspectionReportPage';
import { VerificationDetailsPage } from '../../features/verification/pages/VerificationDetailsPage';
import { PropertySubmissionPage } from '../../features/dashboard/pages/PropertySubmissionPage';
import { PropertiesPage } from '../../features/properties/pages/PropertiesPage';
import { PropertyDetailsPage } from '../../features/properties/pages/PropertyDetailsPage';
import { HomePage } from '../../routes/HomePage';
import { NotFoundPage } from '../../routes/NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'properties',
        element: <PropertiesPage />,
      },
      {
        path: 'properties/:id',
        element: <PropertyDetailsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        lazy: async () => {
          const { LoginPage } = await import('../../features/auth/pages/LoginPage');
          return { Component: LoginPage };
        },
      },
      {
        path: 'register',
        lazy: async () => {
          const { RegisterPage } = await import('../../features/auth/pages/RegisterPage');
          return { Component: RegisterPage };
        },
      },
      {
        path: 'forgot-password',
        lazy: async () => {
          const { ForgotPasswordPage } =
            await import('../../features/auth/pages/ForgotPasswordPage');
          return { Component: ForgotPasswordPage };
        },
      },
      {
        path: 'reset-password',
        lazy: async () => {
          const { ResetPasswordPage } = await import('../../features/auth/pages/ResetPasswordPage');
          return { Component: ResetPasswordPage };
        },
      },
      {
        path: 'verify-email',
        lazy: async () => {
          const { EmailVerificationPage } =
            await import('../../features/auth/pages/EmailVerificationPage');
          return { Component: EmailVerificationPage };
        },
      },
    ],
  },
  {
    path: 'dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHomePage />,
      },
      {
        path: 'properties',
        element: <DashboardPropertiesPage />,
      },
      {
        path: 'properties/new',
        element: <PropertySubmissionPage />,
      },
      {
        path: 'properties/:propertyId/edit',
        element: <PropertySubmissionPage />,
      },
      {
        path: 'properties/:propertyId',
        element: <DashboardPropertyDetailsPage />,
      },
      {
        path: 'messages',
        element: <MessagingPage />,
      },
      {
        path: 'kyc',
        element: <KycDashboardPage />,
      },
      {
        path: 'kyc/submit',
        element: <KycSubmissionPage />,
      },
      {
        path: 'agent-application',
        element: <AgentApplicationPage />,
      },
      {
        path: 'profile',
        element: <DashboardProfilePage />,
      },
    ],
  },
  {
    path: 'agent/dashboard',
    element: (
      <RoleBasedRoute roles={['approved-agent']}>
        <AgentDashboardLayout />
      </RoleBasedRoute>
    ),
    children: [
      { index: true, element: <AgentDashboardPage /> },
      { path: 'properties', element: <AgentTasksPage view='all' /> },
      { path: 'tasks', element: <AgentTasksPage view='open' /> },
      { path: 'completed', element: <AgentTasksPage view='completed' /> },
      { path: 'commissions', element: <AgentCommissionsPage /> },
      { path: 'properties/:taskId', element: <AgentPropertyTaskPage /> },
      { path: 'tasks/:taskId/inspection', element: <InspectionReportPage /> },
      { path: 'verification/:taskId', element: <VerificationDetailsPage /> },
    ],
  },
]);
