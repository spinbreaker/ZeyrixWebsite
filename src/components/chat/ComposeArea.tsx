"use client";

import PlusIcon from "@/src/icons/plus.svg";
import MicroIcon from "@/src/icons/microphone.svg";
import SendIcon from "@/src/icons/arrow.svg";
import CheckIcon from "@/src/icons/check.svg";
import CloseIcon from "@/src/icons/close.svg";
import { useRef, useState, useEffect } from "react";
import { useConnection } from "../auth/ConnectionContext";
import { useRouter } from "next/navigation";
import { useFileUpload } from "@/src/hooks/useFileUpload";
import { AttachmentCard } from "./Attachment";
import { mapAttachments, Attachment } from "@/src/types/chat";
import { useVoiceRecorder } from "@/src/hooks/useVoiceRecorder";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";

type ComposeAreaProps = {
  chatId?: string,
  sendMessage: (prompt: string, attachments: Attachment[], fileIds: string[], newChatId?: string) => Promise<void>,
  sending: boolean,
  createChat: (userPrompt: string) => Promise<string>,
  isNewChat: boolean,
  isToolRequestPending: boolean;
}

export function ComposeArea({ chatId, sendMessage, sending, createChat, isNewChat, isToolRequestPending }: ComposeAreaProps) {
    const t = useTranslations("composeArea");

    const { state } = useConnection();
    const canInteract = state === "ready";

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { attachments, addAttachment, removeAttachment, readyFileIds, isUploading, setAttachments, transcribeVoice } = useFileUpload();

    const { isRecording, startRecording, stopRecording, waveform } = useVoiceRecorder({
        onRecordingFinished: async (blob) => {
            const voiceFile = new File([blob], "voice.webm", {
                type: blob.type,
            });
            
            const transcribed = await transcribeVoice(voiceFile);

            setMessage((prev) => `${prev.trim()} ${transcribed}`.trim())
        }
    })

    const [message, setMessage] = useState("");
    const canSend = message.trim().length > 0 && canInteract && !sending && !isUploading && !isToolRequestPending;

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const router = useRouter();

     function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        files.forEach(addAttachment);
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
                router.replace(`/chat/${newChatId}`, { scroll: false });
                await sendMessage(message, attachmentsToSend, readyFileIds, newChatId);
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

    const textareaPlaceholder = () => {
        if (!canInteract) {
            return t("connectingPlaceholder");
        } else if (isRecording) {
            return t("recordingPlaceholder");
        } else {
            return t("standardPlaceholder");
        }
    }

    return (
        <div className="bg-background px-6 pb-3 w-full h-fit flex flex-col items-center">
            <div
                className="
                    bg-background border border-border rounded-2xl
                    px-4 py-3 flex flex-col gap-2
                    max-w-190 w-full
                "
            >
                <AnimatePresence>
                    {attachments.length > 0 && (
                        <motion.div
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="flex max-w-full gap-2 overflow-x-auto pb-1 scrollbar-thin">
                                {attachments.map((a) => (
                                    <AttachmentCard
                                        key={a.localId}
                                        attachment={a}
                                        onRemove={removeAttachment}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <textarea
                    autoFocus={isNewChat}
                    ref={textareaRef}
                    value={message}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    disabled={!canInteract}
                    placeholder={textareaPlaceholder()}
                    readOnly={isRecording}
                    rows={isNewChat ? 2 : 1}
                    className={`
                        w-full h-fit resize-none bg-transparent outline-none font-sans text-body text-foreground placeholder:text-foreground-muted max-h-50
                    `}
                />

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                />

                <div className="w-full h-fit flex justify-between gap-5">
                    <button 
                        className={`
                            size-8 flex items-center justify-center rounded-lg
                            ${canInteract && "hover:bg-elevated"}
                            ${isRecording && "hidden"}
                            ${canInteract && !isRecording && "cursor-pointer"}
                        `}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={!canInteract || sending || isRecording}
                    >
                        <PlusIcon className="text-foreground-secondary size-4" />
                    </button>

                    <div className="flex flex-row items-center justify-end gap-1 h-full flex-1 min-w-0 overflow-hidden">
                        {waveform.map((value, index) => (
                            <div
                                key={index}
                                className="w-1 shrink-0 bg-primary rounded-full"
                                style={{
                                    height: `${Math.max(value * 200, 3)}px`,
                                    minHeight: "3px",
                                    maxHeight: "30px",
                                }}
                            />
                        ))}
                    </div>

                    <div className="flex flex-row items-center gap-3">
                        {isRecording ? (
                            <>
                            <button 
                                className={`
                                    size-8 rounded-lg flex items-center justify-center
                                    hover:cursor-pointer bg-elevated
                                `}
                                disabled={!canInteract}
                                onClick={() => {
                                    isRecording && stopRecording(true);
                                }}
                            >
                                <CloseIcon className="text-foreground-secondary size-3.5" />
                            </button>

                            <button
                                className={`
                                    size-8 rounded-lg flex items-center justify-center
                                    transition-all duration-200
                                    bg-primary cursor-pointer
                                `}
                                onClick={() => {
                                    isRecording && stopRecording(false);
                                }}
                            >
                                <CheckIcon className="size-3 text-background" />
                            </button>
                            </>
                        ) : (
                            <>
                            <button 
                                className={`
                                    size-8 rounded-lg flex items-center justify-center
                                    ${canInteract && "hover:cursor-pointer hover:bg-elevated"}
                                `}
                                disabled={!canInteract}
                                onClick={() => {
                                    !isRecording && startRecording()
                                }}
                            >
                                <MicroIcon className="text-foreground-secondary size-5" />
                            </button>

                            <button
                                disabled={!canSend}
                                className={`
                                    size-8 rounded-lg flex items-center justify-center
                                    transition-all duration-200
                                    ${canSend ? "bg-primary cursor-pointer" : "bg-foreground-muted/50"}
                                `}
                                onClick={handleSend}
                            >
                                <SendIcon className="size-3 text-background" />
                            </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <p className={`
                text-foreground-muted font-sans text-caption max-w-190 w-full text-center
                ${isNewChat ? "hidden" : ""}
            `}>
                {t("warningCaption")}
            </p>
        </div>
    );
}