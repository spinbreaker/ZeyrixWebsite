"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Message, Attachment } from "../types/chat";

export function useChat(chatId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
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
        setMessages([]);
      }

      if (!chatId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/chats/${chatId}/get_messages`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error(`Backend вернул ${res.status}`);
        const data: Message[] = await res.json();

        if (!cancelled) setMessages(data);
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

        if (!res.ok) throw new Error(`Backend вернул ${res.status}`);

        const data = await res.json();
        const aiMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          text: data.content,
          attachments: [],
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Не удалось отправить сообщение");
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