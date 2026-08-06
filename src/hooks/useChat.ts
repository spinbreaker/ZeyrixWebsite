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
  
  // Загрузка истории при монтировании / смене chatId
  useEffect(() => {
    let cancelled = false; // защита от гонки при быстрой смене chatId
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

        if (!cancelled) {
          if (data.length > 0) {
            if (data.at(-1)?.role === "approve") {
              const expiresAt = data.at(-1)?.approvalDetails?.approvalExpiresAt;
              const isProbablyPending = new Date() < new Date(expiresAt || Date.now())

              if (isProbablyPending) {
                setIsToolRequestPending(true);
              } else {
                setIsToolRequestPending(false);
              }
            }

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
      cancelled = true; // если chatId сменился до завершения fetch — игнорируем устаревший ответ
    };
  }, [chatId]);

  const sendMessage = useCallback(
    async (prompt: string, attachments: Attachment[] = [], fileIds: string[] = [], newChatId?: string) => {
      const targetChatId = newChatId ?? chatId;

      const optimisticUserMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        text: prompt,
        attachments: attachments,
        createdAt: new Date().toISOString(),
      };

      if (newChatId) {
        setOptimisticMessages(newChatId, [
          ...(optimisticMessagesByChatId.get(newChatId) ?? []),
          optimisticUserMsg,
        ]);
      }

      setMessages((prev) => [...prev, optimisticUserMsg]);
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

        if (data.status === "completed") {
          var role: "assistant" | "approve" = "assistant";
        } else if (data.status === "approve_required") {
          var role: "assistant" | "approve" = "approve";
          setIsToolRequestPending(true);
        } else {
          throw new Error("The server response was not as expected.\nPlease, inform us if you see it.\nError detail: AI response status was null or different.");
        }

        const responseMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          text: data.content,
          attachments: [],
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, responseMessage]);

        if (targetChatId) {
          clearOptimisticMessages(targetChatId);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to send a message.\nTry again in a moment.\nIf this problem will repeat, please, inform us.");
        setMessages((prev) => prev.filter((message) => message.id !== optimisticUserMsg.id));
        if (targetChatId) {
          clearOptimisticMessages(targetChatId);
        }

        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: "error",
          text: error.message,
          createdAt: new Date().toISOString(),
          applyToolUse: applyToolUse,
        };
        setMessages((prev) => [...prev, errorMessage]);

        setError(error.message);
        throw error;
      } finally {
        setSending(false);
      }
    },
    [chatId]
  );

  return { messages, loading, error, sending, sendMessage };
}