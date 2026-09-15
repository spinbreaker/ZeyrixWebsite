import CloseIcon from "@/src/icons/close.svg";
import ArrowIcon from "@/src/icons/arrowBasic.svg";
import GlobusIcon from "@/src/icons/globus.svg";
import { useTranslations } from "next-intl";

type MenuProps = {
  open: boolean;
  onClose: () => void;
  onExited: () => void;
};

export function MenuOverlay({
  open,
  onClose,
  onExited,
}: MenuProps) {
  const t = useTranslations("menu")

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ease-out motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"} lg:hidden`}
      onTransitionEnd={(event) => {
        if (event.target !== event.currentTarget || open) {
          return;
        }

        onExited();
      }}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-150 ease-out motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      <aside
        className={`
          absolute right-0 top-0 h-screen w-65 max-w-full bg-background transform-gpu
          transition-transform duration-150 ease-out motion-reduce:transition-none
          ${open ? "translate-x-0" : "-translate-x-full"}
          flex flex-col items-center justify-center gap-7 px-6
        `}
      >
        <div 
          className="absolute top-0 right-0 p-4"
          onClick={onClose}
        >
            <CloseIcon className="size-3" />
        </div>

        <h2 className="font-display-en font-light text-h1">zeyrix</h2>

        <div className="flex flex-col text-nav items-center">
            <div className="p-2.5"><p>{t("home")}</p></div>
            <div className="p-2.5"><p>{t("services")}</p></div>
            <div className="p-2.5"><p>{t("cases")}</p></div>
            <div className="p-2.5"><p>{t("about")}</p></div>
            <div className="p-2.5"><p>{t("contact")}</p></div>
            <div className="p-2.5"><p>{t("zeyrixai")}</p></div>
            <div className="p-2.5"><p>{t("settings")}</p></div>
        </div>

        <div className="flex flex-col gap-3">
            <div className="bg-elevated h-10 flex flex-row rounded-lg justify-between items-center gap-3 px-3 border border-border">
                <div className="flex flex-row items-center gap-2">
                    <GlobusIcon className="size-4" />
                    <p className="text-body">{t("selectLanguage")}</p>
                </div>
                
                <ArrowIcon className="size-3" />
            </div>

            <div className="bg-primary h-10 flex flex-row justify-center items-center rounded-lg">
                <p className="text-background text-body">{t("CTA")}</p>
            </div>
        </div>
      </aside>
    </div>
  );
}
