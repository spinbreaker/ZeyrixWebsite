"use client";

import LikeIcon from "@/src/icons/like.svg";
import WarningIcon from "@/src/icons/warning.svg";
import ArrowIcon from "@/src/icons/arrowBasic.svg";
import ConfirmedIcon from "@/src/icons/check.svg";
import CloseIcon from "@/src/icons/close.svg";
import ExpiredIcon from "@/src/icons/time.svg";

import { MessageAttachment } from "./Attachment";
import {
  Message,
  Attachment,
  AgentStep,
  ApprovalDetails,
  ToolDetails,
  StepKind,
  StepStatus,
} from "@/src/types/chat";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations, useLocale } from "next-intl";
import { format, formatDistanceToNow } from "date-fns";
import { getDateFnsLocale } from "@/src/lib/date-fns-locale";
import { MarkdownMessage } from "./MarkdownMessage";
import { CopyButton } from "./Buttons";
import { Step } from "./AgentStep";
import { ApprovalCard } from "./ApprovalCard";

function formatMessageTime(dateString: string): string {
  const t = useTranslations("message");
  const locale = useLocale();
  const dfLocale = getDateFnsLocale(locale);

  const date = new Date(dateString);
  const now = new Date();

  const isThisYear = date.getFullYear() === now.getFullYear();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday = date.toDateString() === yesterday.toDateString();

  const formatted = isThisYear
    ? format(date, `d MMM, HH:mm`, { locale: dfLocale })
    : format(date, `d MMM, yyyy, HH:mm`, { locale: dfLocale });
  const time = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

  if (isToday) {
    return `${t("today")}, ${time}`;
  }

  if (isYesterday) {
    return `${t("yesterday")}, ${time}`;
  }

  return formatted;
}

function UserMessage({
  attachments,
  text,
  time,
}: {
  attachments: Attachment[] | undefined;
  text: string;
  time: string;
}) {
  return (
    <div className="flex justify-end">
      <div className="bg-primary px-4 py-3 rounded-t-[20px] rounded-bl-[20px] rounded-br-sm max-w-[70%]">
        {attachments && attachments.length === 0 ? (
          <></>
        ) : (
          <div className="flex max-w-full gap-2 overflow-x-auto pb-1 scrollbar-thin overflow-y-hidden">
            {attachments?.map((attachment) => (
              <MessageAttachment key={attachment.fileId} {...attachment} />
            ))}
          </div>
        )}

        <p className="font-sans text-body text-background whitespace-pre-line">
          {text}
        </p>

        <p className="mt-1 text-right font-sans text-caption text-background/70">
          {time}
        </p>
      </div>
    </div>
  );
}

export function MessageBubble({
  applyToolUse,
  role,
  status,
  text,
  attachments,
  steps,
  createdAt,
  processingSeconds,
}: Message) {
  const t = useTranslations("agentSteps");

  const time = formatMessageTime(createdAt);
  const [isStepsExtended, setIsStepsExtended] = useState(
    status === "pending" || status === "approve_required",
  );
  const approvalDetails = steps?.at(-1)?.approvalDetails;
  steps = steps ? steps : [];

  function useElapsedTime(startDate: string | Date): number {
    const [elapsed, setElapsed] = useState(() => {
      return Date.now() - new Date(startDate).getTime();
    });

    useEffect(() => {
      const interval = setInterval(() => {
        setElapsed(Date.now() - new Date(startDate).getTime());
      }, 1000);

      return () => clearInterval(interval);
    }, [startDate]);

    return elapsed;
  }

  function formatDuration(ms: number): string {
    const seconds = Math.round(ms / 1000);

    if (seconds < 60) {
      return `${seconds}${t("s")}`;
    }

    const minutes = Math.round(seconds / 60);
    const restSeconds = seconds % 60;

    return `${minutes}${t("m")} ${restSeconds}${t("s")}`;
  }

  const workDuration = formatDuration(
    useElapsedTime(createdAt) +
      (processingSeconds ? processingSeconds * 1000 : 0),
  );
  const workedFor = processingSeconds
    ? formatDuration(processingSeconds * 1000)
    : "-";

  switch (role) {
    case "user":
      return <UserMessage attachments={attachments} text={text} time={time} />;

    case "assistant":
      return (
        <div className="flex justify-start min-w-0">
          <div className={`
            py-3 rounded-t-[20px] rounded-br-[20px] rounded-bl-sm w-full flex flex-col gap-1 min-w-0
            ${status === "error" && "border border-error pl-5"}
          `}>
            <div className="flex flex-col gap-2">
              <div
                className={`
                    flex flex-row items-center gap-2 w-fit text-foreground-muted
                    hover:cursor-pointer hover:text-foreground-secondary
                `}
                onClick={() => setIsStepsExtended((prev) => !prev)}
              >
                {status === "pending" ? (
                  <p className="text-caption">
                    {t("working")} {workDuration}
                  </p>
                ) : status === "approve_required" ? (
                  <p className="text-caption">{t("awaiting")}</p>
                ) : (
                  <p className="text-caption">
                    {t("worked")} {workedFor}
                  </p>
                )}
                <ArrowIcon
                  className={`size-2 ${isStepsExtended && "rotate-90"}`}
                />
              </div>

              <div
                className={`
                    flex flex-col relative
                    overflow-hidden
                    ${
                      isStepsExtended
                        ? "max-h-250 opacity-100 transition-all duration-300 ease-out"
                        : "max-h-0 opacity-0 transition-[max-height] duration-100"
                    }
                `}
              >
                {steps.map((step, index) => (
                  <Step
                    key={step.id}
                    {...step}
                    isLast={index === steps.length - 1}
                  />
                ))}
              </div>
            </div>

            {text && (
              <>
                <MarkdownMessage text={text} />

                <div className="flex flex-row items-center">
                  <CopyButton content={text} />
                  <button className="p-2 rounded-lg hover:bg-elevated hover:cursor-pointer">
                    <LikeIcon className="text-foreground size-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-elevated hover:cursor-pointer">
                    <LikeIcon className="text-foreground size-4 scale-y-[-1]" />
                  </button>
                </div>
              </>
            )}

            {status === "approve_required" && (
              <ApprovalCard
                approvalDetails={approvalDetails}
                applyToolUse={applyToolUse}
              />
            )}
          </div>
        </div>
      );
  }
}
