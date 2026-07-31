export type AITag = {
    text: string;
};

export type Message = {
    id: string;
    role: "user" | "assistant";
    text: string;
    attachments?: Attachment[];
    time: string;
};

export type Attachment = {
    id: string;
    type: string;
    name: string;
    size: string;
    url?: string;
};

export type Chat = {
    id: string;
    name: string;
    createdAt: string;
}