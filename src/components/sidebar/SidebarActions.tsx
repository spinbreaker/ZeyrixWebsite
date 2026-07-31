import PlusIcon from "@/src/icons/plus.svg";
import SearchIcon from "@/src/icons/search.svg";

export function SidebarActions() {
    return (
        <div className="px-6 flex flex-col gap-3 w-full h-fit">
            <button className="flex flex-row border border-border w-full h-fit px-4 py-3 rounded-lg justify-start items-center gap-4">
                <PlusIcon className="text-foreground-secondary size-4" />
                <p className="font-sans text-btn text-foreground-secondary">Create a New Chat</p>
            </button>
            <div className="flex items-center gap-4 bg-elevated border border-border rounded-lg px-4 py-3">
                <SearchIcon className="size-4 shrink-0 text-foreground" />
                <input
                    className="flex-1 min-w-0 bg-transparent outline-none text-btn text-foreground placeholder:text-foreground-muted"
                    placeholder="Search Chats..."
                />
            </div>
        </div>
    );
}