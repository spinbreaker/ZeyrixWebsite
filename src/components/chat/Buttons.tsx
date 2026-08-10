import { useState } from "react";
import CopyIcon from "@/src/icons/copy.svg";
import ConfirmedIcon from "@/src/icons/check.svg";

export function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (copied) {
        return;
      }

      await navigator.clipboard.writeText(content);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <button
      className="size-8 flex items-center justify-center rounded-lg hover:bg-elevated hover:cursor-pointer"
      onClick={handleCopy}
    >
      {copied ? (
        <ConfirmedIcon className="text-foreground size-3" />
      ) : (
        <CopyIcon className="text-foreground size-4" />
      )}
    </button>
  );
}
