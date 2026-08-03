"use client";

import AttachIcon from "@/src/icons/plus.svg";
import MicroIcon from "@/src/icons/microphone.svg";
import SendIcon from "@/src/icons/arrow.svg";
import { useRef, useState, useEffect } from "react";
import { useConnection } from "../auth/ConnectionContext";
import { useRouter } from "next/navigation";
import { useFileUpload } from "@/src/hooks/useFileUpload";
import { AttachmentCard } from "./Attachment";
import { mapAttachments, Attachment } from "@/src/types/chat";

type ComposeAreaProps = {
  chatId?: string,
  sendMessage: (prompt: string, attachments: Attachment[], fileIds: string[], newChatId?: string) => Promise<void>,
  sending: boolean,
  createChat: (userPrompt: string) => Promise<string>
}

export function ComposeArea({ chatId, sendMessage, sending, createChat }: ComposeAreaProps) {
    const { state } = useConnection();
    const canInteract = state === "ready";

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { attachments, uploadFile, removeAttachment, readyFileIds, isUploading, setAttachments } = useFileUpload();

    const [message, setMessage] = useState("");
    const canSend = message.trim().length > 0 && canInteract && !sending && !isUploading;

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const router = useRouter();

     function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        files.forEach(uploadFile);
        e.target.value = "";
    }

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const value = e.target.value;

        setMessage(value);

        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    async function handleSend() {
        if (!canSend) return;

        const text = message;
        setMessage("");

        const tempAttachments = attachments;
        const attachmentsToSend = attachments.map(mapAttachments);
        setAttachments([]);

        try {
            if (chatId) {
                await sendMessage(message, attachmentsToSend, readyFileIds);
            } else {
                const newChatId = await createChat(message);
                await sendMessage(message, attachmentsToSend, readyFileIds, newChatId);
                router.replace(`/chat/${newChatId}`, { scroll: false });
            }
        } catch {
            setMessage(text);
            setAttachments(tempAttachments);
        }


        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.focus();
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="bg-background px-6 pb-3 w-full h-fit flex flex-col items-center">
            <div className="bg-background border border-border rounded-2xl px-4 py-3 flex flex-col gap-2 max-w-190 w-full">
                {attachments.length > 0 && (
                    <div className="flex max-w-full gap-2 overflow-x-auto pb-1 scrollbar-thin">
                        {attachments.map((a) => (
                            <AttachmentCard key={a.localId} attachment={a} onRemove={removeAttachment} />
                        ))}
                    </div>
                )}

                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    disabled={!canInteract}
                    placeholder={!canInteract ? "Подключение..." : "Спросите Zeyrix AI..."}
                    rows={1}
                    className="w-full h-fit resize-none bg-transparent outline-none font-sans text-body text-foreground placeholder:text-foreground-muted max-h-50"
                />

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                />

                <div className="w-full h-fit flex justify-between">
                    <button 
                        className={`px-3 py-4 ${canInteract && "cursor-pointer"}`}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={!canInteract && sending}
                    >
                        <AttachIcon className="text-foreground-secondary size-4" />
                    </button>

                    <div className="flex flex-row items-center gap-3">
                        <button className={`p-3 ${canInteract && "cursor-pointer"}`} disabled={!canInteract}>
                            <MicroIcon className="text-foreground-secondary size-5" />
                        </button>

                        <button
                            disabled={!canSend}
                            className={`
                                w-8 h-8 rounded-lg flex items-center justify-center
                                transition-all duration-200
                                ${canSend ? "bg-primary cursor-pointer" : "bg-foreground-muted/50"}
                            `}
                            onClick={handleSend}
                        >
                            <SendIcon className="size-3 text-background" />
                        </button>
                    </div>
                </div>
            </div>
            <p className="text-foreground-muted font-sans text-caption max-w-190 w-full">
                ZeyrixAI - это искусственный интеллект, и он может ошибаться. Пожалуйста, перепроверяйте ответы.
            </p>
        </div>
    );
}