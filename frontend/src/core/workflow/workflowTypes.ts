export type WorkflowStatus =
  | "draft"
  | "submitted"
  | "analysis"
  | "completed"
  | "reviewer-approved"
  | "qa-approved"
  | "rejected";

export interface WorkflowState {
  status: WorkflowStatus;

  updatedAt?: string;

  updatedBy?: string;

  comment?: string;
}