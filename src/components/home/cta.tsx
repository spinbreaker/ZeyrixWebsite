import { PrimaryBlackButton } from "../reusable/buttons";

export function MainCTA() {
    return (
        <div className="bg-primary py-16 flex flex-col justify-center items-center gap-6 px-6">
            <h2 className="text-h2 text-background text-center">Start Building With AI</h2>
            <p className="text-body text-background text-center">Explore how our AI tools and solutions can fit into your workflow. Get in touch to discuss integration, use cases, or a custom implementation for your product.</p>
            <PrimaryBlackButton text="Start a Project" mode="fit" />
        </div>
    )
}