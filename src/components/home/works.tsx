import Image from "next/image"
import { PrimaryButton, SecondaryButton } from "../reusable/buttons"

interface Work {
    id: number,
    title: string,
    text: string,
    url: string,
}

function Work({ title, text, url }: Work) {
    return (
        <div className="bg-surface border border-border p-6 rounded-2xl flex flex-col gap-6 items-center">
            <img src={url} alt="image" className="rounded-lg" />
            
            <div className="flex flex-col gap-1 items-center">
                <h4 className="text-h4 text-center">{title}</h4>
                <p className="text-body-sm text-center">{text}</p>
            </div>

            <div className="flex flex-col gap-3 w-full">
                <PrimaryButton text="Primary" />
                <SecondaryButton text="Secondary" />
            </div>
        </div>
    )
}

export function MainWorks() {
    const works: Work[] = [
        {
            "id": 1,
            "title": "A header for this card",
            "text": "This is a small description for this test card. I’ll fill it a bit more to test how it looks.",
            "url": "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        },
        {
            "id": 2,
            "title": "A header for this card",
            "text": "This is a small description for this test card. I’ll fill it a bit more to test how it looks.",
            "url": "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        },
        {
            "id": 3,
            "title": "A header for this card",
            "text": "This is a small description for this test card. I’ll fill it a bit more to test how it looks.",
            "url": "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        },
    ]

    return (
        <div className="bg-background px-6 py-12 flex flex-col gap-10 items-center">
            <div className="flex flex-col w-full">
                <p className="text-overline text-primary">/ OUR WORKS</p>
                <h2 className="text-h2">What We’ve Built</h2>
            </div>

            <div className="flex flex-col gap-6">
                {works.map((work) => (
                    <Work key={work.id} id={work.id} title={work.title} text={work.text} url={work.url} />
                ))}
            </div>

            <PrimaryButton text="See More Projects →" mode="fit" />
        </div>
    )
}