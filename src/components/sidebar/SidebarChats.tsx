import DotsIcon from "@/src/icons/dots.svg";
import { Chat } from "@/src/types/ai";
import { getChats } from "@/src/hooks/getChats";

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

function AIChat({ name }: Chat) {
    return (
        <div className="flex flex-row justify-between pl-4 pr-1 py-1.5 items-center w-full h-fit rounded-lg">
            <p className="font-sans text-body-sm text-foreground-secondary truncate">{name}</p>
            <div className="p-2 w-fit">
                <DotsIcon className="text-foreground-muted size-4" />
            </div>
        </div>
    );
}

function GroupOfChats({ name, chats }: GroupProps) {
    return (
        <div className="flex flex-col gap-3">
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
        const createdAt = new Date(chat.createdAt);

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

export function SidebarChats() {
    const { chats } = getChats();

    const { todayChats, yesterdayChats, lastDaysChats, oldChats } = groupChats(chats)

    return (
        <div className="flex-1 overflow-y-auto px-6">
            <GroupOfChats name="Today" chats={todayChats} />
            <GroupOfChats name="Yesterday" chats={yesterdayChats} />
            <GroupOfChats name="Last 7 days" chats={lastDaysChats} />
            <GroupOfChats name="Older" chats={oldChats} />
        </div>
    );
}