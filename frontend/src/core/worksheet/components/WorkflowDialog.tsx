import { useEffect, useState } from "react";

interface WorkflowDialogProps {
  isOpen: boolean;
  action:
    | "start-analysis"
    | "complete-analysis"
    | "approve-parameter"
    | "reviewer-revision"
    | "qa-revision"
    | "submit-analysis"
    | "submit-qa"
    | "approve-worksheet"
    | null;
  parameterName?: string;
  parameterCode?: string;
  totalParameters?: number;
  approvedParameters?: number;
  busy?: boolean;
  comment: string;
  onCommentChange: (value: string) => void;
  approvalDateTime?: string;
  onApprovalDateTimeChange?: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function WorkflowDialog({
  isOpen,
  action,
  parameterName = "",
  parameterCode = "",
  totalParameters = 0,
  approvedParameters = 0,
  busy = false,
  comment,
  onCommentChange,
  approvalDateTime = "",
  onApprovalDateTimeChange,
  onClose,
  onConfirm,
}: WorkflowDialogProps) {
  const [localComment, setLocalComment] = useState(comment);

  useEffect(() => {
    if (isOpen) setLocalComment(comment);
  }, [isOpen, comment]);

  if (!isOpen || !action) return null;

  const config: Record<string, { title: string; description: string; confirm: string; tone: string; comments: boolean }> = {
    "start-analysis": {
      title: "Start Analysis",
      description: `Start analysis for ${parameterName}${parameterCode ? ` (${parameterCode})` : ""}?`,
      confirm: "Start Analysis",
      tone: "emerald",
      comments: false,
    },
    "complete-analysis": {
      title: "Complete Analysis",
      description: `Complete analysis for ${parameterName}${parameterCode ? ` (${parameterCode})` : ""}.`,
      confirm: "Complete Analysis",
      tone: "emerald",
      comments: true,
    },
    "approve-parameter": {
      title: "Approve Parameter",
      description: `Approve ${parameterName}${parameterCode ? ` (${parameterCode})` : ""} as Reviewer?`,
      confirm: "Approve Parameter",
      tone: "blue",
      comments: true,
    },
    "reviewer-revision": {
      title: "Request Revision",
      description: `Return ${parameterName}${parameterCode ? ` (${parameterCode})` : ""} to the Analyst for revision.`,
      confirm: "Request Revision",
      tone: "amber",
      comments: true,
    },
    "qa-revision": {
      title: "QA Request Revision",
      description: `Return ${parameterName}${parameterCode ? ` (${parameterCode})` : ""} for corrective revision.`,
      confirm: "Request Revision",
      tone: "amber",
      comments: true,
    },
    "submit-analysis": {
      title: "Submit for Analysis",
      description: `Submit ${totalParameters} worksheet parameter(s) for Analyst processing?`,
      confirm: "Submit for Analysis",
      tone: "emerald",
      comments: false,
    },
    "submit-qa": {
      title: "Submit for QA Review",
      description: `Submit this worksheet for QA validation? All ${approvedParameters || totalParameters} parameter(s) are Reviewer approved.`,
      confirm: "Submit for QA Review",
      tone: "blue",
      comments: false,
    },
    "approve-worksheet": {
      title: "Approve Worksheet",
      description: `Approve this worksheet as QA? ${approvedParameters} of ${totalParameters} parameter(s) are approved.`,
      confirm: "Approve Worksheet",
      tone: "emerald",
      comments: true,
    },
  };

  const current = config[action];
  const syncComment = (value: string) => {
    setLocalComment(value);
    onCommentChange(value);
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="text-[17px] font-bold text-slate-900">{current.title}</div>
          <div className="mt-1 text-[13px] leading-5 text-slate-600">{current.description}</div>
        </div>

        <div className="space-y-4 px-6 py-5">
          {current.comments && (
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
                {action === "complete-analysis" ? "Analyst remarks" :
                 action === "approve-parameter" ? "Reviewer remarks" :
                 action === "qa-revision" ? "QA comments" : "Revision comments"}
              </label>
              <textarea
                value={localComment}
                onChange={(e) => syncComment(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-[13px] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Enter remarks/comments..."
                disabled={busy}
              />
            </div>
          )}

          {action === "approve-worksheet" && (
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
                Approval date & time
              </label>
              <input
                type="datetime-local"
                value={approvalDateTime}
                onChange={(e) => onApprovalDateTimeChange?.(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[13px] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                disabled={busy}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Processing..." : current.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
