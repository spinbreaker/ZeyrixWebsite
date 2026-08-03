import { Chat, ApiChat, mapChat } from "../types/chat";
import { useEffect, useState, useCallback } from "react";

export function useChats() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadChats() {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(
                    "/api/chats/get_all_chats",
                    {
                        credentials: "include"
                    }
                );

                if (!res.ok) throw new Error(`Backend вернул ${res.status}`);
                const data: ApiChat[] = await res.json();
                setChats(data.map(mapChat));
            } catch (err) {
                setError(err instanceof Error ? err.message : "Не удалось загрузить чаты");
            } finally {
                setLoading(false);
            }
        }

        loadChats();
    }, []);

    const createChat = useCallback(
        async (userPrompt: string): Promise<string> => {
            setError(null);

            try {
                const res = await fetch(
                    "/api/chats/create",
                    {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ "user_prompt": userPrompt }),
                    }
                );

                if (!res.ok) throw new Error(`Backend вернул ${res.status}`);

                const data: ApiChat = await res.json();
                setChats((prev) => [...prev, mapChat(data)]);

                return data.id;
            } catch (err) {
                const error = err instanceof Error ? err.message : "Не удалось создать чат";

                setError(error);
                throw err;
            }
        },
        [],
    );

    const renameChat = useCallback(
        async (chatId: string, newTitle: string): Promise<undefined> => {
            setError(null);

            try {
                const res = await fetch(
                    "/api/chats/rename",
                    {
                        method: "PATCH",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ "chatId": chatId, "newTitle": newTitle }),
                    }
                );

                if (!res.ok) throw new Error(`Backend вернул ${res.status}`);
            } catch (err) {
                const error = err instanceof Error ? err.message : "Не удалось переименовать чат";

                setError(error);
                throw err;
            }
        },
        [],
    );

    const deleteChat = useCallback(
        async (chatId: string): Promise<undefined> => {
            setError(null);

            try {
                const res = await fetch(
                    "/api/chats/delete",
                    {
                        method: "DELETE",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ "chatId": chatId }),
                    }
                );

                if (!res.ok) throw new Error(`Backend вернул ${res.status}`);

                setChats((prev) => 
                    prev.filter((chat) => chat.id != chatId)
                )
            } catch (err) {
                const error = err instanceof Error ? err.message : "Не удалось переименовать чат";

                setError(error);
                throw err;
            }
        },
        [],
    );

    return { chats, createChat, renameChat, deleteChat, loading };
}