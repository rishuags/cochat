import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
    ref,
    push,
    onValue,
    query,
    limitToLast
} from "firebase/database";

// import { useApiKey } from "../context/ApiKeyContext";

export default function ChatRoom({ roomId }) {

    //console.log("ChatRoom component is mounted!");

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    // const { apiKey } = useApiKey();


    useEffect(() => {
        if (!roomId) return;

        const messagesRef = query(ref(db, `rooms/${roomId}/messages`), limitToLast(50));

        const unsubscribe = onValue(messagesRef, (snapshot) => {
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
        return () => unsubscribe();
    }, [roomId]);

    const [sending, setSending] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        const trimmed = newMessage.trim();
        if (!trimmed || sending) return;

        setSending(true); // prevent duplicates


        // If GPT message
        if (trimmed.startsWith("/gpt")) {
            /** */
            // if (!apiKey) {
            //     alert('Please enter your openAI Key First');
            //     setSending(false);
            //     return;
            // }
            /** */

            // Store gpt message in firebase rtdb
            const msgRef = ref(db, `rooms/${roomId}/messages`);

            try {
                console.log("Trying to send:", trimmed);
                await push(msgRef, {
                    text: trimmed,
                    sender: auth.currentUser.email,
                    timestamp: Date.now(),
                });
                console.log("Message sent!");
                setNewMessage("");

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
                const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
                console.log("Using Backend URL: ", BACKEND_URL);

                /** */
                // const res = await fetch(`${BACKEND_URL}/api/gpt`, {
                //     method: "POST",
                //     headers: { "Content-Type": "application/json" },
                //     body: JSON.stringify({ apiKey, messages: contextMessages }),
                // });
                /** */

                const res = await fetch(`${BACKEND_URL}/api/gpt-room`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        room_id: roomId,
                        messages: contextMessages,
                    }),
                });

                const data = await res.json();

                if (data.error || !data.reply) {
                    console.error("GPT error:", data.error || "No Reply");
                }

                // Push GPT reply to firebase
                console.log("Trying to send:", data.reply.content);
                const msgRef = ref(db, `rooms/${roomId}/messages`);
                await push(msgRef, {
                    text: data.reply.content,
                    sender: "GPT",
                    timestamp: Date.now(),
                });
                console.log("Message Sent!");
                setNewMessage("");

            } catch (err) {
                console.error("Error contacting GPT API:", err);
            }

            setNewMessage("");
            setSending(false);
            return;

        }

        // Else Normal Message 
        const msgRef = ref(db, `rooms/${roomId}/messages`);
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
        <div className="mx-auto p-4 max-w-8xl">
            <div className="h-125 overflow-y-scroll border p-4 mb-4 rounded bg-white shadow">
                {messages.map((msg) => (
                    <div key={msg.id} className="mb-2">
                        <span className="font-semibold">{msg.sender}: </span>
                        <span>{msg.text}</span>
                    </div>
                ))}
            </div>

            <div className="max-w-2xl mx-auto">

                <form onSubmit={handleSend} className="flex gap-2 items-center relative max-w-2xl mx-auto">
                    {/* Tooltip Icon */}
                    <div className="relative group">
                        <div className="w-6 h-6 flex items-center justify-center bg-blue-500 text-white text-xs font-bold rounded-full cursor-pointer">
                            ?
                        </div>

                        {/* Tooltip content */}
                        <div className="absolute left-8 bottom-full mb-2 w-64 p-3 bg-blue-50 border border-blue-300 text-gray-700 text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <p className="font-semibold mb-2">💬 Message Commands</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li><code>/gpt</code> — Ask GPT something (includes room context)</li>
                                <li><code>/priv</code> — Private message (GPT will ignore)</li>
                                <li><span className="italic">No command</span> — Regular message added to GPT context</li>
                            </ul>
                            <div className="mt-1 text-xs text-gray-500 italic">
                                Example: <code>/gpt Who's the greatest footballer ever?</code>
                            </div>
                        </div>
                    </div>

                    {/* Input field */}
                    <input
                        type="text"
                        className="flex-1 p-2 border rounded"
                        placeholder="Type something..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />

                    {/* Send button */}
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        type="submit"
                        onClick={() => console.log("Button clicked!")}
                    >
                        Send
                    </button>
                </form>

            </div>
        </div>
    );
}
