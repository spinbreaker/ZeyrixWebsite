import SettingsIcon from "@/src/icons/settings.svg";

type User = {
    id: number;
    name: string;
    avatar: string | null;
};

const user: User = {
    id: 1,
    name: "Guest",
    avatar: null,
};

export function SidebarFooter() {
    return (
        <div className="flex flex-row justify-between items-center px-6 py-3 border-t border-border w-full h-fit">
            <div className="flex flex-row gap-3 items-center">
                <div className="size-8 rounded-full overflow-hidden bg-elevated">
                    {user.avatar ? (
                        <img 
                            src={user.avatar} alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    ) : null}
                </div>
                <p className="font-sans text-body-sm text-foreground-secondary">{user.name}</p>
            </div>
            <div className="p-3">
                <SettingsIcon className="text-foreground-muted size-5" />
            </div>
        </div>
    );
}