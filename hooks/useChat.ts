"use client";
import { useState } from "react";

export function useChat() {
    const [messages, setMessages] = useState([]);

    async function sendMessage(prompt: string) {
        // code
    }

    return { messages, sendMessage };
}