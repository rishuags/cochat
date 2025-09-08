import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import {
    ref,
    get,
    set,
} from "firebase/database";

export default function JoinRoomPage() {
    const [roomId, setRoomId] = useState("");
    const [joinKey, setJoinKey] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Handles form submission
    const handleJoin = async (e) => {
        e.preventDefault();
        setError("");

        // Empty field check
        if (!roomId.trim() || !joinKey.trim()) {
            setError("Room ID and join key are required.");
            return;
        }

        try {
            // Reference to the room in Firebase
            const roomRef = ref(db, `rooms/${roomId}`);
            const roomSnap = await get(roomRef);

            // Check if room exists
            if (!roomSnap.exists()) {
                setError("Room not found.");
                return;
            }

            const roomData = roomSnap.val();

            // Validate join key
            if (roomData.joinKey !== joinKey.trim()) {
                setError("Invalid join key.");
                return;
            }

            // Check if user is the owner
            if (roomData.owner === auth.currentUser.email) {
                // Just navigate, don't add to members
                navigate(`/room/${roomId}`);
                return;
            }

            // Check if user is already a member
            const memberRef = ref(db, `rooms/${roomId}/members/${auth.currentUser.uid}`);
            const memberSnap = await get(memberRef);

            if (!memberSnap.exists()) {
                // Add user to members list
                await set(memberRef, {
                    email: auth.currentUser.email,
                });
            }

            // Navigate to the room
            navigate(`/room/${roomId}`);
        } catch (err) {
            console.error("Error joining room:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Join a Room</h2>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <form onSubmit={handleJoin} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Join Key"
                    value={joinKey}
                    onChange={(e) => setJoinKey(e.target.value)}
                    className="p-2 border rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Join Room
                </button>
            </form>
        </div>
    );
}