import { PendingAttachment, Attachment } from "@/src/types/chat";
import { useState, useEffect } from "react";
import { getCachedImage } from "@/src/lib/ImageCache";
import FileIcon from "@/src/icons/file.svg";
import CloseIcon from "@/src/icons/close.svg";
import { div } from "motion/react-client";
import { Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion } from "motion/react";

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
    const { file, localId, fileId } = attachment;
    const isImage = file.type.startsWith('image/');
    const src = isImage ? getImageSrc(fileId) : null;
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    return (
        <div className="bg-elevated border border-border rounded-lg w-30 h-30 shrink-0 relative">
            {isImage && src ? (
                <>
                <motion.img
                    layoutId={`attachment-${fileId}`}
                    src={src}
                    alt={file.name}
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
                    alt={file.name}
                    layoutId={`attachment-${fileId}`}
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
                className="absolute top-0 right-0 p-2 bg-border rounded-tr-lg rounded-bl-lg hover:cursor-pointer hover:bg-border/90"
                onClick={() => onRemove(localId)}
            >
                <CloseIcon className="size-3 text-foreground" />
            </button>
        </div>
    );
}

export function MessageAttachment({ id, name, size, type }: Attachment) {
    const isImage = type.startsWith('image/');
    const src = getImageSrc(id);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    return (
        <div className="bg-elevated border border-border rounded-lg w-30 h-30 shrink-0 relative">
            {isImage && src ? (
                <>
                <motion.img
                    layoutId={`attachment-${id}`}
                    src={src}
                    alt={name}
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
                    alt={name}
                    layoutId={`attachment-${id}`}
                    isOpen={isOverlayOpen}
                    onClose={() => setIsOverlayOpen(false)}
                />
                </>
            ) : (
                <div className="flex flex-col gap-2 px-3 py-2 justify-center items-center w-full h-full">
                    <FileIcon className="text-foreground size-4" />
                    <p className="font-sans text-body-sm text-foreground truncate w-full text-center">{name}</p>
                    <p className="font-sans text-caption text-foreground-muted truncate w-full text-center">{size}</p>
                </div>
            )}
        </div>
    );
}