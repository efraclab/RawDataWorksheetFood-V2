import type { WorkflowStatus } from "./workflowTypes";

export type UserRole = "Analyst" | "Reviewer" | "QA";

export interface WorkflowPermissions {
  canStartAnalysis: boolean;
  canCompleteAnalysis: boolean;
  canApproveReviewer: boolean;
  canRequestRevision: boolean;
  canApproveQA: boolean;
  canReturnQARevision: boolean;
  isReadOnly: boolean;
}

export class WorkflowEngine {
  static getPermissions(
    status: WorkflowStatus,
    role: UserRole
  ): WorkflowPermissions {
    const isAnalyst = role === "Analyst";
    const isReviewer = role === "Reviewer";
    const isQA = role === "QA";

    return {
      canStartAnalysis:
        isAnalyst && status === "analysis",

      canCompleteAnalysis:
        isAnalyst && status === "analysis",

      canApproveReviewer:
        isReviewer && status === "completed",

      canRequestRevision:
        isReviewer && status === "completed",

      canApproveQA:
        isQA && status === "reviewer-approved",

      canReturnQARevision:
        isQA && status === "reviewer-approved",

      isReadOnly:
        (isAnalyst && status === "completed") ||
        (isReviewer && status === "reviewer-approved") ||
        (isQA && status === "qa-approved"),
    };
  }
}