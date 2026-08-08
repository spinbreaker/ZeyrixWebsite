"use client";
import { Message } from "@/src/types/chat";
import { useConnection } from "../auth/ConnectionContext";
import { MessageBubble } from "./MessageBubble";
import MainLogo from "@/public/icons/logoMain.svg";
import { useRef, useLayoutEffect, useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";

type ChatAreaProps = {
  chatId?: string,
  loading: boolean,
  messages: Message[],
  error: string | null,
  compactEmptyState?: boolean,
  applyToolUse: (requestId: string, action: "confirm" | "reject") => Promise<void>,
}

export function ChatArea({ loading, messages, compactEmptyState, chatId, applyToolUse }: ChatAreaProps) {
    const t = useTranslations("newChat")

    const { state } = useConnection();
    const isConnectionLoading = state !== "ready";

    const containerRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const prevChatIdRef = useRef<string | undefined>(undefined);
    const prevMessagesLenRef = useRef(0);
    const shouldAutoScrollRef = useRef(true);

    // true = следующий успешный скролл должен быть instant (смена чата)
    // живёт до тех пор, пока реально не проскроллим
    const pendingInstantScrollRef = useRef(false);
    const [isSettling, setIsSettling] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const showLoading = isConnectionLoading || loading;
    const showEmptyState = !showLoading && messages.length === 0 && compactEmptyState;
    const showMessages = !showLoading && !showEmptyState;

    // отслеживание "пользователь у низа"
    useEffect(() => {
        if (!showMessages) return;
        const container = containerRef.current;
        if (!container) return;

        function handleScroll() {
            if (!container) return;
            const distanceFromBottom =
                container.scrollHeight - container.scrollTop - container.clientHeight;
            shouldAutoScrollRef.current = distanceFromBottom < 150;
        }

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, [showMessages]);

    // on chat change
    useLayoutEffect(() => {
    if (prevChatIdRef.current === chatId) return;
        prevChatIdRef.current = chatId;
        prevMessagesLenRef.current = 0;
        shouldAutoScrollRef.current = true;
        pendingInstantScrollRef.current = true;

        setIsSettling(true);
        setIsVisible(false); // сразу прячем без transition
    }, [chatId]);

    // scroll
    useLayoutEffect(() => {
        if (!showMessages) return;
        const container = containerRef.current;
        if (!container) return;

        const isChatSwitch = pendingInstantScrollRef.current;
        const messagesGrew = messages.length > prevMessagesLenRef.current;
        prevMessagesLenRef.current = messages.length;

        if (!isChatSwitch && !messagesGrew) return;
        if (!isChatSwitch && !shouldAutoScrollRef.current) return;

        if (isChatSwitch) {
            requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (!containerRef.current) return;

                // 1. Скроллим мгновенно
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
                pendingInstantScrollRef.current = false;
                setIsSettling(false);

                // 2. На следующем кадре включаем видимость (чтобы transition сработал)
                requestAnimationFrame(() => {
                setIsVisible(true);
                });
            });
            });
        } else {
            bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages, showMessages, chatId]);

    if (showLoading) {
        return <div className="w-full h-full flex justify-center items-center px-6" />;
    }

    if (showEmptyState) {
        const titles = [
            t("title1"), t("title2"), t("title3"),
            t("title4"), t("title5"), t("title6"),
        ]
        const randomItem = titles[Math.floor(Math.random() * titles.length)];

        return (
            <h1 className="font-display-ru text-display text-foreground-secondary text-[clamp(2rem,5vw,3rem)] text-center px-6 max-w-[95vw]">
                <MainLogo className="inline-block text-[clamp(2rem,5vw,3rem)] shrink-0 text-primary mr-3 align-middle" />
                {randomItem}
            </h1>
        );
    }

    return (
        <div
            ref={containerRef}
            key={chatId}
            className="w-full h-full px-6 overflow-y-auto py-3"
            style={{
                opacity: isVisible ? 1 : 0,
                transition: isSettling ? "none" : "opacity 90ms ease-out",
                scrollbarGutter: "stable",
            }}
        >
            <div className="flex justify-center">
                <div className="max-w-190 w-full flex flex-col gap-3 py-3">
                    {messages.map((message) => (
                        <MessageBubble key={message.id} {...message} applyToolUse={applyToolUse} />
                    ))}
                    <div ref={bottomRef} />
                </div>
            </div>
        </div>
    );
}