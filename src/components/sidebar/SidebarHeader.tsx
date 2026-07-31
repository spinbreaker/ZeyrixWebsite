import SidebarIcon from "@/src/icons/sidebar.svg";

type SidebarProps = {
    onClose: () => void;
};

export function SidebarHeader({ onClose }: SidebarProps) {
    return (
        <div className="flex flex-row justify-between items-center pl-6 pr-3 py-3 w-full h-fit">
            <h4 className="text-primary font-sans text-h4">Zeyrix</h4>
            <div className="p-3" onClick={onClose}>
                <SidebarIcon className="text-foreground-muted size-5" />
            </div>
        </div>
    );
}