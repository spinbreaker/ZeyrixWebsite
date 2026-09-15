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
    const steps: Step[] = [
        {
            "number": "01",
            "title": "Consultation",
            "text": "We discuss your project and define the best AI setup for your needs.",
        },
        {
            "number": "02",
            "title": "Setup",
            "text": "After a 50% upfront payment, we start building your AI system.",
        },
        {
            "number": "03",
            "title": "Development & Launch",
            "text": "We configure and deploy your project. You receive updates throughout the process.",
        },
        {
            "number": "04",
            "title": "Delivery & Support",
            "text": "After final payment, your system goes live. We stay available for ongoing support whenever you need it.",
        },
    ]

    return (
        <div className="bg-surface px-6 py-12 flex flex-col gap-10">
            <div className="flex flex-col">
                <p className="text-overline text-primary">/ PROCESS</p>
                <h2 className="text-h2">How It Works</h2>
            </div>

            <div className="flex flex-col gap-10 px-6">
                {steps.map((step) => (
                    <StepComponent key={step.number} title={step.title} text={step.text} number={step.number} />
                ))}
            </div>
        </div>
    )
}