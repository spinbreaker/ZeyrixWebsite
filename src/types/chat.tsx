type StepStatus = "in_progress" | "done" | "error" | "awaiting_approval" | "denied" | "expired"
type StepKind = "tool_call" | "reasoning" | "file_transcribe"

export interface AgentStep {
  id: string;
  kind: StepKind;
  label: string;
  status: StepStatus;
  approvalDetails?: ApprovalDetails;
  toolName?: string;
  isLast?: boolean;
}

export type StreamEvent =
  | { type: "step_start"; id: string; kind: StepKind; label: string; status: StepStatus; toolName?: string; approvalDetails?: ApprovalDetails }
  | { type: "step_update"; id: string; status: StepStatus; approvalDetails?: ApprovalDetails }
  | { type: "text_delta"; delta: string }
  | { type: "done"; status: "completed" | "approve_required"; content: string; steps: AgentStep[]; processingSeconds: number }
  | { type: "error"; message: string };

export type ApprovalDetails = {
  approvalId: string;
  approvalExpiresAt: string;
  toolName: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  actionSummary: string;
  affectedResources: string[];
  reversible: boolean;
  paramsPreview: any;
  status:
    "pending" | "approved" | "rejected" | "expired" | "executed" | "failed";
  appliedAt: string | null;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  status: "completed" | "pending" | "error" | "approve_required";
  text: string;
  attachments?: Attachment[];
  createdAt: string;
  processingSeconds?: number;
  steps?: AgentStep[];
  applyToolUse: (
    requestId: string,
    action: "confirm" | "reject",
  ) => Promise<void>;
};

export type Attachment = {
  fileId: string;
  filename: string;
  mimeType: string;
  size: string;
};

export type ApiChat = {
  id: string;
  title: string;
  updated_at: string;
};

export type Chat = {
  id: string;
  name: string;
  updatedAt: string;
};

export function mapChat(chat: ApiChat): Chat {
  return {
    id: chat.id,
    name: chat.title,
    updatedAt: chat.updated_at,
  };
}

export interface PendingAttachment {
  localId: string;
  file: File;
  status: "uploading" | "done" | "error";
  fileId: string | null;
  error: string | null;
}

export interface PresignResponse {
  uploadUrl: string;
  fileId: string;
}

export function mapAttachments(attachment: PendingAttachment): Attachment {
  const sizeMB = `${(attachment.file.size / (1024 * 1024)).toFixed(2)} MB`;

  return {
    fileId: attachment.fileId ?? crypto.randomUUID(),
    mimeType: attachment.file.type,
    filename: attachment.file.name,
    size: sizeMB,
  };
}
