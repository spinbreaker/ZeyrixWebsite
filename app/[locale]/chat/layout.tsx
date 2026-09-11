"use client";

import { ReactNode, useState } from "react";
import { useParams } from "next/navigation";
import { useChats } from "@/src/hooks/useChats";
import { ChatHeader } from "@/src/components/chat/ChatHeader";
import { SidebarDesktop } from "@/src/components/sidebar/SidebarDesktop";
import { SidebarChats } from "@/src/components/sidebar/SidebarChats";
import ChatClient from "./ChatClient";
import ChatNotFound from "./ChatNotFound";
import { useConnection } from "@/src/components/auth/ConnectionContext";
import LockIcon from "@/src/icons/lock.svg";
import { GetAccessModal } from "@/src/components/modals/getAccess";
import { useTranslations } from "next-intl";

export default function ChatLayout({ children }: { children: ReactNode }) {
  const t = useTranslations("accessDisabled");

  const { chats, createChat, renameChat, deleteChat, loading } = useChats();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { state, access } = useConnection();
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
        <div className="flex flex-col h-dvh w-full">
          {access === "disabled" && (
            <div className="bg-warning text-background h-fit flex flex-col sm:flex-row sm:h-12 justify-between items-center shrink-0 px-6 py-1 gap-1">
              <div className="flex flex-row gap-3 items-center min-w-0 max-w-full">
                <LockIcon className="w-fit shrink-0" />
                <p className="lg:hidden truncate w-full">{t("notActivatedShort")}</p>
                <p className="hidden lg:inline truncate w-full">{t("notActivatedLong")}</p>
              </div>
            
              <button
                className="border shrink-0 border-background text-background text-btn py-1.5 px-3 rounded-lg hover:cursor-pointer hover:bg-border/20"
                onClick={() => setIsModalOpen(true)}
              >
                {t("getAccess")}
              </button>
            </div>
          )}

          {isModalOpen && <GetAccessModal onClose={() => setIsModalOpen(false)} />}

          <div className="flex flex-row flex-1 min-h-0 min-w-0">
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
                <ChatClient chatId={chatId} createChat={createChat} openContactModal={() => setIsModalOpen(true)} />
              </div>
            </div>

            {children}
          </div>
        </div>
      )}
    </>
  );
}
