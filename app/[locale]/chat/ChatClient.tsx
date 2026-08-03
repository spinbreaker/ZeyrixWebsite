"use client";

import { useChat } from "@/src/hooks/useChat";
import { ChatArea } from "@/src/components/chat/ChatArea";
import { ComposeArea } from "@/src/components/chat/ComposeArea";

export default function ChatClient({
  chatId,
  createChat,
}: {
  chatId?: string;
  createChat: (userPrompt: string) => Promise<string>;
}) {
  const { messages, loading, error, sending, sendMessage } = useChat(chatId);

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <div className="flex-1 min-h-0">
        <ChatArea
          key={chatId ?? "new"}
          chatId={chatId}
          messages={messages}
          loading={loading}
          error={error}
        />
      </div>

      <ComposeArea
        chatId={chatId}
        sendMessage={sendMessage}
        sending={sending}
        createChat={createChat}
      />
    </div>
  );
}