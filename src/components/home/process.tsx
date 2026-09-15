import { useTranslations } from "next-intl"

interface Step {
    number: string,
    title: string,
    text: string,
}

function StepComponent({ title, text, number }: Step) {
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <p className="font-display-en text-primary text-display">{number}</p>
            <h3 className="text-h3 text-center">{title}</h3>
            <p className="text-body text-center">{text}</p>
        </div>
    )
}

export function HowItWorks() {
    const t = useTranslations("home");

    const steps: Step[] = [
        {
            "number": "01",
            "title": t("firstStepTitle"),
            "text": t("firstStepText"),
        },
        {
            "number": "02",
            "title": t("secondStepTitle"),
            "text": t("secondStepText"),
        },
        {
            "number": "03",
            "title": t("thirdStepTitle"),
            "text": t("thirdStepText"),
        },
        {
            "number": "04",
            "title": t("fourthStepTitle"),
            "text": t("fourthStepText"),
        },
    ]

    return (
        <div className="bg-surface px-6 py-12 flex flex-col gap-10">
            <div className="flex flex-col">
                <p className="text-overline text-primary">{t("processOverline")}</p>
                <h2 className="text-h2">{t("processTitle")}</h2>
            </div>

            <div className="flex flex-col gap-10 px-6">
                {steps.map((step) => (
                    <StepComponent key={step.number} title={step.title} text={step.text} number={step.number} />
                ))}
            </div>
        </div>
    )
}