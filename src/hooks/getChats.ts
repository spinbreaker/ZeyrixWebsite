import { useState } from "react";
import { Chat } from "../types/ai";

export function getChats() {
    const [chats, setChats] = useState<Chat[]>([
        {
        id: "chat-001",
        name: "AI Assistant",
        createdAt: "2026-08-01T18:42:00Z",
        },
        {
            id: "chat-002",
            name: "React project help",
            createdAt: "2026-08-01T14:15:00Z",
        },
        {
            id: "chat-003",
            name: "Database architecture",
            createdAt: "2026-08-01T09:30:00Z",
        },
        {
            id: "chat-004",
            name: "TypeScript questions",
            createdAt: "2026-07-31T22:10:00Z",
        },
        {
            id: "chat-005",
            name: "Cloud storage discussion",
            createdAt: "2026-07-31T16:45:00Z",
        },
        {
            id: "chat-006",
            name: "Next.js routing",
            createdAt: "2026-07-30T11:20:00Z",
        },
        {
            id: "chat-007",
            name: "UI improvements",
            createdAt: "2026-07-29T19:05:00Z",
        },
        {
            id: "chat-008",
            name: "Tailwind CSS help",
            createdAt: "2026-07-28T13:40:00Z",
        },
        {
            id: "chat-009",
            name: "API design",
            createdAt: "2026-07-27T08:25:00Z",
        },
        {
            id: "chat-010",
            name: "Authentication flow",
            createdAt: "2026-07-26T21:15:00Z",
        },
        {
            id: "chat-011",
            name: "AI models comparison",
            createdAt: "2026-07-25T17:50:00Z",
        },
        {
            id: "chat-012",
            name: "File uploads",
            createdAt: "2026-07-20T12:00:00Z",
        },
        {
            id: "chat-013",
            name: "IndexedDB caching",
            createdAt: "2026-07-15T15:35:00Z",
        },
        {
            id: "chat-014",
            name: "Product ideas",
            createdAt: "2026-07-10T10:10:00Z",
        },
        {
            id: "chat-015",
            name: "Startup planning",
            createdAt: "2026-07-01T18:00:00Z",
        },
        {
            id: "chat-016",
            name: "Marketing strategy",
            createdAt: "2026-06-20T09:45:00Z",
        },
        {
            id: "chat-017",
            name: "Research notes",
            createdAt: "2026-06-10T14:30:00Z",
        },
        {
            id: "chat-018",
            name: "Old project discussion",
            createdAt: "2026-05-25T20:20:00Z",
        },
        {
            id: "chat-019",
            name: "First experiments",
            createdAt: "2026-05-01T11:00:00Z",
        },
        {
            id: "chat-020",
            name: "Initial setup",
            createdAt: "2026-04-15T16:25:00Z",
        },
    ]);

    return { chats };
}