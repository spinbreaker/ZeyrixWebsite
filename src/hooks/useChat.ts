import { useState } from "react";
import { Message } from "../types/ai";

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "user",
            text: "Привет! Можешь помочь мне разобраться с этим вопросом?",
            time: "22:01",
        },
        {
            "id": "2",
            role: "assistant",
            text: "Конечно! Расскажи подробнее, с чем именно нужна помощь.",
            time: "22:01",
        },
        {
            "id": "3",
            role: "user",
            text: "Я делаю AI-чат на React и хочу правильно хранить сообщения.",
            attachments: [
                {
                    "id": "1",
                    type: "pdf",
                    name: "architecture.pdf",
                    size: "2.4 MB",
                },
                {
                    "id": "2",
                    type: "docx",
                    name: "notes.docx",
                    size: "850 KB",
                },
            ],
            time: "22:03",
        },
        {
            "id": "4",
            role: "assistant",
            text: "Для этого лучше разделить сообщения и вложения. Сообщения храни в базе данных, а файлы — в объектном хранилище.",
            time: "22:04",
        },
        {
            "id": "5",
            role: "assistant",
            text: "На клиенте можно дополнительно использовать IndexedDB как локальный кэш для быстрых загрузок после перезагрузки страницы.",
            attachments: [
                {
                    "id": "1",
                    type: "image",
                    name: "diagram.png",
                    size: "320 KB",
                    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyhQBCzWNSC96QTNDmYVjJX51uC-Cq4b5_k4Ra7yh-5Q&s=10",
                },
            ],
            time: "22:05",
        },
    ]);

    async function sendMessage(prompt: string) {
        // code
    }

    return { messages, sendMessage };
}