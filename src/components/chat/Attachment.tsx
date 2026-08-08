import { PendingAttachment, Attachment } from "@/src/types/chat";
import { useState, useEffect, useMemo } from "react";
import { getCachedImage } from "@/src/lib/ImageCache";
import FileIcon from "@/src/icons/file.svg";
import CloseIcon from "@/src/icons/close.svg";
import ErrorIcon from "@/src/icons/warning.svg";
import { AnimatePresence, motion } from "motion/react";
import { ImageSkeleton } from "../skeletons/imageSkeleton";
import { div } from "motion/react-client";

interface AttachmentCardProps {
  attachment: PendingAttachment;
  onRemove: (localId: string) => void;
}

function getImageSrc(fileId: string | null) {
    const [src, setSrc] = useState<string | null>(null);

    useEffect(() => {
        let objectUrl: string | null = null;
        let cancelled = false;

        async function load() {
            if (!fileId) return;

            const cachedBlob = await getCachedImage(fileId);
            if (cachedBlob && !cancelled) {
                objectUrl = URL.createObjectURL(cachedBlob);
                setSrc(objectUrl);
                return;
            }
        }
        load();

        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [fileId]);

    return src;
}

function ImageOverlay({
    src, alt, layoutId, isOpen, onClose,
}: {
    src: string;
    alt: string;
    layoutId: string;
    isOpen: boolean;
    onClose: () => void;
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-999 flex items-center justify-center bg-black/90"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="flex flex-col items-center gap-3 p-10"
                    >
                        <motion.img
                            layoutId={layoutId}
                            src={src}
                            alt={alt}
                            className="max-w-[80vw] max-h-[80vh] rounded-xl"
                            transition={{
                                layout: {
                                    duration: 0.35,
                                    ease: [0.22, 1, 0.36, 1],
                                },
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-white"
                        >
                            {alt}
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function AttachmentCard({ attachment, onRemove }: AttachmentCardProps) {
    const { file, localId, fileId, status, error } = attachment;
    const isImage = file.type.startsWith('image/');
    const [localSrc, setLocalSrc] = useState<string | null>(null);

    useEffect(() => {
        if (!isImage) {
            setLocalSrc(null);
            return;
        }

        const url = URL.createObjectURL(file);
        setLocalSrc(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file, isImage]);

    const src = localSrc;
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    return (
        <div className="bg-elevated border border-border rounded-lg w-30 h-30 shrink-0 relative overflow-hidden">
            {isImage && src ? (
                <>
                <motion.img
                    layoutId={`attachment-${localId}`}
                    src={src}
                    alt={file.name}
                    onClick={() => setIsOverlayOpen(true)}
                    className={`
                        w-30 h-30
                        object-cover
                        rounded-lg
                        hover:cursor-pointer
                    `}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                />

                <ImageOverlay
                    src={src}
                    alt={file.name}
                    layoutId={`attachment-${localId}`}
                    isOpen={isOverlayOpen}
                    onClose={() => setIsOverlayOpen(false)}
                />
                </>
            ) : (

                <div className="flex flex-col gap-2 px-3 py-2 justify-center items-center w-full h-full">
                    <FileIcon className="text-foreground size-4" />
                    <p className="font-sans text-body-sm text-foreground truncate w-full text-center">{file.name}</p>
                    <p className="font-sans text-caption text-foreground-muted truncate w-full text-center">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
            )}

            <button
                className="absolute top-0 right-0 p-2 bg-border rounded-tr-lg rounded-bl-lg hover:cursor-pointer hover:bg-border/90 z-10"
                onClick={() => onRemove(localId)}
            >
                <CloseIcon className="size-3 text-foreground" />
            </button>

            {status === "uploading" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 overflow-hidden">
                    <div className="h-full w-1/3 bg-primary animate-indeterminate" />
                </div>
            )}

            {status === "error" && (
                <>
                <div className="absolute top-0 left-0 bg-black/70 w-full h-full pointer-events-none flex flex-col justify-center items-center gap-2">
                    <ErrorIcon className="size-6 text-error shrink-0" />
                    <p className="text-caption text-foreground-secondary text-center max-w-[95%]">{error}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 overflow-hidden">
                    <div className="h-full w-full bg-error" />
                </div>
                </>
            )}
        </div>
    );
}

export function MessageAttachment({ fileId, filename, size, mimeType }: Attachment) {
    const isImage = mimeType.startsWith('image/');
    const src = getImageSrc(fileId);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    return (
        <div className="bg-elevated border border-border rounded-lg w-30 h-30 shrink-0 relative overflow-hidden">
            {isImage && src ? (
                <>
                <motion.img
                    layoutId={`attachment-${fileId}`}
                    src={src}
                    alt={filename}
                    onClick={() => setIsOverlayOpen(true)}
                    className="
                        w-30 h-30
                        object-cover
                        rounded-lg
                        hover:cursor-pointer
                    "
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                />

                <ImageOverlay
                    src={src}
                    alt={filename}
                    layoutId={`attachment-${fileId}`}
                    isOpen={isOverlayOpen}
                    onClose={() => setIsOverlayOpen(false)}
                />
                </>
            ) : (
                <div className="flex flex-col gap-2 px-3 py-2 justify-center items-center w-full h-full">
                    <FileIcon className="text-foreground size-4" />
                    <p className="font-sans text-body-sm text-foreground truncate w-full text-center">{filename}</p>
                    <p className="font-sans text-caption text-foreground-muted truncate w-full text-center">{(Number(size) / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
            )}
        </div>
    );
}