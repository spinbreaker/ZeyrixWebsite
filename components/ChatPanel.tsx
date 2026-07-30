"use client";
import { useChat } from "@/hooks/useChat";

export default function ChatPanel() {
    const { messages, sendMessage } = useChat();

    return (
        <div className="bg-neutral-800 border border-neutral-700 rounded-x1 px-4 py-2 text-sm">
            Привет!
        </div>
    );
}