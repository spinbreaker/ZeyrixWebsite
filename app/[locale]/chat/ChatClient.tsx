"use client";

import { useChat } from "@/src/hooks/useChat";
import { ChatArea } from "@/src/components/chat/ChatArea";
import { ComposeArea } from "@/src/components/chat/ComposeArea";
import MainLogo from "@/public/icons/logoMain.svg";

export default function ChatClient({
  chatId,
  createChat,
}: {
  chatId?: string;
  createChat: (userPrompt: string) => Promise<string>;
}) {
  const { messages, loading, error, sending, sendMessage, applyToolUse, isToolRequestPending } = useChat(chatId);
  const isEmptyRootChat = !chatId && !loading && messages.length === 0;

  if (isEmptyRootChat) {
    return (
      <div className="flex flex-1 min-h-0 flex-col items-center mt-[10dvh] py-8 md:mt-[20dvh]">
        <div className="w-full max-w-190 flex flex-col items-center gap-[clamp(2rem,5vw,3rem)]">
          <ChatArea
            chatId={chatId}
            messages={messages}
            loading={loading}
            error={error}
            compactEmptyState
            applyToolUse={applyToolUse}
          />

          <ComposeArea
            chatId={chatId}
            sendMessage={sendMessage}
            sending={sending}
            createChat={createChat}
            isNewChat
            isToolRequestPending={isToolRequestPending}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <div className="flex-1 min-h-0">
        <ChatArea
          key={chatId ?? "new"}
          chatId={chatId}
          messages={messages}
          loading={loading}
          error={error}
          applyToolUse={applyToolUse}
        />
      </div>

      <ComposeArea
        chatId={chatId}
        sendMessage={sendMessage}
        sending={sending}
        createChat={createChat}
        isNewChat={chatId ? false : true}
        isToolRequestPending={isToolRequestPending}
      />
    </div>
  );
}