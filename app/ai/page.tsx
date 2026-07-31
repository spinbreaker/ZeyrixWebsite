import { ChatArea } from "@/src/components/ai/ChatArea";
import { ChatHeader } from "@/src/components/ai/ChatHeader";
import { ComposeArea } from "@/src/components/ai/ComposeArea";

export default function Page() {
    return (
        <div className="h-screen flex flex-col">
            <ChatHeader />
            <ChatArea />
            <ComposeArea />
        </div>
    );
}