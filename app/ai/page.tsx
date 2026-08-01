"use client";
import { ChatArea } from "@/src/components/ai/ChatArea";
import { ChatHeader } from "@/src/components/ai/ChatHeader";
import { ComposeArea } from "@/src/components/ai/ComposeArea";
import { SidebarDesktop } from "@/src/components/sidebar/SidebarDesktop";

export default function Page() {
    return (
        <div className="flex flex-row h-screen w-full">
            <div className="hidden lg:flex">
                <SidebarDesktop />
            </div>
            <div className="w-full h-full flex flex-col bg-background">
                <ChatHeader />
                <ChatArea />
                <ComposeArea />
            </div>
        </div>
    );
}