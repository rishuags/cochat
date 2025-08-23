import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import {
    ref,
    push,
    onValue,
    query,
    limitToLast
} from "firebase/database";

import { useApiKey } from "./context/ApiKeyContext";

export default function ChatRoom() {

    //console.log("ChatRoom component is mounted!");

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const { apiKey } = useApiKey();

    useEffect(() => {
        const messagesRef = query(ref(db, "messages"), limitToLast(50));

        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                setMessages([]);
                return;
            }

            const parsed = Object.entries(data).map(([id, msg]) => ({
                id,
                ...msg,
            }));

            parsed.sort((a, b) => a.timestamp - b.timestamp);
            setMessages(parsed);
        });

        // No cleanup needed for now; onValue doesn't return anything
    }, []);

    const [sending, setSending] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        const trimmed = newMessage.trim();
        if (!trimmed || sending) return;

        setSending(true); // prevent duplicates

        // If GPT message
        if (trimmed.startsWith("/gpt")) {
            if (!apiKey) {
                alert("Please enter your openAI Key First");
                return;
            }

            // Store gpt message in firebase rtdb

            const msgRef = ref(db, "messages");
            try {
                console.log("Trying to send:", trimmed);
                await push(msgRef, {
                    text: trimmed,
                    sender: auth.currentUser.email,
                    timestamp: Date.now(),
                });
                console.log("Message sent!");
            } catch (error) {
                console.error("Error sending message:", error);
            }

            // Build GPT context

            const contextMessages = messages
                .filter((msg) => {
                    const isPrivate = msg.text.startsWith("/priv");
                    return !isPrivate;
                })
                .map((msg) => ({
                    role: msg.sender === "GPT" ? "assistant" : "user",
                    content: msg.text,
                }));

            // Add latest /gpt prompt as the final user message

            contextMessages.push({
                role: "user",
                content: trimmed.replace("/gpt", "").trim(),
            });

            console.log("Trying to Prompt: ", contextMessages)

            try {
                const res = await fetch("https://cochat-back.onrender.com/api/gpt", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ apiKey, messages: contextMessages }),
                });

                const data = await res.json();

                if (data.error || !data.reply) {
                    console.error("GPT error:", data.error || "No Reply");
                }

                // Push GPT reply to firebase
                console.log("Trying to send:", data.reply.content);
                const msgRef = ref(db, "messages");
                await push(msgRef, {
                    text: data.reply.content,
                    sender: "GPT",
                    timestamp: Date.now(),
                });
                console.log("Message Sent!");
            } catch (err) {
                console.error("Error contacting GPT API:", err);
            }

            setNewMessage("");
            setSending(false);
            return;

        }

        // Else Normal Message 
        const msgRef = ref(db, "messages");
        try {
            console.log("Trying to send:", newMessage);
            await push(msgRef, {
                text: newMessage,
                sender: auth.currentUser.email,
                timestamp: Date.now(),
            });
            console.log("Message sent!");
        } catch (error) {
            console.error("Error sending message:", error);
        }


        setNewMessage("");
        setSending(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="h-96 overflow-y-scroll border p-4 mb-4 rounded bg-white shadow">
                {messages.map((msg) => (
                    <div key={msg.id} className="mb-2">
                        <span className="font-semibold">{msg.sender}: </span>
                        <span>{msg.text}</span>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSend} className="flex gap-2">
                <input
                    type="text"
                    className="flex-1 p-2 border rounded"
                    placeholder="Type something..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    type="submit"
                    onClick={() => console.log("Button clicked!")}
                >
                    Send
                </button>
            </form>
        </div>
    );
}
