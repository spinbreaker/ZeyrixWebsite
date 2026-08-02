export type AITag = {
    text: string;
};

export type Message = {
    id: string;
    role: "user" | "assistant";
    text: string;
    attachments?: Attachment[];
    createdAt: string;
};

export type ApiMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
    created_at: string;
}

export type Attachment = {
    id: string;
    type: string;
    name: string;
    size: string;
    url?: string;
};

export type ApiChat = {
  id: string;
  title: string;
  updated_at: string;
};

export type Chat = {
  id: string;
  name: string;
  updatedAt: string;
};

export function mapChat(chat: ApiChat): Chat {
  return {
    id: chat.id,
    name: chat.title,
    updatedAt: chat.updated_at,
  };
}

export function mapMessage(message: ApiMessage): Message {
  return {
    id: message.id,
    role: message.role,
    text: String(message.content),
    createdAt: message.created_at,
  }
}