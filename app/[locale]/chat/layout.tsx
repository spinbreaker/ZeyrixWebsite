"use client";

import { ReactNode } from "react";
import { useParams } from "next/navigation";
import { useChats } from "@/src/hooks/useChats";
import { ChatHeader } from "@/src/components/chat/ChatHeader";
import { SidebarDesktop } from "@/src/components/sidebar/SidebarDesktop";
import { SidebarChats } from "@/src/components/sidebar/SidebarChats";
import ChatClient from "./ChatClient";
import ChatNotFound from "./ChatNotFound";
import { useConnection } from "@/src/components/auth/ConnectionContext";

export default function ChatLayout({ children }: { children: ReactNode }) {
  const { chats, createChat, renameChat, deleteChat, loading } = useChats();

  const { state } = useConnection();
  const isLoading = state !== "ready" || loading;

  const params = useParams<{ chatId?: string | string[] }>();
  const chatId = Array.isArray(params.chatId)
    ? params.chatId[0]
    : params.chatId;

  const isChatExist = chatId ? chats.some((chat) => chat.id === chatId) : true;

  return (
    <>
      {!isChatExist && !isLoading ? (
        <ChatNotFound />
      ) : (
        <div className="flex flex-row h-dvh w-full">
          <div className="hidden lg:flex">
            <SidebarDesktop>
              <SidebarChats
                chats={chats}
                renameChat={renameChat}
                deleteChat={deleteChat}
              />
            </SidebarDesktop>
          </div>

          <div className="w-full h-full flex flex-col bg-background min-w-0">
            <ChatHeader
              chats={chats}
              renameChat={renameChat}
              deleteChat={deleteChat}
            />

            <div className="flex flex-1 min-h-0 flex-col">
              <ChatClient chatId={chatId} createChat={createChat} />
            </div>
          </div>

          {children}
        </div>
      )}
    </>
  );
}
