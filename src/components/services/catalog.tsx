import { randomUUID } from "crypto";
import { PrimaryButton, SecondaryButton } from "../reusable/buttons"

interface Service {
    id: number,
    title: string,
    text: string,
    url: string,
    tags: string[],
}

function Tag({ text }: { text: string }) {
    return (
        <div className="bg-elevated text-foreground rounded-md px-3 py-1 text-caption shrink-0">
            {text}
        </div>
    );
}

function Service({ id, title, text, url, tags }: Service) {
    return (
        <div className="bg-surface border border-border p-6 rounded-2xl flex flex-col gap-6 items-center">
            <img src={url} alt="image" className="rounded-lg" />
            
            <div className="flex flex-col gap-3 items-center">
                <p className="text-overline text-primary-outline">0{id}</p>

                <div className="flex flex-col gap-1 items-center">
                    <h4 className="text-h4 text-center">{title}</h4>
                    <p className="text-body-sm text-center">{text}</p>
                </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
                <div className="flex flex-row overflow-x-auto gap-2">
                    {tags.map((text) => (
                        <Tag key={randomUUID()} text={text} />
                    ))}
                </div>
    
                <PrimaryButton text="Primary" />
                <SecondaryButton text="Secondary" />
            </div>
        </div>
    )
}

export function ServicesCatalog() {
    const services: Service[] = [
        {
            "id": 1,
            "title": "A header for this card",
            "text": "This is a small description for this test card. I’ll fill it a bit more to test how it looks.",
            "url": "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
            "tags": ["Next.js", "React", "Tailwind CSS", "Custom UI", "Comfort UX"],
        },
        {
            "id": 2,
            "title": "A header for this card",
            "text": "This is a small description for this test card. I’ll fill it a bit more to test how it looks.",
            "url": "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
            "tags": ["Next.js", "React", "Tailwind CSS", "Custom UI", "Comfort UX"],
        },
        {
            "id": 3,
            "title": "A header for this card",
            "text": "This is a small description for this test card. I’ll fill it a bit more to test how it looks.",
            "url": "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
            "tags": ["Next.js", "React", "Tailwind CSS", "Custom UI", "Comfort UX"],
        },
    ]

    return (
        <div className="bg-background px-6 py-12 flex flex-col gap-6">
            {services.map((service) => (
                <Service key={service.id} id={service.id} title={service.title} text={service.text} url={service.url} tags={service.tags} />
            ))}
        </div>
    );
}