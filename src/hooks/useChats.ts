import { Chat, ApiChat, mapChat } from "../types/ai";
import { useEffect, useState, useCallback } from "react";

export function useChats() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadChats() {
            setError(null);

            try {
                const res = await fetch(
                    "/v1/chats/get_all_chats",
                    {
                        credentials: "include"
                    }
                );

                if (!res.ok) throw new Error(`Backend вернул ${res.status}`);
                const data: ApiChat[] = await res.json();
                setChats(data.map(mapChat));
            } catch (err) {
                setError(err instanceof Error ? err.message : "Не удалось загрузить чаты");
            }
        }

        loadChats();
    }, []);

    const createChat = useCallback(
        async (userPrompt: string): Promise<string> => {
            setError(null);

            try {
                const res = await fetch(
                    "/v1/chats/create",
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

    async function renameChat() {

    }

    async function deleteChat() {

    }

    return { chats, createChat };
}