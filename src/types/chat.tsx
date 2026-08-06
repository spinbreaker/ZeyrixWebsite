export type AITag = {
    text: string;
};

type ApprovalDetails = {
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
    role: "user" | "assistant" | "approve" | "error";
    text: string;
    attachments?: Attachment[];
    createdAt: string;
    approvalDetails?: ApprovalDetails;
    applyToolUse: (requestId: string, action: "confirm" | "reject") => Promise<void>;
};

export type Attachment = {
    id: string;
    type: string;
    name: string;
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

export type AttachmentStatus = "uploading" | "done" | "error";

export interface PendingAttachment {
  localId: string;
  file: File;
  status: AttachmentStatus;
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
  approvalDetails?: ApprovalDetails;
};

export function mapAttachments(attachment: PendingAttachment): Attachment {
  const sizeMB = `${(attachment.file.size / (1024 * 1024)).toFixed(2)} MB`

  return {
    id: attachment.fileId ?? crypto.randomUUID(),
    type: attachment.file.type,
    name: attachment.file.name,
    size: sizeMB,
  }
}