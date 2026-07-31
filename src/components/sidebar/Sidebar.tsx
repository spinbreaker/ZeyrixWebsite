import { SidebarHeader } from "./SidebarHeader";
import { SidebarActions } from "./SidebarActions";
import { SidebarChats } from "./SidebarChats";
import { SidebarFooter } from "./SidebarFooter";

type SidebarProps = {
    onClose: () => void;
};

export function Sidebar({ onClose }: SidebarProps) {
    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            <aside className="absolute left-0 top-0 h-screen w-65 bg-background flex flex-col gap-3">
                <SidebarHeader onClose={onClose} />
                <SidebarActions />
                <div className="flex-1 flex flex-col min-h-0">
                    <SidebarChats />
                    <SidebarFooter />
                </div>
            </aside>
        </div>
    );
}