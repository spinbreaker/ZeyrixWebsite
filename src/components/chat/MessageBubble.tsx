"use client";

import LikeIcon from "@/src/icons/like.svg";
import WarningIcon from "@/src/icons/warning.svg";
import ArrowIcon from "@/src/icons/arrowBasic.svg";
import ConfirmedIcon from "@/src/icons/check.svg";
import CloseIcon from "@/src/icons/close.svg";
import ExpiredIcon from "@/src/icons/time.svg";
import InProgressIcon from "@/src/icons/in_progress.svg";
import DoneIcon from "@/src/icons/done.svg";
import CancelledIcon from "@/src/icons/cancelled.svg";
import AwaitingIcon from "@/src/icons/time.svg";
import ToolIcon from "@/src/icons/tool.svg";
import ReasoningIcon from "@/src/icons/idea.svg";

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
import { useStep } from "@/src/hooks/useStep";

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

function ApprovalCard({
  approvalDetails,
  applyToolUse,
}: {
  approvalDetails: ApprovalDetails | undefined;
  applyToolUse: (
    requestId: string,
    action: "confirm" | "reject",
  ) => Promise<void>;
}) {
  const t = useTranslations("toolApproval");

  if (!approvalDetails) {
    return (
      <div className="flex justify-start">
        <div className="bg-error/10 border-l-2 border-error px-5 py-6 rounded-[20px] max-w-[90%]">
          <p className="font-sans text-body-lg text-foreground whitespace-pre-line">
            {t("failedToLoad")}
          </p>
        </div>
      </div>
    );
  }

  const {
    actionSummary,
    affectedResources,
    approvalExpiresAt,
    approvalId,
    paramsPreview,
    reversible,
    riskLevel,
    toolName,
    status,
    appliedAt,
  } = approvalDetails;

  const [isParamsDisplay, setIsParamsDisplay] = useState(false);
  const isExpired = new Date() > new Date(approvalExpiresAt) && !appliedAt;
  const isActive = status === "pending" && !isExpired;

  function timeAgo(date: Date) {
    const locale = useLocale();
    const dfLocale = getDateFnsLocale(locale);

    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: dfLocale,
    });
  }

  return (
    <div className="flex justify-start">
      <div
        className={`
                px-4 py-3 rounded-t-[20px] rounded-br-[20px] rounded-bl-sm w-[90%] min-w-50 bg-elevated flex flex-col
                border ${
                  !isActive
                    ? "border-border"
                    : riskLevel === "low"
                      ? "border-info"
                      : riskLevel === "medium"
                        ? "border-warning"
                        : riskLevel === "high"
                          ? "border-error"
                          : "border-error"
                }
                ${!isActive && "opacity-70"}
            `}
      >
        {/* Header */}
        <div className="flex flex-row border-b border-border items-center justify-between pb-3">
          <p className="text-label">{t("title")}</p>
          <div
            className={`
                        rounded-full px-3 py-0.5
                        ${
                          !isActive
                            ? "bg-border"
                            : riskLevel === "low"
                              ? "bg-info/80"
                              : riskLevel === "medium"
                                ? "bg-warning/80"
                                : riskLevel === "high"
                                  ? "bg-error/80"
                                  : "bg-error"
                        }
                    `}
          >
            <p>{riskLevel}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 mt-7">
          <h3 className="text-h3 text-foreground">{toolName}</h3>
          <p className="text-body text-foreground-secondary">{actionSummary}</p>

          <div className="flex flex-row justify-between">
            <p className="text-caption text-foreground-muted">
              {affectedResources}
            </p>
            {!reversible && (
              <div className="flex flex-row gap-1 items-center">
                <WarningIcon className="text-error size-3" />
                <p className="text-error text-caption">{t("irreversible")}</p>
              </div>
            )}
          </div>
        </div>

        {isActive ? (
          <>
            {/* Buttons */}
            <div className="flex justify-between flex-col sm:flex-row gap-5 items-center mt-7">
              <div className="flex flex-col gap-5 sm:flex-row w-full">
                <button
                  className="
                                    bg-primary text-background rounded-lg px-3 py-2
                                    hover:cursor-pointer hover:bg-primary-hover
                                "
                  onClick={() => applyToolUse(approvalId, "confirm")}
                >
                  {t("continue")}
                </button>
                <button
                  className="
                                    text-foreground-secondary border border-border rounded-lg px-3 py-2
                                    hover:cursor-pointer hover:bg-surface
                                "
                  onClick={() => applyToolUse(approvalId, "reject")}
                >
                  {t("decline")}
                </button>
              </div>

              <button
                className="
                                text-label text-primary flex flex-row items-center gap-2 px-3 py-2
                                hover:cursor-pointer hover:underline
                            "
                onClick={() => setIsParamsDisplay((prev) => !prev)}
              >
                <p>{t("details")}</p>
                <ArrowIcon
                  className={`size-2 transition-transform duration-200 ${
                    isParamsDisplay ? "rotate-180" : "rotate-90"
                  }`}
                />
              </button>
            </div>

            {/* Params — отступ теперь внутри анимации */}
            <AnimatePresence initial={false}>
              {isParamsDisplay && (
                <motion.div
                  key="params"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.25,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="overflow-hidden"
                >
                  <div className="bg-background rounded-md p-3 text-caption font-mono mt-7">
                    <pre className="whitespace-pre-wrap break-all m-0">
                      {typeof paramsPreview === "string"
                        ? paramsPreview
                        : JSON.stringify(paramsPreview, null, 2)}
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : isExpired ? (
          <div className="mt-7 flex flex-row gap-2 items-center">
            <ExpiredIcon className="text-error size-4" />
            <p className="text-body text-error">
              {t("expired")} {timeAgo(new Date(approvalExpiresAt))}
            </p>
          </div>
        ) : status === "rejected" ? (
          <div className="mt-7 flex flex-row gap-2 items-center">
            <CloseIcon className="text-error size-4" />
            <p className="text-body text-error">
              {t("cancelled")} {appliedAt ? timeAgo(new Date(appliedAt)) : ""}
            </p>
          </div>
        ) : status === "approved" ? (
          <div className="mt-7 flex flex-row gap-2 items-center">
            <ConfirmedIcon className="text-success size-4" />
            <p className="text-body text-success">
              {t("confirmed")} {appliedAt ? timeAgo(new Date(appliedAt)) : ""}
            </p>
          </div>
        ) : status === "executed" ? (
          <div className="mt-7 flex flex-row gap-2 items-center">
            <ConfirmedIcon className="text-success size-4" />
            <p className="text-body text-success">
              {t("executed")} {appliedAt ? timeAgo(new Date(appliedAt)) : ""}
            </p>
          </div>
        ) : (
          <div className="mt-7 flex flex-row gap-2 items-center">
            <WarningIcon className="text-error size-4" />
            <p className="text-body text-error">
              {t("failed")} {appliedAt ? timeAgo(new Date(appliedAt)) : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StepOverlay(
  { kind, status, toolName, toolDetails, onClose }: 
  { kind: StepKind, status: StepStatus, toolName?: string, toolDetails?: ToolDetails, onClose: () => void }
) {
  const { error, undoTool } = useStep()
  const [isUndone, setIsUndone] = useState(false);
  const [isUndoing, setIsUndoing] = useState(false);

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/90 cursor-auto p-3"
      onClick={onClose}
    >
      <div
        className="w-full max-w-110 bg-surface rounded-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="absolute top-0 right-0 p-4 hover:cursor-pointer bg-surface rounded-2xl"
          onClick={onClose}
        >
          <CloseIcon className="size-3 text-foreground-muted" />
        </div>

        {kind === "tool_call" ? (
          <>
          <div className="flex flex-col w-fit items-start p-3">
            <div className="flex flex-row  text-foreground gap-2 min-w-0 w-full">
              <ToolIcon className="size-5" />
              <h4 className="text-h4 truncate min-w-0 flex-1">Tool "{toolName}"</h4>
            </div>
            <p className="text-caption text-foreground-secondary">{status} · 0.6 seconds</p>
          </div>

          {toolDetails ? (
            <div className="p-6 flex flex-col gap-10">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                  <h4 className="text-h4 text-foreground-secondary">Params preview:</h4>
                  <div className="bg-background rounded-md p-3 text-caption font-mono">
                    <pre className="whitespace-pre-wrap break-all m-0">
                      {toolDetails.arguments}
                    </pre>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="text-h4 text-foreground-secondary">Result:</h4>
                  <div className="bg-background rounded-md p-3 text-caption font-mono">
                    <pre className="whitespace-pre-wrap break-all m-0">
                      {toolDetails.rowsAffected} data rows affected
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button 
                  className={`
                    w-full py-3 rounded-lg text-background bg-primary 
                    ${["delete", "update", "insert"].includes(toolName ?? "") && toolDetails.auditLogId && !isUndone && !isUndoing ? "hover:cursor-pointer hover:bg-primary-hover" : "opacity-50"}
                    ${isUndoing && "bg-primary-active"}
                  `}
                  disabled={!["delete", "update", "insert"].includes(toolName ?? "") || !toolDetails.auditLogId || isUndone || isUndoing}
                  onClick={async () => {
                    if (toolDetails.auditLogId) {
                      try {
                        setIsUndoing(true);
                        await undoTool(toolDetails.auditLogId, setIsUndone);
                      } catch {

                      } finally {
                        setIsUndoing(false);
                      }
                    }
                  }}
                >
                  {isUndone ? "Action undone" : isUndoing ? "Undoing..." : "Undo this action"}
                </button>
                <p className="text-caption text-error">{error}</p>
              </div>
            </div>
          ) : (
            <div className="p-3">
              <p className="text-body text-foreground-secondary">Here should be the info about the tool. But it is empty. Please, inform us about this.</p>
            </div>
          )}
          </>
        ) : (
          <div>
            <p>It is empty now</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Step({ kind, status, toolName, isLast, toolDetails }: AgentStep) {
  const t = useTranslations("agentSteps");
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  let stepAction = `${t("unknown")}: `;
  if (["reasoning", "tool_call", "file_transcribe"].includes(kind)) {
    stepAction = `${t(kind)}: `;
  }

  const colorClass =
    status === "in_progress" || status === "awaiting_approval"
      ? "text-foreground-secondary"
      : status === "done"
        ? "text-foreground-muted"
        : "text-[#ff8686]";

  const localizedLabel = () => {
    const tKey = `${kind}_${status}`;

    return t(tKey, {
      toolName: toolName ?? t("unknown_tool"),
    });
  };

  return (
    <>
    <button
      className={`flex gap-2 items-start ${colorClass} hover:cursor-pointer group max-w-70`}
      onClick={() => setIsOverlayOpen((prev) => !prev)}
    >
      <div className="relative flex w-3 shrink-0 flex-col items-center self-stretch">
        <div className="relative z-10 mt-1 flex size-3 shrink-0 items-center justify-center bg-surface">
          {status === "in_progress" ? (
            <InProgressIcon className="size-3 animate-pulse" />
          ) : status === "done" ? (
            <DoneIcon className="size-3" />
          ) : status === "awaiting_approval" ? (
            <AwaitingIcon className="size-3" />
          ) : (
            <CancelledIcon className="size-3" />
          )}
        </div>

        {!isLast && <div className="w-0.5 flex-1 -mb-1 bg-foreground-muted" />}
      </div>
      
      <div className="flex w-full items-center justify-between gap-2 min-w-0">
        <p
          className={`text-body-sm min-w-0 flex-1 truncate pb-2 text-start group-hover:underline ${
            status === "in_progress" ? "animate-pulse" : ""
          }`}
        >
          {stepAction}
          {localizedLabel()}
        </p>
        
        <div className="pb-2">
          <ArrowIcon className="size-2 shrink-0" />
        </div>
      </div>
    </button>

    {isOverlayOpen && <StepOverlay kind={kind} status={status} toolName={toolName} toolDetails={toolDetails} onClose={() => setIsOverlayOpen(false)} />}
    </>
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
          <div className="py-3 rounded-t-[20px] rounded-br-[20px] rounded-bl-sm w-full flex flex-col gap-1 min-w-0">
            <div className="flex flex-col gap-2">
              <div
                className={`
                    flex flex-row items-center gap-2 hover:cursor-pointer w-fit text-foreground-muted
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
