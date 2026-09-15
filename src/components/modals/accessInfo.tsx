import { useTranslations } from "next-intl";

export type AccessInfoModalStatus = "NOT_FOUND" | "EXPIRED" | "EXHAUSTED" | "REVOKED";
type AccessInfoModalProps = {
    status: AccessInfoModalStatus,
    onClose: () => void;
}

export function AccessInfoModal({ status, onClose }: AccessInfoModalProps) {
    const t = useTranslations("accessDisabled");

    return (
        <div className="fixed inset-0 z-999 bg-black/90 w-full h-full flex items-center justify-center px-6">
            <div className="bg-surface border border-border rounded-2xl flex flex-col p-6 gap-6 justify-center items-center max-w-100">
                <h2 className="text-h2 text-center">{t(status)}</h2>
                <p className="text-body text-center text-foreground-secondary">{t(`${status}_DESCRIPTION`)}</p>
                <button 
                    className="bg-primary text-background text-btn py-3 px-6 rounded-lg hover:bg-primary-hover hover:cursor-pointer w-full"
                    onClick={onClose}
                >
                    {t("gotIt")}
                </button>
            </div>
        </div>
    );
}