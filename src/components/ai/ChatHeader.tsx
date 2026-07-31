"use client";

import { useState } from "react";
import SidebarIcon from "@/src/icons/sidebar.svg";
import CloseIcon from "@/src/icons/close.svg";
import { Sidebar } from "../sidebar/Sidebar";

export function ChatHeader() {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    return (
        <div className="bg-background h-fit w-full flex justify-between items-center px-2 py-3 border-b border-border">
            <div 
                className="p-3"
                onClick={() => setIsSideBarOpen(true)}
            >
                <SidebarIcon className="text-foreground-muted size-5" />
            </div>
            <h4 className="text-foreground font-sans text-h4">Zeyrix AI</h4>
            <div className="p-3.5">
                <CloseIcon className="text-foreground-muted size-4" />
            </div>

            {isSideBarOpen && (
                <Sidebar onClose={() => setIsSideBarOpen(false)} />
            )}
        </div>
    );
}