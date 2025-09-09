import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { get, child } from "firebase/database";

function MyRoomsPage() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [openMembers, setOpenMembers] = useState(null);

    useEffect(() => {
        //console.log("auth.currentUser at mount:", auth.currentUser);

        // inside useEffect
        const dbRef = ref(db);
        get(child(dbRef, "rooms"))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    //console.log("Data exists:", snapshot.val());
                } else {
                    //console.log("No data at /rooms");
                }
            })
            .catch((error) => {
                //console.error("Error reading /rooms:", error);
            });


        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                console.log("User not logged in.");
                return;
            }

            console.log("User logged in:", user.email);

            const roomsRef = ref(db, "rooms");

            onValue(roomsRef, (snapshot) => {
                const data = snapshot.val();
                //console.log("Rooms data from Firebase:", data);

                const filtered = [];

                for (const roomId in data) {
                    const room = data[roomId];
                    const isOwner = room.owner === user.email;
                    const isMember = room.members && room.members[user.uid];

                    if (isOwner || isMember) {
                        filtered.push({
                            id: roomId,
                            name: room.name,
                            createdAt: room.createdAt,
                            role: isOwner ? "Owner" : "Member",
                            members: room.members || {}
                        });
                    }
                }

                setRooms(filtered);
                setLoading(false);
            });
        });

        return () => unsubscribe();
    }, []);

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    if (loading) return <p className="text-center mt-10 text-gray-600 text-lg">Loading your rooms...</p>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">My Rooms</h1>

            {rooms.length === 0 ? (
                <p className="text-gray-500">You haven't joined or created any rooms yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="bg-white border border-gray-200 rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-200"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">{room.name}</h2>
                            <p className="text-gray-600 mb-1">Created: {formatDate(room.createdAt)}</p>
                            <p className="text-gray-600 mb-4">
                                Role: <span className="font-bold">{room.role}</span>
                            </p>

                            <button
                                onClick={() => setOpenMembers(openMembers === room.id ? null : room.id)}
                                className="text-sm text-blue-600 hover:underline mb-2"
                            >
                                {openMembers === room.id ? "Hide Members" : "Show Members"}
                            </button>

                            {openMembers === room.id && room.members && (
                                <ul className="text-sm text-gray-700 mb-2">
                                    {Object.values(room.members).map((member, idx) => (
                                        <li key={idx} className="ml-2 list-disc">{member.email}</li>
                                    ))}
                                </ul>
                            )}
                            <button
                                onClick={() => navigate(`/room/${room.id}`)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-150"
                            >
                                Enter Room
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyRoomsPage;