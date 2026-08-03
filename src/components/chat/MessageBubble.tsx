import { MessageAttachment } from "./Attachment";
import CopyIcon from "@/src/icons/copy.svg";
import LikeIcon from "@/src/icons/like.svg";
import { Message } from "@/src/types/chat";

function formatMessageTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();
    
    const isYesterday =
        date.getDate() === (now.getDate() - 1) &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const isThisYear = date.getFullYear() === now.getFullYear();

    const dayMonthYear = date.toLocaleDateString([], {
        day: "numeric",
        month: "short",
        ...(isThisYear ? {} : { year: "numeric" }),
    });

    const hourMinute = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    if (isToday) {
        return `Сегодня, ${hourMinute}`;
    }
    if (isYesterday) {
        return `Вчера, ${hourMinute}`;
    }

    return `${dayMonthYear}, ${hourMinute}`;
}

export function MessageBubble({ role, text, attachments, createdAt }: Message) {
    const time = formatMessageTime(createdAt);

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