export type AgentApplicationStatus =
  'not_applied' | 'pending' | 'under_review' | 'approved' | 'rejected';

export type AgentApplicationStatusLabel =
  'Not Applied' | 'Pending' | 'Under Review' | 'Approved' | 'Rejected';

export const AGENT_APPLICATION_STATUS_LABELS: Record<
  AgentApplicationStatus,
  AgentApplicationStatusLabel
> = {
  not_applied: 'Not Applied',
  pending: 'Pending',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const AGENT_APPLICATION_STATUS_MAPPING: Record<string, AgentApplicationStatus> = {
  not_applied: 'not_applied',
  none: 'not_applied',
  pending: 'pending',
  submitted: 'pending',
  under_review: 'under_review',
  in_review: 'under_review',
  approved: 'approved',
  accepted: 'approved',
  rejected: 'rejected',
  declined: 'rejected',
};

export type AgentTaskStatus = 'assigned' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export const AGENT_TASK_STATUS_LABELS: Record<AgentTaskStatus, string> = {
  assigned: 'Assigned',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const AGENT_TASK_STATUS_MAPPING: Record<string, AgentTaskStatus> = {
  assigned: 'assigned',
  accepted: 'accepted',
  in_progress: 'in_progress',
  started: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled',
  canceled: 'cancelled',
};

export type FinalVerificationStatus =
  'pending_verification' | 'under_review' | 'verified' | 'rejected';

export const FINAL_VERIFICATION_STATUS_MAPPING: Record<string, FinalVerificationStatus> = {
  pending_verification: 'pending_verification',
  pending: 'pending_verification',
  under_review: 'under_review',
  in_review: 'under_review',
  verified: 'verified',
  approved: 'verified',
  rejected: 'rejected',
};

export interface AgentApplicationValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  residentialAddress: string;
  state: string;
  city: string;
  professionalExperience: string;
  previousRealEstateExperience: string;
  introduction: string;
  supportingDocuments: File[];
}

export interface AgentApplicationRecord {
  status: AgentApplicationStatus;
  rawStatus: string;
  submittedAt: string | null;
  updatedAt: string | null;
  adminFeedback?: string;
  rejectionReason?: string;
}

export interface AgentPropertyTask {
  id: string;
  propertyTitle: string;
  propertyType: string;
  address: string;
  neighbourhood: string;
  city: string;
  state: string;
  askingPriceNaira: number;
  taskStatus: AgentTaskStatus;
  rawTaskStatus: string;
  inspectionInstructions: string;
  assignedAt: string;
  documentReviewStatus: string;
  inspectionStatus: string;
  inspectionFindings?: string;
  agentNotes?: string;
  adminDecision?: string;
  finalStatus: FinalVerificationStatus;
  rawFinalStatus: string;
  inspectionDate?: string;
}

export interface InspectionReportValues {
  inspectionDate: string;
  outcome: string;
  conditionObservations: string;
  locationConfirmed: boolean;
  supportingPhotos: File[];
  additionalNotes: string;
}

export interface AgentDashboardSummary {
  tasks: AgentPropertyTask[];
  recentActivity: Array<{ id: string; description: string; date: string }>;
}

export type AgentServiceMode = 'mock' | 'api';
