"use client";
import SparklesIcon from "@/src/icons/sparkles.svg";
import { AITag, Message } from "@/src/types/chat";
import { useConnection } from "../auth/ConnectionContext";
import { MessageBubble } from "./MessageBubble";

function AITagCard({ text }: AITag) {
    return (
        <div className="bg-surface border border-border rounded-xl p-4">
            <p className="text-foreground-secondary font-sans text-body-sm text-center">
                {text}
            </p>
        </div>
    );
}

function EmptyChat() {
    return (
        <div className="w-full h-full flex justify-center items-center px-6">
            <div className="flex flex-col justify-center items-center gap-8 max-w-190">
                <SparklesIcon className="text-primary size-12" />

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
        </div>
    );
}

type ChatAreaProps = {
  chatId?: string,
  loading: boolean,
  messages: Message[],
  error: string | null,
}

export function ChatArea({ loading, messages }: ChatAreaProps) {
    const { state } = useConnection();
    const isConnectionLoading = state !== "ready";

    if (isConnectionLoading || loading) {
        return <div className="w-full h-full flex justify-center items-center px-6"></div>;
    }

    if (messages.length === 0) {
        return <EmptyChat />
    }

    return (
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
    );
}