"use client";

import WarningIcon from "@/src/icons/warning.svg";
import ArrowIcon from "@/src/icons/arrowBasic.svg";
import ConfirmedIcon from "@/src/icons/check.svg";
import CloseIcon from "@/src/icons/close.svg";
import ExpiredIcon from "@/src/icons/time.svg";

import { ApprovalDetails } from "@/src/types/chat";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations, useLocale } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { getDateFnsLocale } from "@/src/lib/date-fns-locale";

export function ApprovalCard({
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