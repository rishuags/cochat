import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import BackToDashboardButton from "../components/utilityUI/BackToDashboardButton";


export default function CreateRoomPage() {
    const [roomName, setRoomName] = useState("");
    const [joinKey, setJoinKey] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();



    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");

        if (!roomName.trim() || !joinKey.trim() || !apiKey.trim()) {
            setError("Room name and join key and api key are required.");
            return;
        }

        const roomId = uuidv4();

        const roomData = {
            name: roomName.trim(),
            joinKey: joinKey.trim(),
            owner: auth.currentUser.email,
            createdAt: Date.now(),
            // members: {
            //     [auth.currentUser.uid]: {
            //         status: "approved"
            //     }
            // }
        };

        try {
            await set(ref(db, `rooms/${roomId}`), roomData);
            /** */
            try {
                const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

                const response = await fetch(`${BACKEND_URL}/api/store-key`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        room_id: roomId,
                        api_key: apiKey,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to store API key securely.");
                }

                console.log("🔐 API key stored securely in Supabase");
            } catch (err) {
                console.error("❌ Error storing API key:", err);
                setError("Room created, but failed to securely store API key.");
            }
            /** */
            // navigate(`/room/${roomId}`, { state: { apiKey } });
            navigate(`/room/${roomId}`);
        } catch (err) {
            console.error("Error creating room:", err);
            setError("Failed to create room. Try again.");
        }
    };


    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">

            <h2 className="text-2xl font-bold mb-4">Create a Room</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}

            <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Room Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Join Key"
                    value={joinKey}
                    onChange={(e) => setJoinKey(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Api Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="p-2 border rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Create Room
                </button>
            </form>


            <BackToDashboardButton />
        </div>


    );

}
