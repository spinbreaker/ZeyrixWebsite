"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { flushSync } from "react-dom";
import {
  Message,
  Attachment,
  StreamEvent,
  AgentStep,
} from "../types/chat";
import { useLocale } from "next-intl";
import { useConnection } from "../components/auth/ConnectionContext";

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
  const [messages, setMessages] = useState<Message[]>(() =>
    getOptimisticMessages(chatId),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const previousChatIdRef = useRef<string | undefined>(chatId);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [shouldMessagesLoad, setShouldMessagesLoad] = useState(false);

  const locale = useLocale();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { state } = useConnection();

  useEffect(() => {
    let cancelled = false;
    const previousChatId = previousChatIdRef.current;
    previousChatIdRef.current = chatId;

    if (state !== "ready") {
      return;
    }

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
            clearOptimisticMessages(chatId);
            setMessages(data);
          } else {
            setMessages(getOptimisticMessages(chatId));
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load messages",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
        if (shouldMessagesLoad) setShouldMessagesLoad(false);
      }
    }

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [chatId, state, shouldMessagesLoad]);

  async function streamAI(
    url: string,
    body: Record<string, unknown>,
    onEvent: (event: StreamEvent) => void,
    signal: AbortSignal,
  ) {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "identity",
      },
      body: JSON.stringify(body),
      signal,
    });
    
    if (!response.ok || !response.body) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data:")) {
            continue;
          }

          const data = trimmed.slice(5).trim();
          if (!data || data === "[DONE]") {
            continue;
          }

          const event: StreamEvent = JSON.parse(data);
          onEvent(event);
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  function handleStreamEvent(
    event: StreamEvent,
    updateMessage: (updater: (message: Message) => Message) => void,
  ) {
    switch (event.type) {
      case "step_start": {
        const newStep: AgentStep = {
          id: event.id,
          kind: event.kind,
          label: event.label,
          status: event.status,
          toolName: event.toolName,
          approvalDetails: event.approvalDetails,
          toolDetails: event.toolDetails,
          failedGeneration: event.failedGeneration,
        };

        updateMessage((message) => ({
          ...message,
          steps: [...(message.steps ?? []), newStep],
        }));
        break;
      }

      case "step_update":
        updateMessage((message) => ({
          ...message,
          steps: (message.steps ?? []).map((step) =>
            step.id === event.id
              ? {
                  ...step,
                  status: event.status,
                  approvalDetails: event.approvalDetails,
                  toolDetails: event.toolDetails,
                  failedGeneration: event.failedGeneration,
                }
              : step,
          ),
        }));
        break;

      case "text_delta":
        updateMessage((message) => ({
          ...message,
          text: message.text + event.delta,
        }));
        break;

      case "done":
        updateMessage((message) => ({
          ...message,
          status: event.status,
          text: event.content,
          processingSeconds:
            (message.processingSeconds ?? 0) +
            event.processingSeconds,
        }));
        break;

      case "error":
        updateMessage((message) => ({
          ...message,
          status: "error",
          text: event.message,
        }));
        break;
    }
  }

  const sendMessage = useCallback(
    async (
      prompt: string,
      attachments: Attachment[] = [],
      fileIds: string[] = [],
      newChatId?: string,
    ) => {
      const targetChatId = newChatId ?? chatId;

      const controller = new AbortController();
      abortControllerRef.current = controller;

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

      setMessages((prev) => [
        ...prev,
        optimisticUserMsg,
        optimisticAgentMessage,
      ]);
      setSending(true);
      setError(null);

      try {
        const updateLastAssistantMessage = (updater: (message: Message) => Message) => {
          flushSync(() => {
            setMessages((prev) => {
              const index = prev.findLastIndex((m) => m.role === "assistant");
              if (index === -1) return prev;

              const next = prev.map((message, i) =>
                i === index ? updater(message) : message,
              );

              return next;
            });
          });
        };

        try {
          await streamAI(
            "http://localhost:8000/v1/ai/zeyrix/stream",
            {
              chatId: targetChatId,
              fileIds,
              userPrompt: prompt,
              locale: locale,
              timezone: timezone,
            },
            (event) => handleStreamEvent(event, updateLastAssistantMessage),
            controller.signal,
          );
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            setMessages((prev) =>
              prev.map((message, index) => {
                if (
                  index === prev.findLastIndex((m) => m.role === "assistant")
                ) {
                  return {
                    ...message,
                    status: "cancelled",
                  };
                }

                return message;
              }),
            );

            return;
          }

          if (error instanceof Error) {
            const data = JSON.parse(error.message)
            console.log(data.detail);
          }

          setMessages((prev) => {
            const messages = [...prev];

            const lastAgentIndex = messages.findLastIndex(
              (message) => message.role === "assistant"
            );

            if (lastAgentIndex !== -1) {
              messages.splice(lastAgentIndex, 1);
            }

            const lastUserIndex = messages.findLastIndex(
              (message) => message.role === "user"
            );

            if (lastUserIndex !== -1) {
              messages[lastUserIndex] = {
                ...messages[lastUserIndex],
                status: "error",
                notSent: true,
                retrySendMessage: retrySendMessage,
              };
            }

            return messages;
          });

          throw error;
        }
      } finally {
        if (targetChatId) {
          clearOptimisticMessages(targetChatId);
        }
        
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }

        setSending(false);
      }
    },
    [chatId],
  );

  async function retrySendMessage(id: string, prompt: string, attachments: Attachment[], deleteFromLocal: boolean = true) {
    if (deleteFromLocal) {
      setMessages((prev) =>
        prev.filter((message) => message.id !== id)
      );
    }

    const fileIds = attachments.map((attachment) => attachment.fileId)

    try {
      await sendMessage(prompt, attachments, fileIds)
    } catch(error) {

    }
  }

  const applyToolUse = useCallback(async (requestId: string, action: "confirm" | "reject") => {
      setSending(true);
      setError(null);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const updateApproveRequiredMessage = (
          updater: (message: Message) => Message,
        ) => {
          flushSync(() => {
            setMessages((prev) => {
              const index = prev.findLastIndex(
                (message) => message.status === "approval_required",
              );
              if (index === -1) return prev;
              return prev.map((message, i) =>
                i === index ? updater(message) : message,
              );
            });
          });
        };

        await streamAI(
          "/api/ai/apply_tool",
          { 
            requestId: requestId,
            action: action,
            locale: locale,
            timezone: timezone,
          },
          (event) => handleStreamEvent(event, updateApproveRequiredMessage),
          controller.signal,
        );
        
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setMessages((prev) =>
            prev.map((message, index) => {
              if (
                index === prev.findLastIndex((m) => m.role === "assistant")
              ) {
                return {
                  ...message,
                  status: "cancelled",
                };
              }

              return message;
            }),
          );

          return;
        }

        const error =
          err instanceof Error
            ? err
            : new Error(
                `Failed to handle the request.\nTry again in a moment.\nIf this problem will repeat, please, inform us.`,
              );

        setMessages((prev) => {
          const index = prev.findLastIndex(
            (message) => message.role === "assistant",
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
              : message,
          );
        });

        setError(error.message);
        throw error;
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }

        setSending(false);
      }
    },
    [locale, timezone],
  );

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return { messages, loading, error, sending, sendMessage, applyToolUse, retrySendMessage, stopGeneration, setShouldMessagesLoad };
}
