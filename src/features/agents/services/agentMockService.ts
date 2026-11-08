import type {
  AgentApplicationRecord,
  AgentApplicationValues,
  AgentDashboardSummary,
  AgentPropertyTask,
  AgentTaskStatus,
  InspectionReportValues,
} from '../types/agent';
import type { AgentApplicationService } from './agentApplicationService';
import type { AgentDashboardService } from './agentDashboardService';
import type { InspectionService } from '../../verification/services/inspectionService';
import type { VerificationService } from '../../verification/services/verificationService';

const initialApplication: AgentApplicationRecord = {
  status: 'rejected',
  rawStatus: 'rejected',
  submittedAt: '2026-10-12T10:00:00.000Z',
  updatedAt: '2026-10-17T10:00:00.000Z',
  adminFeedback: 'Please provide more detail about your real estate experience.',
  rejectionReason: 'The application needs a clearer summary of previous property work.',
};

const initialTasks: AgentPropertyTask[] = [
  {
    id: 'sample-task-101',
    propertyTitle: 'Sample family home in Asokoro',
    propertyType: 'Detached home',
    address: 'Example address, Aso Drive',
    neighbourhood: 'Asokoro',
    city: 'Abuja',
    state: 'FCT',
    askingPriceNaira: 285000000,
    taskStatus: 'assigned',
    rawTaskStatus: 'assigned',
    inspectionInstructions: 'Confirm the location and document visible property condition.',
    assignedAt: '2026-10-31T10:00:00.000Z',
    documentReviewStatus: 'Awaiting authorized review',
    inspectionStatus: 'Not started',
    finalStatus: 'pending_verification',
    rawFinalStatus: 'pending_verification',
  },
  {
    id: 'sample-task-102',
    propertyTitle: 'Sample apartment in Jabi',
    propertyType: 'Apartment',
    address: 'Example address, Jabi',
    neighbourhood: 'Jabi',
    city: 'Abuja',
    state: 'FCT',
    askingPriceNaira: 92000000,
    taskStatus: 'completed',
    rawTaskStatus: 'completed',
    inspectionInstructions: 'Record observations and submit supporting inspection photos.',
    assignedAt: '2026-10-20T10:00:00.000Z',
    documentReviewStatus: 'Awaiting admin decision',
    inspectionStatus: 'Completed',
    inspectionFindings: 'The observed property is consistent with the task description.',
    agentNotes: 'Illustrative agent field note.',
    adminDecision: 'Awaiting admin decision',
    finalStatus: 'under_review',
    rawFinalStatus: 'under_review',
    inspectionDate: '2026-10-24',
  },
];

let application = { ...initialApplication };
let tasks = initialTasks.map((task) => ({ ...task }));
let activities = [
  {
    id: 'activity-1',
    description: 'Inspection report submitted for Sample apartment in Jabi',
    date: '2026-10-24T11:00:00.000Z',
  },
  {
    id: 'activity-2',
    description: 'New property verification task assigned',
    date: '2026-10-31T10:00:00.000Z',
  },
];

export const agentApplicationMockService: AgentApplicationService = {
  mode: 'mock',
  async getCurrent() {
    return { ...application };
  },
  async submit(values: AgentApplicationValues) {
    void values;
    const now = new Date().toISOString();
    application = {
      status: 'pending',
      rawStatus: 'pending',
      submittedAt: now,
      updatedAt: now,
    };
    return { ...application };
  },
};

export const agentDashboardMockService: AgentDashboardService = {
  mode: 'mock',
  async getSummary(): Promise<AgentDashboardSummary> {
    return {
      tasks: tasks.map((task) => ({ ...task })),
      recentActivity: activities.map((activity) => ({ ...activity })),
    };
  },
  async getTask(id) {
    const task = tasks.find((item) => item.id === id);
    return task ? { ...task } : null;
  },
  async updateTaskStatus(id, status: AgentTaskStatus) {
    const task = tasks.find((item) => item.id === id);
    if (!task) {
      throw new Error('Assigned task was not found in the local demo data.');
    }
    if (task.taskStatus === 'completed' || task.taskStatus === 'cancelled') {
      throw new Error('This task can no longer be updated.');
    }
    const updated = { ...task, taskStatus: status, rawTaskStatus: status };
    tasks = tasks.map((item) => (item.id === id ? updated : item));
    activities = [
      {
        id: `activity-${Date.now()}`,
        description: `${status.replaceAll('_', ' ')} task: ${task.propertyTitle}`,
        date: new Date().toISOString(),
      },
      ...activities,
    ];
    return { ...updated };
  },
};

export const verificationMockService: VerificationService = {
  mode: 'mock',
  async getVerification(id) {
    const task = tasks.find((item) => item.id === id);
    return task ? { ...task } : null;
  },
};

export const inspectionMockService: InspectionService = {
  mode: 'mock',
  async submit(taskId: string, values: InspectionReportValues) {
    void values;
    const task = tasks.find((item) => item.id === taskId);
    if (!task || !['accepted', 'in_progress'].includes(task.taskStatus)) {
      throw new Error('Accept this assigned task before submitting an inspection report.');
    }
    const now = new Date().toISOString();
    const updated: AgentPropertyTask = {
      ...task,
      taskStatus: 'completed',
      rawTaskStatus: 'completed',
      inspectionStatus: 'Completed',
      inspectionDate: now.slice(0, 10),
      inspectionFindings: 'Inspection report submitted in local demo mode.',
      agentNotes: 'Mock inspection observations; no photos were uploaded.',
      finalStatus: 'pending_verification',
      rawFinalStatus: 'pending_verification',
    };
    tasks = tasks.map((item) => (item.id === taskId ? updated : item));
    activities = [
      {
        id: `activity-${Date.now()}`,
        description: `Inspection report submitted for ${task.propertyTitle}`,
        date: now,
      },
      ...activities,
    ];
    return {
      taskId,
      taskStatus: 'completed',
      finalVerificationStatus: 'pending_verification',
    };
  },
};

export function resetAgentMockData() {
  application = { ...initialApplication };
  tasks = initialTasks.map((task) => ({ ...task }));
  activities = [
    {
      id: 'activity-1',
      description: 'Inspection report submitted for Sample apartment in Jabi',
      date: '2026-10-24T11:00:00.000Z',
    },
    {
      id: 'activity-2',
      description: 'New property verification task assigned',
      date: '2026-10-31T10:00:00.000Z',
    },
  ];
}
