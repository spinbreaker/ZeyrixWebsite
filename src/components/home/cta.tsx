import { PrimaryBlackButton } from "../reusable/buttons";
import { useTranslations } from "next-intl";

export function MainCTA() {
    const t = useTranslations("home")
    
    return (
        <div className="bg-primary py-16 flex flex-col justify-center items-center gap-6 px-6">
            <h2 className="text-h2 text-background text-center">{t("ctaTitle")}</h2>
            <p className="text-body text-background text-center">{t("ctaDescription")}</p>
            <PrimaryBlackButton text="Start a Project" mode="fit" />
        </div>
    )
}