// src/pages/RoomPage.jsx
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../firebase";
import { ApiKeyProvider } from "../context/ApiKeyContext";
import ChatRoom from "../components/ChatRoom";

export default function RoomPage() {
    const { roomId } = useParams();
    const [roomData, setRoomData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const location = useLocation();
    const apiKey = location.state?.apiKey;

    useEffect(() => {
        if (!roomId) return;

        const fetchRoom = async () => {
            try {
                const roomRef = ref(db, `rooms/${roomId}`);
                const snapshot = await get(roomRef);

                if (snapshot.exists()) {
                    setRoomData(snapshot.val());
                } else {
                    setError("Room not found.");
                }
            } catch (err) {
                console.error("Error fetching room:", err);
                setError("Failed to load room.");
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [roomId]);

    if (loading) return <p className="text-center mt-10">Loading room...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Room: {roomData.name}</h2>
            <ApiKeyProvider initialKey={apiKey}>
                <ChatRoom roomId={roomId} />
            </ApiKeyProvider>
        </div>
    );
}