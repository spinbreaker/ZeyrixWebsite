"use client";

import { useState, useCallback } from "react";
import type { PendingAttachment, PresignResponse } from "@/src/types/chat";
import { cacheImage } from "../lib/ImageCache";

export function useFileUpload() {
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);

  const updateAttachment = useCallback((localId: string, patch: Partial<PendingAttachment>) => {
    setAttachments((prev) =>
      prev.map((a) => (a.localId === localId ? { ...a, ...patch } : a))
    );
  }, []);

  const removeAttachment = useCallback((localId: string) => {
    setAttachments((prev) => prev.filter((a) => a.localId !== localId));
  }, []);

  function isImage(file: File): boolean {
    return file.type.startsWith("image/");
  }

  const uploadFile = useCallback(async (file: File) => {
    const localId = crypto.randomUUID();
    const entry: PendingAttachment = {
      localId,
      file,
      status: "uploading",
      fileId: null,
      error: null,
    };
    setAttachments((prev) => [...prev, entry]);

    try {
      // Step 1: presign
      const presignRes = await fetch("/api/files/presign", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });
      if (!presignRes.ok) throw new Error(`Presign failed: ${presignRes.status}`);
      const { uploadUrl, fileId }: PresignResponse = await presignRes.json();

      // Step 2: PUT to storage & cache to IDB
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);

      if (isImage(file)) {
        await cacheImage(fileId, file);
      }

      // Step 3: confirm
      fetch("/api/files/confirm", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_id: fileId }),
      }).catch(() => {});

      updateAttachment(localId, { status: "done", fileId });
    } catch (err) {
      updateAttachment(localId, {
        status: "error",
        error: err instanceof Error ? err.message : "Upload failed",
      });
    }
  }, [updateAttachment]);

  const readyFileIds = attachments
    .filter((a) => a.status === "done" && a.fileId)
    .map((a) => a.fileId!) as string[];

  const isUploading = attachments.some((a) => a.status === "uploading");

  return { attachments, uploadFile, removeAttachment, readyFileIds, isUploading, setAttachments };
}