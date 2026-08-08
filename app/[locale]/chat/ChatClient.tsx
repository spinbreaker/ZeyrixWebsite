"use client";

import { useChat } from "@/src/hooks/useChat";
import { ChatArea } from "@/src/components/chat/ChatArea";
import { ComposeArea } from "@/src/components/chat/ComposeArea";
import { useConnection } from "@/src/components/auth/ConnectionContext";
import { div } from "motion/react-client";

export default function ChatClient({
  chatId,
  createChat,
}: {
  chatId?: string;
  createChat: (userPrompt: string) => Promise<string>;
}) {
  const { state } = useConnection();
  const { messages, loading, error, sending, sendMessage, applyToolUse } = useChat(chatId);
  const isEmptyRootChat = !chatId && messages.length === 0;
  const isLoading = state !== "ready" && loading;

  const isToolRequestPending = messages.some(
      message =>
          message.role === "assistant" &&
          message.status === "approval_required"
  );

  if (isLoading) {
    return <div></div>;
  }

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