interface PendingAgentMessage {
  type: "pending";
  id: string;
  steps: AgentStep[];
  status: "thinking" | "streaming" | "done";
}

export interface AgentStep {
  id: string;
  kind: "tool_call" | "reasoning";
  label: string;
  status: "in_progress" | "done" | "error" | "awaiting_approval" | "denied" | "expired";
  approvalDetails?: ApprovalDetails;
  toolName?: string;
  isLast?: boolean;
}

export type ApprovalDetails = {
  approvalId: string;
  approvalExpiresAt: string;
  toolName: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  actionSummary: string;
  affectedResources: string[];
  reversible: boolean;
  paramsPreview: any;
  status: "pending" | "approved" | "rejected" | "expired" | "executed" | "failed";
  appliedAt: string | null;
}

export type Message = {
    id: string;
    role: "user" | "assistant";
    status: "completed" | "pending" | "error" | "approval_required"
    text: string;
    attachments?: Attachment[];
    createdAt: string;
    processingSeconds?: number;
    steps?: AgentStep[];
    applyToolUse: (requestId: string, action: "confirm" | "reject") => Promise<void>;
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
};

export interface PresignResponse {
  uploadUrl: string;
  fileId: string;
};

export type AIResponse = {
  status: "completed" | "approve_required";
  content: string;
  steps?: AgentStep[];
  processingSeconds?: number;
};

export function mapAttachments(attachment: PendingAttachment): Attachment {
  const sizeMB = `${(attachment.file.size / (1024 * 1024)).toFixed(2)} MB`

  return {
    fileId: attachment.fileId ?? crypto.randomUUID(),
    mimeType: attachment.file.type,
    filename: attachment.file.name,
    size: sizeMB,
  }
}