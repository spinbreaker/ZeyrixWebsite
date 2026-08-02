"use client";

import DotsIcon from "@/src/icons/dots.svg";
import { Chat } from "@/src/types/ai";
import { useChats } from "@/src/hooks/useChats";
import { useRouter } from "next/navigation";

type GroupProps = {
    name: string;
    chats: Chat[];
};

type GroupedChats = {
    todayChats: Chat[];
    yesterdayChats: Chat[];
    lastDaysChats: Chat[];
    oldChats: Chat[];
};

function AIChat({ id, name }: Chat) {
    const router = useRouter();

    return (
        <button 
            className="
                group
                flex flex-row justify-between pl-2 py-1.5 items-center w-full h-fit rounded-lg
                hover:cursor-pointer hover:bg-elevated
            "
            onClick={() => router.push(`/chat/${id}`, { scroll: false })}
        >
            <p className="font-sans text-body-sm text-foreground-secondary truncate">{name}</p>
            <span 
                className="p-2 w-fit lg:opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                    e.stopPropagation();

                }}
            >
                <DotsIcon className="text-foreground size-3" />
            </span>
        </button>
    );
}

function GroupOfChats({ name, chats }: GroupProps) {
    return (
        <div className="flex flex-col">
            <p className="font-sans text-caption text-foreground-muted">{name}</p>
            <div className="flex flex-col">
                {chats.map((chat) => (
                    <AIChat
                        key={chat.id}
                        {...chat}
                    />
                ))}
            </div>
        </div>
    );
}

function groupChats(chats: Chat[]): GroupedChats {
    const now = new Date();

    // Сегодня 00:00 в локальном часовом поясе пользователя
    const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    // Вчера 00:00
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    // 7 дней назад
    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const todayChats: Chat[] = [];
    const yesterdayChats: Chat[] = [];
    const lastDaysChats: Chat[] = [];
    const oldChats: Chat[] = [];

    for (const chat of chats) {
        const createdAt = new Date(chat.updatedAt);

        if (createdAt >= todayStart) {
            todayChats.push(chat);
        } else if (createdAt >= yesterdayStart) {
            yesterdayChats.push(chat);
        } else if (createdAt >= sevenDaysAgo) {
            lastDaysChats.push(chat);
        } else {
            oldChats.push(chat);
        }
    }

    return {
        todayChats,
        yesterdayChats,
        lastDaysChats,
        oldChats,
    };
}

export function SidebarChats({ chats }: { chats: Chat[] }) {
    if (!chats) {
        return (
        <div className="flex-1 overflow-y-auto px-6 pt-3 flex flex-col gap-3">
            <p className="text-body text-error">Failed to get the chats</p>
        </div>
        );
    }

    const { todayChats, yesterdayChats, lastDaysChats, oldChats } = groupChats(chats)

    return (
        <div className="flex-1 overflow-y-auto px-6 pt-3 flex flex-col gap-3">
            <GroupOfChats name="Today" chats={todayChats} />
            <GroupOfChats name="Yesterday" chats={yesterdayChats} />
            <GroupOfChats name="Last 7 days" chats={lastDaysChats} />
            <GroupOfChats name="Older" chats={oldChats} />
        </div>
    );
}