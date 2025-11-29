import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ChatInterface from "./components/chat-interface";

export default async function PetChatPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    return (
        <div className="h-[calc(100vh-64px)]">
            <ChatInterface />
        </div>
    );
}
