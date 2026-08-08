"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Message, Attachment, AIResponse } from "../types/chat";

const optimisticMessagesByChatId = new Map<string, Message[]>();

function getOptimisticMessages(chatId?: string) {
  if (!chatId) return [];

  return optimisticMessagesByChatId.get(chatId) ?? [];
}

function setOptimisticMessages(chatId: string, messages: Message[]) {
  optimisticMessagesByChatId.set(chatId, messages);
}

function clearOptimisticMessages(chatId?: string) {
  if (!chatId) return;

  optimisticMessagesByChatId.delete(chatId);
}

export function useChat(chatId?: string) {
  const [messages, setMessages] = useState<Message[]>(() => getOptimisticMessages(chatId));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const previousChatIdRef = useRef<string | undefined>(chatId);
  
  useEffect(() => {
    let cancelled = false;
    const previousChatId = previousChatIdRef.current;
    previousChatIdRef.current = chatId;

    async function loadMessages() {
      setLoading(true);
      setError(null);

      if (previousChatId !== undefined && previousChatId !== chatId) {
          setMessages(getOptimisticMessages(chatId));
      }

      if (!chatId) {
        setMessages([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/chats/${chatId}/get_messages`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error(`Backend вернул ${res.status}`);
        const data: Message[] = await res.json();

        const status = data.at(-1)?.status;
        const approvalDetails = data.at(-1)?.steps?.at(-1)?.approvalDetails;

        if (!cancelled) {
          if (data.length > 0) {
            clearOptimisticMessages(chatId);
            setMessages(data);
          } else {
            setMessages(getOptimisticMessages(chatId));
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Не удалось загрузить сообщения");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [chatId]);

  const sendMessage = useCallback(
    async (prompt: string, attachments: Attachment[] = [], fileIds: string[] = [], newChatId?: string) => {
      const targetChatId = newChatId ?? chatId;

      const optimisticUserMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        status: "completed",
        text: prompt,
        attachments: attachments,
        createdAt: new Date().toISOString(),
        applyToolUse: applyToolUse,
      };

      const optimisticAgentMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        status: "pending",
        text: "",
        createdAt: new Date().toISOString(),
        applyToolUse: applyToolUse,
      };

      if (newChatId) {
        setOptimisticMessages(newChatId, [
          ...(optimisticMessagesByChatId.get(newChatId) ?? []),
          optimisticUserMsg,
          optimisticAgentMessage,
        ]);
      }

      setMessages((prev) => [...prev, optimisticUserMsg, optimisticAgentMessage]);
      setSending(true);
      setError(null);

      try {
        const res = await fetch("/api/ai/zeyrixai", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_prompt: prompt, file_ids: fileIds, chat_id: targetChatId }),
        });
        
        try {
          await res.clone().json();
        } catch {
          throw new Error(`Failed to connect to the server.\nCheck your network and try again.`)
        }

        if (!res.ok) {
          const resError = await res.json();
          throw new Error(`Internal server error occurred.\nPlease, copy the request id and inform us.\nRequest ID: ${resError.request_id}`)
        }
        const data: AIResponse = await res.json();

        setMessages(prev => {
          const index = prev.findLastIndex(
            message => message.role === "assistant"
          );

          if (index === -1) {
            return prev;
          }

          return prev.map((message, i) =>
            i === index
              ? {
                  ...message,
                  status: data.status == "completed" ? "completed" : "approval_required",
                  text: data.content,
                  steps: data.steps,
                  processingSeconds: data.processingSeconds,
                }
              : message
          );
        });

        if (targetChatId) {
          clearOptimisticMessages(targetChatId);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to send a message.\nTry again in a moment.\nIf this problem will repeat, please, inform us.");
        setMessages((prev) => prev.filter((message) => message.id !== optimisticUserMsg.id));
        if (targetChatId) {
          clearOptimisticMessages(targetChatId);
        }

        setMessages(prev => {
          const index = prev.findLastIndex(
            message => message.role === "assistant"
          );

          if (index === -1) {
            return prev;
          }

          return prev.map((message, i) =>
            i === index
              ? {
                  ...message,
                  status: "error",
                  text: error.message,
                }
              : message
          );
        });

        setError(error.message);
        throw error;
      } finally {
        setSending(false);
      }
    },
    [chatId]
  );

  const applyToolUse = useCallback(async (requestId: string, action: "confirm" | "reject") => {
      setSending(true);
      setError(null);

      try {
        const res = await fetch(`/api/ai/apply_tool`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestId: requestId, action: action }),
        });
        
        try {
          await res.clone().json();
        } catch {
          throw new Error(`Failed to connect to the server.\nCheck your network and try again.`)
        }

        if (!res.ok) {
          const resError = await res.json();
          throw new Error(`Internal server error occurred.\nPlease, copy the request id and inform us.\nRequest ID: ${resError.request_id}`)
        }
        const data: AIResponse = await res.json();

        setMessages(prev => {
          const index = prev.findLastIndex(
            message => message.status === "approval_required"
          );

          if (index === -1) {
            return prev;
          }
          
          return prev.map((message, i) =>
            i === index
              ? {
                  ...message,
                  status: "completed",
                  text: data.content,
                  steps: data.steps,
                  processingSeconds: (message.processingSeconds ? message.processingSeconds : 0) + (data.processingSeconds ? data.processingSeconds : 0),
                }
              : message
          );
        });

      } catch (err) {
        const error = err instanceof Error ? err : new Error(`Failed to handle the request.\nTry again in a moment.\nIf this problem will repeat, please, inform us.`);

        setMessages(prev => {
          const index = prev.findLastIndex(
            message => message.role === "assistant"
          );

          if (index === -1) {
            return prev;
          }

          return prev.map((message, i) =>
            i === index
              ? {
                  ...message,
                  status: "error",
                  text: error.message,
                }
              : message
          );
        });

        setError(error.message);
        throw error;
      } finally {
        setSending(false);
      }
    }, [])

  return { messages, loading, error, sending, sendMessage, applyToolUse };
}