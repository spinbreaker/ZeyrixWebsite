import { useTranslations } from "next-intl";

export function MainHero() {
    const t = useTranslations("home")

    return (
        <div className="relative h-dvh flex flex-col justify-center items-center px-6 gap-6">
            <div className="
                absolute h-full w-full main-hero bg-size-[auto_100%] bg-center bg-no-repeat -z-1
                after:absolute after:inset-0 after:bg-radial-[circle_at_center] after:from-background after:via-background/50
                after:to-transparent after:content-[''] after:from-20% after:via-50% after:to-80% opacity-5
            " />

            <div className="flex flex-col">
                <p className="text-overline text-primary text-center">{t("heroOverline")}</p>
                <h1 className="font-display-en text-display text-center">{t("heroTitle")}</h1>
            </div>

            <p className="text-body text-center">{t("heroDescription")}</p>

            <div className="flex flex-col gap-4">
                <div className="bg-primary text-background px-6 h-13 rounded-lg flex justify-center items-center text-btn">
                    {t("startProject")}
                </div>
                <div className="border border-primary text-primary px-6 h-13 rounded-lg flex justify-center items-center text-btn">
                    {t("viewServices")}
                </div>
            </div>
        </div>
    )
}