import ArrowIcon from "@/src/icons/arrow.svg";
import { navigate } from "next/dist/client/components/segment-cache/navigation";

type ContactButtonProps = {
    Icon: any;
    name: string;
    note: string;
    url: string;
}

export function ContactButton({ Icon, name, note, url }: ContactButtonProps) {
    return (
        <div className="flex flex-col min-w-0">
            <a 
                href={url}
                className="
                    flex flex-row bg-elevated border border-border rounded-xl justify-between min-w-0 hover:cursor-pointer
                    hover:bg-border hover:border-foreground-muted
                "
            >
                <div className="flex flex-row pl-3 py-3 items-center gap-3 min-w-0 flex-1">
                    <Icon className="size-5 shrink-0" />
                    <h4 className="text-h4 truncate min-w-0">{name}</h4>
                </div>

                <div className="border-l border-border flex justify-center items-center px-4 shrink-0">
                    <ArrowIcon className="size-5 rotate-90" />
                </div>
            </a>

            <p className="text-caption text-foreground-muted">{note}</p>
        </div>
    )
}