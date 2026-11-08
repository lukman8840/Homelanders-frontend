import {
  AGENT_APPLICATION_STATUS_LABELS,
  AGENT_APPLICATION_STATUS_MAPPING,
  AGENT_TASK_STATUS_LABELS,
  AGENT_TASK_STATUS_MAPPING,
  FINAL_VERIFICATION_STATUS_MAPPING,
  type AgentApplicationStatus,
  type AgentTaskStatus,
  type FinalVerificationStatus,
} from '../types/agent';

export interface AgentStatusDisplay {
  label: string;
  tone: 'neutral' | 'info' | 'warning' | 'success' | 'danger';
  status: string | null;
}

const applicationTones: Record<AgentApplicationStatus, AgentStatusDisplay['tone']> = {
  not_applied: 'neutral',
  pending: 'info',
  under_review: 'warning',
  approved: 'success',
  rejected: 'danger',
};

const taskTones: Record<AgentTaskStatus, AgentStatusDisplay['tone']> = {
  assigned: 'info',
  accepted: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'neutral',
};

const verificationLabels: Record<FinalVerificationStatus, string> = {
  pending_verification: 'Pending Verification',
  under_review: 'Under Review',
  verified: 'Verified',
  rejected: 'Rejected',
};

const verificationTones: Record<FinalVerificationStatus, AgentStatusDisplay['tone']> = {
  pending_verification: 'info',
  under_review: 'warning',
  verified: 'success',
  rejected: 'danger',
};

export function getAgentApplicationStatus(rawStatus: string): AgentStatusDisplay {
  const status = AGENT_APPLICATION_STATUS_MAPPING[normalize(rawStatus)] ?? null;
  return status
    ? {
        label: AGENT_APPLICATION_STATUS_LABELS[status],
        tone: applicationTones[status],
        status,
      }
    : { label: 'Status unavailable', tone: 'neutral', status: null };
}

export function getAgentTaskStatus(rawStatus: string): AgentStatusDisplay {
  const status = AGENT_TASK_STATUS_MAPPING[normalize(rawStatus)] ?? null;
  return status
    ? { label: AGENT_TASK_STATUS_LABELS[status], tone: taskTones[status], status }
    : { label: 'Status unavailable', tone: 'neutral', status: null };
}

export function getFinalVerificationStatus(rawStatus: string): AgentStatusDisplay {
  const status = FINAL_VERIFICATION_STATUS_MAPPING[normalize(rawStatus)] ?? null;
  return status
    ? { label: verificationLabels[status], tone: verificationTones[status], status }
    : { label: 'Status unavailable', tone: 'neutral', status: null };
}

function normalize(rawStatus: string) {
  return rawStatus.trim().toLowerCase().replaceAll('-', '_').replaceAll(' ', '_');
}
