"use client";
import { useChat } from "@/src/hooks/useChat";
import SparklesIcon from "@/src/icons/sparkles.svg";
import CopyIcon from "@/src/icons/copy.svg";
import LikeIcon from "@/src/icons/like.svg";
import CloseIcon from "@/src/icons/close.svg";
import FileIcon from "@/src/icons/file.svg";
import { AITag, Attachment, Message } from "@/src/types/ai";

function AITagCard({ text }: AITag) {
    return (
        <div className="bg-surface border border-border rounded-xl p-4">
            <p className="text-foreground-secondary font-sans text-body-sm text-center">
                {text}
            </p>
        </div>
    );
}

function MessageAttachment({ type, name, size, url }: Attachment) {
    return (
        <div className="bg-elevated rounded-lg w-30 h-30 shrink-0 relative">
            {type === "image" ? (
                <img
                    src={url}
                    alt={name}
                    className="w-full h-full object-cover rounded-lg"
                />
            ) : (

                <div className="flex flex-col gap-2 px-3 py-2 justify-center items-center w-full h-full">
                    <FileIcon className="text-foreground size-4" />
                    <p className="font-sans text-body-sm text-foreground truncate w-full text-center">{name}</p>
                    <p className="font-sans text-caption text-foreground-muted truncate w-full text-center">{size}</p>
                </div>
            )}

            <button className="absolute top-0 right-0 p-2 bg-background/30 rounded-tr-lg">
                <CloseIcon className="size-3 text-foreground" />
            </button>
        </div>
    );
}

function MessageBubble({ role, text, attachments, time }: Message) {
    switch (role) {
        case "user":
            return (
                <div className="flex justify-end">
                    <div className="bg-primary px-4 py-3 rounded-t-[20px] rounded-bl-[20px] rounded-br-sm max-w-[70%]">
                        {attachments && attachments.length === 0 ? (
                            <></>
                        ) : (
                            <div className="flex max-w-full gap-2 overflow-x-auto pb-1 scrollbar-thin">
                                {attachments?.map((attachment) => (
                                    <MessageAttachment
                                    key={attachment.id}
                                        {...attachment}
                                    />
                                ))}
                            </div>
                        )}

                        <p className="font-sans text-body text-background whitespace-pre-line">
                            {text}
                        </p>

                        <p className="mt-1 text-right font-sans text-caption text-background/70">
                            {time}
                        </p>
                    </div>
                </div>
            );

        case "assistant":
            return (
                <div className="flex justify-start">
                    <div className="bg-surface border border-border px-4 py-3 rounded-t-[20px] rounded-br-[20px] rounded-bl-sm max-w-[80%]">
                        {attachments && attachments.length === 0 ? (
                            <></>
                        ) : (
                            <div className="flex max-w-full gap-2 overflow-x-auto pb-1 scrollbar-thin">
                                {attachments?.map((attachment) => (
                                    <MessageAttachment
                                    key={attachment.id}
                                        {...attachment}
                                    />
                                ))}
                            </div>
                        )}

                        <p className="font-sans text-body text-foreground whitespace-pre-line">
                            {text}
                        </p>

                        <div className="mt-2 flex items-center justify-between gap-4">
                            <div className="flex gap-4">
                                <CopyIcon className="text-foreground size-3" />
                                <LikeIcon className="text-foreground size-3" />
                                <LikeIcon className="text-foreground size-3 scale-y-[-1]" />
                            </div>

                            <p className="shrink-0 font-sans text-caption text-foreground-muted">
                                {time}
                            </p>
                        </div>
                    </div>
                </div>
            );
    }
}

export function ChatArea() {
    const { messages, sendMessage } = useChat();

    return (
        <>
        {messages.length === 0 ? (
            <div className="w-full h-full flex flex-col justify-center items-center gap-8 px-6 max-w-190">
                <div>
                    <SparklesIcon className="text-primary size-12" />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-foreground font-sans text-h2 text-center">
                        What can I help you with?
                    </h2>
                    <p className="text-foreground-secondary font-sans text-body text-center">
                        Ask anything — I can read files, analyze images, and remember our conversation.
                    </p>
                </div>

                <div className="flex flex-col w-full h-fit gap-3">
                    <AITagCard text="What AI solutions do you build?" />
                    <AITagCard text="How much does an AI integration cost?" />
                    <AITagCard text="Do you provide post-launch support?" />
                    <AITagCard text="Can you integrate with my existing systems?" />
                </div>
            </div>
        ) : (
            <div className="w-full h-full px-6 overflow-y-auto py-3">
                <div className="flex justify-center">
                    <div className="max-w-190 w-full flex flex-col gap-3 py-3">
                        {messages.map((message) => (
                            <MessageBubble
                                key={message.id}
                                {...message}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )}
        </>
    );
}