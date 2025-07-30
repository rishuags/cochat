import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import {
    ref,
    push,
    onValue,
    query,
    limitToLast
} from "firebase/database";

export default function ChatRoom() {

    console.log("ChatRoom component is mounted!");

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

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
        if (!newMessage.trim() || sending) return;

        setSending(true); // prevent duplicates

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
