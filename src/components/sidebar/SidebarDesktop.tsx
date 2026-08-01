import { useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarChats } from "./SidebarChats";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarContext } from "./SidebarContext";

export function SidebarDesktop() {
    const [expanded, setExpanded] = useState(true);

    const toggle = () => {
        setExpanded((prev) => !prev);
    };

    return (
        <SidebarContext.Provider value={{ expanded, toggle }}>
            <aside
                className={`
                    h-full 
                    bg-background
                    border-r border-border
                    flex flex-col
                    transition-[width] duration-150 ease-out motion-reduce:transition-none
                    overflow-hidden
                    ${expanded ? "w-72" : "w-16"}
                `}
            >
                <SidebarHeader />


                <div className="flex-1 flex flex-col min-h-0 justify-between">
                    <div className={`
                        flex-1 min-h-0 flex flex-col transition-opacity duration-150
                        ${expanded ? "opacity-100" : "opacity-0 pointer-events-none"}
                    `}>
                        <SidebarChats />
                    </div>

                    <SidebarFooter />
                </div>
            </aside>
        </SidebarContext.Provider>
    );
}