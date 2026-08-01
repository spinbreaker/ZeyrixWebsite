"use client";

import AttachIcon from "@/src/icons/attach.svg";
import ImageIcon from "@/src/icons/image.svg";
import MicroIcon from "@/src/icons/microphone.svg";
import { useRef } from "react";

export function ComposeArea() {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    return (
        <div className="bg-background px-6 pb-3 w-full h-fit flex flex-col items-center">
            <div className="bg-background border border-border rounded-2xl px-4 py-3 gap-2 max-w-190 w-full">
                <textarea
                    ref={textareaRef}
                    onChange={handleChange}
                    placeholder="Message Zeyrix AI..."
                    rows={1}
                    className="w-full h-fit resize-none bg-transparent outline-none font-sans text-body text-foreground placeholder:text-foreground-muted max-h-50"
                />
                <div className="w-full h-fit flex justify-between">
                    <div className="flex">
                        <div className="p-3">
                            <AttachIcon className="text-foreground-muted size-5" />
                        </div>
                        <div className="p-3">
                            <ImageIcon className="text-foreground-muted size-5" />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="p-3">
                            <MicroIcon className="text-foreground-muted size-5" />
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-foreground-muted font-sans text-caption max-w-190 w-full">
                Please verify AI-provided information before making decisions or payments.
            </p>
        </div>
    );
}