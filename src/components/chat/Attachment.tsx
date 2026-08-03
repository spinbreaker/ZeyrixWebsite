import { PendingAttachment, Attachment } from "@/src/types/chat";
import { useState, useEffect } from "react";
import { getCachedImage } from "@/src/lib/ImageCache";
import FileIcon from "@/src/icons/file.svg";
import CloseIcon from "@/src/icons/close.svg";

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

export function AttachmentCard({ attachment, onRemove }: AttachmentCardProps) {
    const { file, localId, fileId } = attachment;
    const isImage = file.type.startsWith('image/');
    const src = isImage ? getImageSrc(fileId) : null;

    return (
        <div className="bg-elevated rounded-lg w-30 h-30 shrink-0 relative">
            {isImage && src ? (
                <img
                    src={src}
                    alt={file.name}
                    className="w-full h-full object-cover rounded-lg"
                />
            ) : (

                <div className="flex flex-col gap-2 px-3 py-2 justify-center items-center w-full h-full">
                    <FileIcon className="text-foreground size-4" />
                    <p className="font-sans text-body-sm text-foreground truncate w-full text-center">{file.name}</p>
                    <p className="font-sans text-caption text-foreground-muted truncate w-full text-center">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
            )}

            <button
                className="absolute top-0 right-0 p-2 bg-background/30 rounded-tr-lg"
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

    return (
        <div className="bg-elevated rounded-lg w-30 h-30 shrink-0 relative">
            {isImage && src ? (
                <img
                    src={src}
                    alt={name}
                    className="w-full h-full object-cover rounded-lg"
                />
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