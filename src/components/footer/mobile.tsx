import { useTranslations } from "next-intl"
import TelegramIcon from "@/src/icons/telegram.svg";
import WhatsappIcon from "@/src/icons/whatsapp.svg";
import InstagramIcon from "@/src/icons/instagram.svg";
import TiktokIcon from "@/src/icons/tiktok.svg";

export function FooterMobile() {
    const t = useTranslations("footer");
    const pages = useTranslations("menu");

    return (
        <div className="flex flex-col bg-background px-6 py-12 gap-10">
            <div className="flex flex-col items-center">
                <h2 className="font-display-en font-light text-h1">zeyrix</h2>
                <p className="text-caption">{t("slogan")}</p>
            </div>

            <div className="flex flex-col items-center">
                <h3 className="text-h2">{t("pages")}</h3>

                <div className="grid grid-cols-2 w-full text-center max-w-150 text-caption text-foreground-secondary">
                    <div className="p-2.5"><p>{pages("home")}</p></div>
                    <div className="p-2.5"><p>{pages("services")}</p></div>
                    <div className="p-2.5"><p>{pages("cases")}</p></div>
                    <div className="p-2.5"><p>{pages("about")}</p></div>
                    <div className="p-2.5"><p>{pages("contact")}</p></div>
                    <div className="p-2.5"><p>{pages("zeyrixai")}</p></div>
                    <div className="p-2.5"><p>{pages("settings")}</p></div>
                </div>
            </div>

            <div className="flex flex-col items-center">
                <h3 className="text-h3">{t("contacts")}</h3>

                <div className="grid grid-cols-2 w-full text-center max-w-150 text-caption text-foreground-secondary">
                    <div className="p-2.5"><p>{t("callUs")}</p></div>
                    <div className="p-2.5"><p>{t("contactByEmail")}</p></div>
                    <div className="p-2.5"><p>{t("webChat")}</p></div>
                    <div className="p-2.5"><p>{t("telegramChat")}</p></div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-3">
                <h3 className="text-h4">{t("socialMedia")}</h3>

                <div className="flex flex-row justify-between w-full max-w-100">
                    <div className="p-3"><TelegramIcon className="size-6" /></div>
                    <div className="p-3"><WhatsappIcon className="size-6" /></div>
                    <div className="p-3"><InstagramIcon className="size-6" /></div>
                    <div className="p-3"><TiktokIcon className="size-6" /></div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-3 text-caption text-foreground-secondary">
                <div className="flex flex-row w-full justify-between max-w-100 px-3">
                    <p>{t("privacyPolicy")}</p>
                    <p>{t("termsOfUse")}</p>
                </div>

                <p>© {new Date().getFullYear()} Zeyrix. {t("allRightsReserved")}.</p>
            </div>
        </div>
    )
}