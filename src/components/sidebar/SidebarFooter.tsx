import SettingsIcon from "@/src/icons/settings.svg";
import { useSidebar } from "./SidebarContext";
import { useTranslations } from "next-intl";

type User = {
    id: number;
    name: string;
    avatar: string | null;
};

export function SidebarFooter() {
    const { expanded } = useSidebar();
    const t = useTranslations("sidebarFooter");

    const user: User = {
        id: 1,
        name: t("guest"),
        avatar: null,
    };

    return (
        <div className={`
            flex flex-row justify-between items-center transition-[padding,border-color] duration-300 ease-out motion-reduce:transition-none bg-background
            ${expanded ? "border-t border-border px-6 py-3" : "px-3 py-3 border-t border-transparent"} w-full h-fit
        `}>
            <div className="flex flex-row gap-3 items-center">
                <div className="size-8 rounded-full overflow-hidden bg-elevated">
                    {user.avatar ? (
                        <img 
                            src={user.avatar} alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    ) : null}
                </div>
                <div className={`
                    overflow-hidden transition-[max-width,opacity,transform] duration-300 ease-out motion-reduce:transition-none
                    ${expanded ? "max-w-28 opacity-100 translate-x-0" : "max-w-0 opacity-0 -translate-x-2"}
                `}>
                    <p className="font-sans text-body-sm text-foreground-secondary whitespace-nowrap">{user.name}</p>
                </div>
            </div>
            <div className={`
                overflow-hidden transition-[max-width,opacity,transform] duration-300 ease-out motion-reduce:transition-none
                ${expanded ? "max-w-14 opacity-100 translate-x-0" : "max-w-0 opacity-0 translate-x-2 pointer-events-none"}
            `}>
                <div className="p-3">
                    <SettingsIcon className="text-foreground-muted size-5" />
                </div>
            </div>
        </div>
    );
}