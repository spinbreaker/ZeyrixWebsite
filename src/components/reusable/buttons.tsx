import SparkleIcon from "@/src/icons/sparkle.svg";

export function PrimaryButton({ text, mode = "full" }: { text: string, mode?: "fit" | "full" }) {
    return (
        <button className={`py-4 px-6 bg-primary text-background rounded-lg text-btn text-center w-${mode}`}>
            {text}
        </button>
    )
}

export function SecondaryButton({ text, mode = "full" }: { text: string, mode?: "fit" | "full" }) {
    return (
        <button className="py-4 px-6 border border-primary text-primary rounded-lg text-btn text-center">
            {text}
        </button>
    )
}

export function PrimaryBlackButton({ text, mode = "full" }: { text: string, mode?: "fit" | "full" }) {
    return (
        <button className={`py-4 px-6 bg-background text-foreground rounded-lg text-btn text-center w-${mode}`}>
            {text}
        </button>
    )
}

export function OpenAgentButton() {
    return (
        <button 
            className="fixed bottom-6 right-6 bg-primary p-3 rounded-lg"
        >
            <SparkleIcon className="size-4 text-background" />
        </button>
    );
}