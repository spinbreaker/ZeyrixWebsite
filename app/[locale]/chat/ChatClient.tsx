"use client";

import { useChat } from "@/src/hooks/useChat";
import { ChatArea } from "@/src/components/chat/ChatArea";
import { ComposeArea } from "@/src/components/chat/ComposeArea";
import { useState } from "react";

export default function ChatClient({
  chatId,
  createChat,
}: {
  chatId?: string;
  createChat: (userPrompt: string) => Promise<string>;
}) {
  const { messages, loading, error, sending, sendMessage, applyToolUse, retrySendMessage, stopGeneration } =
    useChat(chatId);
  const isEmptyRootChat = !chatId && messages.length === 0;

  const isToolRequestPending = messages.some(
    (message) =>
      message.role === "assistant" &&
      message.status === "approval_required" &&
      message.steps?.some(
        (step) => 
          step.approvalDetails?.approvalExpiresAt &&
          new Date(step.approvalDetails.approvalExpiresAt) > new Date()
      ),
  );

  const [closeToBottom, setCloseToBottom] = useState(true);
  const [shouldScroll, setShouldScroll] = useState(false);

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
            retrySendMessage={retrySendMessage}
            closeToBottom={closeToBottom}
            setCloseToBottom={setCloseToBottom}
            shouldScroll={shouldScroll}
            setShouldScroll={setShouldScroll}
          />

          <ComposeArea
            chatId={chatId}
            sendMessage={sendMessage}
            sending={sending}
            createChat={createChat}
            isNewChat
            isToolRequestPending={isToolRequestPending}
            failedToLoad={false}
            stopGeneration={stopGeneration}
            closeToBottom={closeToBottom}
            setShouldScroll={setShouldScroll}
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
          retrySendMessage={retrySendMessage}
          closeToBottom={closeToBottom}
          setCloseToBottom={setCloseToBottom}
          shouldScroll={shouldScroll}
          setShouldScroll={setShouldScroll}
        />
      </div>

      <ComposeArea
        chatId={chatId}
        sendMessage={sendMessage}
        sending={sending}
        createChat={createChat}
        isNewChat={chatId ? false : true}
        isToolRequestPending={isToolRequestPending}
        failedToLoad={Boolean(messages.length === 0 && error)}
        stopGeneration={stopGeneration}
        closeToBottom={closeToBottom}
        setShouldScroll={setShouldScroll}
      />
    </div>
  );
}
