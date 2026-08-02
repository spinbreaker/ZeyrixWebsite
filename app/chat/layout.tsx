"use client";

import { ReactNode } from "react";
import { useParams } from "next/navigation";
import { useChats } from "@/src/hooks/useChats";
import { ChatHeader } from "@/src/components/chat/ChatHeader";
import { SidebarDesktop } from "@/src/components/sidebar/SidebarDesktop";
import { SidebarChats } from "@/src/components/sidebar/SidebarChats";
import ChatClient from "./ChatClient";

export default function ChatLayout({ children }: { children: ReactNode }) {
	const params = useParams<{ chatId?: string | string[] }>();
	const { chats, createChat } = useChats();

	const chatId = Array.isArray(params.chatId) ? params.chatId[0] : params.chatId;

	return (
		<div className="flex flex-row h-screen w-full">
			<div className="hidden lg:flex">
				<SidebarDesktop>
					<SidebarChats chats={chats} />
				</SidebarDesktop>
			</div>

			<div className="w-full h-full flex flex-col bg-background min-w-0">
				<ChatHeader chats={chats} />

				<div className="flex flex-1 min-h-0 flex-col">
					<ChatClient
						chatId={chatId}
						createChat={createChat}
					/>
				</div>
			</div>

			{children}
		</div>
	);
}
