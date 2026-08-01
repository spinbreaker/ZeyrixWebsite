import SidebarIcon from "@/src/icons/sidebar.svg";
import SearchIcon from "@/src/icons/search.svg";
import NewChatIcon from "@/src/icons/redact.svg";
import { useSidebar } from "./SidebarContext";

type SidebarProps = {
    onClose?: () => void;
};

export function SidebarHeader({ onClose }: SidebarProps) {
    const { expanded, toggle } = useSidebar();

    return (
        <div className={`
            flex flex-col gap-5 pl-6 pr-3 pt-3 pb-6 transition-[padding,border-color] duration-300 ease-out motion-reduce:transition-none
            ${expanded ? "border-b border-border" : "border-b border-transparent"}
        `}>
            <div className="flex flex-row justify-between items-center">
                <div className={`
                    overflow-hidden transition-[max-width,opacity,transform] duration-300 ease-out motion-reduce:transition-none
                    ${expanded ? "max-w-32 opacity-100 translate-x-0" : "max-w-0 opacity-0 -translate-x-2"}
                `}>
                    <h4 className="text-primary font-sans text-h4 whitespace-nowrap">Zeyrix</h4>
                </div>
                <div className="flex flex-row">
                    <div className={`
                        overflow-hidden transition-[max-width,opacity,transform] duration-300 ease-out motion-reduce:transition-none
                        ${expanded ? "max-w-12 opacity-100 translate-x-0" : "max-w-0 opacity-0 translate-x-2 pointer-events-none"}
                    `}>
                        <div className="p-3">
                            <SearchIcon className="text-foreground-muted size-4" />
                        </div>
                    </div>
                    <div className={`${expanded ? "p-3" : "py-3 pl-0 pr-3"}`} onClick={onClose ? onClose : toggle}>
                        <SidebarIcon className="text-foreground-muted size-4" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                <button className="flex flex-row w-full h-fit justify-start items-center gap-4">
                    <NewChatIcon className="text-foreground-secondary size-4 shrink-0" />
                    <span className={`
                        overflow-hidden whitespace-nowrap motion-reduce:transition-none
                        ${expanded ? "max-w-28 opacity-100 translate-x-0" : "max-w-0 opacity-0 -translate-x-2"}
                        transition-[max-width,opacity,transform] duration-300 ease-out
                    `}>
                        <p className="font-sans text-btn text-foreground-secondary">New chat</p>
                    </span>
                </button>
            </div>
        </div>
    );
}