"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useLiveCall } from "@/src/hooks/useLiveCall";
import WaveformIcon from "@/src/icons/waveform.svg";
import CloseIcon from "@/src/icons/close.svg";

type LiveCallOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function LiveCallOverlay({ open, onClose }: LiveCallOverlayProps) {
  const t = useTranslations("liveCall");
  const { status, error, inputTranscript, outputTranscript, start, stop } =
    useLiveCall();

  // Avoid double start/stop from React Strict Mode in the same "open" session
  const startedForOpenRef = useRef(false);

  useEffect(() => {
    if (!open) {
      startedForOpenRef.current = false;
      return;
    }
    if (startedForOpenRef.current) return;
    startedForOpenRef.current = true;
    void start();
  }, [open, start]);

  // Only stop when the overlay is actually dismissed, not on Strict Mode re-run
  useEffect(() => {
    if (open) return;
    stop();
  }, [open, stop]);

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
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
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

        <div className="px-5 py-8 flex flex-col items-center gap-6">
          <div
            className={`
              size-28 rounded-full flex items-center justify-center
              border border-border
              ${status === "live" ? "bg-primary/10 animate-pulse" : "bg-elevated"}
            `}
          >
            <WaveformIcon
              className={`size-12 ${status === "live" ? "text-primary" : "text-foreground-muted"}`}
            />
          </div>

          <div className="w-full space-y-3 min-h-24">
            {inputTranscript && (
              <div className="rounded-xl bg-elevated px-3 py-2">
                <p className="text-caption text-foreground-muted mb-1">
                  {t("you")}
                </p>
                <p className="text-body-sm text-foreground-secondary">
                  {inputTranscript}
                </p>
              </div>
            )}
            {outputTranscript && (
              <div className="rounded-xl bg-primary/10 px-3 py-2">
                <p className="text-caption text-primary mb-1">{t("agent")}</p>
                <p className="text-body-sm text-foreground">{outputTranscript}</p>
              </div>
            )}
            {!inputTranscript && !outputTranscript && status === "live" && (
              <p className="text-center text-body-sm text-foreground-muted">
                {t("listening")}
              </p>
            )}
            {error && (
              <p className="text-center text-body-sm text-error">{error}</p>
            )}
            {status === "ended" && !error && (
              <p className="text-center text-body-sm text-foreground-muted">
                {t("ended")}
              </p>
            )}
          </div>
        </div>

        <div className="px-5 pb-6 flex justify-center gap-3">
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
