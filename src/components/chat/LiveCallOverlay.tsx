"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useLiveCall } from "@/src/hooks/useLiveCall";
import WaveformIcon from "@/src/icons/waveform.svg";
import CloseIcon from "@/src/icons/close.svg";

type LiveCallOverlayProps = {
  open: boolean;
  onClose: () => void;
  /** Existing chat only — required for WS query param chatId */
  chatId?: string;
};

export function LiveCallOverlay({ open, onClose, chatId }: LiveCallOverlayProps) {
  const t = useTranslations("liveCall");
  const { status, error, turns, start, stop } = useLiveCall({ chatId });
  const listRef = useRef<HTMLDivElement>(null);

  const startedForOpenRef = useRef(false);

  useEffect(() => {
    if (!open) {
      startedForOpenRef.current = false;
      return;
    }
    if (!chatId) return;
    if (startedForOpenRef.current) return;
    startedForOpenRef.current = true;
    void start();
  }, [open, start, chatId]);

  useEffect(() => {
    if (open) return;
    stop();
  }, [open, stop]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [turns]);

  if (!open) return null;

  const statusLabel =
    status === "connecting"
      ? t("connecting")
      : status === "live"
        ? t("live")
        : status === "error"
          ? t("error")
          : status === "ended"
            ? t("ended")
            : t("connecting");

  function handleHangUp() {
    stop();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[min(90dvh,640px)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
              <WaveformIcon className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-body font-medium text-foreground truncate">
                {t("title")}
              </p>
              <p className="text-caption text-foreground-muted">{statusLabel}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleHangUp}
            className="p-2 rounded-lg hover:bg-elevated hover:cursor-pointer"
            aria-label={t("hangUp")}
          >
            <CloseIcon className="size-4 text-foreground-muted" />
          </button>
        </div>

        <div className="px-5 py-6 flex flex-col items-center gap-5 min-h-0 flex-1">
          <div
            className={`
              size-20 rounded-full flex items-center justify-center shrink-0
              border border-border
              ${status === "live" ? "bg-primary/10 animate-pulse" : "bg-elevated"}
            `}
          >
            <WaveformIcon
              className={`size-9 ${status === "live" ? "text-primary" : "text-foreground-muted"}`}
            />
          </div>

          <div
            ref={listRef}
            className="w-full flex-1 min-h-0 overflow-y-auto space-y-2 pr-1"
          >
            {turns.map((turn) => (
              <div
                key={turn.id}
                className={`
                  rounded-xl px-3 py-2
                  ${turn.role === "user" ? "bg-elevated" : "bg-primary/10"}
                `}
              >
                <p
                  className={`
                    text-caption mb-1
                    ${turn.role === "user" ? "text-foreground-muted" : "text-primary"}
                  `}
                >
                  {turn.role === "user" ? t("you") : t("agent")}
                </p>
                <p
                  className={`
                    text-body-sm whitespace-pre-wrap
                    ${turn.role === "user" ? "text-foreground-secondary" : "text-foreground"}
                  `}
                >
                  {turn.text}
                </p>
              </div>
            ))}

            {turns.length === 0 && status === "live" && (
              <p className="text-center text-body-sm text-foreground-muted py-4">
                {t("listening")}
              </p>
            )}
            {error && (
              <p className="text-center text-body-sm text-error">{error}</p>
            )}
            {status === "ended" && !error && turns.length === 0 && (
              <p className="text-center text-body-sm text-foreground-muted">
                {t("ended")}
              </p>
            )}
          </div>
        </div>

        <div className="px-5 pb-6 flex justify-center gap-3 shrink-0">
          {status === "ended" || status === "error" ? (
            <>
              <button
                type="button"
                onClick={() => void start()}
                className="rounded-full bg-primary px-8 py-3 text-btn text-primary-surface hover:bg-primary-hover hover:cursor-pointer transition"
              >
                {t("reconnect")}
              </button>
              <button
                type="button"
                onClick={handleHangUp}
                className="rounded-full bg-elevated px-8 py-3 text-btn text-foreground hover:bg-border hover:cursor-pointer transition"
              >
                {t("hangUp")}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleHangUp}
              className="rounded-full bg-error px-8 py-3 text-btn text-foreground hover:bg-error/90 hover:cursor-pointer transition"
            >
              {t("hangUp")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
